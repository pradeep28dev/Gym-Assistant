(function () {
    "use strict";

    if (!TrainerAuth.requireTrainer()) return;
    var status = document.getElementById("dashboardStatus");
    var username = TrainerAuth.getUsername() || "Trainer";
    document.getElementById("usernameDisplay").textContent = username;
    document.getElementById("usernameHeading").textContent = username;
    document.getElementById("logoutButton").addEventListener("click", function () { TrainerAuth.logout(true); });

    function set(id, value) { document.getElementById(id).textContent = TrainerUI.displayValue(value); }
    function renderClients(clients) {
        var list = document.getElementById("recentClients");
        list.textContent = "";
        if (!clients.length) {
            var empty = document.createElement("li");
            empty.className = "empty-state";
            empty.textContent = "No clients are assigned yet.";
            list.appendChild(empty);
            return;
        }
        clients.slice(0, 5).forEach(function (client) {
            var item = document.createElement("li");
            item.className = "list-item";
            var text = document.createElement("span");
            var name = document.createElement("strong");
            name.textContent = client.fullname || client.username || "Unnamed client";
            var email = document.createElement("small");
            email.textContent = client.email || "No email provided";
            text.append(name, email);
            var link = document.createElement("a");
            link.className = "button secondary small";
            link.href = "client-details.html?" + new URLSearchParams({ id: client._id || client.id });
            link.textContent = "View";
            item.append(text, link);
            list.appendChild(item);
        });
    }

    async function loadDashboard() {
        try {
            var responses = await Promise.all([TrainerAPI.getProfile(), TrainerAPI.getClients()]);
            var profile = responses[0].profile || {};
            var clients = Array.isArray(responses[1].clients) ? responses[1].clients : [];
            var trainerProfile = profile.trainerProfile || {};
            set("clientCount", clients.length);
            set("specialization", trainerProfile.specialization);
            set("experience", trainerProfile.experience);
            set("bio", trainerProfile.bio);
            renderClients(clients);
        } catch (error) {
            TrainerUI.showError(status, error);
        }
    }
    loadDashboard();
}());
