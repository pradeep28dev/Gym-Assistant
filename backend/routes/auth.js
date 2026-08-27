const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ===============================
// SIGNUP
// ===============================

router.post("/signup", async (req, res) => {

    try {

        const {
            fullname,
            username,
            email,
            password
        } = req.body;


        // ===============================
        // CHECK REQUIRED FIELDS
        // ===============================

        if (
            !fullname ||
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        // ===============================
        // CHECK USERNAME
        // ===============================

        const existingUsername =
            await User.findOne({ username });

        if (existingUsername) {

            return res.status(400).json({
                message: "Username already exists"
            });

        }


        // ===============================
        // CHECK EMAIL
        // ===============================

        const existingEmail =
            await User.findOne({ email });

        if (existingEmail) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }


        // ===============================
        // HASH PASSWORD
        // ===============================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ===============================
        // CREATE USER
        // ===============================

        const newUser = new User({

            fullname: fullname,

            username: username,

            email: email,

            password: hashedPassword

        });


        // ===============================
        // SAVE USER
        // ===============================

        await newUser.save();


        // ===============================
        // SUCCESS
        // ===============================

        res.status(201).json({

            message: "Account created successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error"

        });

    }

});


// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        // Check if fields are provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Login successful
        const token =
    jwt.sign(
        {
            userId: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

res.status(200).json({

    message: "Login successful",

    username:
        user.username,

    token:
        token

});

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;