
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
    AssignmentError,
    createTrainerService
} = require("../services/trainerService");

const gymOne = new mongoose.Types.ObjectId();
const gymTwo = new mongoose.Types.ObjectId();
const trainerOneId = new mongoose.Types.ObjectId();
const trainerTwoId = new mongoose.Types.ObjectId();
const clientOneId = new mongoose.Types.ObjectId();
const nonClientId = new mongoose.Types.ObjectId();

function user(_id, role, gymId, assignedTrainerId = null, fitnessProfile = {}) {
    return {
        _id,
        fullname: `${role} user`,
        username: `${role}-${_id.toString().slice(-4)}`,
        email: `${role}-${_id.toString().slice(-4)}@example.com`,
        role,
        gymId,
        assignedTrainerId,
        fitnessProfile,
        password: "hashed-password"
    };
}

function fakeRepository(users) {
    return {
        async findByIdForAssignment(id) {
            return users.find((item) => item && item._id.toString() === id.toString()) || null;
        }
    };
}

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

function assertAssessmentError(action, code, status) {
    return assert.rejects(action, (error) => {
        assert.equal(error instanceof AssignmentError, true);
        assert.equal(error.code, code);
        assert.equal(error.status, status);
        return true;
    });
}

function assessmentService(client, trainer = user(trainerOneId, "trainer", gymOne)) {
    return createTrainerService(fakeRepository([trainer, client]));
}

test("Unauthenticated assessment request returns 401", async () => {
    const res = responseRecorder();
    await authMiddleware({ headers: {} }, res, () => {});
    assert.equal(res.statusCode, 401);
});

test("Client cannot access assessment endpoint", () => {
    const res = responseRecorder();
    requireRole("trainer")({ user: { role: "client" } }, res, () => {});
    assert.equal(res.statusCode, 403);
});

test("Invalid client ID is rejected with 400", async () => {
    await assertAssessmentError(
        assessmentService(null).getAssignedClientAssessment(trainerOneId, "invalid"),
        "INVALID_CLIENT_ID",
        400
    );
});

test("Nonexistent client is rejected with 404", async () => {
    await assertAssessmentError(
        assessmentService(null).getAssignedClientAssessment(trainerOneId, clientOneId),
        "CLIENT_NOT_FOUND",
        404
    );
});

test("Trainer without gym is rejected", async () => {
    const trainer = user(trainerOneId, "trainer", null);
    const client = user(clientOneId, "client", gymOne, trainerOneId);
    await assertAssessmentError(
        assessmentService(client, trainer).getAssignedClientAssessment(trainerOneId, clientOneId),
        "GYM_REQUIRED",
        403
    );
});

test("Client without gym is rejected", async () => {
    const client = user(clientOneId, "client", null, trainerOneId);
    await assertAssessmentError(
        assessmentService(client).getAssignedClientAssessment(trainerOneId, clientOneId),
        "CLIENT_NOT_ELIGIBLE",
        403
    );
});

test("Non-client target is rejected", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const target = user(nonClientId, "trainer", gymOne);
    await assertAssessmentError(
        assessmentService(target, trainer).getAssignedClientAssessment(trainerOneId, nonClientId),
        "CLIENT_NOT_ELIGIBLE",
        403
    );
});

test("Cross-gym client is rejected", async () => {
    const client = user(clientOneId, "client", gymTwo, trainerOneId);
    await assertAssessmentError(
        assessmentService(client).getAssignedClientAssessment(trainerOneId, clientOneId),
        "GYM_ACCESS_DENIED",
        403
    );
});

test("Unassigned client is rejected", async () => {
    const client = user(clientOneId, "client", gymOne);
    await assertAssessmentError(
        assessmentService(client).getAssignedClientAssessment(trainerOneId, clientOneId),
        "CLIENT_NOT_FOUND",
        404
    );
});

test("Another trainer's client is rejected", async () => {
    const client = user(clientOneId, "client", gymOne, trainerTwoId);
    await assertAssessmentError(
        assessmentService(client).getAssignedClientAssessment(trainerOneId, clientOneId),
        "CLIENT_NOT_FOUND",
        404
    );
});

test("Assigned same-gym client returns fitness assessment", async () => {
    const fitnessProfile = {
        gender: "female",
        age: 29,
        height: 168,
        weight: 64,
        neck: 31,
        waist: 72,
        hip: 98,
        bodyFat: 24,
        activity: "active",
        experience: "intermediate",
        goal: "strength"
    };
    const client = user(clientOneId, "client", gymOne, trainerOneId, fitnessProfile);
    const result = await assessmentService(client)
        .getAssignedClientAssessment(trainerOneId, clientOneId);
    assert.deepEqual(result, { fitnessProfile });
});

test("Assessment response excludes password hash", async () => {
    const client = user(clientOneId, "client", gymOne, trainerOneId, { goal: "strength" });
    const result = await assessmentService(client)
        .getAssignedClientAssessment(trainerOneId, clientOneId);
    assert.equal("password" in result, false);
    assert.equal("passwordHash" in result, false);
});
