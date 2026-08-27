const Gym = require("../models/Gym");

async function requireGymAccess(req, res, next) {
    try {
        if (!req.user || !req.user.gymId) {
            return res.status(403).json({
                message: "Gym membership is required"
            });
        }

        const requestedGymId = req.params.gymId;

        if (!requestedGymId || requestedGymId !== req.user.gymId) {
            return res.status(403).json({
                message: "Access to this gym is not permitted"
            });
        }

        const gym = await Gym.findOne({
            _id: req.user.gymId,
            isActive: true
        }).select("_id");

        if (!gym) {
            return res.status(403).json({
                message: "Gym is not active or does not exist"
            });
        }

        next();
    } catch (error) {
        console.error("Gym authorization error:", error.message);
        return res.status(403).json({
            message: "Unable to verify gym access"
        });
    }
}

module.exports = requireGymAccess;
