// ==================================================
// GYM ASSISTANT - PROGRESS.JS
// ==================================================


// ==================================================
// BACKEND API
// ==================================================

const BACKEND_URL =
    "https://gym-assistant-rb7h.onrender.com";

const API_URL =
    BACKEND_URL + "/api/progress";


// ==================================================
// CHECK LOGIN
// ==================================================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href =
        "index.html";

}


// ==================================================
// GET CURRENT USER
// ==================================================

const username =
    localStorage.getItem("username");

if (!username) {

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "index.html";

}


// ==================================================
// GET TOKEN
// ==================================================

const token =
    localStorage.getItem("token");

if (!token) {

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "username"
    );

    window.location.href =
        "index.html";

}


// ==================================================
// GET ELEMENTS
// ==================================================

const usernameDisplay =
    document.getElementById(
        "usernameDisplay"
    );

const startingWeight =
    document.getElementById(
        "startingWeight"
    );

const currentWeight =
    document.getElementById(
        "currentWeight"
    );

const weightChange =
    document.getElementById(
        "weightChange"
    );

const currentBodyFat =
    document.getElementById(
        "currentBodyFat"
    );

const progressForm =
    document.getElementById(
        "progressForm"
    );

const progressDate =
    document.getElementById(
        "progressDate"
    );

const progressWeight =
    document.getElementById(
        "progressWeight"
    );

const progressBodyFat =
    document.getElementById(
        "progressBodyFat"
    );

const progressTableBody =
    document.getElementById(
        "progressTableBody"
    );

const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );

const profileButton =
    document.getElementById(
        "profileButton"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


// ==================================================
// DISPLAY USERNAME
// ==================================================

if (usernameDisplay) {

    usernameDisplay.textContent =
        username;

}


// ==================================================
// AUTH HEADERS
// ==================================================

function getAuthHeaders() {

    return {

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


// ==================================================
// TODAY'S DATE
// ==================================================

function getTodayString() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


const todayString =
    getTodayString();


// ==================================================
// SET DATE LIMITS
// ==================================================

if (progressDate) {

    progressDate.value =
        todayString;

    progressDate.max =
        todayString;

}


// ==================================================
// FITNESS PROFILE CHECK
// ==================================================

async function checkFitnessProfile() {

    try {

        const response =
            await fetch(

                BACKEND_URL +
                "/api/profile/" +
                encodeURIComponent(
                    username
                ),

                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        // ==================================================
        // TOKEN EXPIRED / INVALID
        // ==================================================

        if (response.status === 401) {

            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "index.html";

            return false;

        }


        // ==================================================
        // PROFILE NOT FOUND
        // ==================================================

        if (!response.ok) {

            alert(
                "Please complete your fitness assessment first."
            );

            window.location.href =
                "assessment.html";

            return false;

        }


        const data =
            await response.json();


        const profile =
            data.profile;


        // ==================================================
        // CHECK REQUIRED PROFILE DATA
        // ==================================================

        if (
            !profile ||
            !profile.age ||
            !profile.height ||
            !profile.weight
        ) {

            alert(
                "Please complete your fitness assessment first."
            );

            window.location.href =
                "assessment.html";

            return false;

        }


        return true;

    }

    catch (error) {

        console.error(
            "Fitness profile check error:",
            error
        );


        if (formMessage) {

            formMessage.textContent =
                "Unable to connect to the server.";

        }


        return false;

    }

}


// ==================================================
// GET PROGRESS FROM MONGODB
// ==================================================

async function getProgressRecords() {

    try {

        const response =
            await fetch(

                API_URL +
                "/" +
                encodeURIComponent(
                    username
                ),

                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        // ==================================================
        // TOKEN ERROR
        // ==================================================

        if (response.status === 401) {

            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "index.html";

            return [];

        }


        // ==================================================
        // OTHER ERROR
        // ==================================================

        if (!response.ok) {

            const errorData =
                await response
                    .json()
                    .catch(
                        function () {
                            return {};
                        }
                    );


            throw new Error(

                errorData.message ||
                "Unable to fetch progress."

            );

        }


        const data =
            await response.json();


        return (
            Array.isArray(
                data.progress
            )
                ? data.progress
                : []
        );

    }

    catch (error) {

        console.error(
            "Progress fetch error:",
            error
        );


        if (formMessage) {

            formMessage.textContent =
                "Unable to load progress data.";

        }


        return [];

    }

}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(dateString) {

    if (!dateString) {

        return "--";

    }


    const parts =
        String(
            dateString
        ).split("-");


    if (
        parts.length !== 3
    ) {

        return dateString;

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


// ==================================================
// UPDATE SUMMARY
// ==================================================

function updateSummary(records) {

    if (
        !records ||
        records.length === 0
    ) {

        if (startingWeight) {

            startingWeight.textContent =
                "--";

        }

        if (currentWeight) {

            currentWeight.textContent =
                "--";

        }

        if (weightChange) {

            weightChange.textContent =
                "--";

            weightChange.className =
                "";

        }

        if (currentBodyFat) {

            currentBodyFat.textContent =
                "--";

        }

        return;

    }


    // ==================================================
    // SORT OLDEST → NEWEST
    // ==================================================

    const sortedRecords =
        [...records].sort(
            function (a, b) {

                return String(
                    a.date
                ).localeCompare(
                    String(b.date)
                );

            }
        );


    const firstRecord =
        sortedRecords[0];


    const latestRecord =
        sortedRecords[
            sortedRecords.length - 1
        ];


    const firstWeight =
        Number(
            firstRecord.weight
        );


    const latestWeight =
        Number(
            latestRecord.weight
        );


    const change =
        latestWeight -
        firstWeight;


    // ==================================================
    // STARTING WEIGHT
    // ==================================================

    if (startingWeight) {

        startingWeight.textContent =
            firstWeight.toFixed(1);

    }


    // ==================================================
    // CURRENT WEIGHT
    // ==================================================

    if (currentWeight) {

        currentWeight.textContent =
            latestWeight.toFixed(1);

    }


    // ==================================================
    // WEIGHT CHANGE
    // ==================================================

    if (weightChange) {

        if (change > 0) {

            weightChange.textContent =
                "+" +
                change.toFixed(1) +
                " kg";

            weightChange.className =
                "changePositive";

        }

        else if (change < 0) {

            weightChange.textContent =
                change.toFixed(1) +
                " kg";

            weightChange.className =
                "changeNegative";

        }

        else {

            weightChange.textContent =
                "0 kg";

            weightChange.className =
                "";

        }

    }


    // ==================================================
    // CURRENT BODY FAT
    // ==================================================

    if (currentBodyFat) {

        if (
            latestRecord.bodyFat !== null &&
            latestRecord.bodyFat !== undefined &&
            latestRecord.bodyFat !== ""
        ) {

            currentBodyFat.textContent =
                Number(
                    latestRecord.bodyFat
                ).toFixed(1);

        }

        else {

            currentBodyFat.textContent =
                "--";

        }

    }

}


// ==================================================
// CALCULATE CHANGE FROM PREVIOUS RECORD
// ==================================================

function calculateChange(
    currentRecord,
    records
) {

    const sortedRecords =
        [...records].sort(
            function (a, b) {

                return String(
                    a.date
                ).localeCompare(
                    String(b.date)
                );

            }
        );


    const currentIndex =
        sortedRecords.findIndex(
            function (record) {

                return (
                    String(record.id) ===
                    String(currentRecord.id)
                );

            }
        );


    if (
        currentIndex <= 0
    ) {

        return null;

    }


    const previousRecord =
        sortedRecords[
            currentIndex - 1
        ];


    return (
        Number(
            currentRecord.weight
        ) -
        Number(
            previousRecord.weight
        )
    );

}


// ==================================================
// DISPLAY PROGRESS TABLE
// ==================================================

async function displayProgress() {

    const records =
        await getProgressRecords();


    if (!progressTableBody) {

        return;

    }


    progressTableBody.innerHTML =
        "";


    // ==================================================
    // NO RECORDS
    // ==================================================

    if (
        !records ||
        records.length === 0
    ) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }


        updateSummary([]);

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    // ==================================================
    // SORT NEWEST → OLDEST
    // ==================================================

    const sortedRecords =
        [...records].sort(
            function (a, b) {

                return String(
                    b.date
                ).localeCompare(
                    String(a.date)
                );

            }
        );


    // ==================================================
    // CREATE TABLE ROWS
    // ==================================================

    sortedRecords.forEach(
        function (record) {

            const row =
                document.createElement(
                    "tr"
                );


            // ==================================================
            // DATE
            // ==================================================

            const dateCell =
                document.createElement(
                    "td"
                );

            dateCell.textContent =
                formatDate(
                    record.date
                );


            // ==================================================
            // WEIGHT
            // ==================================================

            const weightCell =
                document.createElement(
                    "td"
                );

            weightCell.textContent =
                Number(
                    record.weight
                ).toFixed(1) +
                " kg";


            // ==================================================
            // BODY FAT
            // ==================================================

            const bodyFatCell =
                document.createElement(
                    "td"
                );


            if (
                record.bodyFat !== null &&
                record.bodyFat !== undefined &&
                record.bodyFat !== ""
            ) {

                bodyFatCell.textContent =
                    Number(
                        record.bodyFat
                    ).toFixed(1) +
                    "%";

            }

            else {

                bodyFatCell.textContent =
                    "--";

            }


            // ==================================================
            // WEIGHT CHANGE
            // ==================================================

            const changeCell =
                document.createElement(
                    "td"
                );


            const change =
                calculateChange(
                    record,
                    records
                );


            if (change === null) {

                changeCell.textContent =
                    "--";

            }

            else if (change > 0) {

                changeCell.textContent =
                    "+" +
                    change.toFixed(1) +
                    " kg";

                changeCell.className =
                    "changePositive";

            }

            else if (change < 0) {

                changeCell.textContent =
                    change.toFixed(1) +
                    " kg";

                changeCell.className =
                    "changeNegative";

            }

            else {

                changeCell.textContent =
                    "0 kg";

            }


            // ==================================================
            // ACTION
            // ==================================================

            const actionCell =
                document.createElement(
                    "td"
                );


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";

            deleteButton.textContent =
                "Delete";

            deleteButton.className =
                "deleteButton";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteProgress(
                        record.id
                    );

                }
            );


            actionCell.appendChild(
                deleteButton
            );


            // ==================================================
            // ADD CELLS
            // ==================================================

            row.appendChild(
                dateCell
            );

            row.appendChild(
                weightCell
            );

            row.appendChild(
                bodyFatCell
            );

            row.appendChild(
                changeCell
            );

            row.appendChild(
                actionCell
            );


            progressTableBody.appendChild(
                row
            );

        }
    );


    // ==================================================
    // UPDATE SUMMARY
    // ==================================================

    updateSummary(
        records
    );

}


// ==================================================
// DELETE PROGRESS RECORD
// ==================================================

async function deleteProgress(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this progress record?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(

                API_URL +
                "/" +
                encodeURIComponent(
                    username
                ) +
                "/" +
                encodeURIComponent(
                    id
                ),

                {

                    method:
                        "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        const data =
            await response
                .json()
                .catch(
                    function () {
                        return {};
                    }
                );


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "index.html";

            return;

        }


        if (!response.ok) {

            if (formMessage) {

                formMessage.textContent =
                    data.message ||
                    "Unable to delete progress.";

            }

            return;

        }


        if (formMessage) {

            formMessage.textContent =
                "Progress record deleted successfully.";

        }


        // ==================================================
        // RELOAD FROM MONGODB
        // ==================================================

        await displayProgress();

    }

    catch (error) {

        console.error(
            "Progress delete error:",
            error
        );


        if (formMessage) {

            formMessage.textContent =
                "Unable to connect to the server.";

        }

    }

}


// ==================================================
// FORM SUBMIT
// ==================================================

if (progressForm) {

    progressForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================================
            // GET VALUES
            // ==================================================

            const date =
                progressDate
                    ? progressDate.value
                    : "";


            const weight =
                progressWeight
                    ? parseFloat(
                        progressWeight.value
                    )
                    : NaN;


            let bodyFat =
                progressBodyFat
                    ? progressBodyFat.value.trim()
                    : "";


            if (bodyFat === "") {

                bodyFat = null;

            }

            else {

                bodyFat =
                    parseFloat(
                        bodyFat
                    );

            }


            // ==================================================
            // VALIDATE DATE
            // ==================================================

            if (!date) {

                formMessage.textContent =
                    "Please select a date.";

                return;

            }


            // ==================================================
            // PREVENT FUTURE DATE
            // ==================================================

            if (
                date >
                todayString
            ) {

                formMessage.textContent =
                    "You cannot add progress for a future date.";

                return;

            }


            // ==================================================
            // VALIDATE WEIGHT
            // ==================================================

            if (
                isNaN(weight) ||
                weight <= 0
            ) {

                formMessage.textContent =
                    "Please enter a valid weight.";

                return;

            }


            // ==================================================
            // VALIDATE BODY FAT
            // ==================================================

            if (
                bodyFat !== null &&
                (
                    isNaN(bodyFat) ||
                    bodyFat <= 0 ||
                    bodyFat >= 70
                )
            ) {

                formMessage.textContent =
                    "Please enter a valid body-fat percentage.";

                return;

            }


            // ==================================================
            // GET SUBMIT BUTTON
            // ==================================================

            const submitButton =
                progressForm.querySelector(
                    'button[type="submit"]'
                );


            const originalButtonText =
                submitButton
                    ? submitButton.textContent
                    : "Save Progress";


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Saving...";

            }


            if (formMessage) {

                formMessage.textContent =
                    "Saving progress...";

            }


            // ==================================================
            // SAVE TO MONGODB
            // ==================================================

            try {

                const response =
                    await fetch(

                        API_URL,

                        {

                            method:
                                "POST",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({

                                    username:
                                        username,

                                    date:
                                        date,

                                    weight:
                                        weight,

                                    bodyFat:
                                        bodyFat

                                })

                        }

                    );


                const data =
                    await response
                        .json()
                        .catch(
                            function () {
                                return {};
                            }
                        );


                // ==================================================
                // TOKEN ERROR
                // ==================================================

                if (
                    response.status === 401
                ) {

                    localStorage.removeItem(
                        "isLoggedIn"
                    );

                    localStorage.removeItem(
                        "username"
                    );

                    localStorage.removeItem(
                        "token"
                    );

                    window.location.href =
                        "index.html";

                    return;

                }


                // ==================================================
                // BACKEND ERROR
                // ==================================================

                if (!response.ok) {

                    if (formMessage) {

                        formMessage.textContent =
                            data.message ||
                            "Unable to save progress.";

                    }

                    return;

                }


                // ==================================================
                // SUCCESS
                // ==================================================

                if (formMessage) {

                    formMessage.textContent =
                        "Progress saved successfully!";

                }


                // ==================================================
                // RESET FORM
                // ==================================================

                if (progressWeight) {

                    progressWeight.value =
                        "";

                }


                if (progressBodyFat) {

                    progressBodyFat.value =
                        "";

                }


                if (progressDate) {

                    progressDate.value =
                        todayString;

                }


                // ==================================================
                // IMPORTANT:
                // FETCH FRESH DATA FROM MONGODB
                // ==================================================

                await displayProgress();

            }

            catch (error) {

                console.error(
                    "Progress save error:",
                    error
                );


                if (formMessage) {

                    formMessage.textContent =
                        "Unable to connect to the server.";

                }

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        }
    );

}


// ==================================================
// PROFILE BUTTON
// ==================================================

if (profileButton) {

    profileButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                "profile.html";

        }
    );

}


// ==================================================
// LOGOUT
// ==================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "token"
            );


            window.location.href =
                "index.html";

        }
    );

}


// ==================================================
// INITIALIZE PROGRESS
// ==================================================

async function initializeProgress() {

    // ==================================================
    // CHECK FITNESS PROFILE
    // ==================================================

    const profileExists =
        await checkFitnessProfile();


    if (!profileExists) {

        return;

    }


    // ==================================================
    // LOAD PROGRESS FROM MONGODB
    // ==================================================

    await displayProgress();

}


// ==================================================
// START
// ==================================================

initializeProgress();
