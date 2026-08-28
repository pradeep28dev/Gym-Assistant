(function () {
    "use strict";

    if (!TrainerAuth.requireTrainer()) return;
    var status = document.getElementById("clientsStatus");
    var list = document.getElementById("clientList");
    var assignForm = document.getElementById("assignForm");
    var assignButton = document.getElementById("assignButton");
    document.getElementById("usernameDisplay").textContent = TrainerAuth.getUsername() || "Trainer";
    document.getElementById("logoutButton").addEventListener("click", function () { TrainerAuth.logout(true); });

    function render(clients) {
        list.textContent = "";
        if (!clients.length) {
            var empty = document.createElement("div");
            empty.className = "empty-state card";
            empty.textContent = "No assigned clients found.";
            list.appendChild(empty);
            return;
        }
        clients.forEach(function (client) {
            var card = document.createElement("article");
            card.className = "card client-card";
            var title = document.createElement("h2");
            title.textContent = client.fullname || client.username || "Unnamed client";
            var meta = document.createElement("p");
            meta.className = "client-meta";
            meta.textContent = (client.email || "No email") + " · " + (client.username || "No username");
            var actions = document.createElement("div");
            actions.className = "card-actions";
            var details = document.createElement("a");
            details.className = "button secondary small";
            details.href = "client-details.html?" + new URLSearchParams({ id: client._id || client.id });
            details.textContent = "View details";
            var remove = document.createElement("button");
            remove.className = "button danger small";
            remove.type = "button";
            remove.textContent = "Unassign";
            remove.addEventListener("click", function () { unassign(client._id || client.id, remove); });
            actions.append(details, remove);
            card.append(title, meta, actions);
            list.appendChild(card);
        });
    }

    async function load(showLoading) {
        try {
            if (showLoading) TrainerUI.status(status, "Loading clients...", "info");
            var response = await TrainerAPI.getClients();
            var clients = Array.isArray(response.clients) ? response.clients : [];
            render(clients);
            if (showLoading) TrainerUI.clearStatus(status);
        } catch (error) {
            TrainerUI.showError(status, error);
            return false;
        }
        return true;
    }

    async function unassign(id, button) {
        TrainerUI.busy(button, true, "Removing...");
        try {
            var response = await TrainerAPI.unassignClient(id);
            if (await load(false)) {
                TrainerUI.status(status, response.message || "Client unassigned successfully.", "success");
            }
        } catch (error) { TrainerUI.showError(status, error); }
        TrainerUI.busy(button, false);
    }

    assignForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        TrainerUI.clearStatus(status);
        var idInput = document.getElementById("clientId");
        var clientId = idInput.value.trim();
        if (!clientId) {
            TrainerUI.status(status, "Enter a client ID to assign.", "error");
            return;
        }
        TrainerUI.busy(assignButton, true, "Assigning...");
        try {
            var response = await TrainerAPI.assignClient(clientId);
            idInput.value = "";
            if (await load(false)) {
                TrainerUI.status(status, response.message || "Client assigned successfully.", "success");
            }
        } catch (error) { TrainerUI.showError(status, error); }
        TrainerUI.busy(assignButton, false);
    });
    load(true);
}());
