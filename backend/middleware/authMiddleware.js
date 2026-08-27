const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

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

        // ===============================
        // STORE USER INFORMATION
        // ===============================

        req.user = decoded;

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