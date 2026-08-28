const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


// ===============================
// SAVE / UPDATE FITNESS PROFILE
// ===============================

router.post("/profile",authMiddleware, async (req, res) => {

    try {

        const {
    gender,
    age,
    height,
    weight,
    neck,
    waist,
    hip,
    bodyFat,
    activity,
    experience,
    goal
} = req.body;

const username =
    req.user.username;

        // ===============================
        // CHECK USERNAME
        // ===============================

        if (!username) {

            return res.status(400).json({
                message: "Username is required"
            });

        }


        // ===============================
        // FIND USER
        // ===============================

        const user =
            await User.findOne({ username });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // ===============================
        // UPDATE FITNESS PROFILE
        // ===============================

        user.fitnessProfile = {

            gender: gender || "",

            age: Number(age) || 0,

            height: Number(height) || 0,

            weight: Number(weight) || 0,

            neck: Number(neck) || 0,

            waist: Number(waist) || 0,

            hip: Number(hip) || 0,

            bodyFat: Number(bodyFat) || 0,

            activity: activity || "",

            experience: experience || "",

            goal: goal || ""

        };


        // ===============================
        // SAVE USER
        // ===============================

        await user.save();


        // ===============================
        // SUCCESS
        // ===============================

        res.status(200).json({

            message:
                "Fitness profile saved successfully"

        });


    } catch (error) {

        console.error(
            "Profile save error:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

});

// ===============================
// GET FITNESS PROFILE
// ===============================

router.get("/profile/:username",authMiddleware, async (req, res) => {

    try {

        const username =
    req.user.username;


        const user =
            await User.findOne(
                { username },
                { fitnessProfile: 1, _id: 0 }
            );


        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        res.status(200).json({

            profile:
                user.fitnessProfile

        });


    } catch (error) {

        console.error(
            "Profile fetch error:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

});

module.exports = router;