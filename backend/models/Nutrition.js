const mongoose = require("mongoose");


// ==================================================
// FOOD SCHEMA
// ==================================================

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true
        },

        unit: {
            type: String,
            required: true,
            trim: true
        },

        calories: {
            type: Number,
            default: 0
        },

        protein: {
            type: Number,
            default: 0
        },

        carbs: {
            type: Number,
            default: 0
        },

        fat: {
            type: Number,
            default: 0
        },

        date: {
            type: String,
            required: true
        }
    }
);


// ==================================================
// MEAL SCHEMA
// ==================================================

const mealSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            default: "meal"
        },

        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        time: {
            type: String,
            default: ""
        },

        foods: {
            type: Array,
            default: []
        }
    }
);


// ==================================================
// NUTRITION SCHEMA
// ==================================================

const nutritionSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },


        // ==================================================
        // DAILY TARGETS
        // ==================================================

        targets: {
            calories: {
                type: Number,
                default: 0
            },

            protein: {
                type: Number,
                default: 0
            },

            carbs: {
                type: Number,
                default: 0
            },

            fat: {
                type: Number,
                default: 0
            }
        },


        // ==================================================
        // FOOD TRACKER
        // ==================================================

        foods: {
            type: [foodSchema],
            default: []
        },

        // ==================================================
// DAILY NUTRITION HISTORY
// ==================================================

dailyTotals: {
    type: [
        {
            date: {
                type: String,
                required: true
            },

            calories: {
                type: Number,
                default: 0
            },

            protein: {
                type: Number,
                default: 0
            },

            carbs: {
                type: Number,
                default: 0
            },

            fat: {
                type: Number,
                default: 0
            }
        }
    ],
    default: []
},

        // ==================================================
        // MEAL PLANNER
        // ==================================================

        meals: {
            type: [mealSchema],
            default: []
        }
    },


    {
        timestamps: true
    }
);


const Nutrition = mongoose.model(
    "Nutrition",
    nutritionSchema
);


module.exports = Nutrition;
