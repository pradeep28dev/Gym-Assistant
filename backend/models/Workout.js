const mongoose = require("mongoose");


// =====================================================
// WORKOUT PROGRESS SCHEMA
// =====================================================

const workoutProgressSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },

        plan: {
            type: String,
            enum: [
                "recommended",
                "custom"
            ],
            required: true
        },

        completedExercises: {
            type: [String],
            default: []
        }
    }
);


// =====================================================
// WORKOUT SCHEMA
// =====================================================

const workoutSchema = new mongoose.Schema(
    {
        // =================================================
        // USERNAME
        // =================================================

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },


        // =================================================
        // ACTIVE PLAN
        // =================================================

        activePlan: {
            type: String,
            enum: [
                "recommended",
                "custom"
            ],
            default: "recommended"
        },


        // =================================================
        // CUSTOM PLAN
        // =================================================

        customPlan: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },


        // =================================================
        // DAILY WORKOUT PROGRESS
        // =================================================

        workoutProgress: {
            type: [workoutProgressSchema],
            default: []
        }
    },


    // =====================================================
    // TIMESTAMPS
    // =====================================================

    {
        timestamps: true
    }
);


// =====================================================
// MODEL
// =====================================================

const Workout = mongoose.model(
    "Workout",
    workoutSchema
);


module.exports = Workout;