// =========================
// CHECK LOGIN
// =========================

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    window.location.href = "index.html";
}


// =========================
// GET CURRENT USER
// =========================

const username =
    localStorage.getItem("username");

if (!username) {

    window.location.href = "index.html";
}


// =========================
// GET ELEMENTS
// =========================

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


// =========================
// DISPLAY USERNAME
// =========================

usernameDisplay.textContent =
    username;


// =========================
// STORAGE KEY
// =========================

const progressStorageKey =
    "progress_" + username;


// =========================
// GET FITNESS PROFILE
// =========================

const savedProfile =
    localStorage.getItem(
        "fitnessProfile_" + username
    );


if (!savedProfile) {

    alert(
        "Please complete your fitness assessment first."
    );

    window.location.href =
        "assessment.html";
}

// =========================
// SET DATE LIMITS
// =========================

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

progressDate.value =
    todayString;


// User can select today or any past date

progressDate.max =
    todayString;

// =========================
// LOAD PROGRESS
// =========================

function getProgressRecords() {

    const savedProgress =
        localStorage.getItem(
            progressStorageKey
        );


    if (!savedProgress) {

        return [];
    }


    try {

        return JSON.parse(
            savedProgress
        );

    } catch (error) {

        return [];
    }
}


// =========================
// SAVE PROGRESS
// =========================

function saveProgressRecords(
    records
) {

    localStorage.setItem(
        progressStorageKey,
        JSON.stringify(records)
    );
}


// =========================
// DISPLAY SUMMARY
// =========================

function updateSummary(
    records
) {

    if (records.length === 0) {

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


    /*
        Records are sorted from
        oldest to newest.
    */

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
        Number(firstRecord.weight);

    const latestWeight =
        Number(latestRecord.weight);


    const change =
        latestWeight -
        firstWeight;


    startingWeight.textContent =
        firstWeight.toFixed(1);


    currentWeight.textContent =
        latestWeight.toFixed(1);


    if (change > 0) {

        weightChange.textContent =
            "+" + change.toFixed(1) + " kg";

        weightChange.className =
            "changePositive";

    } else if (change < 0) {

        weightChange.textContent =
            change.toFixed(1) + " kg";

        weightChange.className =
            "changeNegative";

    } else {

        weightChange.textContent =
            "0 kg";

        weightChange.className = "";
    }


    if (
        latestRecord.bodyFat !== null &&
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


// =========================
// DISPLAY TABLE
// =========================

function displayProgress() {

    const records =
        getProgressRecords();


    progressTableBody.innerHTML =
        "";


    if (records.length === 0) {

        emptyMessage.style.display =
            "block";

        updateSummary(records);

        return;
    }


    emptyMessage.style.display =
        "none";


    const sortedRecords =
        [...records].sort(
            function (a, b) {

                return b.date.localeCompare(
                    a.date
                );

            }
        );


    sortedRecords.forEach(
        function (record) {

            const row =
                document.createElement("tr");


            // =========================
            // DATE
            // =========================

            const dateCell =
                document.createElement("td");

            dateCell.textContent =
                formatDate(record.date);


            // =========================
            // WEIGHT
            // =========================

            const weightCell =
                document.createElement("td");

            weightCell.textContent =
                Number(
                    record.weight
                ).toFixed(1) + " kg";


            // =========================
            // BODY FAT
            // =========================

            const bodyFatCell =
                document.createElement("td");


            if (
                record.bodyFat !== null &&
                record.bodyFat !== ""
            ) {

                bodyFatCell.textContent =
                    Number(
                        record.bodyFat
                    ).toFixed(1) + "%";

            } else {

                bodyFatCell.textContent =
                    "--";
            }


            // =========================
            // WEIGHT CHANGE
            // =========================

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

            } else {

                if (change > 0) {

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
            }


            // =========================
            // DELETE
            // =========================

            const actionCell =
                document.createElement("td");


            const deleteButton =
                document.createElement("button");


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


            // =========================
            // ADD ROW
            // =========================

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


    updateSummary(records);
}


// =========================
// FORMAT DATE
// =========================

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


// =========================
// CALCULATE CHANGE
// =========================

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

                return record.id ===
                    currentRecord.id;

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


// =========================
// DELETE PROGRESS
// =========================

function deleteProgress(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this progress record?"
        );


    if (!confirmed) {

        return;
    }


    let records =
        getProgressRecords();


    records =
        records.filter(
            function (record) {

                return record.id !== id;

            }
        );


    saveProgressRecords(records);

    displayProgress();
}


// =========================
// FORM SUBMIT
// =========================

progressForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // =========================
        // GET VALUES
        // =========================

        const date =
            progressDate.value;

        const weight =
            parseFloat(
                progressWeight.value
            );


        let bodyFat =
            progressBodyFat.value;


        if (
            bodyFat === ""
        ) {

            bodyFat = null;

        } else {

            bodyFat =
                parseFloat(bodyFat);
        }


        // =========================
        // VALIDATE
        // =========================

        if (!date) {

            formMessage.textContent =
                "Please select a date.";

            return;
        }
        // =========================
        // PREVENT FUTURE DATE
        // =========================

        if (date > todayString) {

            formMessage.textContent =
            "You cannot add progress for a future date.";

            return;
        }

        if (
            !weight ||
            weight <= 0
        ) {

            formMessage.textContent =
                "Please enter a valid weight.";

            return;
        }


        if (
            bodyFat !== null &&
            (
                bodyFat <= 0 ||
                bodyFat >= 70
            )
        ) {

            formMessage.textContent =
                "Please enter a valid body-fat percentage.";

            return;
        }


        // =========================
        // GET RECORDS
        // =========================

        const records =
            getProgressRecords();


        // =========================
        // CHECK DUPLICATE DATE
        // =========================

        const duplicate =
            records.some(
                function (record) {

                    return record.date ===
                        date;

                }
            );


        if (duplicate) {

            formMessage.textContent =
                "You already have a progress record for this date.";

            return;
        }


        // =========================
        // CREATE RECORD
        // =========================

        const newRecord = {

            id:
                Date.now(),

            date:
                date,

            weight:
                weight,

            bodyFat:
                bodyFat
        };


        // =========================
        // ADD RECORD
        // =========================

        records.push(
            newRecord
        );


        // =========================
        // SAVE
        // =========================

        saveProgressRecords(
            records
        );


        // =========================
        // SUCCESS
        // =========================

        formMessage.textContent =
            "Progress saved successfully!";


        // =========================
        // RESET FORM
        // =========================

        progressWeight.value =
            "";

        progressBodyFat.value =
            "";


        // =========================
        // REFRESH
        // =========================

        displayProgress();

    }
);


// =========================
// PROFILE
// =========================

profileButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "profile.html";

    }
);


// =========================
// LOGOUT
// =========================

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


// =========================
// INITIAL LOAD
// =========================

displayProgress();