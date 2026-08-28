(function () {
    "use strict";

    window.TrainerConfig = Object.freeze({
        authBaseUrl: "http://localhost:5000",
        loginUrl: "http://localhost:5000/api/auth/login",
        trainerApiBaseUrl: "http://localhost:5001",
        trainerApiPath: "/api/trainers",
        loginPath: "/api/auth/login",
        loginPage: "index.html",
        dashboardPage: "dashboard.html"
    });
}());
