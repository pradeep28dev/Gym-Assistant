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


// =========================
// GET ELEMENTS
// =========================

const profileUsername =
    document.getElementById("profileUsername");

const profileInitial =
    document.getElementById("profileInitial");

const profileAge =
    document.getElementById("profileAge");

const profileGender =
    document.getElementById("profileGender");

const profileHeight =
    document.getElementById("profileHeight");

const profileWeight =
    document.getElementById("profileWeight");

const profileBodyFat =
    document.getElementById("profileBodyFat");

const profileNeck =
    document.getElementById("profileNeck");

const profileWaist =
    document.getElementById("profileWaist");

const profileHip =
    document.getElementById("profileHip");

const hipCard =
    document.getElementById("hipCard");

const profileActivity =
    document.getElementById("profileActivity");

const profileExperience =
    document.getElementById("profileExperience");

const profileGoal =
    document.getElementById("profileGoal");

const editProfileButton =
    document.getElementById("editProfileButton");


// =========================
// DISPLAY USERNAME
// =========================

if (username) {

    profileUsername.textContent =
        username;


    profileInitial.textContent =
        username.charAt(0).toUpperCase();
}


// =========================
// GET FITNESS PROFILE
// =========================

const savedProfile =
    localStorage.getItem(
        "fitnessProfile_" + username
    );


// =========================
// CHECK PROFILE
// =========================

if (!savedProfile) {

    alert(
        "Please complete your fitness assessment first."
    );

    window.location.href =
        "assessment.html";

} else {


    // =========================
    // PARSE PROFILE
    // =========================

    const profile =
        JSON.parse(savedProfile);


    // =========================
    // PERSONAL INFORMATION
    // =========================

    profileAge.textContent =
        profile.age;


    profileGender.textContent =
        formatValue(profile.gender);


    profileHeight.textContent =
        profile.height;


    profileWeight.textContent =
        profile.weight;


    // =========================
    // BODY COMPOSITION
    // =========================

    if (
        profile.bodyFat !== undefined &&
        profile.bodyFat !== null
    ) {

        profileBodyFat.textContent =
            profile.bodyFat;

    } else {

        profileBodyFat.textContent =
            "--";
    }


    profileNeck.textContent =
        profile.neck;


    profileWaist.textContent =
        profile.waist;


    // =========================
    // HIP
    // =========================

    if (
        profile.gender === "female" &&
        profile.hip
    ) {

        profileHip.textContent =
            profile.hip;

    } else {

        hipCard.style.display =
            "none";
    }


    // =========================
    // FITNESS INFORMATION
    // =========================

    profileActivity.textContent =
        formatValue(profile.activity);


    profileExperience.textContent =
        formatValue(profile.experience);


    profileGoal.textContent =
        formatGoal(profile.goal);

}


// =========================
// FORMAT NORMAL VALUES
// =========================

function formatValue(value) {

    if (!value) {
        return "--";
    }

    return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
    });
}


// =========================
// FORMAT FITNESS GOAL
// =========================

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


// =========================
// EDIT PROFILE
// =========================

editProfileButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "assessment.html";

    }
);