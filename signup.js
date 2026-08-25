// =========================
// GET FORM
// =========================

const signupForm =
    document.getElementById("signupForm");

const successMessage =
    document.getElementById("successMessage");


// =========================
// PASSWORD VISIBILITY
// =========================

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const passwordEye =
    document.getElementById("passwordEye");

const confirmPasswordEye =
    document.getElementById("confirmPasswordEye");


// =========================
// PASSWORD EYE
// =========================

passwordEye.addEventListener(
    "click",
    function () {

        if (password.type === "password") {

            password.type = "text";

            passwordEye.innerHTML =
                '<i data-lucide="eye-off"></i>';

            passwordEye.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            password.type = "password";

            passwordEye.innerHTML =
                '<i data-lucide="eye"></i>';

            passwordEye.setAttribute(
                "aria-label",
                "Show password"
            );
        }

        lucide.createIcons();

    }
);


// =========================
// CONFIRM PASSWORD EYE
// =========================

confirmPasswordEye.addEventListener(
    "click",
    function () {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            confirmPasswordEye.innerHTML =
                '<i data-lucide="eye-off"></i>';

            confirmPasswordEye.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            confirmPassword.type = "password";

            confirmPasswordEye.innerHTML =
                '<i data-lucide="eye"></i>';

            confirmPasswordEye.setAttribute(
                "aria-label",
                "Show password"
            );
        }

        lucide.createIcons();

    }
);


// =========================
// SIGN UP
// =========================

signupForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // =========================
        // GET VALUES
        // =========================

        const fullname =
            document
                .getElementById("fullname")
                .value
                .trim();

        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        // =========================
        // CHECK EMPTY FIELDS
        // =========================

        if (
            fullname === "" ||
            username === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            alert(
                "Please fill in all the fields"
            );

            return;
        }


        // =========================
        // CHECK PASSWORD STRENGTH
        // =========================

        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;


        if (!strongPassword.test(password)) {

            alert(
                "Password must contain at least 8 characters, " +
                "one uppercase letter, one lowercase letter, " +
                "one number, and one special character."
            );

            return;
        }


        // =========================
        // CHECK CONFIRM PASSWORD
        // =========================

        if (password !== confirmPassword) {

            alert(
                "Passwords do not match"
            );

            return;
        }


        // =========================
        // GET EXISTING USERS
        // =========================

        const savedUsers =
            localStorage.getItem("gymUsers");

        let users = [];


        if (savedUsers) {

            try {

                users =
                    JSON.parse(savedUsers);

            } catch (error) {

                users = [];

            }

        }


        // =========================
        // CHECK USERNAME
        // =========================

        const usernameExists =
            users.some(
                function (user) {

                    return (
                        user.username.toLowerCase() ===
                        username.toLowerCase()
                    );

                }
            );


        if (usernameExists) {

            alert(
                "Username already exists. Please sign in."
            );

            return;
        }


        // =========================
        // CHECK EMAIL
        // =========================

        const emailExists =
            users.some(
                function (user) {

                    return (
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                    );

                }
            );


        if (emailExists) {

            alert(
                "Email already exists. Please use another email."
            );

            return;
        }


        // =========================
        // CREATE USER
        // =========================

        const user = {

            fullname: fullname,

            username: username,

            email: email,

            password: password

        };


        // =========================
        // ADD USER
        // =========================

        users.push(user);


        // =========================
        // SAVE ALL USERS
        // =========================

        localStorage.setItem(
            "gymUsers",
            JSON.stringify(users)
        );


        // =========================
        // SUCCESS MESSAGE
        // =========================

        successMessage.textContent =
            "Account created! Redirecting to sign in...";

        successMessage.style.display =
            "block";


        // =========================
        // DISABLE BUTTON
        // =========================

        const button =
            signupForm.querySelector(
                'button[type="submit"]'
            );

        button.disabled = true;


        // =========================
        // REDIRECT TO LOGIN
        // =========================

        setTimeout(
            function () {

                window.location.href =
                    "index.html";

            },
            2000
        );

    }
);