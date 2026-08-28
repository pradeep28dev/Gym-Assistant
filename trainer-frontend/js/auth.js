(function () {
    "use strict";

    var TOKEN_KEY = "trainerToken";
    var USERNAME_KEY = "trainerUsername";

    function redirectToLogin() {
        if (!window.location.pathname.endsWith("/index.html") &&
            !window.location.pathname.endsWith("/trainer-frontend/")) {
            window.location.replace("index.html");
        }
    }

    function getTokenPayload() {
        var token = sessionStorage.getItem(TOKEN_KEY);
        if (!token) return null;

        try {
            var parts = token.split(".");
            if (parts.length !== 3) return null;
            var encoded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            while (encoded.length % 4) encoded += "=";
            return JSON.parse(atob(encoded));
        } catch (error) {
            return null;
        }
    }

    window.TrainerAuth = {
        getToken: function () { return sessionStorage.getItem(TOKEN_KEY); },
        getUsername: function () { return sessionStorage.getItem(USERNAME_KEY); },
        isAuthenticated: function () { return Boolean(this.getToken()); },
        saveSession: function (token, username) {
            sessionStorage.setItem(TOKEN_KEY, token);
            sessionStorage.setItem(USERNAME_KEY, username);
        },
        clearSession: function () {
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USERNAME_KEY);
        },
        logout: function (redirect) {
            this.clearSession();
            if (redirect !== false) {
                redirectToLogin();
            }
        },
        requireTrainer: function () {
            var payload = getTokenPayload();
            if (!payload || payload.role !== "trainer") {
                this.clearSession();
                redirectToLogin();
                return false;
            }
            return true;
        }
    };

    window.TrainerUI = {
        status: function (element, message, type) {
            if (!element) return;
            element.textContent = message || "";
            element.className = "status visible " + (type || "info");
        },
        clearStatus: function (element) {
            if (!element) return;
            element.textContent = "";
            element.className = "status";
        },
        busy: function (button, busy, label) {
            if (!button) return;
            if (busy) {
                button.dataset.originalLabel = button.textContent;
                button.disabled = true;
                button.textContent = label || "Working...";
            } else {
                button.disabled = false;
                button.textContent = button.dataset.originalLabel || button.textContent;
            }
        },
        displayValue: function (value) {
            if (value === null || value === undefined || value === "") return "—";
            if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
            return String(value);
        },
        showError: function (element, error) {
            this.status(element, error && error.message ? error.message : "Something went wrong.", "error");
        }
    };
}());
