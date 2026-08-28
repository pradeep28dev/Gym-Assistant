const {
    TrainerProfileError,
    createTrainerProfileService
} = require("../services/trainerProfileService");

const trainerProfileService = createTrainerProfileService();

function handleError(res, error) {
    if (error instanceof TrainerProfileError) {
        return res.status(error.status).json({
            message: error.message,
            code: error.code
        });
    }

    console.error("Trainer profile error:", error);
    return res.status(500).json({ message: "Unable to process trainer profile" });
}

async function getProfile(req, res) {
    try {
        const trainer = await trainerProfileService.getOwnProfile(req.user.userId);
        return res.status(200).json({ profile: trainer });
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateProfile(req, res) {
    try {
        const trainer = await trainerProfileService.updateOwnProfile(
            req.user.userId,
            req.body.trainerProfile
        );
        return res.status(200).json({
            message: "Trainer profile updated successfully",
            profile: trainer
        });
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = { getProfile, updateProfile };
