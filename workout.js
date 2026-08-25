// =====================================================
// CHECK LOGIN
// =====================================================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href = "index.html";
}


// =====================================================
// GET USER
// =====================================================

const username =
    localStorage.getItem("username");

if (!username) {

    window.location.href = "index.html";
}


// =====================================================
// GET ELEMENTS
// =====================================================

const usernameDisplay =
    document.getElementById("usernameDisplay");

const goalValue =
    document.getElementById("goalValue");

const experienceValue =
    document.getElementById("experienceValue");

const activityValue =
    document.getElementById("activityValue");

const trainingDays =
    document.getElementById("trainingDays");

const todayWorkoutTitle =
    document.getElementById("todayWorkoutTitle");

const todayWorkoutDay =
    document.getElementById("todayWorkoutDay");

const exerciseList =
    document.getElementById("exerciseList");

const scheduleGrid =
    document.getElementById("scheduleGrid");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const profileButton =
    document.getElementById("profileButton");

const logoutButton =
    document.getElementById("logoutButton");

const currentPlanTitle =
    document.getElementById("currentPlanTitle");

const currentPlanDescription =
    document.getElementById("currentPlanDescription");

const customPlanButton =
    document.getElementById("customPlanButton");

const recommendedPlanButton =
    document.getElementById("recommendedPlanButton");

const customEditor =
    document.getElementById("customEditor");

const customDays =
    document.getElementById("customDays");

const saveCustomButton =
    document.getElementById("saveCustomButton");

const cancelButton =
    document.getElementById("cancelButton");

const closeEditorButton =
    document.getElementById("closeEditorButton");

const customManage =
    document.getElementById("customManage");

const editCustomButton =
    document.getElementById("editCustomButton");

const deleteCustomButton =
    document.getElementById("deleteCustomButton");


// =====================================================
// USERNAME
// =====================================================

usernameDisplay.textContent = username;


// =====================================================
// STORAGE KEYS
// =====================================================

const customPlanKey =
    "customWorkout_" + username;

const activePlanKey =
    "activeWorkoutPlan_" + username;


// =====================================================
// FITNESS PROFILE
// =====================================================

const savedProfile =
    localStorage.getItem(
        "fitnessProfile_" + username
    );

if (!savedProfile) {

    alert(
        "Please complete your fitness assessment first."
    );

    window.location.href =
        "assessment.html";
}


// =====================================================
// PROFILE DATA
// =====================================================

const profile =
    JSON.parse(savedProfile);


// =====================================================
// CURRENT PLAN
// =====================================================

let activePlan =
    localStorage.getItem(activePlanKey);

if (!activePlan) {

    activePlan = "recommended";

    localStorage.setItem(
        activePlanKey,
        "recommended"
    );
}


// =====================================================
// GET CUSTOM PLAN
// =====================================================

function getCustomPlan() {

    const saved =
        localStorage.getItem(customPlanKey);

    if (!saved) {
        return null;
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        return null;
    }
}


// =====================================================
// FORMAT VALUE
// =====================================================

function formatValue(value) {

    if (!value) {
        return "--";
    }

    return value
        .replace("-", " ")
        .replace(/\b\w/g, function(letter) {
            return letter.toUpperCase();
        });
}


// =====================================================
// FORMAT GOAL
// =====================================================

function formatGoal(goal) {

    if (goal === "weight-loss") {
        return "Lose Weight";
    }

    if (goal === "muscle-gain") {
        return "Build Muscle";
    }

    if (goal === "maintenance") {
        return "Maintain Weight";
    }

    if (goal === "general-fitness") {
        return "General Fitness";
    }

    return "--";
}


// =====================================================
// DISPLAY PROFILE
// =====================================================

goalValue.textContent =
    formatGoal(profile.goal);

experienceValue.textContent =
    formatValue(profile.experience);

activityValue.textContent =
    formatValue(profile.activity);


// =====================================================
// CREATE DAY
// =====================================================

function createDay(name, exercises) {

    return {

        name: name,

        exercises: exercises

    };
}


// =====================================================
// BUILD RECOMMENDED PLAN
// =====================================================

function getRecommendedPlan() {

    return generateWorkoutPlan(
        profile.goal,
        profile.experience,
        profile.activity
    );
}


// =====================================================
// GENERATE RECOMMENDED WORKOUT
// =====================================================

function generateWorkoutPlan(
    goal,
    experience,
    activity
) {

    let trainingDays = 4;

    let week;


    // =================================================
    // BEGINNER
    // =================================================

    if (experience === "beginner") {

        trainingDays = 3;

        if (goal === "muscle-gain") {

            week = [

                createDay(
                    "Full Body",
                    [
                        ["Bodyweight Squat", "3 × 10"],
                        ["Push Ups", "3 × 8"],
                        ["Dumbbell Row", "3 × 10"],
                        ["Shoulder Press", "3 × 10"],
                        ["Plank", "3 × 30 sec"]
                    ]
                ),

                createDay("Rest", []),

                createDay(
                    "Upper Body",
                    [
                        ["Push Ups", "3 × 10"],
                        ["Dumbbell Row", "3 × 10"],
                        ["Dumbbell Curl", "3 × 12"],
                        ["Tricep Extension", "3 × 12"]
                    ]
                ),

                createDay("Rest", []),

                createDay(
                    "Lower Body",
                    [
                        ["Squats", "3 × 10"],
                        ["Lunges", "3 × 10"],
                        ["Glute Bridge", "3 × 12"],
                        ["Calf Raises", "3 × 15"]
                    ]
                ),

                createDay("Rest", []),

                createDay("Rest", [])

            ];

        } else {

            week = [

                createDay(
                    "Full Body",
                    [
                        ["Bodyweight Squat", "3 × 12"],
                        ["Push Ups", "3 × 10"],
                        ["Dumbbell Row", "3 × 12"],
                        ["Lunges", "3 × 10"],
                        ["Plank", "3 × 30 sec"]
                    ]
                ),

                createDay("Rest", []),

                createDay(
                    "Full Body",
                    [
                        ["Squats", "3 × 12"],
                        ["Incline Push Ups", "3 × 10"],
                        ["Dumbbell Row", "3 × 12"],
                        ["Glute Bridge", "3 × 15"],
                        ["Mountain Climbers", "3 × 20"]
                    ]
                ),

                createDay("Rest", []),

                createDay(
                    "Full Body",
                    [
                        ["Lunges", "3 × 10"],
                        ["Push Ups", "3 × 10"],
                        ["Shoulder Press", "3 × 10"],
                        ["Bicycle Crunches", "3 × 15"],
                        ["Plank", "3 × 40 sec"]
                    ]
                ),

                createDay("Rest", []),

                createDay("Rest", [])

            ];
        }


    // =================================================
    // INTERMEDIATE
    // =================================================

    } else if (experience === "intermediate") {

        trainingDays = 4;

        if (goal === "muscle-gain") {

            week = [

                createDay(
                    "Chest + Triceps",
                    [
                        ["Bench Press", "4 × 8"],
                        ["Incline Dumbbell Press", "3 × 10"],
                        ["Chest Fly", "3 × 12"],
                        ["Tricep Pushdown", "3 × 12"],
                        ["Overhead Tricep Extension", "3 × 10"]
                    ]
                ),

                createDay(
                    "Back + Biceps",
                    [
                        ["Lat Pulldown", "4 × 10"],
                        ["Barbell Row", "3 × 8"],
                        ["Seated Cable Row", "3 × 10"],
                        ["Barbell Curl", "3 × 10"],
                        ["Hammer Curl", "3 × 12"]
                    ]
                ),

                createDay("Rest", []),

                createDay(
                    "Legs",
                    [
                        ["Squat", "4 × 8"],
                        ["Leg Press", "3 × 10"],
                        ["Romanian Deadlift", "3 × 10"],
                        ["Leg Curl", "3 × 12"],
                        ["Calf Raises", "4 × 15"]
                    ]
                ),

                createDay(
                    "Shoulders + Core",
                    [
                        ["Shoulder Press", "4 × 8"],
                        ["Lateral Raises", "3 × 12"],
                        ["Rear Delt Fly", "3 × 12"],
                        ["Plank", "3 × 45 sec"],
                        ["Leg Raises", "3 × 12"]
                    ]
                ),

                createDay("Rest", []),

                createDay("Rest", [])

            ];

        } else {

            week = [

                createDay(
                    "Upper Body",
                    [
                        ["Bench Press", "3 × 10"],
                        ["Lat Pulldown", "3 × 10"],
                        ["Shoulder Press", "3 × 10"],
                        ["Cable Row", "3 × 12"],
                        ["Bicep Curl", "3 × 12"]
                    ]
                ),

                createDay(
                    "Lower Body",
                    [
                        ["Squat", "3 × 10"],
                        ["Leg Press", "3 × 12"],
                        ["Romanian Deadlift", "3 × 10"],
                        ["Leg Curl", "3 × 12"],
                        ["Calf Raises", "3 × 15"]
                    ]
                ),

                createDay("Rest", []),

                createDay(
                    "Full Body",
                    [
                        ["Deadlift", "3 × 6"],
                        ["Bench Press", "3 × 8"],
                        ["Lat Pulldown", "3 × 10"],
                        ["Lunges", "3 × 10"],
                        ["Plank", "3 × 45 sec"]
                    ]
                ),

                createDay(
                    "Cardio + Core",
                    [
                        ["Treadmill", "20 min"],
                        ["Cycling", "15 min"],
                        ["Mountain Climbers", "3 × 20"],
                        ["Bicycle Crunches", "3 × 15"],
                        ["Plank", "3 × 45 sec"]
                    ]
                ),

                createDay("Rest", []),

                createDay("Rest", [])

            ];
        }


    // =================================================
    // ADVANCED
    // =================================================

    } else if (experience === "advanced") {

        trainingDays = 5;

        if (goal === "muscle-gain") {

            week = [

                createDay(
                    "Chest + Triceps",
                    [
                        ["Barbell Bench Press", "5 × 5"],
                        ["Incline Barbell Press", "4 × 8"],
                        ["Weighted Dips", "4 × 8"],
                        ["Cable Crossover", "3 × 12"],
                        ["Skull Crushers", "3 × 10"],
                        ["Close Grip Bench Press", "3 × 8"]
                    ]
                ),

                createDay(
                    "Back + Biceps",
                    [
                        ["Deadlift", "5 × 5"],
                        ["Weighted Pull Ups", "4 × 8"],
                        ["Barbell Row", "4 × 8"],
                        ["T-Bar Row", "3 × 10"],
                        ["Preacher Curl", "3 × 10"],
                        ["Incline Dumbbell Curl", "3 × 12"]
                    ]
                ),

                createDay(
                    "Legs",
                    [
                        ["Barbell Squat", "5 × 5"],
                        ["Romanian Deadlift", "4 × 8"],
                        ["Bulgarian Split Squat", "3 × 10"],
                        ["Hack Squat", "3 × 10"],
                        ["Leg Curl", "3 × 12"],
                        ["Standing Calf Raise", "4 × 15"]
                    ]
                ),

                createDay(
                    "Shoulders + Core",
                    [
                        ["Overhead Barbell Press", "5 × 6"],
                        ["Arnold Press", "4 × 8"],
                        ["Lateral Raises", "4 × 12"],
                        ["Face Pulls", "3 × 15"],
                        ["Hanging Leg Raises", "4 × 12"],
                        ["Ab Wheel Rollout", "3 × 10"]
                    ]
                ),

                createDay(
                    "Full Body",
                    [
                        ["Front Squat", "4 × 6"],
                        ["Incline Bench Press", "4 × 8"],
                        ["Weighted Pull Ups", "4 × 8"],
                        ["Walking Lunges", "3 × 12"],
                        ["Farmer's Walk", "3 × 40 sec"]
                    ]
                ),

                createDay("Rest", []),

                createDay("Rest", [])

            ];

        } else {

            week = [

                createDay(
                    "Push",
                    [
                        ["Barbell Bench Press", "4 × 6"],
                        ["Incline Dumbbell Press", "4 × 8"],
                        ["Overhead Press", "4 × 8"],
                        ["Weighted Dips", "3 × 10"],
                        ["Cable Lateral Raise", "3 × 12"]
                    ]
                ),

                createDay(
                    "Pull",
                    [
                        ["Deadlift", "4 × 5"],
                        ["Weighted Pull Ups", "4 × 8"],
                        ["Barbell Row", "4 × 8"],
                        ["Face Pulls", "3 × 15"],
                        ["Barbell Curl", "3 × 10"]
                    ]
                ),

                createDay(
                    "Legs",
                    [
                        ["Barbell Squat", "5 × 5"],
                        ["Romanian Deadlift", "4 × 8"],
                        ["Bulgarian Split Squat", "3 × 10"],
                        ["Leg Press", "3 × 12"],
                        ["Calf Raises", "4 × 15"]
                    ]
                ),

                createDay(
                    "Conditioning",
                    [
                        ["Treadmill Intervals", "25 min"],
                        ["Rowing", "15 min"],
                        ["Battle Ropes", "5 × 30 sec"],
                        ["Burpees", "4 × 15"],
                        ["Mountain Climbers", "4 × 20"]
                    ]
                ),

                createDay(
                    "Full Body",
                    [
                        ["Deadlift", "4 × 5"],
                        ["Bench Press", "4 × 6"],
                        ["Front Squat", "4 × 6"],
                        ["Weighted Pull Ups", "3 × 8"],
                        ["Hanging Leg Raises", "4 × 12"]
                    ]
                ),

                createDay("Rest", []),

                createDay("Rest", [])

            ];
        }


    // =================================================
    // DEFAULT
    // =================================================

    } else {

        trainingDays = 4;

        week = [

            createDay(
                "Full Body",
                [
                    ["Squat", "3 × 10"],
                    ["Push Ups", "3 × 10"],
                    ["Lat Pulldown", "3 × 10"],
                    ["Lunges", "3 × 10"],
                    ["Plank", "3 × 30 sec"]
                ]
            ),

            createDay(
                "Upper Body",
                [
                    ["Bench Press", "3 × 10"],
                    ["Cable Row", "3 × 10"],
                    ["Shoulder Press", "3 × 10"],
                    ["Bicep Curl", "3 × 12"]
                ]
            ),

            createDay("Rest", []),

            createDay(
                "Lower Body",
                [
                    ["Squat", "3 × 10"],
                    ["Leg Press", "3 × 12"],
                    ["Leg Curl", "3 × 12"],
                    ["Calf Raises", "3 × 15"]
                ]
            ),

            createDay(
                "Core + Cardio",
                [
                    ["Treadmill", "20 min"],
                    ["Bicycle Crunches", "3 × 15"],
                    ["Mountain Climbers", "3 × 20"],
                    ["Plank", "3 × 45 sec"]
                ]
            ),

            createDay("Rest", []),

            createDay("Rest", [])

        ];
    }


    return {

        trainingDays: trainingDays,

        week: week

    };
}


// =====================================================
// RENDER ACTIVE PLAN
// =====================================================

function renderActivePlan() {

    let plan;


    if (activePlan === "custom") {

        plan = getCustomPlan();

        if (!plan) {

            activePlan = "recommended";

            localStorage.setItem(
                activePlanKey,
                "recommended"
            );

            plan = getRecommendedPlan();
        }

    } else {

        plan = getRecommendedPlan();
    }


    // =================================================
    // PLAN HEADER
    // =================================================

    if (activePlan === "custom") {

        currentPlanTitle.textContent =
            "Custom Plan";

        currentPlanDescription.textContent =
            "Your personal workout routine.";

        customPlanButton.textContent =
            "Edit Custom Plan";

        recommendedPlanButton.classList.remove(
            "hidden"
        );

        customManage.classList.remove(
            "hidden"
        );

    } else {

        currentPlanTitle.textContent =
            "Recommended Plan";

        currentPlanDescription.textContent =
            "A workout plan generated from your fitness profile.";

        if (getCustomPlan()) {

            customPlanButton.textContent =
                "Use Custom Plan";

            customManage.classList.remove(
                "hidden"
            );

        } else {

            customPlanButton.textContent =
                "Create Custom Plan";

            customManage.classList.add(
                "hidden"
            );
        }

        recommendedPlanButton.classList.add(
            "hidden"
        );
    }


    trainingDays.textContent =
        plan.trainingDays;


    // =================================================
    // TODAY
    // =================================================

    const today =
        new Date().getDay();

    const dayIndex =
        today === 0
            ? 6
            : today - 1;

    const todayWorkout =
        plan.week[dayIndex];


    todayWorkoutTitle.textContent =
        todayWorkout.name;

    todayWorkoutDay.textContent =
        "DAY " + (dayIndex + 1);


    displayExercises(
        todayWorkout.exercises
    );


    displaySchedule(
        plan.week,
        dayIndex
    );
}


// =====================================================
// TODAY DATE
// =====================================================

function getTodayDate() {

    const today =
        new Date();

    return (
        today.getFullYear() +
        "-" +
        String(
            today.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            today.getDate()
        ).padStart(2, "0")
    );
}


// =====================================================
// COMPLETION STORAGE
// =====================================================

function getWorkoutStorageKey() {

    return (
        "workoutProgress_" +
        username +
        "_" +
        activePlan +
        "_" +
        getTodayDate()
    );
}


function getCompletedExercises() {

    const saved =
        localStorage.getItem(
            getWorkoutStorageKey()
        );

    if (!saved) {
        return [];
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        return [];
    }
}


function saveCompletedExercises(
    completedExercises
) {

    localStorage.setItem(
        getWorkoutStorageKey(),
        JSON.stringify(
            completedExercises
        )
    );
}


// =====================================================
// DISPLAY EXERCISES
// =====================================================

function displayExercises(exercises) {

    exerciseList.innerHTML = "";


    // =================================================
    // REST DAY
    // =================================================

    if (exercises.length === 0) {

        exerciseList.innerHTML = `

            <div class="exerciseCard">

                <div class="exerciseInfo">

                    <h3>
                        Rest Day
                    </h3>

                    <p>
                        Recovery is part of your training.
                    </p>

                </div>

            </div>

        `;

        progressText.textContent =
            "100%";

        progressFill.style.width =
            "100%";

        return;
    }


    const completedExercises =
        getCompletedExercises();


    exercises.forEach(
        function(exercise, index) {

            const card =
                document.createElement("div");

            card.className =
                "exerciseCard";


            const exerciseId =
                index + "_" + exercise[0];


            const alreadyCompleted =
                completedExercises.includes(
                    exerciseId
                );


            card.innerHTML = `

                <div class="exerciseNumber">
                    ${index + 1}
                </div>

                <div class="exerciseInfo">

                    <h3>
                        ${exercise[0]}
                    </h3>

                    <p>
                        Controlled movement · Good form
                    </p>

                </div>

                <div class="exerciseSets">
                    ${exercise[1]}
                </div>

                <button
                    class="completeButton"
                    type="button"
                >
                    Complete
                </button>

            `;


            const button =
                card.querySelector(
                    ".completeButton"
                );


            if (alreadyCompleted) {

                card.classList.add(
                    "completed"
                );

                button.textContent =
                    "Completed";
            }


            button.addEventListener(
                "click",
                function() {

                    const isCompleted =
                        card.classList.toggle(
                            "completed"
                        );


                    let savedExercises =
                        getCompletedExercises();


                    if (isCompleted) {

                        button.textContent =
                            "Completed";


                        if (
                            !savedExercises.includes(
                                exerciseId
                            )
                        ) {

                            savedExercises.push(
                                exerciseId
                            );
                        }

                    } else {

                        button.textContent =
                            "Complete";


                        savedExercises =
                            savedExercises.filter(
                                function(id) {

                                    return id !==
                                        exerciseId;

                                }
                            );
                    }


                    saveCompletedExercises(
                        savedExercises
                    );


                    updateProgress();

                }
            );


            exerciseList.appendChild(
                card
            );

        }
    );


    updateProgress();
}


// =====================================================
// UPDATE PROGRESS
// =====================================================

function updateProgress() {

    const cards =
        exerciseList.querySelectorAll(
            ".exerciseCard"
        );

    const completed =
        exerciseList.querySelectorAll(
            ".exerciseCard.completed"
        );


    const total =
        cards.length;


    if (total === 0) {

        progressText.textContent =
            "100%";

        progressFill.style.width =
            "100%";

        return;
    }


    const percentage =
        Math.round(
            (
                completed.length /
                total
            ) * 100
        );


    progressText.textContent =
        percentage + "%";

    progressFill.style.width =
        percentage + "%";
}


// =====================================================
// DISPLAY SCHEDULE
// =====================================================

function displaySchedule(
    week,
    todayIndex
) {

    scheduleGrid.innerHTML =
        "";


    const days = [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
    ];


    week.forEach(
        function(day, index) {

            const dayCard =
                document.createElement(
                    "div"
                );


            dayCard.className =
                "scheduleDay";


            if (
                index ===
                todayIndex
            ) {

                dayCard.classList.add(
                    "today"
                );
            }


            if (
                day.name ===
                "Rest"
            ) {

                dayCard.classList.add(
                    "rest"
                );
            }


            dayCard.innerHTML = `

                <div class="scheduleDayName">
                    ${days[index]}
                </div>

                <div class="scheduleWorkout">
                    ${day.name}
                </div>

            `;


            scheduleGrid.appendChild(
                dayCard
            );

        }
    );
}


// =====================================================
// CUSTOM PLAN EDITOR
// =====================================================

function openCustomEditor() {

    // Show editor first
    customEditor.classList.remove(
        "hidden"
    );


    // Clear old editor
    customDays.innerHTML =
        "";


    const existingPlan =
        getCustomPlan();


    // =================================================
    // LOAD EXISTING CUSTOM PLAN
    // =================================================

    if (existingPlan) {

        existingPlan.week.forEach(
            function(day, index) {

                createCustomDay(
                    index,
                    day
                );

            }
        );


    } else {

        const days = [

            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"

        ];


        days.forEach(
            function(day, index) {

                createCustomDay(
                    index,
                    {
                        name: "",
                        exercises: []
                    }
                );

            }
        );
    }


    // =================================================
    // IMPORTANT FIX
    // SCROLL AFTER EDITOR IS VISIBLE
    // =================================================

    setTimeout(
        function() {

            customEditor.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        },
        100
    );
}


// =====================================================
// CREATE CUSTOM DAY
// =====================================================

function createCustomDay(
    index,
    day
) {

    const dayBox =
        document.createElement(
            "div"
        );


    dayBox.className =
        "customDay";


    dayBox.dataset.index =
        index;


    const dayNames = [

        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"

    ];


    const defaultName =
        day.name || "Rest";


    dayBox.innerHTML = `

        <div class="customDayHeader">

            <h3>
                ${dayNames[index]}
            </h3>

            <input
                class="dayNameInput"
                type="text"
                placeholder="Workout name"
                value="${defaultName}"
            >

        </div>

        <div class="exerciseEditor"></div>

        <button
            type="button"
            class="addExerciseButton"
        >
            + Add Exercise
        </button>

    `;


    const exerciseEditor =
        dayBox.querySelector(
            ".exerciseEditor"
        );


    const addButton =
        dayBox.querySelector(
            ".addExerciseButton"
        );


    // Load existing exercises
    if (
        day.exercises &&
        day.exercises.length > 0
    ) {

        day.exercises.forEach(
            function(exercise) {

                addExerciseRow(
                    exerciseEditor,
                    exercise[0],
                    exercise[1]
                );

            }
        );
    }


    addButton.addEventListener(
        "click",
        function() {

            addExerciseRow(
                exerciseEditor,
                "",
                ""
            );

        }
    );


    customDays.appendChild(
        dayBox
    );
}


// =====================================================
// ADD EXERCISE ROW
// =====================================================

function addExerciseRow(
    container,
    exerciseName,
    sets
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "exerciseInputRow";


    row.innerHTML = `

        <input
            type="text"
            class="exerciseNameInput"
            placeholder="Exercise name"
            value="${exerciseName}"
        >

        <input
            type="text"
            class="exerciseSetsInput"
            placeholder="e.g. 3 × 10"
            value="${sets}"
        >

        <button
            type="button"
            class="removeExerciseButton"
        >
            ×
        </button>

    `;


    const removeButton =
        row.querySelector(
            ".removeExerciseButton"
        );


    removeButton.addEventListener(
        "click",
        function() {

            row.remove();

        }
    );


    container.appendChild(
        row
    );
}


// =====================================================
// SAVE CUSTOM PLAN
// =====================================================

function saveCustomWorkout() {

    const dayBoxes =
        customDays.querySelectorAll(
            ".customDay"
        );


    const week = [];

    let trainingCount = 0;


    dayBoxes.forEach(
        function(dayBox) {

            const nameInput =
                dayBox.querySelector(
                    ".dayNameInput"
                );


            const workoutName =
                nameInput.value.trim();


            const rows =
                dayBox.querySelectorAll(
                    ".exerciseInputRow"
                );


            const exercises = [];


            rows.forEach(
                function(row) {

                    const exerciseName =
                        row.querySelector(
                            ".exerciseNameInput"
                        ).value.trim();


                    const sets =
                        row.querySelector(
                            ".exerciseSetsInput"
                        ).value.trim();


                    if (
                        exerciseName &&
                        sets
                    ) {

                        exercises.push([
                            exerciseName,
                            sets
                        ]);

                    }

                }
            );


            if (
                exercises.length > 0
            ) {

                trainingCount++;


                week.push({

                    name:
                        workoutName ||
                        "Custom Workout",

                    exercises:
                        exercises

                });

            } else {

                week.push({

                    name:
                        "Rest",

                    exercises:
                        []

                });
            }

        }
    );


    if (trainingCount === 0) {

        alert(
            "Please add at least one workout day."
        );

        return;
    }


    const customPlan = {

        trainingDays:
            trainingCount,

        week:
            week

    };


    // =================================================
    // PERMANENT LOCAL STORAGE
    // =================================================

    localStorage.setItem(
        customPlanKey,
        JSON.stringify(
            customPlan
        )
    );


    // =================================================
    // MAKE CUSTOM PLAN ACTIVE
    // =================================================

    activePlan =
        "custom";


    localStorage.setItem(
        activePlanKey,
        "custom"
    );


    // Hide editor
    customEditor.classList.add(
        "hidden"
    );


    // Render new plan
    renderActivePlan();


    // Go to top
    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// =====================================================
// SWITCH TO RECOMMENDED
// =====================================================

function switchToRecommended() {

    activePlan =
        "recommended";


    localStorage.setItem(
        activePlanKey,
        "recommended"
    );


    renderActivePlan();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// =====================================================
// USE CUSTOM PLAN
// =====================================================

function useCustomPlan() {

    const customPlan =
        getCustomPlan();


    if (!customPlan) {

        openCustomEditor();

        return;
    }


    activePlan =
        "custom";


    localStorage.setItem(
        activePlanKey,
        "custom"
    );


    renderActivePlan();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// =====================================================
// DELETE CUSTOM PLAN
// =====================================================

function deleteCustomPlan() {

    const confirmed =
        confirm(
            "Delete your custom workout plan?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        customPlanKey
    );


    activePlan =
        "recommended";


    localStorage.setItem(
        activePlanKey,
        "recommended"
    );


    renderActivePlan();
}


// =====================================================
// CUSTOM PLAN BUTTON
// =====================================================

customPlanButton.addEventListener(
    "click",
    function() {

        const savedCustomPlan =
            getCustomPlan();


        if (activePlan === "custom") {

            // If custom is already active,
            // clicking button means EDIT.
            openCustomEditor();

            return;
        }


        if (savedCustomPlan) {

            // Existing custom plan
            // but recommended is active.
            useCustomPlan();

        } else {

            // No custom plan yet.
            openCustomEditor();

        }

    }
);


// =====================================================
// RECOMMENDED BUTTON
// =====================================================

recommendedPlanButton.addEventListener(
    "click",
    function() {

        switchToRecommended();

    }
);


// =====================================================
// SAVE BUTTON
// =====================================================

saveCustomButton.addEventListener(
    "click",
    function() {

        saveCustomWorkout();

    }
);


// =====================================================
// CANCEL BUTTON
// =====================================================

cancelButton.addEventListener(
    "click",
    function() {

        customEditor.classList.add(
            "hidden"
        );

    }
);


// =====================================================
// CLOSE EDITOR
// =====================================================

closeEditorButton.addEventListener(
    "click",
    function() {

        customEditor.classList.add(
            "hidden"
        );

    }
);


// =====================================================
// EDIT CUSTOM PLAN
// =====================================================

editCustomButton.addEventListener(
    "click",
    function() {

        openCustomEditor();

    }
);


// =====================================================
// DELETE CUSTOM PLAN
// =====================================================

deleteCustomButton.addEventListener(
    "click",
    function() {

        deleteCustomPlan();

    }
);


// =====================================================
// PROFILE
// =====================================================

profileButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "profile.html";

    }
);


// =====================================================
// LOGOUT
// =====================================================

logoutButton.addEventListener(
    "click",
    function() {

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


// =====================================================
// INITIAL LOAD
// =====================================================

renderActivePlan();