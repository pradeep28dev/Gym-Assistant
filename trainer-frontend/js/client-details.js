(function () {
    "use strict";

    if (!TrainerAuth.requireTrainer()) return;
    var status = document.getElementById("detailsStatus");
    document.getElementById("usernameDisplay").textContent = TrainerAuth.getUsername() || "Trainer";
    document.getElementById("logoutButton").addEventListener("click", function () { TrainerAuth.logout(true); });

    var id = new URLSearchParams(window.location.search).get("id");
    function set(idName, value) { document.getElementById(idName).textContent = TrainerUI.displayValue(value); }

    async function load() {
        if (!id) {
            TrainerUI.status(status, "A client ID is required to view details.", "error");
            return;
        }
        try {
            TrainerUI.status(status, "Loading client details...", "info");
            var response = await TrainerAPI.getClient(id);
            var client = response.client || {};
            var fitness = client.fitnessProfile || {};
            set("clientName", client.fullname || client.username);
            set("clientEmail", client.email);
            set("clientUsername", client.username);
            set("clientGender", fitness.gender);
            set("clientAge", fitness.age);
            set("clientHeight", fitness.height);
            set("clientWeight", fitness.weight);
            set("clientBodyFat", fitness.bodyFat);
            set("clientActivity", fitness.activity);
            set("clientExperience", fitness.experience);
            set("clientGoal", fitness.goal);
            TrainerUI.clearStatus(status);
        } catch (error) { TrainerUI.showError(status, error); }
    }
    load();
}());
