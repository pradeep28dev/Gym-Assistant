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

            // Change eye → eye-off
            passwordEye.innerHTML =
                '<i data-lucide="eye-off" class="eyeIcon"></i>';

            lucide.createIcons();

        } else {

            passwordInput.type = "password";

            passwordEye.setAttribute(
                "aria-label",
                "Show password"
            );

            // Change eye-off → eye
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
    function (event) {

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
            document
                .getElementById("password")
                .value;


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
        // GET ALL USERS
        // =========================

        const savedUsers =
            localStorage.getItem("gymUsers");


        // =========================
        // NO USERS FOUND
        // =========================

        if (!savedUsers) {

            alert(
                "User not found. Please create a new account."
            );

            return;
        }


        // =========================
        // CONVERT TO ARRAY
        // =========================

        const users =
            JSON.parse(savedUsers);


        // =========================
        // FIND USER
        // =========================

        const user =
            users.find(
                function (user) {

                    return (
                        user.username.toLowerCase() ===
                        username.toLowerCase()
                    );

                }
            );


        // =========================
        // USER NOT FOUND
        // =========================

        if (!user) {

            alert(
                "User not found. Please create a new account."
            );

            return;
        }


        // =========================
        // CHECK PASSWORD
        // =========================

        if (password !== user.password) {

            alert(
                "Incorrect password. Please try again."
            );

            return;
        }


        // =========================
        // LOGIN SUCCESS
        // =========================

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );

        localStorage.setItem(
            "username",
            user.username
        );


        // =========================
        // GO TO HOME
        // =========================

        window.location.href =
            "home.html";

    }
);