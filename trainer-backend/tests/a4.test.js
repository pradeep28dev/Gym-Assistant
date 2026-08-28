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
const clientTwoId = new mongoose.Types.ObjectId();

function user(_id, role, gymId, assignedTrainerId = null) {
    return {
        _id,
        fullname: `${role} user`,
        username: `${role}-${_id.toString().slice(-4)}`,
        email: `${role}-${_id.toString().slice(-4)}@example.com`,
        role,
        gymId,
        assignedTrainerId,
        fitnessProfile: { goal: "strength" }
    };
}

function fakeRepository(users) {
    return {
        async findByIdForAssignment(id) {
            return users.find((item) => item._id.toString() === id.toString()) || null;
        },
        async findAssignedClients(trainerId) {
            return users.filter(
                (item) =>
                    item.role === "client" &&
                    item.assignedTrainerId &&
                    item.assignedTrainerId.toString() === trainerId.toString()
            );
        },
        async assignClient(clientId, trainerId) {
            const client = users.find((item) => item._id.toString() === clientId.toString());
            if (!client || client.assignedTrainerId) {
                return null;
            }
            client.assignedTrainerId = trainerId;
            return client;
        },
        async unassignClient(clientId, trainerId) {
            const client = users.find((item) => item._id.toString() === clientId.toString());
            if (
                !client ||
                !client.assignedTrainerId ||
                client.assignedTrainerId.toString() !== trainerId.toString()
            ) {
                return null;
            }
            client.assignedTrainerId = null;
            return client;
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

function assertAssignmentError(action, code, status) {
    return assert.rejects(action, (error) => {
        assert.equal(error instanceof AssignmentError, true);
        assert.equal(error.code, code);
        assert.equal(error.status, status);
        return true;
    });
}

test("Unauthenticated assignment request returns 401", async () => {
    const res = responseRecorder();
    await authMiddleware({ headers: {} }, res, () => {});
    assert.equal(res.statusCode, 401);
});

test("Client cannot access Trainer API", () => {
    const res = responseRecorder();
    requireRole("trainer")({ user: { role: "client" } }, res, () => {});
    assert.equal(res.statusCode, 403);
});

test("Client cannot self-assign", async () => {
    const client = user(clientOneId, "client", gymOne);
    await assertAssignmentError(
        createTrainerService(fakeRepository([client])).assignClient(clientOneId, clientOneId),
        "TRAINER_REQUIRED",
        403
    );
});

test("Trainer can assign same-gym client", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymOne);
    const result = await createTrainerService(fakeRepository([trainer, client]))
        .assignClient(trainerOneId, clientOneId);
    assert.equal(result.assignedTrainerId.toString(), trainerOneId.toString());
});

test("Trainer can list only assigned clients", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const assigned = user(clientOneId, "client", gymOne, trainerOneId);
    const other = user(clientTwoId, "client", gymOne, trainerTwoId);
    const result = await createTrainerService(fakeRepository([trainer, assigned, other]))
        .listAssignedClients(trainerOneId);
    assert.deepEqual(result.map((client) => client._id), [clientOneId]);
});

test("Trainer can view assigned client fitness profile", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymOne, trainerOneId);
    const result = await createTrainerService(fakeRepository([trainer, client]))
        .getAssignedClient(trainerOneId, clientOneId);
    assert.equal(result.fitnessProfile.goal, "strength");
});

test("Trainer cannot view another trainer's client", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymOne, trainerTwoId);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .getAssignedClient(trainerOneId, clientOneId),
        "CLIENT_NOT_FOUND",
        404
    );
});

test("Cross-gym assignment is rejected", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymTwo);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .assignClient(trainerOneId, clientOneId),
        "GYM_ACCESS_DENIED",
        403
    );
});

test("Cross-gym client access is rejected", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymTwo, trainerOneId);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .getAssignedClient(trainerOneId, clientOneId),
        "GYM_ACCESS_DENIED",
        403
    );
});

test("Invalid client ID is rejected safely", async () => {
    await assertAssignmentError(
        createTrainerService(fakeRepository([])).assignClient(trainerOneId, "invalid"),
        "INVALID_CLIENT_ID",
        400
    );
});

test("Trainer without gym is rejected", async () => {
    const trainer = user(trainerOneId, "trainer", null);
    const client = user(clientOneId, "client", gymOne);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .assignClient(trainerOneId, clientOneId),
        "GYM_REQUIRED",
        403
    );
});

test("Non-client target is rejected", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const otherTrainer = user(trainerTwoId, "trainer", gymOne);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, otherTrainer]))
            .assignClient(trainerOneId, trainerTwoId),
        "CLIENT_NOT_ELIGIBLE",
        403
    );
});

test("Client without gym is rejected", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", null);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .assignClient(trainerOneId, clientOneId),
        "CLIENT_NOT_ELIGIBLE",
        403
    );
});

test("Already-assigned client cannot be reassigned", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymOne, trainerTwoId);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .assignClient(trainerOneId, clientOneId),
        "CLIENT_ALREADY_ASSIGNED",
        409
    );
});

test("Assigned trainer can unassign client", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymOne, trainerOneId);
    const result = await createTrainerService(fakeRepository([trainer, client]))
        .unassignClient(trainerOneId, clientOneId);
    assert.equal(result.assignedTrainerId, null);
});

test("Another trainer cannot unassign client", async () => {
    const trainer = user(trainerTwoId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymOne, trainerOneId);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .unassignClient(trainerTwoId, clientOneId),
        "CLIENT_NOT_FOUND",
        404
    );
});

test("Unassigned client cannot be accessed", async () => {
    const trainer = user(trainerOneId, "trainer", gymOne);
    const client = user(clientOneId, "client", gymOne);
    await assertAssignmentError(
        createTrainerService(fakeRepository([trainer, client]))
            .getAssignedClient(trainerOneId, clientOneId),
        "CLIENT_NOT_FOUND",
        404
    );
});
