const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "a3-test-secret";

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
    TrainerProfileError,
    createTrainerProfileService
} = require("../services/trainerProfileService");

const trainerId = new mongoose.Types.ObjectId();
const otherUserId = new mongoose.Types.ObjectId();
const gymId = new mongoose.Types.ObjectId();

function responseRecorder() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

function trainer(overrides = {}) {
    return {
        _id: trainerId,
        fullname: "Rahul Trainer",
        username: "rahul",
        email: "rahul@example.com",
        role: "trainer",
        gymId,
        assignedTrainerId: null,
        trainerProfile: { bio: "", specialization: "", certifications: [], experience: "" },
        ...overrides
    };
}

function fakeRepository(currentTrainer = trainer()) {
    return {
        async findByIdForTrainerProfile(id) {
            return id.toString() === trainerId.toString() ? currentTrainer : null;
        },
        async updateTrainerProfile(id, profile) {
            assert.equal(id.toString(), trainerId.toString());
            currentTrainer.trainerProfile = profile;
            return currentTrainer;
        }
    };
}

function assertProfileError(action, code, status) {
    return assert.rejects(action, (error) => {
        assert.equal(error instanceof TrainerProfileError, true);
        assert.equal(error.code, code);
        assert.equal(error.status, status);
        return true;
    });
}

test("Unauthenticated user cannot view trainer profile", async () => {
    const res = responseRecorder();
    await authMiddleware({ headers: {} }, res, () => {});
    assert.equal(res.statusCode, 401);
});

test("Unauthenticated user cannot update trainer profile", async () => {
    const res = responseRecorder();
    await authMiddleware({ headers: {} }, res, () => {});
    assert.equal(res.statusCode, 401);
});

test("Client cannot view or update trainer profile", () => {
    const res = responseRecorder();
    requireRole("trainer")({ user: { role: "client" } }, res, () => {});
    assert.equal(res.statusCode, 403);
});

test("Trainer can view their own profile without a password", async () => {
    const service = createTrainerProfileService(fakeRepository());
    const result = await service.getOwnProfile(trainerId);
    assert.equal(result._id, trainerId);
    assert.equal("password" in result, false);
});

test("Trainer can update allowed profile fields", async () => {
    const service = createTrainerProfileService(fakeRepository());
    const result = await service.updateOwnProfile(trainerId, {
        bio: "Strength coach",
        specialization: "Strength training",
        certifications: ["CPT"],
        experience: "5 years"
    });
    assert.deepEqual(result.trainerProfile, {
        bio: "Strength coach",
        specialization: "Strength training",
        certifications: ["CPT"],
        experience: "5 years"
    });
});

test("Protected identity and authorization fields cannot be modified", async () => {
    for (const field of ["role", "gymId", "assignedTrainerId", "_id", "username", "password"]) {
        await assertProfileError(
            createTrainerProfileService(fakeRepository()).updateOwnProfile(
                trainerId,
                { [field]: "blocked" }
            ),
            "INVALID_PROFILE_FIELD",
            400
        );
    }
});

test("Authenticated identity controls ownership", async () => {
    const service = createTrainerProfileService(fakeRepository());
    await assertProfileError(
        service.getOwnProfile(otherUserId),
        "TRAINER_REQUIRED",
        403
    );
});

test("Invalid update data is rejected safely", async () => {
    const service = createTrainerProfileService(fakeRepository());
    await assertProfileError(
        service.updateOwnProfile(trainerId, { bio: 42 }),
        "INVALID_PROFILE_VALUE",
        400
    );
    await assertProfileError(
        service.updateOwnProfile(trainerId, { certifications: ["CPT", 4] }),
        "INVALID_PROFILE_VALUE",
        400
    );
    await assertProfileError(
        service.updateOwnProfile(trainerId, {}),
        "INVALID_PROFILE",
        400
    );
});

test("Trainer role middleware allows authenticated trainer", () => {
    let called = false;
    requireRole("trainer")({ user: { role: "trainer" } }, responseRecorder(), () => {
        called = true;
    });
    assert.equal(called, true);
});

test("JWT contract provides authenticated user identity", async () => {
    const token = jwt.sign(
        { userId: trainerId.toString(), username: "untrusted", role: "client", gymId: null },
        process.env.JWT_SECRET
    );
    const originalFindById = User.findById;
    User.findById = () => ({
        select: async () => ({ _id: trainerId, username: "rahul", role: "trainer", gymId })
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = responseRecorder();
    await authMiddleware(req, res, () => {});
    User.findById = originalFindById;

    assert.equal(req.user.userId, trainerId.toString());
    assert.equal(req.user.role, "trainer");
});
