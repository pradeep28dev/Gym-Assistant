const {
    AssignmentError,
    createTrainerService
} = require("../services/trainerService");

const trainerService = createTrainerService();

function handleError(res, error) {
    if (error instanceof AssignmentError) {
        return res.status(error.status).json({
            message: error.message,
            code: error.code
        });
    }

    console.error("Trainer assignment error:", error);
    return res.status(500).json({
        message: "Unable to process trainer assignment"
    });
}

async function listClients(req, res) {
    try {
        const clients = await trainerService.listAssignedClients(req.user.userId);
        return res.status(200).json({ clients });
    } catch (error) {
        return handleError(res, error);
    }
}

async function getClient(req, res) {
    try {
        const client = await trainerService.getAssignedClient(
            req.user.userId,
            req.params.clientId
        );
        return res.status(200).json({ client });
    } catch (error) {
        return handleError(res, error);
    }
}

async function getClientAssessment(req, res) {
    try {
        const assessment = await trainerService.getAssignedClientAssessment(
            req.user.userId,
            req.params.clientId
        );
        return res.status(200).json(assessment);
    } catch (error) {
        return handleError(res, error);
    }
}

async function assignClient(req, res) {
    try {
        const client = await trainerService.assignClient(
            req.user.userId,
            req.params.clientId
        );
        return res.status(200).json({
            message: "Client assigned successfully",
            client
        });
    } catch (error) {
        return handleError(res, error);
    }
}

async function unassignClient(req, res) {
    try {
        const client = await trainerService.unassignClient(
            req.user.userId,
            req.params.clientId
        );
        return res.status(200).json({
            message: "Client unassigned successfully",
            client
        });
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    listClients,
    getClient,
    getClientAssessment,
    assignClient,
    unassignClient
};
