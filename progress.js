// ==================================================
// GYM ASSISTANT - PROGRESS.JS
// ==================================================


// ==================================================
// CHECK LOGIN
// ==================================================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href = "index.html";

}


// ==================================================
// GET CURRENT USER
// ==================================================

const username =
    localStorage.getItem("username");

if (!username) {

    localStorage.removeItem("isLoggedIn");

    window.location.href = "index.html";

}


// ==================================================
// API URL
// ==================================================

const API_URL =
    "http://localhost:5000/api/progress";


// ==================================================
// GET ELEMENTS
// ==================================================

const usernameDisplay =
    document.getElementById("usernameDisplay");

const startingWeight =
    document.getElementById("startingWeight");

const currentWeight =
    document.getElementById("currentWeight");

const weightChange =
    document.getElementById("weightChange");

const currentBodyFat =
    document.getElementById("currentBodyFat");

const progressForm =
    document.getElementById("progressForm");

const progressDate =
    document.getElementById("progressDate");

const progressWeight =
    document.getElementById("progressWeight");

const progressBodyFat =
    document.getElementById("progressBodyFat");

const progressTableBody =
    document.getElementById("progressTableBody");

const emptyMessage =
    document.getElementById("emptyMessage");

const formMessage =
    document.getElementById("formMessage");

const profileButton =
    document.getElementById("profileButton");

const logoutButton =
    document.getElementById("logoutButton");


// ==================================================
// DISPLAY USERNAME
// ==================================================

if (usernameDisplay) {

    usernameDisplay.textContent =
        username;

}


// ==================================================
// SET DATE LIMITS
// ==================================================

const today =
    new Date();


const year =
    today.getFullYear();


const month =
    String(
        today.getMonth() + 1
    ).padStart(2, "0");


const day =
    String(
        today.getDate()
    ).padStart(2, "0");


const todayString =
    `${year}-${month}-${day}`;


// Default date = today

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
                `http://localhost:5000/api/profile/${encodeURIComponent(username)}`
            );


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

    } catch (error) {

        console.error(
            "Fitness profile check error:",
            error
        );


        formMessage.textContent =
            "Unable to connect to the server.";


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
                `${API_URL}/${encodeURIComponent(username)}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to fetch progress."
            );

        }


        const data =
            await response.json();


        return data.progress || [];


    } catch (error) {

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
// UPDATE SUMMARY
// ==================================================

function updateSummary(records) {

    if (!records || records.length === 0) {

        startingWeight.textContent =
            "--";

        currentWeight.textContent =
            "--";

        weightChange.textContent =
            "--";

        currentBodyFat.textContent =
            "--";

        return;

    }


    // ==================================================
    // SORT OLDEST → NEWEST
    // ==================================================

    const sortedRecords =
        [...records].sort(
            function (a, b) {

                return a.date.localeCompare(
                    b.date
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

    startingWeight.textContent =
        firstWeight.toFixed(1);


    // ==================================================
    // CURRENT WEIGHT
    // ==================================================

    currentWeight.textContent =
        latestWeight.toFixed(1);


    // ==================================================
    // WEIGHT CHANGE
    // ==================================================

    if (change > 0) {

        weightChange.textContent =
            "+" +
            change.toFixed(1) +
            " kg";

        weightChange.className =
            "changePositive";

    } else if (change < 0) {

        weightChange.textContent =
            change.toFixed(1) +
            " kg";

        weightChange.className =
            "changeNegative";

    } else {

        weightChange.textContent =
            "0 kg";

        weightChange.className =
            "";

    }


    // ==================================================
    // BODY FAT
    // ==================================================

    if (
        latestRecord.bodyFat !== null &&
        latestRecord.bodyFat !== undefined &&
        latestRecord.bodyFat !== ""
    ) {

        currentBodyFat.textContent =
            Number(
                latestRecord.bodyFat
            ).toFixed(1);

    } else {

        currentBodyFat.textContent =
            "--";

    }

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

                return b.date.localeCompare(
                    a.date
                );

            }
        );


    // ==================================================
    // CREATE TABLE ROWS
    // ==================================================

    sortedRecords.forEach(
        function (record) {

            const row =
                document.createElement("tr");


            // ==================================================
            // DATE
            // ==================================================

            const dateCell =
                document.createElement("td");


            dateCell.textContent =
                formatDate(
                    record.date
                );


            // ==================================================
            // WEIGHT
            // ==================================================

            const weightCell =
                document.createElement("td");


            weightCell.textContent =
                Number(
                    record.weight
                ).toFixed(1) +
                " kg";


            // ==================================================
            // BODY FAT
            // ==================================================

            const bodyFatCell =
                document.createElement("td");


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

            } else {

                bodyFatCell.textContent =
                    "--";

            }


            // ==================================================
            // WEIGHT CHANGE
            // ==================================================

            const changeCell =
                document.createElement("td");


            const change =
                calculateChange(
                    record,
                    records
                );


            if (change === null) {

                changeCell.textContent =
                    "--";

            } else if (change > 0) {

                changeCell.textContent =
                    "+" +
                    change.toFixed(1) +
                    " kg";

                changeCell.className =
                    "changePositive";

            } else if (change < 0) {

                changeCell.textContent =
                    change.toFixed(1) +
                    " kg";

                changeCell.className =
                    "changeNegative";

            } else {

                changeCell.textContent =
                    "0 kg";

            }


            // ==================================================
            // DELETE
            // ==================================================

            const actionCell =
                document.createElement("td");


            const deleteButton =
                document.createElement("button");


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

    updateSummary(records);

}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(dateString) {

    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

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
// CALCULATE WEIGHT CHANGE
// ==================================================

function calculateChange(
    currentRecord,
    records
) {

    const sortedRecords =
        [...records].sort(
            function (a, b) {

                return a.date.localeCompare(
                    b.date
                );

            }
        );


    const currentIndex =
        sortedRecords.findIndex(
            function (record) {

                return String(record.id) ===
                    String(currentRecord.id);

            }
        );


    if (currentIndex <= 0) {

        return null;

    }


    const previousRecord =
        sortedRecords[
            currentIndex - 1
        ];


    return (
        Number(currentRecord.weight) -
        Number(previousRecord.weight)
    );

}


// ==================================================
// DELETE PROGRESS
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
                `${API_URL}/${encodeURIComponent(username)}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            formMessage.textContent =
                data.message ||
                "Unable to delete progress.";

            return;

        }


        formMessage.textContent =
            "Progress record deleted successfully.";


        await displayProgress();


    } catch (error) {

        console.error(
            "Progress delete error:",
            error
        );


        formMessage.textContent =
            "Unable to connect to the server.";

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
                progressDate.value;


            const weight =
                parseFloat(
                    progressWeight.value
                );


            let bodyFat =
                progressBodyFat.value;


            if (bodyFat === "") {

                bodyFat = null;

            } else {

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

            if (date > todayString) {

                formMessage.textContent =
                    "You cannot add progress for a future date.";

                return;

            }


            // ==================================================
            // VALIDATE WEIGHT
            // ==================================================

            if (
                !weight ||
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
            // BUTTON STATE
            // ==================================================

            const originalButtonText =
                progressForm.querySelector(
                    'button[type="submit"]'
                )?.textContent;


            const submitButton =
                progressForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Saving...";

            }


            formMessage.textContent =
                "Saving progress...";


            // ==================================================
            // SEND TO BACKEND
            // ==================================================

            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

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
                    await response.json();


                // ==================================================
                // ERROR
                // ==================================================

                if (!response.ok) {

                    formMessage.textContent =
                        data.message ||
                        "Unable to save progress.";

                    return;

                }


                // ==================================================
                // SUCCESS
                // ==================================================

                formMessage.textContent =
                    "Progress saved successfully!";


                // ==================================================
                // RESET FORM
                // ==================================================

                progressWeight.value =
                    "";

                progressBodyFat.value =
                    "";


                progressDate.value =
                    todayString;


                // ==================================================
                // REFRESH TABLE
                // ==================================================

                await displayProgress();


            } catch (error) {

                console.error(
                    "Progress save error:",
                    error
                );


                formMessage.textContent =
                    "Unable to connect to the server.";

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText ||
                        "Save Progress";

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
        function () {

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
        function () {

            localStorage.removeItem(
                "isLoggedIn"
            );


            localStorage.removeItem(
                "username"
            );


            window.location.href =
                "index.html";

        }
    );

}


// ==================================================
// INITIAL LOAD
// ==================================================

async function initializeProgress() {

    const profileExists =
        await checkFitnessProfile();


    if (!profileExists) {

        return;

    }


    await displayProgress();

}


initializeProgress();