// =========================
// GET LOGIN FORM
// =========================

const loginForm =
    document.getElementById("loginForm");


// =========================
// PASSWORD VISIBILITY
// =========================

const passwordInput =
    document.getElementById("password");

const passwordEye =
    document.getElementById("passwordEye");


// =========================
// INITIALIZE LUCIDE ICONS
// =========================

lucide.createIcons();


// =========================
// PASSWORD EYE
// =========================

passwordEye.addEventListener(
    "click",
    function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            passwordEye.setAttribute(
                "aria-label",
                "Hide password"
            );

            passwordEye.innerHTML =
                '<i data-lucide="eye-off" class="eyeIcon"></i>';

            lucide.createIcons();

        } else {

            passwordInput.type = "password";

            passwordEye.setAttribute(
                "aria-label",
                "Show password"
            );

            passwordEye.innerHTML =
                '<i data-lucide="eye" class="eyeIcon"></i>';

            lucide.createIcons();

        }

    }
);


// =========================
// LOGIN
// =========================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // =========================
        // GET VALUES
        // =========================

        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            passwordInput.value;


        // =========================
        // CHECK EMPTY FIELDS
        // =========================

        if (
            username === "" ||
            password === ""
        ) {

            alert(
                "Please enter username and password"
            );

            return;
        }


        // =========================
        // GET LOGIN BUTTON
        // =========================

        const loginButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );


        // =========================
        // DISABLE BUTTON
        // =========================

        loginButton.disabled = true;

        loginButton.textContent =
            "Signing In...";


        try {

            // =========================
            // SEND LOGIN REQUEST
            // =========================

            const response =
                await fetch(
                    "https://gym-assistant-rb7h.onrender.com/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            username: username,

                            password: password

                        })
                    }
                );


            // =========================
            // GET BACKEND RESPONSE
            // =========================

            const data =
                await response.json();


            // =========================
            // LOGIN FAILED
            // =========================

            if (!response.ok) {

                alert(data.message);

                loginButton.disabled = false;

                loginButton.textContent =
                    "Sign In";

                return;
            }


// =========================
// LOGIN SUCCESS
// =========================

const loggedInUsername =
    data.username;

// Check whether this user has logged in before
const hasLoggedInBefore =
    localStorage.getItem(
        "hasLoggedIn_" + loggedInUsername
    );

localStorage.setItem(
    "isLoggedIn",
    "true"
);

localStorage.setItem(
    "username",
    loggedInUsername
);

localStorage.setItem(
    "token",
    data.token
);

// Store whether this is the user's first login
localStorage.setItem(
    "isFirstLogin",
    hasLoggedInBefore !== "true"
        ? "true"
        : "false"
);

// Mark this user as having logged in
localStorage.setItem(
    "hasLoggedIn_" + loggedInUsername,
    "true"
);


            // =========================
            // GO TO HOME
            // =========================

            window.location.href =
                "home.html";


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server. Please try again."
            );

            loginButton.disabled = false;

            loginButton.textContent =
                "Sign In";

        }

    }
);