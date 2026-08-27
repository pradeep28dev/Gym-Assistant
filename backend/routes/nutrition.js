const express = require("express");
const Nutrition = require("../models/Nutrition");

const router = express.Router();


// ==================================================
// USDA NUTRITION SEARCH
// GET /api/nutrition/search
// ==================================================

router.get(
    "/nutrition/search",
    async (req, res) => {

        try {

            const query =
                String(
                    req.query.query || ""
                ).trim();


            if (!query) {

                return res.status(400).json({

                    message:
                        "Food search query is required.",

                    foods: []

                });

            }


            if (!process.env.USDA_API_KEY) {

                console.error(
                    "USDA_API_KEY is missing."
                );

                return res.status(500).json({

                    message:
                        "USDA API key is not configured.",

                    foods: []

                });

            }


            const url =
                "https://api.nal.usda.gov/fdc/v1/foods/search" +
                "?api_key=" +
                encodeURIComponent(
                    process.env.USDA_API_KEY
                ) +
                "&query=" +
                encodeURIComponent(query) +
                "&pageSize=8";


            const response =
                await fetch(url);


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "USDA API error:",
                    errorText
                );

                return res.status(
                    response.status
                ).json({

                    message:
                        "USDA food search failed.",

                    foods: []

                });

            }


            const data =
                await response.json();


            return res.status(200).json({

                foods:
                    data.foods || []

            });

        }

        catch (error) {

            console.error(
                "Nutrition search error:",
                error
            );

            return res.status(500).json({

                message:
                    "Unable to search nutrition data.",

                foods: []

            });

        }

    }
);


// ==================================================
// GET NUTRITION DATA
// GET /api/nutrition/:username
// ==================================================

router.get(
    "/nutrition/:username",
    async (req, res) => {

        try {

            const username =
                String(
                    req.params.username || ""
                ).trim();


            if (!username) {

                return res.status(400).json({

                    message:
                        "Username is required."

                });

            }


            const nutrition =
                await Nutrition.findOne({

                    username:
                        username

                });


            if (!nutrition) {

                return res.status(200).json({

                    username:
                        username,

                    targets: {

                        calories: 0,

                        protein: 0,

                        carbs: 0,

                        fat: 0

                    },

                    foods: [],

                    meals: []

                });

            }


            return res.status(200).json({

                username:
                    nutrition.username,

                targets:
                    nutrition.targets,

                foods:
                    nutrition.foods,

                meals:
                    nutrition.meals

            });

        }

        catch (error) {

            console.error(
                "Nutrition fetch error:",
                error
            );

            return res.status(500).json({

                message:
                    "Unable to load nutrition data."

            });

        }

    }
);


// ==================================================
// SAVE COMPLETE NUTRITION DATA
// POST /api/nutrition
// ==================================================

router.post(
    "/nutrition",
    async (req, res) => {

        try {

            const {

                username,

                targets,

                foods,

                meals

            } = req.body;


            if (!username) {

                return res.status(400).json({

                    message:
                        "Username is required."

                });

            }


            const nutrition =
                await Nutrition.findOneAndUpdate(

                    {

                        username:
                            String(
                                username
                            ).trim()

                    },

                    {

                        username:
                            String(
                                username
                            ).trim(),

                        targets:
                            targets || {

                                calories: 0,

                                protein: 0,

                                carbs: 0,

                                fat: 0

                            },

                        foods:
                            Array.isArray(
                                foods
                            )
                                ? foods
                                : [],

                        meals:
                            Array.isArray(
                                meals
                            )
                                ? meals
                                : []

                    },

                    {

                        new: true,

                        upsert: true,

                        runValidators: true

                    }

                );


            return res.status(200).json({

                message:
                    "Nutrition data saved successfully.",

                nutrition:
                    nutrition

            });

        }

        catch (error) {

            console.error(
                "Nutrition save error:",
                error
            );

            return res.status(500).json({

                message:
                    "Unable to save nutrition data.",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// DELETE ONE FOOD
// DELETE /api/nutrition/:username/food/:foodId
// ==================================================

router.delete(
    "/nutrition/:username/food/:foodId",
    async (req, res) => {

        try {

            const username =
                String(
                    req.params.username || ""
                ).trim();


            const foodId =
                req.params.foodId;


            const nutrition =
                await Nutrition.findOne({

                    username:
                        username

                });


            if (!nutrition) {

                return res.status(404).json({

                    message:
                        "Nutrition data not found."

                });

            }


            const originalLength =
                nutrition.foods.length;


            nutrition.foods =
                nutrition.foods.filter(
                    function (food) {

                        return (
                            food._id.toString() !==
                            foodId
                        );

                    }
                );


            if (
                nutrition.foods.length ===
                originalLength
            ) {

                return res.status(404).json({

                    message:
                        "Food entry not found."

                });

            }


            await nutrition.save();


            return res.status(200).json({

                message:
                    "Food deleted successfully."

            });

        }

        catch (error) {

            console.error(
                "Food delete error:",
                error
            );

            return res.status(500).json({

                message:
                    "Unable to delete food."

            });

        }

    }
);


// ==================================================
// RESET TODAY'S FOOD
// DELETE /api/nutrition/:username/food/today/:date
// ==================================================

router.delete(
    "/nutrition/:username/food/today/:date",
    async (req, res) => {

        try {

            const username =
                String(
                    req.params.username || ""
                ).trim();


            const date =
                req.params.date;


            const nutrition =
                await Nutrition.findOne({

                    username:
                        username

                });


            if (!nutrition) {

                return res.status(200).json({

                    message:
                        "No nutrition data found."

                });

            }


            nutrition.foods =
                nutrition.foods.filter(
                    function (food) {

                        return (
                            food.date !== date
                        );

                    }
                );


            await nutrition.save();


            return res.status(200).json({

                message:
                    "Today's food reset successfully."

            });

        }

        catch (error) {

            console.error(
                "Food reset error:",
                error
            );

            return res.status(500).json({

                message:
                    "Unable to reset today's food."

            });

        }

    }
);


module.exports = router;
