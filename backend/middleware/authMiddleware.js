const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;

        // ===============================
        // CHECK AUTHORIZATION HEADER
        // ===============================

        if (!authHeader) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }

        // ===============================
        // CHECK BEARER TOKEN
        // ===============================

        const parts =
            authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({
                message: "Invalid authorization format"
            });

        }

        const token =
            parts[1];

        // ===============================
        // VERIFY TOKEN
        // ===============================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (!decoded.userId) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        const user = await User.findById(decoded.userId).select(
            "_id username role gymId"
        );

        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            });
        }

        req.user = {
            userId: user._id.toString(),
            username: user.username,
            role: user.role || "client",
            gymId: user.gymId ? user.gymId.toString() : null
        };

        next();

    } catch (error) {

        console.error(
            "JWT verification error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

}

module.exports =
    authMiddleware;