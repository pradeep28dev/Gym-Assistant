// =========================
// CHECK LOGIN
// =========================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href =
        "index.html";

}


// =========================
// GET CURRENT USER
// =========================

const username =
    localStorage.getItem("username");

if (!username) {

    localStorage.removeItem("isLoggedIn");

    window.location.href =
        "index.html";

}


// =========================
// GET ELEMENTS
// =========================

const usernameDisplay =
    document.getElementById("usernameDisplay");

const welcomeMessage =
    document.getElementById("welcomeMessage");

const weightValue =
    document.getElementById("weightValue");

const bodyFatValue =
    document.getElementById("bodyFatValue");

const goalValue =
    document.getElementById("goalValue");

const logoutButton =
    document.getElementById("logoutButton");

const profileButton =
    document.getElementById("profileButton");

const assessmentButton =
    document.getElementById("assessmentButton");

const assessmentLabel =
    document.getElementById("assessmentLabel");

const assessmentTitle =
    document.getElementById("assessmentTitle");

const assessmentDescription =
    document.getElementById(
        "assessmentDescription"
    );


// =========================
// DISPLAY USERNAME
// =========================

if (usernameDisplay) {

    usernameDisplay.textContent =
        username;

}


// =========================
// SHOW START ASSESSMENT
// =========================

function showStartAssessment() {

    if (assessmentLabel) {

        assessmentLabel.textContent =
            "GET STARTED";

    }


    if (assessmentTitle) {

        assessmentTitle.textContent =
            "Complete your fitness assessment";

    }


    if (assessmentDescription) {

        assessmentDescription.textContent =
            "Tell us about your fitness goals and body details to personalize your Gym Assistant experience.";

    }


    if (assessmentButton) {

        assessmentButton.textContent =
            "Start Assessment";

    }

}


// =========================
// SHOW EDIT PROFILE
// =========================

function showEditProfile() {

    if (assessmentLabel) {

        assessmentLabel.textContent =
            "FITNESS PROFILE";

    }


    if (assessmentTitle) {

        assessmentTitle.textContent =
            "Your fitness profile is ready";

    }


    if (assessmentDescription) {

        assessmentDescription.textContent =
            "Your fitness information is saved. You can edit your details anytime if something needs to be corrected.";

    }


    if (assessmentButton) {

        assessmentButton.textContent =
            "Edit Fitness Profile";

    }

}


// =========================
// LOAD FITNESS PROFILE
// =========================

async function loadFitnessProfile() {

    try {

        // =========================
        // REQUEST PROFILE
        // =========================

        const response =
            await fetch(
                `https://gym-assistant-rb7h.onrender.com/api/profile/${encodeURIComponent(username)}`
            );


        // =========================
        // PROFILE NOT FOUND
        // =========================

        if (response.status === 404) {

            if (welcomeMessage) {

                welcomeMessage.textContent =
                    "Welcome";

            }

            showStartAssessment();

            return;

        }


        // =========================
        // OTHER SERVER ERROR
        // =========================

        if (!response.ok) {

            throw new Error(
                "Unable to load fitness profile"
            );

        }


        // =========================
        // GET RESPONSE DATA
        // =========================

        const data =
            await response.json();


        const fitnessProfile =
            data.profile;


        // =========================
        // CHECK IF PROFILE EXISTS
        // =========================

        if (!fitnessProfile) {

            if (welcomeMessage) {

                welcomeMessage.textContent =
                    "Welcome";

            }

            showStartAssessment();

            return;

        }


        // =========================
        // CHECK IF ASSESSMENT
        // IS ACTUALLY COMPLETED
        // =========================
        //
        // A new user may already have
        // a profile object in MongoDB
        // containing default values such
        // as 0 or 0.0.
        //
        // Therefore we check the actual
        // assessment information.
        //

        const hasCompletedAssessment =
            Number(fitnessProfile.age) > 0 &&
            Number(fitnessProfile.height) > 0 &&
            Number(fitnessProfile.weight) > 0 &&
            Boolean(fitnessProfile.gender) &&
            Boolean(fitnessProfile.activity) &&
            Boolean(fitnessProfile.goal);


        // =========================
        // NEW USER
        // =========================

        if (!hasCompletedAssessment) {

            if (welcomeMessage) {

                welcomeMessage.textContent =
                    "Welcome";

            }

            showStartAssessment();

            return;

        }


        // =========================
        // EXISTING USER
        // =========================

        if (welcomeMessage) {

            welcomeMessage.textContent =
                "Welcome back";

        }


        // =========================
        // WEIGHT
        // =========================

        if (
            weightValue &&
            fitnessProfile.weight !== undefined &&
            fitnessProfile.weight !== null
        ) {

            weightValue.textContent =
                Number(
                    fitnessProfile.weight
                ).toFixed(1);

        }


        // =========================
        // BODY FAT
        // =========================

        if (
            bodyFatValue &&
            fitnessProfile.bodyFat !== undefined &&
            fitnessProfile.bodyFat !== null &&
            Number(fitnessProfile.bodyFat) > 0
        ) {

            bodyFatValue.textContent =
                Number(
                    fitnessProfile.bodyFat
                ).toFixed(1);

        }


        // =========================
        // GOAL
        // =========================

        if (
            goalValue &&
            fitnessProfile.goal ===
            "weight-loss"
        ) {

            goalValue.textContent =
                "LOSE WEIGHT";

        }

        else if (
            goalValue &&
            fitnessProfile.goal ===
            "muscle-gain"
        ) {

            goalValue.textContent =
                "BUILD MUSCLE";

        }

        else if (
            goalValue &&
            fitnessProfile.goal ===
            "maintenance"
        ) {

            goalValue.textContent =
                "MAINTAIN";

        }

        else if (
            goalValue &&
            fitnessProfile.goal ===
            "general-fitness"
        ) {

            goalValue.textContent =
                "FITNESS";

        }


        // =========================
        // SHOW EDIT PROFILE
        // =========================

        showEditProfile();

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


// =========================
// LOAD PROFILE
// =========================

loadFitnessProfile();


// =========================
// ASSESSMENT BUTTON
// =========================

if (assessmentButton) {

    assessmentButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "assessment.html";

        }
    );

}


// =========================
// PROFILE BUTTON
// =========================

if (profileButton) {

    profileButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "profile.html";

        }
    );

}


// =========================
// LOGOUT
// =========================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

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