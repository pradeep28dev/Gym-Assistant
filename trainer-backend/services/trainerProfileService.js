const mongoose = require("mongoose");
const userRepository = require("../repositories/userRepository");

const ALLOWED_FIELDS = new Set([
    "bio",
    "specialization",
    "certifications",
    "experience"
]);

class TrainerProfileError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

function assertTrainerId(userId) {
    if (!mongoose.isValidObjectId(userId)) {
        throw new TrainerProfileError(401, "INVALID_AUTHENTICATED_USER", "Invalid authenticated user");
    }
}

function assertTrainer(trainer) {
    if (!trainer || trainer.role !== "trainer") {
        throw new TrainerProfileError(403, "TRAINER_REQUIRED", "Trainer access is required");
    }

    if (!trainer.gymId) {
        throw new TrainerProfileError(403, "GYM_REQUIRED", "Gym membership is required");
    }
}

function normalizeProfileUpdate(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new TrainerProfileError(400, "INVALID_PROFILE", "trainerProfile must be an object");
    }

    const unknownFields = Object.keys(input).filter((field) => !ALLOWED_FIELDS.has(field));
    if (unknownFields.length > 0) {
        throw new TrainerProfileError(400, "INVALID_PROFILE_FIELD", "Only trainerProfile fields may be updated");
    }

    const profile = {};
    if (input.bio !== undefined) {
        if (typeof input.bio !== "string") {
            throw new TrainerProfileError(400, "INVALID_PROFILE_VALUE", "bio must be a string");
        }
        profile.bio = input.bio.trim();
    }
    if (input.specialization !== undefined) {
        if (typeof input.specialization !== "string") {
            throw new TrainerProfileError(400, "INVALID_PROFILE_VALUE", "specialization must be a string");
        }
        profile.specialization = input.specialization.trim();
    }
    if (input.experience !== undefined) {
        if (typeof input.experience !== "string") {
            throw new TrainerProfileError(400, "INVALID_PROFILE_VALUE", "experience must be a string");
        }
        profile.experience = input.experience.trim();
    }
    if (input.certifications !== undefined) {
        if (
            !Array.isArray(input.certifications) ||
            input.certifications.some((item) => typeof item !== "string")
        ) {
            throw new TrainerProfileError(
                400,
                "INVALID_PROFILE_VALUE",
                "certifications must be an array of strings"
            );
        }
        profile.certifications = input.certifications.map((item) => item.trim());
    }

    if (Object.keys(profile).length === 0) {
        throw new TrainerProfileError(400, "INVALID_PROFILE", "At least one profile field is required");
    }

    return profile;
}

function createTrainerProfileService(repository = userRepository) {
    async function getOwnProfile(userId) {
        assertTrainerId(userId);
        const trainer = await repository.findByIdForTrainerProfile(userId);
        assertTrainer(trainer);
        return trainer;
    }

    async function updateOwnProfile(userId, input) {
        const trainer = await getOwnProfile(userId);
        const profileUpdate = normalizeProfileUpdate(input);
        const trainerProfile = {
            ...(trainer.trainerProfile || {}),
            ...profileUpdate
        };
        return repository.updateTrainerProfile(trainer._id, trainerProfile);
    }

    return { getOwnProfile, updateOwnProfile };
}

module.exports = {
    TrainerProfileError,
    createTrainerProfileService,
    normalizeProfileUpdate
};
