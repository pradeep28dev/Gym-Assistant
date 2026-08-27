// ==================================================
// GYM ASSISTANT - NUTRITION.JS
// ==================================================


// ==================================================
// BACKEND API
// ==================================================

const BACKEND_URL =
    "http://localhost:5000";


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
// GET ELEMENTS
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

    usernameDisplay.textContent =
        username;

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
// ACTIVITY MULTIPLIER
// ==================================================

function getActivityMultiplier(activity) {

    const value =
        String(activity || "")
            .toLowerCase()
            .trim();


    if (value === "sedentary") {

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
// CALCULATE CALORIES
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
            .toLowerCase();

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


    // ==================================================
    // VALIDATE PROFILE
    // ==================================================

    if (
        !age ||
        !height ||
        !weight
    ) {

        alert(
            "Some fitness information is missing. Please edit your assessment."
        );

        window.location.href =
            "assessment.html";

        return;

    }


    // ==================================================
    // PROFILE DATA
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

    } else {

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
    // CALORIE TARGET
    // ==================================================

    let calories =
        calculateCalories(
            tdee,
            goal
        );


    // ==================================================
    // SAFETY FLOOR
    // ==================================================

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
    // DISPLAY
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
    // TARGETS
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


    updateMacroTargetBars();

    updateNutritionProgress();

}


// ==================================================
// MACRO TARGET BARS
// ==================================================

function updateMacroTargetBars() {

    if (proteinFill) {

        proteinFill.style.width =
            "100%";

    }


    if (carbsFill) {

        carbsFill.style.width =
            "100%";

    }


    if (fatFill) {

        fatFill.style.width =
            "100%";

    }

}


// ==================================================
// TODAY KEY
// ==================================================

function getTodayKey() {

    const date =
        new Date();


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
// FOOD STORAGE
// ==================================================

const foodStorageKey =
    "nutritionFood_" +
    username +
    "_" +
    getTodayKey();


let todayFoods = [];


// ==================================================
// LOAD FOOD
// ==================================================

function loadTodayFoods() {

    const savedFoods =
        localStorage.getItem(
            foodStorageKey
        );


    if (savedFoods) {

        try {

            todayFoods =
                JSON.parse(savedFoods);

        } catch (error) {

            todayFoods = [];

        }

    } else {

        todayFoods = [];

    }


    renderFoodList();

    updateNutritionProgress();

}


// ==================================================
// SAVE FOOD
// ==================================================

function saveTodayFoods() {

    localStorage.setItem(
        foodStorageKey,
        JSON.stringify(todayFoods)
    );

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
// UPDATE NUTRITION PROGRESS
// ==================================================

function updateNutritionProgress() {

    const totals =
        getFoodTotals();


    if (consumedCalories) {

        consumedCalories.textContent =
            Math.round(totals.calories);

    }


    if (consumedProtein) {

        consumedProtein.textContent =
            Math.round(totals.protein);

    }


    if (consumedCarbs) {

        consumedCarbs.textContent =
            Math.round(totals.carbs);

    }


    if (consumedFat) {

        consumedFat.textContent =
            Math.round(totals.fat);

    }


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

    if (!element || !target) {

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

    } else if (amount === 0) {

        element.textContent =
            "Target reached ✓";

    } else {

        element.textContent =
            rounded +
            " " +
            unit +
            " over target";

    }

}


// ==================================================
// USDA SEARCH THROUGH BACKEND
// ==================================================

async function searchFood(foodNameText) {

    const url =
        BACKEND_URL +
        "/api/nutrition/search?query=" +
        encodeURIComponent(foodNameText);


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Food API request failed."
        );

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
// FOOD SUGGESTIONS
// ==================================================

let suggestionTimer = null;


async function getFoodSuggestions(
    searchText
) {

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

    } catch (error) {

        console.error(
            "Suggestion error:",
            error
        );

        hideFoodSuggestions();

    }

}


// ==================================================
// SEARCH FOOD SUGGESTIONS THROUGH BACKEND
// ==================================================

async function searchFoodSuggestions(
    searchText
) {

    const url =
        BACKEND_URL +
        "/api/nutrition/search?query=" +
        encodeURIComponent(searchText);


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Suggestion API request failed."
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


    foodSuggestions.innerHTML = "";


    if (
        !foods ||
        foods.length === 0
    ) {

        hideFoodSuggestions();

        return;

    }


    foods.forEach(
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

                    foodName.value =
                        food.description || "";


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


    foodSuggestions.innerHTML = "";

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


            if (value.length < 2) {

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


            if (value.length >= 2) {

                getFoodSuggestions(
                    value
                );

            }

        }
    );

}


// ==================================================
// CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
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
// GET NUTRIENT
// ==================================================

function getNutrient(
    food,
    names
) {

    if (!food.foodNutrients) {

        return 0;

    }


    for (
        let i = 0;
        i < food.foodNutrients.length;
        i++
    ) {

        const nutrient =
            food.foodNutrients[i];


        if (
            names.includes(
                nutrient.nutrientName
            )
        ) {

            return Number(
                nutrient.value
            ) || 0;

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
                foodName.value.trim();


            const quantity =
                Number(
                    foodQuantity.value
                );


            const unit =
                foodUnit.value;


            if (!name) {

                foodStatus.textContent =
                    "Please enter a food name.";

                return;

            }


            if (
                !quantity ||
                quantity <= 0
            ) {

                foodStatus.textContent =
                    "Please enter a valid quantity.";

                return;

            }


            addFoodButton.disabled =
                true;


            addFoodButton.textContent =
                "Searching...";


            foodStatus.textContent =
                "Finding nutrition information...";


            try {

                const foods =
                    await searchFood(name);


                const food =
                    foods[0];


                let baseQuantity =
                    quantity;


                if (
                    unit === "serving"
                ) {

                    baseQuantity =
                        Number(
                            food.servingSize
                        ) || 100;

                }


                const multiplier =
                    baseQuantity / 100;


                const calories =
                    getNutrient(
                        food,
                        ["Energy"]
                    ) *
                    multiplier;


                const protein =
                    getNutrient(
                        food,
                        ["Protein"]
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


                const newFood = {

                    id:
                        Date.now(),

                    name:
                        food.description ||
                        name,

                    quantity:
                        quantity,

                    unit:
                        unit,

                    calories:
                        calories,

                    protein:
                        protein,

                    carbs:
                        carbs,

                    fat:
                        fat

                };


                todayFoods.push(
                    newFood
                );


                saveTodayFoods();

                renderFoodList();

                updateNutritionProgress();


                foodName.value = "";

                foodQuantity.value = "";

                foodUnit.value = "g";


                foodStatus.textContent =
                    "Food added successfully ✓";


            } catch (error) {

                console.error(error);


                foodStatus.textContent =
                    "Could not find that food. Try a more specific name.";

            } finally {

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


    foodList.innerHTML = "";


    if (todayFoods.length === 0) {

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
        function (food, index) {

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
                        ${food.quantity}
                        ${escapeHTML(food.unit)}
                    </p>

                </div>

                <div class="foodMacros">

                    <span>
                        P ${Math.round(food.protein)}g
                    </span>

                    <span>
                        C ${Math.round(food.carbs)}g
                    </span>

                    <span>
                        F ${Math.round(food.fat)}g
                    </span>

                </div>

                <div class="foodCalories">

                    <strong>
                        ${Math.round(food.calories)}
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


            deleteButton.addEventListener(
                "click",
                function (event) {

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


                    todayFoods.splice(
                        index,
                        1
                    );


                    saveTodayFoods();

                    renderFoodList();

                    updateNutritionProgress();

                }
            );


            foodList.appendChild(
                card
            );

        }
    );

}


// ==================================================
// RESET FOOD
// ==================================================

if (resetFoodButton) {

    resetFoodButton.addEventListener(
        "click",
        function (event) {

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


            todayFoods = [];


            saveTodayFoods();

            renderFoodList();

            updateNutritionProgress();

        }
    );

}


// ==================================================
// DEFAULT MEALS
// ==================================================

const defaultMeals = [

    {
        type: "meal",
        name: "Breakfast",
        description:
            "Plan your breakfast"
    },

    {
        type: "snack",
        name: "Snack 1",
        description:
            "Add a healthy snack"
    },

    {
        type: "meal",
        name: "Lunch",
        description:
            "Plan your lunch"
    },

    {
        type: "snack",
        name: "Snack 2",
        description:
            "Add a healthy snack"
    },

    {
        type: "meal",
        name: "Dinner",
        description:
            "Plan your dinner"
    },

    {
        type: "snack",
        name: "Snack 3",
        description:
            "Add a healthy snack"
    }

];


// ==================================================
// MEAL STORAGE
// ==================================================

const mealStorageKey =
    "mealPlan_" +
    username;


let meals = [];


// ==================================================
// LOAD MEAL PLAN
// ==================================================

function loadMealPlan() {

    const savedMeals =
        localStorage.getItem(
            mealStorageKey
        );


    if (savedMeals) {

        try {

            meals =
                JSON.parse(
                    savedMeals
                );

        } catch (error) {

            meals =
                JSON.parse(
                    JSON.stringify(
                        defaultMeals
                    )
                );

        }

    } else {

        meals =
            JSON.parse(
                JSON.stringify(
                    defaultMeals
                )
            );

    }


    renderMeals();

}


// ==================================================
// SAVE MEAL PLAN
// ==================================================

function saveMealPlan() {

    localStorage.setItem(
        mealStorageKey,
        JSON.stringify(meals)
    );

}


// ==================================================
// RENDER MEALS
// ==================================================

function renderMeals() {

    if (!mealList) {

        return;

    }


    mealList.innerHTML = "";


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
                        value="${escapeHTML(meal.name)}"
                        placeholder="Meal name"
                    >

                    <input
                        type="text"
                        class="mealDescriptionInput"
                        value="${escapeHTML(meal.description)}"
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
            // NAME
            // ==================================================

            nameInput.addEventListener(
                "input",
                function () {

                    meals[index].name =
                        nameInput.value;

                }
            );


            // ==================================================
            // DESCRIPTION
            // ==================================================

            descriptionInput.addEventListener(
                "input",
                function () {

                    meals[index].description =
                        descriptionInput.value;

                }
            );


            // ==================================================
            // DELETE
            // ==================================================

            deleteButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const shouldDelete =
                        confirm(
                            "Are you sure you want to delete " +
                            meal.name +
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

                name:
                    "New Meal",

                description:
                    "Add your meal details"

            });


            renderMeals();


            const cards =
                document.querySelectorAll(
                    ".mealCard"
                );


            if (cards.length > 0) {

                cards[
                    cards.length - 1
                ].scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            }

        }
    );

}


// ==================================================
// SAVE MEAL BUTTON
// ==================================================

if (saveMealButton) {

    saveMealButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            saveMealPlan();


            saveMealButton.textContent =
                "✓ Meal Plan Saved";


            setTimeout(
                function () {

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
        function (event) {

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


            saveMealPlan();

            renderMeals();

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
// LOGOUT BUTTON
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
// LOAD FITNESS PROFILE FROM BACKEND
// ==================================================

async function loadFitnessProfile() {

    try {

        const response =
            await fetch(
                BACKEND_URL +
                "/api/profile/" +
                encodeURIComponent(username)
            );


        // ==================================================
        // PROFILE NOT FOUND
        // ==================================================

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


        // ==================================================
        // CHECK PROFILE
        // ==================================================

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


    } catch (error) {

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

    const profile =
        await loadFitnessProfile();


    if (!profile) {

        return;

    }


    // ==================================================
    // CALCULATE NUTRITION
    // ==================================================

    calculateNutrition(
        profile
    );


    // ==================================================
    // LOAD TODAY'S FOOD
    // ==================================================

    loadTodayFoods();


    // ==================================================
    // LOAD MEAL PLAN
    // ==================================================

    loadMealPlan();

}


// ==================================================
// START NUTRITION PAGE
// ==================================================

initializeNutrition();