(function () {
    "use strict";

    var form = document.getElementById("loginForm");
    var status = document.getElementById("loginStatus");
    var submit = document.getElementById("loginSubmit");
    var password = document.getElementById("password");
    var toggle = document.getElementById("togglePassword");

    if (window.TrainerAuth.isAuthenticated()) window.location.replace("dashboard.html");

    toggle.addEventListener("click", function () {
        var showing = password.type === "text";
        password.type = showing ? "password" : "text";
        toggle.textContent = showing ? "Show" : "Hide";
        toggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        TrainerUI.clearStatus(status);
        var username = document.getElementById("username").value.trim();
        var passwordValue = password.value;
        if (!username || !passwordValue) {
            TrainerUI.status(status, "Username and password are required.", "error");
            return;
        }
        TrainerUI.busy(submit, true, "Signing in...");
        try {
            var result = await TrainerAPI.login(username, passwordValue);
            if (!result.token || result.role !== "trainer") {
                throw new TrainerAPI.TrainerApiError(403, "Trainer access is required.");
            }
            TrainerAuth.saveSession(result.token, result.username || username);
            TrainerUI.status(status, "Signed in. Redirecting...", "success");
            window.location.replace("dashboard.html");
        } catch (error) {
            TrainerAuth.clearSession();
            TrainerUI.showError(status, error);
            TrainerUI.busy(submit, false);
        }
    });
}());
