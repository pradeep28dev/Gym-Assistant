(function () {
    "use strict";

    function TrainerApiError(status, message, payload) {
        this.name = "TrainerApiError";
        this.status = status || 0;
        this.message = message;
        this.payload = payload;
    }
    TrainerApiError.prototype = Object.create(Error.prototype);

    function messageFor(status, fallback) {
        var messages = {
            400: "Please check the information and try again.",
            401: "Your session has expired. Please sign in again.",
            403: "You do not have permission to perform this action.",
            404: "The requested resource could not be found.",
            409: "This change conflicts with the current client assignment."
        };
        return messages[status] || fallback || "Unable to reach the trainer service.";
    }

    async function parseResponse(response) {
        var data = null;
        try { data = await response.json(); } catch (ignored) { data = null; }
        return data;
    }

    async function request(url, options, isAuthRequest) {
        var requestOptions = Object.assign({ headers: {} }, options || {});
        requestOptions.headers = Object.assign({ "Content-Type": "application/json" }, requestOptions.headers);
        if (!isAuthRequest) {
            var token = window.TrainerAuth.getToken();
            if (!token) {
                window.TrainerAuth.logout(true);
                throw new TrainerApiError(401, "Please sign in to continue.");
            }
            requestOptions.headers.Authorization = "Bearer " + token;
        }

        var response;
        try {
            response = await fetch(url, requestOptions);
        } catch (error) {
            throw new TrainerApiError(0, "Network error. Check that the trainer service is running.", error);
        }

        var data = await parseResponse(response);
        if (!response.ok) {
            if (response.status === 401 && !isAuthRequest) {
                window.TrainerAuth.logout(true);
            }
            throw new TrainerApiError(
                response.status,
                (data && data.message) || messageFor(response.status),
                data
            );
        }
        return data || {};
    }

    function trainerUrl(path) {
        return window.TrainerConfig.trainerApiBaseUrl +
            window.TrainerConfig.trainerApiPath + path;
    }

    window.TrainerAPI = {
        TrainerApiError: TrainerApiError,
        login: function (username, password) {
            return request(
                window.TrainerConfig.loginUrl,
                { method: "POST", body: JSON.stringify({ username: username, password: password }) },
                true
            );
        },
        getProfile: function () {
            return request(trainerUrl("/profile"), { method: "GET" });
        },
        updateProfile: function (trainerProfile) {
            var allowed = ["bio", "specialization", "certifications", "experience"];
            var safeProfile = {};
            allowed.forEach(function (field) {
                if (Object.prototype.hasOwnProperty.call(trainerProfile, field)) safeProfile[field] = trainerProfile[field];
            });
            return request(
                trainerUrl("/profile"),
                { method: "PUT", body: JSON.stringify({ trainerProfile: safeProfile }) }
            );
        },
        getClients: function () {
            return request(trainerUrl("/clients"), { method: "GET" });
        },
        getClient: function (clientId) {
            return request(trainerUrl("/clients/" + encodeURIComponent(clientId)), { method: "GET" });
        },
        getClientAssessment: function (clientId) {
            return request(
                trainerUrl("/clients/" + encodeURIComponent(clientId) + "/assessment"),
                { method: "GET" }
            );
        },
        assignClient: function (clientId) {
            return request(
                trainerUrl("/clients/" + encodeURIComponent(clientId) + "/assign"),
                { method: "POST", body: JSON.stringify({}) }
            );
        },
        unassignClient: function (clientId) {
            return request(
                trainerUrl("/clients/" + encodeURIComponent(clientId) + "/assign"),
                { method: "DELETE" }
            );
        }
    };
}());
