const express = require("express");

const Workout = require("../models/Workout");

const router = express.Router();


// ===============================
// GET WORKOUT DATA
// ===============================

router.get(
    "/workout/:username",
    async (req, res) => {

        try {

            const username =
                req.params.username;


            const workout =
                await Workout.findOne({
                    username: username
                });


            // ===============================
            // NO WORKOUT DATA YET
            // ===============================

            if (!workout) {

                return res.status(200).json({

                    activePlan:
                        "recommended",

                    customPlan:
                        null,

                    workoutProgress:
                        []

                });

            }


            // ===============================
            // RETURN WORKOUT DATA
            // ===============================

            res.status(200).json({

                activePlan:
                    workout.activePlan,

                customPlan:
                    workout.customPlan,

                workoutProgress:
                    workout.workoutProgress

            });

        }

        catch (error) {

            console.error(
                "Workout fetch error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ===============================
// SAVE CUSTOM WORKOUT
// ===============================

router.post(
    "/workout/custom",
    async (req, res) => {

        try {

            const {
                username,
                customPlan
            } = req.body;


            if (!username || !customPlan) {

                return res.status(400).json({

                    message:
                        "Username and custom plan are required"

                });

            }


            const workout =
                await Workout.findOneAndUpdate(

                    {
                        username: username
                    },

                    {

                        username: username,

                        customPlan:
                            customPlan,

                        activePlan:
                            "custom"

                    },

                    {

                        new: true,

                        upsert: true

                    }

                );


            res.status(200).json({

                message:
                    "Custom workout saved successfully",

                activePlan:
                    workout.activePlan,

                customPlan:
                    workout.customPlan

            });

        }

        catch (error) {

            console.error(
                "Custom workout save error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ===============================
// CHANGE ACTIVE PLAN
// ===============================

router.put(
    "/workout/active",
    async (req, res) => {

        try {

            const {
                username,
                activePlan
            } = req.body;


            if (
                !username ||
                !activePlan
            ) {

                return res.status(400).json({

                    message:
                        "Username and active plan are required"

                });

            }


            if (
                activePlan !== "recommended" &&
                activePlan !== "custom"
            ) {

                return res.status(400).json({

                    message:
                        "Invalid active plan"

                });

            }


            const workout =
                await Workout.findOneAndUpdate(

                    {
                        username: username
                    },

                    {

                        username: username,

                        activePlan:
                            activePlan

                    },

                    {

                        new: true,

                        upsert: true

                    }

                );


            res.status(200).json({

                message:
                    "Active workout plan updated",

                activePlan:
                    workout.activePlan

            });

        }

        catch (error) {

            console.error(
                "Active plan update error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ===============================
// SAVE DAILY WORKOUT PROGRESS
// ===============================

router.post(
    "/workout/progress",
    async (req, res) => {

        try {

            const {
                username,
                date,
                plan,
                completedExercises
            } = req.body;


            if (
                !username ||
                !date ||
                !plan
            ) {

                return res.status(400).json({

                    message:
                        "Username, date and plan are required"

                });

            }


            let workout =
                await Workout.findOne({
                    username: username
                });


            // ===============================
            // CREATE WORKOUT DOCUMENT
            // ===============================

            if (!workout) {

                workout =
                    new Workout({

                        username:
                            username,

                        activePlan:
                            plan,

                        workoutProgress: []

                    });

            }


            // ===============================
            // FIND TODAY'S PROGRESS
            // ===============================

            const existingProgress =
                workout.workoutProgress.find(
                    function(progress) {

                        return (
                            progress.date === date &&
                            progress.plan === plan
                        );

                    }
                );


            // ===============================
            // UPDATE EXISTING
            // ===============================

            if (existingProgress) {

                existingProgress.completedExercises =
                    completedExercises || [];

            }


            // ===============================
            // CREATE NEW
            // ===============================

            else {

                workout.workoutProgress.push({

                    date:
                        date,

                    plan:
                        plan,

                    completedExercises:
                        completedExercises || []

                });

            }


            await workout.save();


            res.status(200).json({

                message:
                    "Workout progress saved successfully"

            });

        }

        catch (error) {

            console.error(
                "Workout progress save error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ===============================
// DELETE CUSTOM WORKOUT
// ===============================

router.delete(
    "/workout/custom/:username",
    async (req, res) => {

        try {

            const username =
                req.params.username;


            const workout =
                await Workout.findOne({
                    username: username
                });


            if (!workout) {

                return res.status(404).json({

                    message:
                        "Workout data not found"

                });

            }


            workout.customPlan = {

                trainingDays: 0,

                week: []

            };


            workout.activePlan =
                "recommended";


            await workout.save();


            res.status(200).json({

                message:
                    "Custom workout deleted successfully",

                activePlan:
                    "recommended"

            });

        }

        catch (error) {

            console.error(
                "Custom workout delete error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


module.exports = router;