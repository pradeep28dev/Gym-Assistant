const express = require("express");

const router = express.Router();


// ==================================================
// USDA NUTRITION SEARCH
// ==================================================

router.get("/nutrition/search", async (req, res) => {

    try {

        const query =
            String(req.query.query || "").trim();


        // ------------------------------------------
        // VALIDATE QUERY
        // ------------------------------------------

        if (!query) {

            return res.status(400).json({

                message:
                    "Food search query is required.",

                foods: []

            });

        }


        // ------------------------------------------
        // CHECK API KEY
        // ------------------------------------------

        if (!process.env.USDA_API_KEY) {

            console.error(
                "USDA_API_KEY is missing from .env"
            );

            return res.status(500).json({

                message:
                    "USDA API key is not configured.",

                foods: []

            });

        }


        // ------------------------------------------
        // USDA API URL
        // ------------------------------------------

        const url =
            "https://api.nal.usda.gov/fdc/v1/foods/search" +
            "?api_key=" +
            encodeURIComponent(
                process.env.USDA_API_KEY
            ) +
            "&query=" +
            encodeURIComponent(query) +
            "&pageSize=8";


        // ------------------------------------------
        // CALL USDA
        // ------------------------------------------

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


        // ------------------------------------------
        // GET USDA DATA
        // ------------------------------------------

        const data =
            await response.json();


        // ------------------------------------------
        // RETURN FOOD DATA
        // ------------------------------------------

        return res.status(200).json({

            foods:
                data.foods || []

        });

    } catch (error) {

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

});


module.exports = router;