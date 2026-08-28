(function () {
    "use strict";

    if (!TrainerAuth.requireTrainer()) return;
    var status = document.getElementById("detailsStatus");
    document.getElementById("usernameDisplay").textContent = TrainerAuth.getUsername() || "Trainer";
    document.getElementById("logoutButton").addEventListener("click", function () { TrainerAuth.logout(true); });

    var id = new URLSearchParams(window.location.search).get("id");
    function set(idName, value) { document.getElementById(idName).textContent = TrainerUI.displayValue(value); }
    function hasAssessmentData(fitness) {
        return ["gender", "activity", "experience", "goal"].some(function (field) {
            return Boolean(fitness[field]);
        }) || ["age", "height", "weight", "neck", "waist", "hip", "bodyFat"].some(function (field) {
            return Number(fitness[field]) > 0;
        });
    }

    async function load() {
        if (!id) {
            TrainerUI.status(status, "A client ID is required to view details.", "error");
            return;
        }
        try {
            TrainerUI.status(status, "Loading client details...", "info");
            var responses = await Promise.all([
                TrainerAPI.getClient(id),
                TrainerAPI.getClientAssessment(id)
            ]);
            var client = responses[0].client || {};
            var fitness = responses[1].fitnessProfile || {};
            set("clientName", client.fullname || client.username);
            set("clientEmail", client.email);
            set("clientUsername", client.username);
            set("clientGender", fitness.gender);
            set("clientAge", fitness.age);
            set("clientHeight", fitness.height);
            set("clientWeight", fitness.weight);
            set("clientNeck", fitness.neck);
            set("clientWaist", fitness.waist);
            set("clientHip", fitness.hip);
            set("clientBodyFat", fitness.bodyFat);
            set("clientActivity", fitness.activity);
            set("clientExperience", fitness.experience);
            set("clientGoal", fitness.goal);
            document.getElementById("assessmentEmpty").hidden = hasAssessmentData(fitness);
            document.getElementById("assessmentData").hidden = !hasAssessmentData(fitness);
            TrainerUI.clearStatus(status);
        } catch (error) { TrainerUI.showError(status, error); }
    }
    load();
}());
