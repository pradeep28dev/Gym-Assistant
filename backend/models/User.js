const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ===============================
        // BASIC USER INFORMATION
        // ===============================

        fullname: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },


        // ===============================
        // FITNESS PROFILE
        // ===============================

        fitnessProfile: {

            gender: {
                type: String,
                default: ""
            },

            age: {
                type: Number,
                default: 0
            },

            height: {
                type: Number,
                default: 0
            },

            weight: {
                type: Number,
                default: 0
            },

            neck: {
                type: Number,
                default: 0
            },

            waist: {
                type: Number,
                default: 0
            },

            hip: {
                type: Number,
                default: 0
            },

            bodyFat: {
                type: Number,
                default: 0
            },

            activity: {
                type: String,
                default: ""
            },

            experience: {
                type: String,
                default: ""
            },

            goal: {
                type: String,
                default: ""
            }

        },


        // ===============================
        // PROGRESS
        // ===============================

        progress: [

            {

                id: {
                    type: Number,
                    required: true
                },

                date: {
                    type: String,
                    required: true
                },

                weight: {
                    type: Number,
                    required: true
                },

                bodyFat: {
                    type: Number,
                    default: null
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }

            }

        ]

    },

    {
        timestamps: true
    }
);


// ===============================
// CREATE USER MODEL
// ===============================

const User =
    mongoose.model(
        "User",
        userSchema
    );


module.exports = User;