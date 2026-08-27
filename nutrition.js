// ==================================================
// GYM ASSISTANT - NUTRITION.JS
// ==================================================


// ==================================================
// BACKEND API
// ==================================================

const BACKEND_URL =
    "https://gym-assistant-rb7h.onrender.com";


// ==================================================
// CHECK LOGIN
// ==================================================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href = "index.html";

}


// ==================================================
// GET CURRENT USER
// ==================================================

const username =
    localStorage.getItem("username");

if (!username) {

    localStorage.removeItem("isLoggedIn");

    window.location.href = "index.html";

}


// ==================================================
// GET HTML ELEMENTS
// ==================================================

const usernameDisplay =
    document.getElementById("usernameDisplay");

const bmrValue =
    document.getElementById("bmrValue");

const tdeeValue =
    document.getElementById("tdeeValue");

const calorieValue =
    document.getElementById("calorieValue");

const goalText =
    document.getElementById("goalText");

const proteinValue =
    document.getElementById("proteinValue");

const carbsValue =
    document.getElementById("carbsValue");

const fatValue =
    document.getElementById("fatValue");

const proteinFill =
    document.getElementById("proteinFill");

const carbsFill =
    document.getElementById("carbsFill");

const fatFill =
    document.getElementById("fatFill");

const weightValue =
    document.getElementById("weightValue");

const heightValue =
    document.getElementById("heightValue");

const ageValue =
    document.getElementById("ageValue");

const activityValue =
    document.getElementById("activityValue");

const goalValue =
    document.getElementById("goalValue");

const profileButton =
    document.getElementById("profileButton");

const logoutButton =
    document.getElementById("logoutButton");


// ==================================================
// DAILY PROGRESS ELEMENTS
// ==================================================

const consumedCalories =
    document.getElementById("consumedCalories");

const targetCalories =
    document.getElementById("targetCalories");

const remainingCalories =
    document.getElementById("remainingCalories");

const calorieProgressFill =
    document.getElementById("calorieProgressFill");

const consumedProtein =
    document.getElementById("consumedProtein");

const targetProtein =
    document.getElementById("targetProtein");

const remainingProtein =
    document.getElementById("remainingProtein");

const proteinProgressFill =
    document.getElementById("proteinProgressFill");

const consumedCarbs =
    document.getElementById("consumedCarbs");

const targetCarbs =
    document.getElementById("targetCarbs");

const remainingCarbs =
    document.getElementById("remainingCarbs");

const carbsProgressFill =
    document.getElementById("carbsProgressFill");

const consumedFat =
    document.getElementById("consumedFat");

const targetFat =
    document.getElementById("targetFat");

const remainingFat =
    document.getElementById("remainingFat");

const fatProgressFill =
    document.getElementById("fatProgressFill");


// ==================================================
// FOOD ELEMENTS
// ==================================================

const foodName =
    document.getElementById("foodName");

const foodSuggestions =
    document.getElementById("foodSuggestions");

const foodQuantity =
    document.getElementById("foodQuantity");

const foodUnit =
    document.getElementById("foodUnit");

const addFoodButton =
    document.getElementById("addFoodButton");

const foodStatus =
    document.getElementById("foodStatus");

const foodList =
    document.getElementById("foodList");

const resetFoodButton =
    document.getElementById("resetFoodButton");


// ==================================================
// MEAL ELEMENTS
// ==================================================

const mealList =
    document.getElementById("mealList");

const addMealButton =
    document.getElementById("addMealButton");

const saveMealButton =
    document.getElementById("saveMealButton");

const resetMealButton =
    document.getElementById("resetMealButton");


// ==================================================
// DISPLAY USERNAME
// ==================================================

if (usernameDisplay) {

    usernameDisplay.textContent = username;

}


// ==================================================
// NUTRITION TARGETS
// ==================================================

let nutritionTargets = {

    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0

};


// ==================================================
// FOOD STORAGE
// ==================================================

let allFoods = [];

let todayFoods = [];


// ==================================================
// DEFAULT MEALS
// ==================================================

const defaultMeals = [

    {
        type: "meal",
        name: "Breakfast",
        description: "Plan your breakfast"
    },

    {
        type: "snack",
        name: "Snack 1",
        description: "Add a healthy snack"
    },

    {
        type: "meal",
        name: "Lunch",
        description: "Plan your lunch"
    },

    {
        type: "snack",
        name: "Snack 2",
        description: "Add a healthy snack"
    },

    {
        type: "meal",
        name: "Dinner",
        description: "Plan your dinner"
    },

    {
        type: "snack",
        name: "Snack 3",
        description: "Add a healthy snack"
    }

];

let meals = [];


// ==================================================
// FORMAT TEXT
// ==================================================

function formatText(value) {

    if (!value) {

        return "--";

    }

    return String(value)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, function (letter) {

            return letter.toUpperCase();

        });

}


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==================================================
// TODAY'S DATE
// ==================================================

function getTodayKey() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ==================================================
// ACTIVITY MULTIPLIER
// ==================================================

function getActivityMultiplier(activity) {

    const value =
        String(activity || "")
            .toLowerCase()
            .trim();


    if (
        value === "sedentary"
    ) {

        return 1.2;

    }


    if (
        value === "light" ||
        value === "lightly-active" ||
        value === "lightly active"
    ) {

        return 1.375;

    }


    if (
        value === "moderate" ||
        value === "moderately-active" ||
        value === "moderately active"
    ) {

        return 1.55;

    }


    if (
        value === "very-active" ||
        value === "very_active" ||
        value === "very active"
    ) {

        return 1.725;

    }


    if (
        value === "extra-active" ||
        value === "extremely-active" ||
        value === "extra active"
    ) {

        return 1.9;

    }


    return 1.2;

}


// ==================================================
// CALCULATE CALORIE TARGET
// ==================================================

function calculateCalories(tdee, goal) {

    const value =
        String(goal || "")
            .toLowerCase()
            .trim();


    if (
        value === "weight-loss" ||
        value === "weight_loss" ||
        value === "lose-weight" ||
        value === "lose_weight"
    ) {

        if (goalText) {

            goalText.textContent =
                "Estimated calorie deficit for weight loss";

        }

        return tdee - 400;

    }


    if (
        value === "muscle-gain" ||
        value === "muscle_gain" ||
        value === "gain-muscle" ||
        value === "build-muscle" ||
        value === "build_muscle"
    ) {

        if (goalText) {

            goalText.textContent =
                "Estimated calorie surplus for muscle gain";

        }

        return tdee + 250;

    }


    if (
        value === "maintenance" ||
        value === "maintain"
    ) {

        if (goalText) {

            goalText.textContent =
                "Estimated maintenance calories";

        }

        return tdee;

    }


    if (
        value === "general-fitness" ||
        value === "general_fitness" ||
        value === "fitness"
    ) {

        if (goalText) {

            goalText.textContent =
                "Estimated calories for general fitness";

        }

        return tdee;

    }


    if (goalText) {

        goalText.textContent =
            "Estimated daily calorie requirement";

    }

    return tdee;

}


// ==================================================
// CALCULATE NUTRITION
// ==================================================

function calculateNutrition(profile) {

    const gender =
        String(profile.gender || "")
            .toLowerCase()
            .trim();

    const age =
        Number(profile.age);

    const height =
        Number(profile.height);

    const weight =
        Number(profile.weight);

    const activity =
        profile.activity;

    const goal =
        profile.goal;


    if (
        !age ||
        !height ||
        !weight
    ) {

        alert(
            "Some fitness information is missing. Please complete your assessment."
        );

        window.location.href =
            "assessment.html";

        return false;

    }


    // ==================================================
    // BODY DATA
    // ==================================================

    if (weightValue) {

        weightValue.textContent =
            weight.toFixed(1);

    }


    if (heightValue) {

        heightValue.textContent =
            height;

    }


    if (ageValue) {

        ageValue.textContent =
            age;

    }


    if (activityValue) {

        activityValue.textContent =
            formatText(activity);

    }


    if (goalValue) {

        goalValue.textContent =
            formatText(goal);

    }


    // ==================================================
    // BMR
    // ==================================================

    let bmr;


    if (gender === "male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    }

    else {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }


    // ==================================================
    // TDEE
    // ==================================================

    const multiplier =
        getActivityMultiplier(activity);

    const tdee =
        bmr * multiplier;


    // ==================================================
    // DAILY CALORIES
    // ==================================================

    let calories =
        calculateCalories(
            tdee,
            goal
        );


    // Minimum calorie safeguard
    if (
        gender === "male" &&
        calories < 1500
    ) {

        calories = 1500;

    }


    if (
        gender !== "male" &&
        calories < 1200
    ) {

        calories = 1200;

    }


    // ==================================================
    // MACROS
    // ==================================================

    const protein =
        weight * 1.8;

    const proteinCalories =
        protein * 4;

    const fatCalories =
        calories * 0.25;

    const fat =
        fatCalories / 9;

    const remainingCalories =
        calories -
        proteinCalories -
        fatCalories;

    const carbs =
        Math.max(
            0,
            remainingCalories / 4
        );


    // ==================================================
    // DISPLAY RESULTS
    // ==================================================

    if (bmrValue) {

        bmrValue.textContent =
            Math.round(bmr);

    }


    if (tdeeValue) {

        tdeeValue.textContent =
            Math.round(tdee);

    }


    if (calorieValue) {

        calorieValue.textContent =
            Math.round(calories);

    }


    if (proteinValue) {

        proteinValue.textContent =
            Math.round(protein);

    }


    if (carbsValue) {

        carbsValue.textContent =
            Math.round(carbs);

    }


    if (fatValue) {

        fatValue.textContent =
            Math.round(fat);

    }


    // ==================================================
    // SAVE TARGETS IN MEMORY
    // ==================================================

    nutritionTargets = {

        calories:
            Math.round(calories),

        protein:
            Math.round(protein),

        carbs:
            Math.round(carbs),

        fat:
            Math.round(fat)

    };


    updateTargetDisplays();

    updateMacroTargetBars();

    updateNutritionProgress();


    return true;

}


// ==================================================
// UPDATE TARGET DISPLAYS
// ==================================================

function updateTargetDisplays() {

    if (targetCalories) {

        targetCalories.textContent =
            nutritionTargets.calories;

    }


    if (targetProtein) {

        targetProtein.textContent =
            nutritionTargets.protein;

    }


    if (targetCarbs) {

        targetCarbs.textContent =
            nutritionTargets.carbs;

    }


    if (targetFat) {

        targetFat.textContent =
            nutritionTargets.fat;

    }

}

// ==================================================
// FILTER TODAY'S FOOD
// ==================================================

function filterTodayFoods() {

    const today = getTodayKey();

    todayFoods = allFoods.filter(
        function (food) {

            return food.date === today;

        }
    );

}

// ==================================================
// SAVE NUTRITION TO DATABASE
// ==================================================

async function saveNutritionToDatabase() {

    try {

        const response =
            await fetch(
                BACKEND_URL +
                "/api/nutrition",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            username:
                                username,

                            targets:
                                nutritionTargets,

                            foods:
                                allFoods,

                            meals:
                                meals

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to save nutrition data."
            );

        }


        // MongoDB may return updated
        // food objects with _id values.

        if (
            data.nutrition &&
            Array.isArray(
                data.nutrition.foods
            )
        ) {

            allFoods =
                data.nutrition.foods;

            filterTodayFoods();

        }


        return true;

    }

    catch (error) {

        console.error(
            "Nutrition database save error:",
            error
        );

        return false;

    }

}


// ==================================================
// LOAD NUTRITION FROM DATABASE
// ==================================================

async function loadNutritionFromDatabase() {

    try {

        const response =
            await fetch(

                BACKEND_URL +
                "/api/nutrition/" +
                encodeURIComponent(
                    username
                )

            );


        if (!response.ok) {

            throw new Error(
                "Unable to load nutrition data."
            );

        }


        const data =
            await response.json();


        // ==================================================
        // DO NOT LOAD TARGETS FROM DATABASE
        // ==================================================
        //
        // Nutrition targets are calculated from the
        // user's current fitness profile.
        //
        // calculateNutrition(profile) already calculated
        // the correct values before this function runs.
        //
        // Therefore, DO NOT overwrite nutritionTargets
        // with MongoDB values.
        //
        // ==================================================


        // ==================================================
        // LOAD FOODS
        // ==================================================

        allFoods =
            Array.isArray(
                data.foods
            )
                ? data.foods
                : [];


        filterTodayFoods();


        // ==================================================
        // LOAD MEALS
        // ==================================================

        if (
            Array.isArray(
                data.meals
            ) &&
            data.meals.length > 0
        ) {

            meals =
                data.meals;

        }

        else {

            meals =
                JSON.parse(
                    JSON.stringify(
                        defaultMeals
                    )
                );

        }


        // ==================================================
        // DISPLAY DATA
        // ==================================================

        renderMeals();

        renderFoodList();

        updateNutritionProgress();


        return true;

    }


    catch (error) {

        console.error(
            "Nutrition database load error:",
            error
        );


        return false;

    }

}


// ==================================================
// GET FOOD TOTALS
// ==================================================

function getFoodTotals() {

    const totals = {

        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0

    };


    todayFoods.forEach(
        function (food) {

            totals.calories +=
                Number(food.calories) || 0;

            totals.protein +=
                Number(food.protein) || 0;

            totals.carbs +=
                Number(food.carbs) || 0;

            totals.fat +=
                Number(food.fat) || 0;

        }
    );


    return totals;

}


// ==================================================
// UPDATE MACRO TARGET BARS
// ==================================================

function updateMacroTargetBars() {

    updateProgressBar(
        proteinFill,
        nutritionTargets.protein,
        nutritionTargets.protein
    );

    updateProgressBar(
        carbsFill,
        nutritionTargets.carbs,
        nutritionTargets.carbs
    );

    updateProgressBar(
        fatFill,
        nutritionTargets.fat,
        nutritionTargets.fat
    );

}


// ==================================================
// UPDATE NUTRITION PROGRESS
// ==================================================

function updateNutritionProgress() {

    const totals =
        getFoodTotals();


    if (consumedCalories) {

        consumedCalories.textContent =
            Math.round(
                totals.calories
            );

    }


    if (consumedProtein) {

        consumedProtein.textContent =
            Math.round(
                totals.protein
            );

    }


    if (consumedCarbs) {

        consumedCarbs.textContent =
            Math.round(
                totals.carbs
            );

    }


    if (consumedFat) {

        consumedFat.textContent =
            Math.round(
                totals.fat
            );

    }


    updateTargetDisplays();


    updateProgressBar(
        calorieProgressFill,
        totals.calories,
        nutritionTargets.calories
    );


    updateProgressBar(
        proteinProgressFill,
        totals.protein,
        nutritionTargets.protein
    );


    updateProgressBar(
        carbsProgressFill,
        totals.carbs,
        nutritionTargets.carbs
    );


    updateProgressBar(
        fatProgressFill,
        totals.fat,
        nutritionTargets.fat
    );


    updateRemainingText(
        remainingCalories,
        nutritionTargets.calories -
        totals.calories,
        "kcal"
    );


    updateRemainingText(
        remainingProtein,
        nutritionTargets.protein -
        totals.protein,
        "g"
    );


    updateRemainingText(
        remainingCarbs,
        nutritionTargets.carbs -
        totals.carbs,
        "g"
    );


    updateRemainingText(
        remainingFat,
        nutritionTargets.fat -
        totals.fat,
        "g"
    );

}

// ==================================================
// PROGRESS BAR
// ==================================================

function updateProgressBar(
    element,
    consumed,
    target
) {

    if (!element) {

        return;

    }


    if (
        !target ||
        target <= 0
    ) {

        element.style.width =
            "0%";

        return;

    }


    let percentage =
        (consumed / target) * 100;


    percentage =
        Math.min(
            100,
            Math.max(
                0,
                percentage
            )
        );


    element.style.width =
        percentage + "%";

}


// ==================================================
// REMAINING TEXT
// ==================================================

function updateRemainingText(
    element,
    amount,
    unit
) {

    if (!element) {

        return;

    }


    const rounded =
        Math.round(
            Math.abs(amount)
        );


    if (amount > 0) {

        element.textContent =
            rounded +
            " " +
            unit +
            " remaining";

    }

    else if (amount === 0) {

        element.textContent =
            "Target reached ✓";

    }

    else {

        element.textContent =
            rounded +
            " " +
            unit +
            " over target";

    }

}


// ==================================================
// USDA FOOD SEARCH
// ==================================================

async function searchFood(foodNameText) {

    const url =
        BACKEND_URL +
        "/api/nutrition/search?query=" +
        encodeURIComponent(foodNameText);


    const response =
        await fetch(url);


    if (!response.ok) {

        let message =
            "Food search failed.";

        try {

            const errorData =
                await response.json();

            if (errorData.message) {

                message =
                    errorData.message;

            }

        }

        catch (error) {

            // Ignore JSON parsing error.

        }

        throw new Error(message);

    }


    const data =
        await response.json();


    if (
        !data.foods ||
        data.foods.length === 0
    ) {

        throw new Error(
            "Food was not found."
        );

    }


    return data.foods;

}


// ==================================================
// FOOD SUGGESTION TIMER
// ==================================================

let suggestionTimer = null;


// ==================================================
// GET FOOD SUGGESTIONS
// ==================================================

async function getFoodSuggestions(searchText) {

    if (
        !searchText ||
        searchText.length < 2
    ) {

        hideFoodSuggestions();

        return;

    }


    try {

        const foods =
            await searchFoodSuggestions(
                searchText
            );


        showFoodSuggestions(
            foods
        );

    }

    catch (error) {

        console.error(
            "Suggestion error:",
            error
        );

        hideFoodSuggestions();

    }

}


// ==================================================
// SEARCH FOOD SUGGESTIONS
// ==================================================

async function searchFoodSuggestions(searchText) {

    const url =
        BACKEND_URL +
        "/api/nutrition/search?query=" +
        encodeURIComponent(searchText);


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Suggestion request failed."
        );

    }


    const data =
        await response.json();


    return data.foods || [];

}


// ==================================================
// SHOW FOOD SUGGESTIONS
// ==================================================

function showFoodSuggestions(foods) {

    if (!foodSuggestions) {

        return;

    }


    foodSuggestions.innerHTML =
        "";


    if (
        !foods ||
        foods.length === 0
    ) {

        hideFoodSuggestions();

        return;

    }


    foods.slice(0, 8).forEach(
        function (food) {

            const suggestion =
                document.createElement(
                    "div"
                );


            suggestion.className =
                "foodSuggestion";


            suggestion.textContent =
                food.description ||
                "Unknown food";


            suggestion.addEventListener(
                "click",
                function () {

                    if (foodName) {

                        foodName.value =
                            food.description || "";

                    }


                    hideFoodSuggestions();


                    if (foodQuantity) {

                        foodQuantity.focus();

                    }

                }
            );


            foodSuggestions.appendChild(
                suggestion
            );

        }
    );


    foodSuggestions.style.display =
        "block";

}


// ==================================================
// HIDE FOOD SUGGESTIONS
// ==================================================

function hideFoodSuggestions() {

    if (!foodSuggestions) {

        return;

    }


    foodSuggestions.innerHTML =
        "";

    foodSuggestions.style.display =
        "none";

}


// ==================================================
// FOOD NAME INPUT
// ==================================================

if (foodName) {

    foodName.addEventListener(
        "input",
        function () {

            const value =
                foodName.value.trim();


            clearTimeout(
                suggestionTimer
            );


            if (
                value.length < 2
            ) {

                hideFoodSuggestions();

                return;

            }


            suggestionTimer =
                setTimeout(
                    function () {

                        getFoodSuggestions(
                            value
                        );

                    },
                    400
                );

        }
    );


    foodName.addEventListener(
        "focus",
        function () {

            const value =
                foodName.value.trim();


            if (
                value.length >= 2
            ) {

                getFoodSuggestions(
                    value
                );

            }

        }
    );

}


// ==================================================
// CLOSE SUGGESTIONS
// ==================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".foodSearchGroup"
            )
        ) {

            hideFoodSuggestions();

        }

    }
);


// ==================================================
// GET USDA NUTRIENT
// ==================================================

function getNutrient(food, nutrientNames) {

    if (
        !food ||
        !Array.isArray(
            food.foodNutrients
        )
    ) {

        return 0;

    }


    for (
        let i = 0;
        i < food.foodNutrients.length;
        i++
    ) {

        const nutrient =
            food.foodNutrients[i];


        const nutrientName =
            String(
                nutrient.nutrientName || ""
            )
                .toLowerCase()
                .trim();


        for (
            let j = 0;
            j < nutrientNames.length;
            j++
        ) {

            if (
                nutrientName ===
                nutrientNames[j]
                    .toLowerCase()
                    .trim()
            ) {

                return (
                    Number(
                        nutrient.value
                    ) || 0
                );

            }

        }

    }


    return 0;

}


// ==================================================
// ADD FOOD
// ==================================================

if (addFoodButton) {

    addFoodButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            const name =
                foodName
                    ? foodName.value.trim()
                    : "";


            const quantity =
                foodQuantity
                    ? Number(
                        foodQuantity.value
                    )
                    : 0;


            const unit =
                foodUnit
                    ? foodUnit.value
                    : "g";


            // ==================================================
            // VALIDATION
            // ==================================================

            if (!name) {

                if (foodStatus) {

                    foodStatus.textContent =
                        "Please enter a food name.";

                }

                return;

            }


            if (
                !quantity ||
                quantity <= 0
            ) {

                if (foodStatus) {

                    foodStatus.textContent =
                        "Please enter a valid quantity.";

                }

                return;

            }


            addFoodButton.disabled =
                true;

            addFoodButton.textContent =
                "Searching...";


            if (foodStatus) {

                foodStatus.textContent =
                    "Finding nutrition information...";

            }


            try {

                // ==================================================
                // SEARCH USDA
                // ==================================================

                const foods =
                    await searchFood(name);


                const food =
                    foods[0];


                if (!food) {

                    throw new Error(
                        "Food was not found."
                    );

                }


                // ==================================================
                // CALCULATE QUANTITY
                // ==================================================

                let baseQuantity =
                    quantity;


                if (unit === "serving") {

                    baseQuantity =
                        Number(
                            food.servingSize
                        ) || 100;

                }


                if (
                    unit === "ml"
                ) {

                    // For foods where USDA
                    // provides values per 100g,
                    // ml is treated approximately
                    // as 1 ml = 1 g.

                    baseQuantity =
                        quantity;

                }


                const multiplier =
                    baseQuantity / 100;


                // ==================================================
                // NUTRITION VALUES
                // ==================================================

                const calories =
                    getNutrient(
                        food,
                        [
                            "Energy",
                            "Energy (Atwater General Factors)"
                        ]
                    ) *
                    multiplier;


                const protein =
                    getNutrient(
                        food,
                        [
                            "Protein"
                        ]
                    ) *
                    multiplier;


                const carbs =
                    getNutrient(
                        food,
                        [
                            "Carbohydrate, by difference",
                            "Carbohydrates"
                        ]
                    ) *
                    multiplier;


                const fat =
                    getNutrient(
                        food,
                        [
                            "Total lipid (fat)",
                            "Total Fat"
                        ]
                    ) *
                    multiplier;


                // ==================================================
                // CREATE FOOD OBJECT
                // ==================================================

                const newFood = {

                    name:
                        food.description ||
                        name,

                    quantity:
                        quantity,

                    unit:
                        unit,

                    calories:
                        Number(
                            calories.toFixed(2)
                        ),

                    protein:
                        Number(
                            protein.toFixed(2)
                        ),

                    carbs:
                        Number(
                            carbs.toFixed(2)
                        ),

                    fat:
                        Number(
                            fat.toFixed(2)
                        ),

                    date:
                        getTodayKey()

                };


                // ==================================================
                // ADD TO MEMORY
                // ==================================================

                allFoods.push(
                    newFood
                );


                filterTodayFoods();

                renderFoodList();

                updateNutritionProgress();


                // ==================================================
                // SAVE TO MONGODB
                // ==================================================

                const saved =
                    await saveNutritionToDatabase();


                if (!saved) {

                    if (foodStatus) {

                        foodStatus.textContent =
                            "Food added, but database save failed.";

                    }

                }

                else {

                    if (foodStatus) {

                        foodStatus.textContent =
                            "Food added successfully ✓";

                    }

                }


                // ==================================================
                // CLEAR INPUTS
                // ==================================================

                if (foodName) {

                    foodName.value = "";

                }


                if (foodQuantity) {

                    foodQuantity.value = "";

                }


                if (foodUnit) {

                    foodUnit.value = "g";

                }


                hideFoodSuggestions();

            }

            catch (error) {

                console.error(
                    "Add food error:",
                    error
                );


                if (foodStatus) {

                    foodStatus.textContent =
                        error.message ||
                        "Could not find that food.";

                }

            }

            finally {

                addFoodButton.disabled =
                    false;

                addFoodButton.textContent =
                    "Add Food";

            }

        }
    );

}


// ==================================================
// RENDER FOOD LIST
// ==================================================

function renderFoodList() {

    if (!foodList) {

        return;

    }


    foodList.innerHTML =
        "";


    if (
        todayFoods.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "emptyFood";


        empty.textContent =
            "No food added today yet.";


        foodList.appendChild(
            empty
        );


        return;

    }


    todayFoods.forEach(
        function (food) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "foodCard";


            card.innerHTML = `

                <div class="foodIcon">
                    F
                </div>

                <div class="foodInfo">

                    <h3>
                        ${escapeHTML(food.name)}
                    </h3>

                    <p>
                        ${escapeHTML(food.quantity)}
                        ${escapeHTML(food.unit)}
                    </p>

                </div>

                <div class="foodMacros">

                    <span>
                        P ${Math.round(Number(food.protein) || 0)}g
                    </span>

                    <span>
                        C ${Math.round(Number(food.carbs) || 0)}g
                    </span>

                    <span>
                        F ${Math.round(Number(food.fat) || 0)}g
                    </span>

                </div>

                <div class="foodCalories">

                    <strong>
                        ${Math.round(Number(food.calories) || 0)}
                    </strong>

                    <span>
                        kcal
                    </span>

                </div>

                <button
                    type="button"
                    class="deleteFoodButton"
                    title="Remove food"
                >
                    ×
                </button>

            `;


            const deleteButton =
                card.querySelector(
                    ".deleteFoodButton"
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    async function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const shouldDelete =
                            confirm(
                                "Remove " +
                                food.name +
                                " from today's nutrition?"
                            );


                        if (!shouldDelete) {

                            return;

                        }


                        // ==================================================
                        // DELETE FROM DATABASE
                        // ==================================================

                        if (food._id) {

                            try {

                                const response =
                                    await fetch(

                                        BACKEND_URL +
                                        "/api/nutrition/" +
                                        encodeURIComponent(
                                            username
                                        ) +
                                        "/food/" +
                                        encodeURIComponent(
                                            String(
                                                food._id
                                            )
                                        ),

                                        {

                                            method:
                                                "DELETE"

                                        }

                                    );


                                if (!response.ok) {

                                    const data =
                                        await response
                                            .json()
                                            .catch(
                                                function () {
                                                    return {};
                                                }
                                            );


                                    throw new Error(
                                        data.message ||
                                        "Database delete failed."
                                    );

                                }

                            }

                            catch (error) {

                                console.error(
                                    "Food delete error:",
                                    error
                                );


                                alert(
                                    error.message ||
                                    "Unable to delete food from database."
                                );


                                return;

                            }

                        }


                        // ==================================================
                        // REMOVE FROM FRONTEND
                        // ==================================================

                        allFoods =
                            allFoods.filter(
                                function (item) {

                                    if (
                                        food._id &&
                                        item._id
                                    ) {

                                        return (
                                            String(item._id) !==
                                            String(food._id)
                                        );

                                    }


                                    return (
                                        item !== food
                                    );

                                }
                            );


                        filterTodayFoods();

                        renderFoodList();

                        updateNutritionProgress();

                    }
                );

            }


            foodList.appendChild(
                card
            );

        }
    );

}


// ==================================================
// RESET TODAY'S FOOD
// ==================================================

if (resetFoodButton) {

    resetFoodButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            if (
                todayFoods.length === 0
            ) {

                return;

            }


            const shouldReset =
                confirm(
                    "Remove all food entries from today?"
                );


            if (!shouldReset) {

                return;

            }


            resetFoodButton.disabled =
                true;


            try {

                const today =
                    getTodayKey();


                const response =
                    await fetch(

                        BACKEND_URL +
                        "/api/nutrition/" +
                        encodeURIComponent(
                            username
                        ) +
                        "/food/today/" +
                        today,

                        {

                            method:
                                "DELETE"

                        }

                    );


                if (!response.ok) {

                    const data =
                        await response
                            .json()
                            .catch(
                                function () {
                                    return {};
                                }
                            );


                    throw new Error(
                        data.message ||
                        "Database reset failed."
                    );

                }


                allFoods =
                    allFoods.filter(
                        function (food) {

                            return (
                                food.date !== today
                            );

                        }
                    );


                filterTodayFoods();

                renderFoodList();

                updateNutritionProgress();


                if (foodStatus) {

                    foodStatus.textContent =
                        "Today's food was reset successfully ✓";

                }

            }

            catch (error) {

                console.error(
                    "Food reset error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to reset today's food."
                );

            }

            finally {

                resetFoodButton.disabled =
                    false;

            }

        }
    );

}


// ==================================================
// RENDER MEALS
// ==================================================

function renderMeals() {

    if (!mealList) {

        return;

    }


    mealList.innerHTML =
        "";


    meals.forEach(
        function (meal, index) {

            const mealCard =
                document.createElement(
                    "div"
                );


            mealCard.className =
                "mealCard";


            if (
                meal.type === "snack"
            ) {

                mealCard.classList.add(
                    "snackCard"
                );

            }


            mealCard.innerHTML = `

                <div class="mealNumber">
                    ${index + 1}
                </div>

                <div class="mealIcon">

                    ${
                        meal.type === "snack"
                            ? "S"
                            : "M"
                    }

                </div>

                <div class="mealContent">

                    <input
                        type="text"
                        class="mealNameInput"
                        value="${escapeHTML(meal.name || "")}"
                        placeholder="Meal name"
                    >

                    <input
                        type="text"
                        class="mealDescriptionInput"
                        value="${escapeHTML(meal.description || "")}"
                        placeholder="What will you eat?"
                    >

                </div>

                <div class="mealType">

                    ${
                        meal.type === "snack"
                            ? "SNACK"
                            : "MEAL"
                    }

                </div>

                <button
                    type="button"
                    class="deleteMealButton"
                    title="Delete"
                >
                    ×
                </button>

            `;


            const nameInput =
                mealCard.querySelector(
                    ".mealNameInput"
                );


            const descriptionInput =
                mealCard.querySelector(
                    ".mealDescriptionInput"
                );


            const deleteButton =
                mealCard.querySelector(
                    ".deleteMealButton"
                );


            // ==================================================
            // UPDATE MEAL NAME
            // ==================================================

            if (nameInput) {

                nameInput.addEventListener(
                    "input",
                    function () {

                        meals[index].name =
                            nameInput.value;

                    }
                );

            }


            // ==================================================
            // UPDATE DESCRIPTION
            // ==================================================

            if (descriptionInput) {

                descriptionInput.addEventListener(
                    "input",
                    function () {

                        meals[index].description =
                            descriptionInput.value;

                    }
                );

            }


            // ==================================================
            // DELETE MEAL
            // ==================================================

            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const shouldDelete =
                            confirm(
                                "Are you sure you want to delete " +
                                (
                                    meal.name ||
                                    "this meal"
                                ) +
                                "?"
                            );


                        if (!shouldDelete) {

                            return;

                        }


                        meals.splice(
                            index,
                            1
                        );


                        renderMeals();

                    }
                );

            }


            mealList.appendChild(
                mealCard
            );

        }
    );

}


// ==================================================
// ADD MEAL
// ==================================================

if (addMealButton) {

    addMealButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            meals.push({

                type: "meal",

                name: "New Meal",

                description:
                    "Add your meal details"

            });


            renderMeals();


            const cards =
                document.querySelectorAll(
                    ".mealCard"
                );


            if (
                cards.length > 0
            ) {

                cards[
                    cards.length - 1
                ].scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }

        }
    );

}


// ==================================================
// SAVE MEAL PLAN
// ==================================================

if (saveMealButton) {

    saveMealButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            saveMealButton.disabled =
                true;

            saveMealButton.textContent =
                "Saving...";


            const saved =
                await saveNutritionToDatabase();


            if (saved) {

                saveMealButton.textContent =
                    "✓ Meal Plan Saved";

            }

            else {

                saveMealButton.textContent =
                    "Save Failed";

            }


            setTimeout(
                function () {

                    saveMealButton.disabled =
                        false;

                    saveMealButton.textContent =
                        "Save Meal Plan";

                },
                1500
            );

        }
    );

}


// ==================================================
// RESET MEALS
// ==================================================

if (resetMealButton) {

    resetMealButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            const shouldReset =
                confirm(
                    "Reset your meal plan to the default 3 meals and 3 snacks?"
                );


            if (!shouldReset) {

                return;

            }


            meals =
                JSON.parse(
                    JSON.stringify(
                        defaultMeals
                    )
                );


            renderMeals();


            resetMealButton.disabled =
                true;


            const saved =
                await saveNutritionToDatabase();


            resetMealButton.disabled =
                false;


            if (!saved) {

                alert(
                    "Meal plan reset locally, but database save failed."
                );

            }

        }
    );

}


// ==================================================
// PROFILE BUTTON
// ==================================================

if (profileButton) {

    profileButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                "profile.html";

        }
    );

}


// ==================================================
// LOGOUT
// ==================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "username"
            );


            window.location.href =
                "index.html";

        }
    );

}


// ==================================================
// LOAD FITNESS PROFILE
// ==================================================

async function loadFitnessProfile() {

    try {

        const response =
            await fetch(

                BACKEND_URL +
                "/api/profile/" +
                encodeURIComponent(
                    username
                )

            );


        if (!response.ok) {

            alert(
                "Please complete your fitness assessment first."
            );


            window.location.href =
                "assessment.html";


            return null;

        }


        const data =
            await response.json();


        const profile =
            data.profile;


        if (
            !profile ||
            !profile.age ||
            !profile.height ||
            !profile.weight
        ) {

            alert(
                "Please complete your fitness assessment first."
            );


            window.location.href =
                "assessment.html";


            return null;

        }


        return profile;

    }

    catch (error) {

        console.error(
            "Unable to load fitness profile:",
            error
        );


        alert(
            "Unable to connect to the server."
        );


        return null;

    }

}


// ==================================================
// INITIALIZE NUTRITION
// ==================================================

async function initializeNutrition() {

    try {

        // ==================================================
        // LOAD PROFILE
        // ==================================================

        const profile =
            await loadFitnessProfile();


        if (!profile) {

            return;

        }


        // ==================================================
        // CALCULATE CURRENT TARGETS
        // ==================================================

        const calculated =
            calculateNutrition(
                profile
            );


        if (!calculated) {

            return;

        }


        // ==================================================
        // LOAD SAVED FOODS + MEALS
        // ==================================================

        const loaded =
            await loadNutritionFromDatabase();


        // ==================================================
        // STOP IF DATABASE LOAD FAILED
        // ==================================================
        //
        // IMPORTANT:
        // Never save empty/default data back to MongoDB
        // if the database load failed.
        //
        // ==================================================

        if (!loaded) {

            console.warn(
                "Nutrition data could not be loaded. Database data was NOT overwritten."
            );

            return;

        }


        // ==================================================
        // UPDATE TARGETS
        // ==================================================

        updateTargetDisplays();

        updateMacroTargetBars();

        updateNutritionProgress();


        // ==================================================
        // FINAL RENDER
        // ==================================================

        filterTodayFoods();

        renderFoodList();

        renderMeals();

        updateNutritionProgress();

    }

    catch (error) {

        console.error(
            "Nutrition initialization error:",
            error
        );

    }

}


// ==================================================
// START APPLICATION
// ==================================================

initializeNutrition();