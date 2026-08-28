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

                    dailyTotals: [],

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

                 dailyTotals:
        nutrition.dailyTotals || [],

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


            const cleanUsername =
                String(username).trim();


            // ==================================================
            // TODAY'S DATE
            // ==================================================

            const today =
                new Date();

            const year =
                today.getFullYear();

            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");

            const todayKey =
                year +
                "-" +
                month +
                "-" +
                day;


            // ==================================================
            // PREPARE FOOD DATA
            // ==================================================

            const safeFoods =
                Array.isArray(foods)
                    ? foods.map(
                        function (food) {

                            return {

                                name:
                                    food.name,

                                quantity:
                                    Number(
                                        food.quantity
                                    ) || 0,

                                unit:
                                    food.unit || "g",

                                calories:
                                    Number(
                                        food.calories
                                    ) || 0,

                                protein:
                                    Number(
                                        food.protein
                                    ) || 0,

                                carbs:
                                    Number(
                                        food.carbs
                                    ) || 0,

                                fat:
                                    Number(
                                        food.fat
                                    ) || 0,

                                date:
                                    food.date ||
                                    todayKey

                            };

                        }
                    )
                    : [];


            // ==================================================
            // PREPARE TARGETS
            // ==================================================

            const safeTargets = {

                calories:
                    Number(
                        targets &&
                        targets.calories
                    ) || 0,

                protein:
                    Number(
                        targets &&
                        targets.protein
                    ) || 0,

                carbs:
                    Number(
                        targets &&
                        targets.carbs
                    ) || 0,

                fat:
                    Number(
                        targets &&
                        targets.fat
                    ) || 0

            };


            // ==================================================
            // CALCULATE DAILY TOTALS
            // ==================================================

            const dailyTotalsMap = {};


            safeFoods.forEach(
                function (food) {

                    const date =
                        food.date;


                    if (
                        !dailyTotalsMap[date]
                    ) {

                        dailyTotalsMap[date] = {

                            date:
                                date,

                            calories:
                                0,

                            protein:
                                0,

                            carbs:
                                0,

                            fat:
                                0

                        };

                    }


                    dailyTotalsMap[date].calories +=
                        Number(food.calories) || 0;

                    dailyTotalsMap[date].protein +=
                        Number(food.protein) || 0;

                    dailyTotalsMap[date].carbs +=
                        Number(food.carbs) || 0;

                    dailyTotalsMap[date].fat +=
                        Number(food.fat) || 0;

                }
            );


            // ==================================================
            // ROUND DAILY TOTALS
            // ==================================================

            const calculatedDailyTotals =
                Object.values(
                    dailyTotalsMap
                ).map(
                    function (total) {

                        return {

                            date:
                                total.date,

                            calories:
                                Number(
                                    total.calories.toFixed(2)
                                ),

                            protein:
                                Number(
                                    total.protein.toFixed(2)
                                ),

                            carbs:
                                Number(
                                    total.carbs.toFixed(2)
                                ),

                            fat:
                                Number(
                                    total.fat.toFixed(2)
                                )

                        };

                    }
                );


            // ==================================================
            // GET EXISTING NUTRITION DATA
            // ==================================================

            const existingNutrition =
                await Nutrition.findOne({

                    username:
                        cleanUsername

                });


            // ==================================================
            // PRESERVE PREVIOUS DAILY HISTORY
            // ==================================================

            let existingDailyTotals =
                existingNutrition &&
                Array.isArray(
                    existingNutrition.dailyTotals
                )
                    ? existingNutrition.dailyTotals.map(
                        function (total) {

                            return {

                                date:
                                    total.date,

                                calories:
                                    Number(
                                        total.calories
                                    ) || 0,

                                protein:
                                    Number(
                                        total.protein
                                    ) || 0,

                                carbs:
                                    Number(
                                        total.carbs
                                    ) || 0,

                                fat:
                                    Number(
                                        total.fat
                                    ) || 0

                            };

                        }
                    )
                    : [];


            // ==================================================
            // UPDATE DAILY HISTORY
            // ==================================================

            calculatedDailyTotals.forEach(
                function (newTotal) {

                    const existingIndex =
                        existingDailyTotals.findIndex(
                            function (oldTotal) {

                                return (
                                    oldTotal.date ===
                                    newTotal.date
                                );

                            }
                        );


                    if (
                        existingIndex !== -1
                    ) {

                        // Update that day's total

                        existingDailyTotals[
                            existingIndex
                        ] = newTotal;

                    }

                    else {

                        // Add a new day

                        existingDailyTotals.push(
                            newTotal
                        );

                    }

                }
            );


            // ==================================================
            // SORT HISTORY BY DATE
            // ==================================================

            existingDailyTotals.sort(
                function (a, b) {

                    return (
                        a.date.localeCompare(
                            b.date
                        )
                    );

                }
            );


            // ==================================================
            // SAVE TO MONGODB
            // ==================================================

            const nutrition =
                await Nutrition.findOneAndUpdate(

                    {
                        username:
                            cleanUsername
                    },

                    {

                        username:
                            cleanUsername,

                        targets:
                            safeTargets,

                        foods:
                            safeFoods,

                        dailyTotals:
                            existingDailyTotals,

                        meals:
                            Array.isArray(meals)
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
                String(
                    req.params.foodId || ""
                ).trim();


            const nutrition =
                await Nutrition.findOne({
                    username: username
                });


            if (!nutrition) {

                return res.status(404).json({

                    message:
                        "Nutrition data not found."

                });

            }


            // ==================================================
            // FIND FOOD
            // ==================================================

            const food =
                nutrition.foods.find(
                    function (item) {

                        return (
                            String(item._id) ===
                            foodId
                        );

                    }
                );


            if (!food) {

                console.log(
                    "Food ID not found:",
                    foodId
                );

                console.log(
                    "Available food IDs:",
                    nutrition.foods.map(
                        function (item) {

                            return String(
                                item._id
                            );

                        }
                    )
                );


                return res.status(404).json({

                    message:
                        "Food entry not found."

                });

            }


            // ==================================================
            // REMEMBER FOOD DATE
            // ==================================================

            const foodDate =
                food.date;


            // ==================================================
            // REMOVE FOOD
            // ==================================================

            nutrition.foods =
                nutrition.foods.filter(
                    function (item) {

                        return (
                            String(item._id) !==
                            foodId
                        );

                    }
                );


            // ==================================================
            // RECALCULATE DAILY TOTAL
            // ==================================================

            const remainingFoods =
                nutrition.foods.filter(
                    function (item) {

                        return (
                            item.date ===
                            foodDate
                        );

                    }
                );


            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;


            remainingFoods.forEach(
                function (item) {

                    totalCalories +=
                        Number(
                            item.calories
                        ) || 0;

                    totalProtein +=
                        Number(
                            item.protein
                        ) || 0;

                    totalCarbs +=
                        Number(
                            item.carbs
                        ) || 0;

                    totalFat +=
                        Number(
                            item.fat
                        ) || 0;

                }
            );


            // ==================================================
            // UPDATE DAILY TOTAL
            // ==================================================

            const historyIndex =
                nutrition.dailyTotals.findIndex(
                    function (item) {

                        return (
                            item.date ===
                            foodDate
                        );

                    }
                );


            if (
                remainingFoods.length === 0
            ) {

                // No food remains for this date.
                // Remove the daily history entry.

                if (
                    historyIndex !== -1
                ) {

                    nutrition.dailyTotals.splice(
                        historyIndex,
                        1
                    );

                }

            }

            else {

                const updatedTotal = {

                    date:
                        foodDate,

                    calories:
                        Number(
                            totalCalories.toFixed(2)
                        ),

                    protein:
                        Number(
                            totalProtein.toFixed(2)
                        ),

                    carbs:
                        Number(
                            totalCarbs.toFixed(2)
                        ),

                    fat:
                        Number(
                            totalFat.toFixed(2)
                        )

                };


                if (
                    historyIndex !== -1
                ) {

                    nutrition.dailyTotals[
                        historyIndex
                    ] =
                        updatedTotal;

                }

                else {

                    nutrition.dailyTotals.push(
                        updatedTotal
                    );

                }

            }


            // ==================================================
            // SAVE
            // ==================================================

            await nutrition.save();


            return res.status(200).json({

                message:
                    "Food deleted successfully.",

                nutrition:
                    nutrition

            });

        }

        catch (error) {

            console.error(
                "Food delete error:",
                error
            );

            return res.status(500).json({

                message:
                    "Unable to delete food.",

                error:
                    error.message

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

                nutrition.dailyTotals =
    nutrition.dailyTotals.filter(
        function (total) {

            return (
                total.date !== date
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
