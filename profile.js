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
// GET CURRENT USER & TOKEN
// =========================

const username =
    localStorage.getItem("username");

const token =
    localStorage.getItem("token");

if (!username || !token) {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    window.location.href =
        "index.html";
}


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

if (profileUsername) {

    profileUsername.textContent =
        username;
}

if (profileInitial) {

    profileInitial.textContent =
        username
            .charAt(0)
            .toUpperCase();
}


// =========================
// FORMAT NORMAL VALUES
// =========================

function formatValue(value) {

    if (!value) {

        return "--";
    }

    return String(value)
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

    return formatValue(goal);
}


// =========================
// LOAD PROFILE FROM MONGODB
// =========================

async function loadProfile() {

    try {

        const token =
            localStorage.getItem("token");

const response =
    await fetch(
        `https://gym-assistant-rb7h.onrender.com/api/profile/${encodeURIComponent(username)}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );


        // =========================
        // PROFILE NOT FOUND
        // =========================

        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");
                localStorage.removeItem("token");

                window.location.href =
                    "index.html";

                return;
            }

            if (response.status === 404) {

                alert(
                    "Please complete your fitness assessment first."
                );

                window.location.href =
                    "assessment.html";

                return;
            }


            throw new Error(
                "Unable to load profile."
            );
        }


        // =========================
        // GET RESPONSE
        // =========================

        const data =
            await response.json();


        const profile =
            data.profile;


        // =========================
        // CHECK PROFILE
        // =========================

        if (!profile) {

            alert(
                "Please complete your fitness assessment first."
            );

            window.location.href =
                "assessment.html";

            return;
        }


        // =========================
        // PERSONAL INFORMATION
        // =========================

        if (profileAge) {

            profileAge.textContent =
                profile.age || "--";
        }


        if (profileGender) {

            profileGender.textContent =
                formatValue(
                    profile.gender
                );
        }


        if (profileHeight) {

            profileHeight.textContent =
                profile.height || "--";
        }


        if (profileWeight) {

            profileWeight.textContent =
                profile.weight || "--";
        }


        // =========================
        // BODY FAT
        // =========================

        if (
            profileBodyFat
        ) {

            if (
                profile.bodyFat !== undefined &&
                profile.bodyFat !== null &&
                profile.bodyFat !== 0
            ) {

                profileBodyFat.textContent =
                    Number(
                        profile.bodyFat
                    ).toFixed(1);

            } else {

                profileBodyFat.textContent =
                    "--";
            }
        }


        // =========================
        // NECK
        // =========================

        if (profileNeck) {

            profileNeck.textContent =
                profile.neck || "--";
        }


        // =========================
        // WAIST
        // =========================

        if (profileWaist) {

            profileWaist.textContent =
                profile.waist || "--";
        }


        // =========================
        // HIP
        // =========================

        if (
            profile.gender === "female" &&
            profile.hip
        ) {

            if (profileHip) {

                profileHip.textContent =
                    profile.hip;
            }


            if (hipCard) {

                hipCard.style.display =
                    "";
            }

        } else {

            if (hipCard) {

                hipCard.style.display =
                    "none";
            }
        }


        // =========================
        // ACTIVITY
        // =========================

        if (profileActivity) {

            profileActivity.textContent =
                formatValue(
                    profile.activity
                );
        }


        // =========================
        // EXPERIENCE
        // =========================

        if (profileExperience) {

            profileExperience.textContent =
                formatValue(
                    profile.experience
                );
        }


        // =========================
        // GOAL
        // =========================

        if (profileGoal) {

            profileGoal.textContent =
                formatGoal(
                    profile.goal
                );
        }

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );
    }
}


// =========================
// EDIT PROFILE
// =========================

if (editProfileButton) {

    editProfileButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "assessment.html";

        }
    );
}


// =========================
// INITIALIZE
// =========================

loadProfile();