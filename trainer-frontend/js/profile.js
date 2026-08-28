(function () {
    "use strict";

    if (!TrainerAuth.requireTrainer()) return;
    var form = document.getElementById("profileForm");
    var status = document.getElementById("profileStatus");
    var save = document.getElementById("saveProfile");
    document.getElementById("usernameDisplay").textContent = TrainerAuth.getUsername() || "Trainer";
    document.getElementById("logoutButton").addEventListener("click", function () { TrainerAuth.logout(true); });

    function fill(profile) {
        document.getElementById("profileUsername").textContent = TrainerUI.displayValue(profile.username);
        document.getElementById("profileEmail").textContent = TrainerUI.displayValue(profile.email);
        document.getElementById("profileRole").textContent = TrainerUI.displayValue(profile.role);
        document.getElementById("profileGym").textContent = TrainerUI.displayValue(profile.gymId);
        var trainerProfile = profile.trainerProfile || profile;
        document.getElementById("bio").value = trainerProfile.bio || "";
        document.getElementById("specialization").value = trainerProfile.specialization || "";
        document.getElementById("experience").value = trainerProfile.experience || "";
        document.getElementById("certifications").value = Array.isArray(trainerProfile.certifications) ? trainerProfile.certifications.join(", ") : "";
    }

    async function load() {
        try {
            TrainerUI.status(status, "Loading profile...", "info");
            var response = await TrainerAPI.getProfile();
            fill(response.profile || {});
            TrainerUI.clearStatus(status);
        } catch (error) { TrainerUI.showError(status, error); }
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        TrainerUI.clearStatus(status);
        var profile = {
            bio: document.getElementById("bio").value.trim(),
            specialization: document.getElementById("specialization").value.trim(),
            experience: document.getElementById("experience").value.trim(),
            certifications: document.getElementById("certifications").value.split(",").map(function (item) {
                return item.trim();
            }).filter(Boolean)
        };
        TrainerUI.busy(save, true, "Saving...");
        try {
            var response = await TrainerAPI.updateProfile(profile);
            fill(response.profile || profile);
            TrainerUI.status(status, response.message || "Profile updated successfully.", "success");
        } catch (error) { TrainerUI.showError(status, error); }
        TrainerUI.busy(save, false);
    });
    load();
}());
