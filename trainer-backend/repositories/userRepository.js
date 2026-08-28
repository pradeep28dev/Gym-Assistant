const User = require("../models/User");

const safeProfileFields =
    "_id fullname username email role gymId assignedTrainerId trainerProfile";

const assignmentFields =
    "_id fullname username email role gymId assignedTrainerId fitnessProfile";

function findByIdForTrainerProfile(userId) {
    return User.findById(userId).select(safeProfileFields);
}

async function updateTrainerProfile(userId, trainerProfile) {
    return User.findOneAndUpdate(
        { _id: userId, role: "trainer" },
        { $set: { trainerProfile } },
        { new: true, runValidators: true }
    ).select(safeProfileFields);
}

function assignmentProjection(query) {
    return query.select(assignmentFields);
}

async function findByIdForAssignment(userId) {
    return assignmentProjection(User.findById(userId));
}

async function findAssignedClients(trainerId, gymId) {
    return assignmentProjection(
        User.find({
            role: "client",
            gymId,
            assignedTrainerId: trainerId
        }).sort({ fullname: 1, username: 1 })
    );
}

async function assignClient(clientId, trainerId, gymId) {
    return assignmentProjection(
        User.findOneAndUpdate(
            {
                _id: clientId,
                role: "client",
                gymId,
                assignedTrainerId: null
            },
            {
                $set: {
                    assignedTrainerId: trainerId
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
    );
}

async function unassignClient(clientId, trainerId) {
    return assignmentProjection(
        User.findOneAndUpdate(
            {
                _id: clientId,
                role: "client",
                assignedTrainerId: trainerId
            },
            {
                $set: {
                    assignedTrainerId: null
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
    );
}

module.exports = {
    findByIdForTrainerProfile,
    updateTrainerProfile,
    findByIdForAssignment,
    findAssignedClients,
    assignClient,
    unassignClient
};
