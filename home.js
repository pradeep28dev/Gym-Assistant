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

usernameDisplay.textContent =
    username;


// =========================
// LOAD FITNESS PROFILE
// =========================

async function loadFitnessProfile() {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/profile/${encodeURIComponent(username)}`
            );


        // =========================
        // PROFILE NOT FOUND
        // =========================

        if (response.status === 404) {

            welcomeMessage.textContent =
                "Welcome";

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
        // NO PROFILE
        // =========================

        if (!fitnessProfile) {

            welcomeMessage.textContent =
                "Welcome";

            return;

        }


        // =========================
        // WELCOME MESSAGE
        // =========================

        welcomeMessage.textContent =
            "Welcome back";


        // =========================
        // WEIGHT
        // =========================

        if (
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
            fitnessProfile.bodyFat !== undefined &&
            fitnessProfile.bodyFat !== null
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
            fitnessProfile.goal ===
            "weight-loss"
        ) {

            goalValue.textContent =
                "LOSE WEIGHT";

        }

        else if (
            fitnessProfile.goal ===
            "muscle-gain"
        ) {

            goalValue.textContent =
                "BUILD MUSCLE";

        }

        else if (
            fitnessProfile.goal ===
            "maintenance"
        ) {

            goalValue.textContent =
                "MAINTAIN";

        }

        else if (
            fitnessProfile.goal ===
            "general-fitness"
        ) {

            goalValue.textContent =
                "FITNESS";

        }


        // =========================
        // ASSESSMENT CARD
        // =========================

        assessmentLabel.textContent =
            "FITNESS PROFILE";

        assessmentTitle.textContent =
            "Your fitness profile is ready";

        assessmentDescription.textContent =
            "Your fitness information is saved. " +
            "You can edit your details anytime if " +
            "something needs to be corrected.";

        assessmentButton.textContent =
            "Edit Fitness Profile";


    } catch (error) {

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

assessmentButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "assessment.html";

    }
);


// =========================
// PROFILE BUTTON
// =========================

profileButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "profile.html";

    }
);


// =========================
// LOGOUT
// =========================

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