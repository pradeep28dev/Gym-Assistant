const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const User = require("../models/User");
const Gym = require("../models/Gym");
const requireRole = require("../middleware/roleMiddleware");
const requireGymAccess = require("../middleware/gymMiddleware");

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

test("User defaults to client role and no gym", () => {
    const user = new User({
        fullname: "Test User",
        username: "test-user",
        email: "test@example.com",
        password: "hashed-password"
    });

    assert.equal(user.role, "client");
    assert.equal(user.gymId, null);
});

test("User rejects unsupported roles", () => {
    const user = new User({
        fullname: "Test User",
        username: "test-user",
        email: "test@example.com",
        password: "hashed-password",
        role: "owner"
    });

    const error = user.validateSync();
    assert.equal(error.errors.role.kind, "enum");
});

test("Gym requires a name and defaults to active", () => {
    const gym = new Gym();
    const error = gym.validateSync();

    assert.ok(error.errors.name);
    assert.equal(gym.isActive, true);
});

test("role middleware allows configured roles", () => {
    const req = { user: { role: "trainer" } };
    const res = responseRecorder();
    let called = false;

    requireRole("trainer")(req, res, () => {
        called = true;
    });

    assert.equal(called, true);
    assert.equal(res.statusCode, 200);
});

test("role middleware rejects unauthorized roles", () => {
    const req = { user: { role: "client" } };
    const res = responseRecorder();

    requireRole("trainer")(req, res, () => {});

    assert.equal(res.statusCode, 403);
});

test("gym middleware rejects users without gym membership", async () => {
    const req = { user: { gymId: null }, params: { gymId: "gym-id" } };
    const res = responseRecorder();

    await requireGymAccess(req, res, () => {});

    assert.equal(res.statusCode, 403);
    assert.equal(res.body.message, "Gym membership is required");
});

test("gym middleware rejects a different gym before database access", async () => {
    const gymId = new mongoose.Types.ObjectId().toString();
    const req = { user: { gymId }, params: { gymId: new mongoose.Types.ObjectId().toString() } };
    const res = responseRecorder();

    await requireGymAccess(req, res, () => {});

    assert.equal(res.statusCode, 403);
    assert.equal(res.body.message, "Access to this gym is not permitted");
});
