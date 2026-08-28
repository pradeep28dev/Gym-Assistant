const mongoose = require("mongoose");
const userRepository = require("../repositories/userRepository");

class AssignmentError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

function assertValidUserId(userId) {
    if (!mongoose.isValidObjectId(userId)) {
        throw new AssignmentError(400, "INVALID_CLIENT_ID", "Invalid client ID");
    }
}

function assertTrainer(trainer) {
    if (!trainer || trainer.role !== "trainer") {
        throw new AssignmentError(403, "TRAINER_REQUIRED", "Trainer access is required");
    }

    if (!trainer.gymId) {
        throw new AssignmentError(403, "GYM_REQUIRED", "Gym membership is required");
    }
}

function assertEligibleClient(trainer, client) {
    if (!client) {
        throw new AssignmentError(404, "CLIENT_NOT_FOUND", "Client not found");
    }

    if (client.role !== "client" || !client.gymId) {
        throw new AssignmentError(403, "CLIENT_NOT_ELIGIBLE", "Client is not eligible");
    }

    if (client.gymId.toString() !== trainer.gymId.toString()) {
        throw new AssignmentError(
            403,
            "GYM_ACCESS_DENIED",
            "Access to this client is not permitted"
        );
    }
}

function createTrainerService(repository = userRepository) {
    async function getTrainer(trainerId) {
        const trainer = await repository.findByIdForAssignment(trainerId);
        assertTrainer(trainer);
        return trainer;
    }

    async function listAssignedClients(trainerId) {
        const trainer = await getTrainer(trainerId);
        return repository.findAssignedClients(trainer._id, trainer.gymId);
    }

    async function getAssignedClient(trainerId, clientId) {
        assertValidUserId(clientId);
        const trainer = await getTrainer(trainerId);
        const client = await repository.findByIdForAssignment(clientId);
        assertEligibleClient(trainer, client);

        if (
            !client.assignedTrainerId ||
            client.assignedTrainerId.toString() !== trainer._id.toString()
        ) {
            throw new AssignmentError(404, "CLIENT_NOT_FOUND", "Client not found");
        }

        return client;
    }

    async function getAssignedClientAssessment(trainerId, clientId) {
        const client = await getAssignedClient(trainerId, clientId);
        return {
            fitnessProfile: client.fitnessProfile || {}
        };
    }

    async function assignClient(trainerId, clientId) {
        assertValidUserId(clientId);
        const trainer = await getTrainer(trainerId);
        const client = await repository.findByIdForAssignment(clientId);
        assertEligibleClient(trainer, client);

        if (client.assignedTrainerId) {
            throw new AssignmentError(
                409,
                "CLIENT_ALREADY_ASSIGNED",
                "Client is already assigned"
            );
        }

        const assignedClient = await repository.assignClient(
            client._id,
            trainer._id,
            trainer.gymId
        );

        if (!assignedClient) {
            throw new AssignmentError(
                409,
                "CLIENT_ALREADY_ASSIGNED",
                "Client is already assigned"
            );
        }

        return assignedClient;
    }

    async function unassignClient(trainerId, clientId) {
        assertValidUserId(clientId);
        const trainer = await getTrainer(trainerId);
        const client = await repository.findByIdForAssignment(clientId);
        assertEligibleClient(trainer, client);

        if (
            !client.assignedTrainerId ||
            client.assignedTrainerId.toString() !== trainer._id.toString()
        ) {
            throw new AssignmentError(404, "CLIENT_NOT_FOUND", "Client not found");
        }

        const unassignedClient = await repository.unassignClient(
            client._id,
            trainer._id
        );

        if (!unassignedClient) {
            throw new AssignmentError(404, "CLIENT_NOT_FOUND", "Client not found");
        }

        return unassignedClient;
    }

    return {
        listAssignedClients,
        getAssignedClient,
        getAssignedClientAssessment,
        assignClient,
        unassignClient
    };
}

module.exports = {
    AssignmentError,
    createTrainerService
};
