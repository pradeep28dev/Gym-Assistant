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

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
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

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            passwordEye.innerHTML =
                '<i data-lucide="eye-off"></i>';

            passwordEye.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

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

        if (confirmPasswordInput.type === "password") {

            confirmPasswordInput.type = "text";

            confirmPasswordEye.innerHTML =
                '<i data-lucide="eye-off"></i>';

            confirmPasswordEye.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            confirmPasswordInput.type = "password";

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
    async function (event) {

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
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


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
        // GET CREATE ACCOUNT BUTTON
        // =========================

        const button =
            signupForm.querySelector(
                'button[type="submit"]'
            );


        // =========================
        // DISABLE BUTTON
        // =========================

        button.disabled = true;

        button.textContent =
            "Creating Account...";


        try {

            // =========================
            // SEND DATA TO BACKEND
            // =========================

            const response =
                await fetch(
                    "https://gym-assistant-rb7h.onrender.com/api/auth/signup",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            fullname: fullname,

                            username: username,

                            email: email,

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
            // CHECK RESPONSE
            // =========================

            if (!response.ok) {

                alert(data.message);

                button.disabled = false;

                button.textContent =
                    "Create Account";

                return;
            }


            // =========================
            // SUCCESS MESSAGE
            // =========================

            successMessage.textContent =
                "Account created! Redirecting to sign in...";

            successMessage.style.display =
                "block";


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


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server. Please try again."
            );

            button.disabled = false;

            button.textContent =
                "Create Account";

        }

    }
);