const express = require("express");
const User = require("../models/User");

const router = express.Router();


// ==================================================
// ADD PROGRESS RECORD
// ==================================================

router.post("/", async (req, res) => {

    try {

        const {
            username,
            date,
            weight,
            bodyFat
        } = req.body;


        // ==================================================
        // VALIDATE USERNAME
        // ==================================================

        if (!username) {

            return res.status(400).json({

                message: "Username is required"

            });

        }


        // ==================================================
        // VALIDATE DATE
        // ==================================================

        if (!date) {

            return res.status(400).json({

                message: "Date is required"

            });

        }


        // ==================================================
        // VALIDATE WEIGHT
        // ==================================================

        const numericWeight =
            Number(weight);

        if (
            !numericWeight ||
            numericWeight <= 0
        ) {

            return res.status(400).json({

                message: "Please enter a valid weight"

            });

        }


        // ==================================================
        // VALIDATE BODY FAT
        // ==================================================

        let numericBodyFat = null;

        if (
            bodyFat !== null &&
            bodyFat !== undefined &&
            bodyFat !== ""
        ) {

            numericBodyFat =
                Number(bodyFat);


            if (
                isNaN(numericBodyFat) ||
                numericBodyFat <= 0 ||
                numericBodyFat >= 70
            ) {

                return res.status(400).json({

                    message:
                        "Please enter a valid body-fat percentage"

                });

            }

        }


        // ==================================================
        // FIND USER
        // ==================================================

        const user =
            await User.findOne({
                username: username
            });


        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        // ==================================================
        // CHECK DUPLICATE DATE
        // ==================================================

        const duplicate =
            user.progress.some(
                function (record) {

                    return record.date === date;

                }
            );


        if (duplicate) {

            return res.status(400).json({

                message:
                    "You already have a progress record for this date."

            });

        }


        // ==================================================
        // CREATE PROGRESS RECORD
        // ==================================================

        const newRecord = {

            id: Date.now(),

            date: date,

            weight: numericWeight,

            bodyFat: numericBodyFat

        };


        // ==================================================
        // ADD TO USER
        // ==================================================

        user.progress.push(
            newRecord
        );


        // ==================================================
        // SAVE TO MONGODB
        // ==================================================

        await user.save();


        // ==================================================
        // SUCCESS
        // ==================================================

        res.status(201).json({

            message:
                "Progress saved successfully",

            progress:
                newRecord

        });

    } catch (error) {

        console.error(
            "Progress save error:",
            error
        );


        res.status(500).json({

            message:
                "Server error"

        });

    }

});


// ==================================================
// GET ALL PROGRESS
// ==================================================

router.get("/:username", async (req, res) => {

    try {

        const username =
            req.params.username;


        // ==================================================
        // FIND USER
        // ==================================================

        const user =
            await User.findOne(

                {
                    username: username
                },

                {
                    progress: 1,
                    _id: 0
                }

            );


        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        // ==================================================
        // RETURN PROGRESS
        // ==================================================

        res.status(200).json({

            progress:
                user.progress || []

        });

    } catch (error) {

        console.error(
            "Progress fetch error:",
            error
        );


        res.status(500).json({

            message:
                "Server error"

        });

    }

});


// ==================================================
// DELETE PROGRESS RECORD
// ==================================================

router.delete(
    "/:username/:id",
    async (req, res) => {

        try {

            const username =
                req.params.username;

            const id =
                Number(
                    req.params.id
                );


            // ==================================================
            // FIND USER
            // ==================================================

            const user =
                await User.findOne({
                    username: username
                });


            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }


            // ==================================================
            // FIND RECORD
            // ==================================================

            const recordExists =
                user.progress.some(
                    function (record) {

                        return record.id === id;

                    }
                );


            if (!recordExists) {

                return res.status(404).json({

                    message:
                        "Progress record not found"

                });

            }


            // ==================================================
            // DELETE RECORD
            // ==================================================

            user.progress =
                user.progress.filter(
                    function (record) {

                        return record.id !== id;

                    }
                );


            // ==================================================
            // SAVE USER
            // ==================================================

            await user.save();


            // ==================================================
            // SUCCESS
            // ==================================================

            res.status(200).json({

                message:
                    "Progress record deleted successfully"

            });

        } catch (error) {

            console.error(
                "Progress delete error:",
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