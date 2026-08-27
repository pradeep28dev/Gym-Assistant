const express = require("express");

// IMPORTANT:
// The filename is workout.js
const Workout = require("../models/Workout");

const router = express.Router();


// =====================================================
// GET WORKOUT DATA
// GET /api/workout/:username
// =====================================================

router.get(
    "/:username",
    async (req, res) => {

        try {

            const username =
                req.params.username.trim();


            console.log(
                "Getting workout data for:",
                username
            );


            const workout =
                await Workout.findOne({
                    username: username
                });


            // =================================================
            // NO WORKOUT DOCUMENT YET
            // =================================================

            if (!workout) {

                return res.status(200).json({

                    username:
                        username,

                    activePlan:
                        "recommended",

                    customPlan:
                        null,

                    workoutProgress:
                        []

                });

            }


            // =================================================
            // RETURN EXISTING WORKOUT
            // =================================================

            return res.status(200).json({

                username:
                    workout.username,

                activePlan:
                    workout.activePlan ||
                    "recommended",

                customPlan:
                    workout.customPlan ||
                    null,

                workoutProgress:
                    workout.workoutProgress ||
                    []

            });

        }

        catch (error) {

            console.error(
                "Workout fetch error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to load workout data",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// SAVE CUSTOM WORKOUT
// POST /api/workout/custom
// =====================================================

router.post(
    "/custom",
    async (req, res) => {

        try {

            const {
                username,
                customPlan
            } = req.body;


            if (
                !username ||
                !customPlan
            ) {

                return res.status(400).json({

                    message:
                        "Username and custom plan are required"

                });

            }


            const workout =
                await Workout.findOneAndUpdate(

                    {
                        username:
                            username.trim()
                    },

                    {

                        username:
                            username.trim(),

                        customPlan:
                            customPlan,

                        activePlan:
                            "custom"

                    },

                    {

                        new:
                            true,

                        upsert:
                            true,

                        runValidators:
                            true

                    }

                );


            return res.status(200).json({

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


            return res.status(500).json({

                message:
                    "Unable to save custom workout",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// CHANGE ACTIVE PLAN
// PUT /api/workout/active
// =====================================================

router.put(
    "/active",
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


            // =================================================
            // IF SWITCHING TO CUSTOM,
            // MAKE SURE CUSTOM PLAN EXISTS
            // =================================================

            if (
                activePlan === "custom"
            ) {

                const existingWorkout =
                    await Workout.findOne({
                        username:
                            username.trim()
                    });


                if (
                    !existingWorkout ||
                    !existingWorkout.customPlan
                ) {

                    return res.status(400).json({

                        message:
                            "No custom workout plan found"

                    });

                }

            }


            const workout =
                await Workout.findOneAndUpdate(

                    {
                        username:
                            username.trim()
                    },

                    {

                        username:
                            username.trim(),

                        activePlan:
                            activePlan

                    },

                    {

                        new:
                            true,

                        upsert:
                            true,

                        runValidators:
                            true

                    }

                );


            return res.status(200).json({

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


            return res.status(500).json({

                message:
                    "Unable to update active plan",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// SAVE DAILY WORKOUT PROGRESS
// POST /api/workout/progress
// =====================================================

router.post(
    "/progress",
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


            if (
                plan !== "recommended" &&
                plan !== "custom"
            ) {

                return res.status(400).json({

                    message:
                        "Invalid workout plan"

                });

            }


            let workout =
                await Workout.findOne({
                    username:
                        username.trim()
                });


            // =================================================
            // CREATE WORKOUT DOCUMENT
            // =================================================

            if (!workout) {

                workout =
                    new Workout({

                        username:
                            username.trim(),

                        activePlan:
                            plan,

                        customPlan:
                            null,

                        workoutProgress:
                            []

                    });

            }


            // =================================================
            // FIND EXISTING PROGRESS
            // =================================================

            const existingProgress =
                workout.workoutProgress.find(
                    function(progress) {

                        return (
                            progress.date === date &&
                            progress.plan === plan
                        );

                    }
                );


            // =================================================
            // UPDATE EXISTING PROGRESS
            // =================================================

            if (existingProgress) {

                existingProgress.completedExercises =
                    Array.isArray(
                        completedExercises
                    )
                        ? completedExercises
                        : [];

            }


            // =================================================
            // CREATE NEW PROGRESS
            // =================================================

            else {

                workout.workoutProgress.push({

                    date:
                        date,

                    plan:
                        plan,

                    completedExercises:
                        Array.isArray(
                            completedExercises
                        )
                            ? completedExercises
                            : []

                });

            }


            await workout.save();


            return res.status(200).json({

                message:
                    "Workout progress saved successfully"

            });

        }

        catch (error) {

            console.error(
                "Workout progress save error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to save workout progress",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// DELETE CUSTOM WORKOUT
// DELETE /api/workout/custom/:username
// =====================================================

router.delete(
    "/custom/:username",
    async (req, res) => {

        try {

            const username =
                req.params.username.trim();


            const workout =
                await Workout.findOne({
                    username:
                        username
                });


            if (!workout) {

                return res.status(404).json({

                    message:
                        "Workout data not found"

                });

            }


            workout.customPlan =
                null;


            workout.activePlan =
                "recommended";


            await workout.save();


            return res.status(200).json({

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


            return res.status(500).json({

                message:
                    "Unable to delete custom workout",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;