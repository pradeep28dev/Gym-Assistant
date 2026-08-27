// =========================
// CHECK LOGIN
// =========================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href = "index.html";

}


// =========================
// GET CURRENT USER
// =========================

const username =
    localStorage.getItem("username");

if (!username) {

    localStorage.removeItem("isLoggedIn");

    window.location.href = "index.html";

}


// =========================
// GET ELEMENTS
// =========================

const assessmentForm =
    document.getElementById("assessmentForm");

const formMessage =
    document.getElementById("formMessage");

const genderSelect =
    document.getElementById("gender");

const hipGroup =
    document.getElementById("hipGroup");

const hipInput =
    document.getElementById("hip");


// =========================
// SHOW / HIDE HIP FIELD
// =========================

genderSelect.addEventListener(
    "change",
    function () {

        if (genderSelect.value === "female") {

            hipGroup.style.display = "flex";

            hipInput.required = true;

        } else {

            hipGroup.style.display = "none";

            hipInput.required = false;

            hipInput.value = "";

        }

    }
);


// =========================
// BODY FAT CALCULATION
// =========================

function calculateBodyFat(
    gender,
    height,
    neck,
    waist,
    hip
) {

    let bodyFat;


    // =========================
    // MALE FORMULA
    // =========================

    if (gender === "male") {

        const difference =
            waist - neck;


        if (difference <= 0) {

            return null;

        }


        bodyFat =
            86.010 *
            Math.log10(difference)

            -

            70.041 *
            Math.log10(height)

            +

            36.76;

    }


    // =========================
    // FEMALE FORMULA
    // =========================

    else if (gender === "female") {

        const difference =
            waist + hip - neck;


        if (difference <= 0) {

            return null;

        }


        bodyFat =
            163.205 *
            Math.log10(difference)

            -

            97.684 *
            Math.log10(height)

            -

            78.387;

    }


    else {

        return null;

    }


    // =========================
    // ROUND RESULT
    // =========================

    return Number(
        bodyFat.toFixed(1)
    );

}


// =========================
// LOAD EXISTING PROFILE
// =========================

async function loadProfile() {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/profile/${encodeURIComponent(username)}`
            );


        if (!response.ok) {

            return;

        }


        const data =
            await response.json();


        const profile =
            data.profile;


        if (!profile) {

            return;

        }


        // =========================
        // BASIC INFORMATION
        // =========================

        document.getElementById("age").value =
            profile.age || "";

        document.getElementById("gender").value =
            profile.gender || "";

        document.getElementById("height").value =
            profile.height || "";

        document.getElementById("weight").value =
            profile.weight || "";


        // =========================
        // BODY MEASUREMENTS
        // =========================

        document.getElementById("neck").value =
            profile.neck || "";

        document.getElementById("waist").value =
            profile.waist || "";


        // =========================
        // FEMALE HIP
        // =========================

        if (profile.gender === "female") {

            hipGroup.style.display = "flex";

            hipInput.required = true;

            hipInput.value =
                profile.hip || "";

        }


        // =========================
        // ACTIVITY
        // =========================

        const activityRadio =
            document.querySelector(
                `input[name="activity"][value="${profile.activity}"]`
            );

        if (activityRadio) {

            activityRadio.checked = true;

        }


        // =========================
        // EXPERIENCE
        // =========================

        const experienceRadio =
            document.querySelector(
                `input[name="experience"][value="${profile.experience}"]`
            );

        if (experienceRadio) {

            experienceRadio.checked = true;

        }


        // =========================
        // GOAL
        // =========================

        const goalRadio =
            document.querySelector(
                `input[name="goal"][value="${profile.goal}"]`
            );

        if (goalRadio) {

            goalRadio.checked = true;

        }


    } catch (error) {

        console.error(
            "Unable to load fitness profile:",
            error
        );

    }

}


// =========================
// LOAD PROFILE
// =========================

loadProfile();


// =========================
// FORM SUBMIT
// =========================

assessmentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // =========================
        // BASIC INFORMATION
        // =========================

        const age =
            document.getElementById("age").value;

        const gender =
            document.getElementById("gender").value;

        const height =
            parseFloat(
                document.getElementById("height").value
            );

        const weight =
            parseFloat(
                document.getElementById("weight").value
            );


        // =========================
        // BODY MEASUREMENTS
        // =========================

        const neck =
            parseFloat(
                document.getElementById("neck").value
            );

        const waist =
            parseFloat(
                document.getElementById("waist").value
            );

        let hip = 0;


        if (gender === "female") {

            hip =
                parseFloat(
                    document.getElementById("hip").value
                );

        }


        // =========================
        // ACTIVITY
        // =========================

        const activityElement =
            document.querySelector(
                'input[name="activity"]:checked'
            );

        const activity =
            activityElement
                ? activityElement.value
                : "";


        // =========================
        // EXPERIENCE
        // =========================

        const experienceElement =
            document.querySelector(
                'input[name="experience"]:checked'
            );

        const experience =
            experienceElement
                ? experienceElement.value
                : "";


        // =========================
        // GOAL
        // =========================

        const goalElement =
            document.querySelector(
                'input[name="goal"]:checked'
            );

        const goal =
            goalElement
                ? goalElement.value
                : "";


        // =========================
        // VALIDATE MEASUREMENTS
        // =========================

        if (
            !height ||
            !weight ||
            !neck ||
            !waist ||
            height <= 0 ||
            weight <= 0 ||
            neck <= 0 ||
            waist <= 0
        ) {

            formMessage.textContent =
                "Please enter valid body measurements.";

            return;

        }


        if (
            gender === "female" &&
            (!hip || hip <= 0)
        ) {

            formMessage.textContent =
                "Please enter your hip measurement.";

            return;

        }


        // =========================
        // CALCULATE BODY FAT
        // =========================

        const bodyFat =
            calculateBodyFat(
                gender,
                height,
                neck,
                waist,
                hip
            );


        if (bodyFat === null) {

            formMessage.textContent =
                "Unable to calculate body fat. Please check your measurements.";

            return;

        }


        // =========================
        // CREATE FITNESS PROFILE
        // =========================

        const fitnessProfile = {

            username: username,

            age: Number(age),

            gender: gender,

            height: height,

            weight: weight,

            neck: neck,

            waist: waist,

            hip: hip,

            bodyFat: bodyFat,

            activity: activity,

            experience: experience,

            goal: goal

        };


        // =========================
        // SAVE TO MONGODB
        // =========================

        try {

            formMessage.textContent =
                "Saving profile...";


            const response =
                await fetch(
                    "https://gym-assistant-rb7h.onrender.com/api/profile",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                fitnessProfile
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                formMessage.textContent =
                    data.message ||
                    "Unable to save profile.";

                return;

            }


            // =========================
            // SUCCESS
            // =========================

            formMessage.textContent =
                "Fitness profile saved successfully!";


            // =========================
            // GO HOME
            // =========================

            setTimeout(
                function () {

                    window.location.href =
                        "home.html";

                },
                1000
            );


        } catch (error) {

            console.error(
                "Profile save error:",
                error
            );

            formMessage.textContent =
                "Unable to connect to the server.";

        }

    }
);