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

const dailyTrackingButton =
    document.getElementById(
        "dailyTrackingButton"
    );

const weeklyTrackingButton =
    document.getElementById(
        "weeklyTrackingButton"
    );

const recommendedPaceValue =
    document.getElementById(
        "recommendedPaceValue"
    );

const recommendedPaceHint =
    document.getElementById(
        "recommendedPaceHint"
    );

const estimatedRateValue =
    document.getElementById(
        "estimatedRateValue"
    );

const estimatedRateHint =
    document.getElementById(
        "estimatedRateHint"
    );

const calorieShiftValue =
    document.getElementById(
        "calorieShiftValue"
    );

const calorieShiftHint =
    document.getElementById(
        "calorieShiftHint"
    );

const paceAlert =
    document.getElementById(
        "paceAlert"
    );

const progressFormTitle =
    document.getElementById(
        "progressFormTitle"
    );

const progressFormHint =
    document.getElementById(
        "progressFormHint"
    );

const progressChart =
    document.getElementById(
        "progressChart"
    );

const progressChartTitle =
    document.getElementById(
        "progressChartTitle"
    );

const chartEmptyMessage =
    document.getElementById(
        "chartEmptyMessage"
    );


let fitnessProfile = null;

let trackingMode =
    localStorage.getItem(
        "progressTrackingMode"
    ) === "weekly"
        ? "weekly"
        : "daily";


const KCAL_PER_KG_FAT = 7700;


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


        fitnessProfile =
            profile;


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


function parseDate(dateString) {

    const parts =
        String(dateString)
            .split("-");

    if (parts.length !== 3) {

        return new Date(dateString);

    }

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
        12,
        0,
        0
    );

}


function daysBetween(startDate, endDate) {

    const start =
        parseDate(startDate);

    const end =
        parseDate(endDate);

    const ms =
        end.getTime() -
        start.getTime();

    return Math.max(
        1,
        Math.round(
            ms / (1000 * 60 * 60 * 24)
        )
    );

}


function getMondayKey(dateString) {

    const date =
        parseDate(dateString);

    const weekday =
        date.getDay() === 0
            ? 6
            : date.getDay() - 1;

    date.setDate(
        date.getDate() - weekday
    );

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
        year + "-" + month + "-" + day
    );

}


function sortByDate(records) {

    return [...records].sort(
        function (a, b) {

            return String(a.date)
                .localeCompare(
                    String(b.date)
                );

        }
    );

}


function getChartPoints(records) {

    const sorted =
        sortByDate(records);

    if (trackingMode !== "weekly") {

        return sorted.map(
            function (record) {

                return {

                    date: record.date,

                    weight: Number(
                        record.weight
                    ),

                    bodyFat:
                        record.bodyFat,

                    count: 1,

                    label:
                        formatDate(
                            record.date
                        )

                };

            }
        );

    }

    const weeks = {};

    sorted.forEach(
        function (record) {

            const key =
                getMondayKey(
                    record.date
                );

            if (!weeks[key]) {

                weeks[key] = [];

            }

            weeks[key].push(
                record
            );

        }
    );

    return Object.keys(weeks)
        .sort()
        .map(
            function (key) {

                const entries =
                    weeks[key];

                let weightSum = 0;

                let fatSum = 0;

                let fatCount = 0;

                entries.forEach(
                    function (record) {

                        weightSum +=
                            Number(
                                record.weight
                            );

                        if (
                            record.bodyFat !== null &&
                            record.bodyFat !== undefined &&
                            record.bodyFat !== ""
                        ) {

                            fatSum +=
                                Number(
                                    record.bodyFat
                                );

                            fatCount++;

                        }

                    }
                );

                return {

                    date: key,

                    weight:
                        weightSum /
                        entries.length,

                    bodyFat:
                        fatCount > 0
                            ? fatSum / fatCount
                            : null,

                    count:
                        entries.length,

                    label:
                        "Week of " +
                        formatDate(key) +
                        " avg"

                };

            }
        );

}


function getHealthyTargets(weightKg) {

    const weight =
        Number(weightKg) > 0
            ? Number(weightKg)
            : 70;

    const goal =
        fitnessProfile &&
        fitnessProfile.goal
            ? fitnessProfile.goal
            : "maintenance";

    if (goal === "weight-loss") {

        const recommended =
            Math.min(
                0.75,
                Math.max(
                    0.25,
                    weight * 0.007
                )
            );

        return {

            goal: goal,

            direction: "loss",

            recommendedKg: recommended,

            alertKg: Math.min(
                1,
                weight * 0.01
            ),

            label:
                "lose about " +
                recommended.toFixed(2) +
                " kg / week"

        };

    }

    if (goal === "muscle-gain") {

        const recommended =
            Math.min(
                0.4,
                Math.max(
                    0.2,
                    weight * 0.0025
                )
            );

        return {

            goal: goal,

            direction: "gain",

            recommendedKg: recommended,

            alertKg: Math.min(
                0.75,
                weight * 0.0075
            ),

            label:
                "gain about " +
                recommended.toFixed(2) +
                " kg / week"

        };

    }

    return {

        goal: goal,

        direction: "maintain",

        recommendedKg: 0,

        alertKg: 0.5,

        label:
            "stay within ±0.25 kg / week"

    };

}


function getWeeklyRate(fromRecord, toRecord) {

    if (!fromRecord || !toRecord) {

        return null;

    }

    const days =
        daysBetween(
            fromRecord.date,
            toRecord.date
        );

    const change =
        Number(toRecord.weight) -
        Number(fromRecord.weight);

    return {

        days: days,

        changeKg: change,

        weeklyKg:
            (change / days) * 7

    };

}


function evaluatePace(weeklyKg, weightKg) {

    const targets =
        getHealthyTargets(weightKg);

    if (weeklyKg === null) {

        return {

            targets: targets,

            alert: false,

            message: ""

        };

    }

    const absWeekly =
        Math.abs(weeklyKg);

    if (
        targets.direction === "loss" &&
        weeklyKg > 0.35
    ) {

        return {

            targets: targets,

            alert: true,

            severity: "warning",

            message:
                "Your logs show weight gain, but your goal is fat loss. A small surplus can be water or muscle — keep the weekly change near " +
                targets.recommendedKg.toFixed(2) +
                " kg down, not a sudden jump up."

        };

    }

    if (
        targets.direction === "gain" &&
        weeklyKg < -0.35
    ) {

        return {

            targets: targets,

            alert: true,

            severity: "warning",

            message:
                "Your logs show weight dropping while your goal is muscle gain. Rapid loss can cost muscle. Aim to " +
                targets.label +
                " with a modest surplus."

        };

    }

    if (absWeekly > targets.alertKg) {

        const kind =
            weeklyKg < 0
                ? "loss"
                : "gain";

        return {

            targets: targets,

            alert: true,

            severity: "alert",

            message:
                "This pace is faster than a healthy " +
                kind +
                " rate (" +
                absWeekly.toFixed(2) +
                " kg/week). Stay near " +
                targets.recommendedKg.toFixed(2) +
                " kg/week. Faster swings often mean water, muscle loss, or extra fat — not lasting progress."

        };

    }

    return {

        targets: targets,

        alert: false,

        message: ""

    };

}


function formatSignedKg(value) {

    const number =
        Number(value);

    if (number > 0) {

        return (
            "+" +
            number.toFixed(2) +
            " kg"
        );

    }

    return (
        number.toFixed(2) +
        " kg"
    );

}


function applyTrackingMode() {

    if (dailyTrackingButton) {

        dailyTrackingButton.classList.toggle(
            "active",
            trackingMode === "daily"
        );

    }

    if (weeklyTrackingButton) {

        weeklyTrackingButton.classList.toggle(
            "active",
            trackingMode === "weekly"
        );

    }

    if (progressFormTitle) {

        progressFormTitle.textContent =
            trackingMode === "weekly"
                ? "Add Weekly Check-in"
                : "Add Today's Progress";

    }

    if (progressFormHint) {

        progressFormHint.textContent =
            trackingMode === "weekly"
                ? "Log as often as you like. Weekly view uses the average weight of every weigh-in in that week."
                : "Daily weight moves with water and food. Use the graph for the trend, not a single morning.";

    }

    if (progressChartTitle) {

        progressChartTitle.textContent =
            trackingMode === "weekly"
                ? "Weekly average weight"
                : "Daily weight trend";

    }

    if (chartEmptyMessage) {

        chartEmptyMessage.textContent =
            trackingMode === "weekly"
                ? "Add a weigh-in to see your weekly average trend."
                : "Add a weigh-in to see your graph.";

    }

}


function updateHealthyPace(records) {

    const sorted =
        sortByDate(records || []);

    const latestWeight =
        sorted.length
            ? Number(
                sorted[
                    sorted.length - 1
                ].weight
            )
            : (
                fitnessProfile
                    ? Number(
                        fitnessProfile.weight
                    )
                    : 70
            );

    const targets =
        getHealthyTargets(
            latestWeight
        );

    const weeklyKcal =
        targets.recommendedKg *
        KCAL_PER_KG_FAT;

    const dailyKcal =
        weeklyKcal / 7;

    if (recommendedPaceValue) {

        recommendedPaceValue.textContent =
            targets.direction === "maintain"
                ? "±0.25 kg / wk"
                : (
                    (
                        targets.direction === "gain"
                            ? "+"
                            : "−"
                    ) +
                    targets.recommendedKg.toFixed(2) +
                    " kg / wk"
                );

    }

    if (recommendedPaceHint) {

        recommendedPaceHint.textContent =
            "Healthy target: " +
            targets.label +
            ". Alert if you exceed " +
            targets.alertKg.toFixed(2) +
            " kg / week.";

    }

    let rate = null;

    const trendPoints =
        getChartPoints(sorted);

    if (trendPoints.length >= 2) {

        const fromPoint =
            trendPoints[
                trendPoints.length - 2
            ];

        const toPoint =
            trendPoints[
                trendPoints.length - 1
            ];

        rate =
            getWeeklyRate(
                {
                    date: fromPoint.date,
                    weight: fromPoint.weight
                },
                {
                    date: toPoint.date,
                    weight: toPoint.weight
                }
            );

    }

    if (estimatedRateValue) {

        estimatedRateValue.textContent =
            rate
                ? (
                    formatSignedKg(
                        rate.weeklyKg
                    ) +
                    " / wk"
                )
                : "--";

    }

    if (estimatedRateHint) {

        estimatedRateHint.textContent =
            rate
                ? (
                    formatSignedKg(
                        rate.changeKg
                    ) +
                    " over " +
                    rate.days +
                    " day" +
                    (
                        rate.days === 1
                            ? ""
                            : "s"
                    )
                )
                : "Log two weigh-ins to estimate your weekly rate.";

    }

    if (calorieShiftValue) {

        if (targets.direction === "maintain") {

            calorieShiftValue.textContent =
                "Eat at maintenance";

        }

        else {

            calorieShiftValue.textContent =
                (
                    targets.direction === "loss"
                        ? "−"
                        : "+"
                ) +
                Math.round(dailyKcal) +
                " kcal / day";

        }

    }

    if (calorieShiftHint) {

        calorieShiftHint.textContent =
            targets.direction === "loss"
                ? "A moderate deficit of about 7,700 kcal equals 1 kg of fat. Do not slash calories harder than this pace."
                : targets.direction === "gain"
                    ? "A small surplus supports muscle. Large jumps mostly add fat, not useful size."
                    : "Hold weight steady and let training quality drive progress.";

    }

    const evaluation =
        evaluatePace(
            rate ? rate.weeklyKg : null,
            latestWeight
        );

    if (paceAlert) {

        if (evaluation.alert) {

            paceAlert.classList.remove(
                "hidden"
            );

            paceAlert.classList.toggle(
                "warning",
                evaluation.severity === "warning"
            );

            paceAlert.textContent =
                evaluation.message;

        }

        else {

            paceAlert.classList.add(
                "hidden"
            );

            paceAlert.textContent =
                "";

        }

    }

}


function getPaceWarningForSave(
    records,
    date,
    weight
) {

    const sorted =
        sortByDate(records || []);

    const previous =
        [...sorted]
            .reverse()
            .find(
                function (record) {

                    return record.date < date;

                }
            );

    if (!previous) {

        return null;

    }

    const rate =
        getWeeklyRate(
            previous,
            {
                date: date,
                weight: weight
            }
        );

    const evaluation =
        evaluatePace(
            rate.weeklyKg,
            weight
        );

    if (!evaluation.alert) {

        return null;

    }

    return evaluation.message;

}


function renderProgressChart(records) {

    if (!progressChart) {

        return;

    }

    const points =
        getChartPoints(
            records || []
        );

    if (chartEmptyMessage) {

        chartEmptyMessage.style.display =
            points.length < 1
                ? "block"
                : "none";

    }

    if (points.length < 1) {

        progressChart.innerHTML =
            "";

        return;

    }

    const width = 860;

    const height = 280;

    const pad = {
        top: 24,
        right: 24,
        bottom: 44,
        left: 52
    };

    const innerWidth =
        width -
        pad.left -
        pad.right;

    const innerHeight =
        height -
        pad.top -
        pad.bottom;

    const weights =
        points.map(
            function (point) {

                return point.weight;

            }
        );

    let minWeight =
        Math.min.apply(null, weights);

    let maxWeight =
        Math.max.apply(null, weights);

    if (minWeight === maxWeight) {

        minWeight =
            minWeight - 1;

        maxWeight =
            maxWeight + 1;

    }

    const padY =
        (maxWeight - minWeight) * 0.18;

    minWeight -= padY;

    maxWeight += padY;

    function xFor(index) {

        if (points.length === 1) {

            return pad.left +
                innerWidth / 2;

        }

        return (
            pad.left +
            (
                index /
                (points.length - 1)
            ) * innerWidth
        );

    }

    function yFor(weight) {

        return (
            pad.top +
            (
                (maxWeight - weight) /
                (maxWeight - minWeight)
            ) * innerHeight
        );

    }

    const line =
        points.map(
            function (point, index) {

                return (
                    xFor(index).toFixed(1) +
                    "," +
                    yFor(point.weight).toFixed(1)
                );

            }
        ).join(" ");

    const area =
        xFor(0).toFixed(1) +
        "," +
        (pad.top + innerHeight).toFixed(1) +
        " " +
        line +
        " " +
        xFor(points.length - 1).toFixed(1) +
        "," +
        (pad.top + innerHeight).toFixed(1);

    const ticks = 4;

    let grid = "";

    for (
        let i = 0;
        i <= ticks;
        i++
    ) {

        const value =
            minWeight +
            (
                (maxWeight - minWeight) *
                (i / ticks)
            );

        const y =
            yFor(value);

        grid +=
            '<line x1="' +
            pad.left +
            '" y1="' +
            y.toFixed(1) +
            '" x2="' +
            (width - pad.right) +
            '" y2="' +
            y.toFixed(1) +
            '" stroke="rgba(255,255,255,0.06)" />' +
            '<text x="12" y="' +
            (y + 4).toFixed(1) +
            '" fill="#666" font-size="11">' +
            value.toFixed(1) +
            "</text>";

    }

    const labelStep =
        Math.max(
            1,
            Math.ceil(
                points.length / 6
            )
        );

    let labels = "";

    points.forEach(
        function (point, index) {

            if (
                index % labelStep !== 0 &&
                index !== points.length - 1
            ) {

                return;

            }

            labels +=
                '<text x="' +
                xFor(index).toFixed(1) +
                '" y="' +
                (height - 14) +
                '" fill="#777" font-size="11" text-anchor="middle">' +
                (
                    trackingMode === "weekly"
                        ? "Wk " +
                            formatDate(point.date)
                        : formatDate(point.date)
                ) +
                "</text>";

        }
    );

    const dots =
        points.map(
            function (point, index) {

                return (
                    '<circle class="chartPoint" cx="' +
                    xFor(index).toFixed(1) +
                    '" cy="' +
                    yFor(point.weight).toFixed(1) +
                    '" r="5" fill="#c40000" stroke="#ff2020" stroke-width="1.5">' +
                    "<title>" +
                    (
                        point.label ||
                        formatDate(point.date)
                    ) +
                    " · " +
                    point.weight.toFixed(1) +
                    " kg" +
                    (
                        trackingMode === "weekly"
                            ? " (" +
                                point.count +
                                " weigh-in" +
                                (
                                    point.count === 1
                                        ? ""
                                        : "s"
                                ) +
                                ")"
                            : ""
                    ) +
                    "</title>" +
                    "</circle>"
                );

            }
        ).join("");

    progressChart.innerHTML =
        '<svg viewBox="0 0 ' +
        width +
        " " +
        height +
        '" preserveAspectRatio="none">' +
        "<defs>" +
        '<linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#ff2020" stop-opacity="0.28" />' +
        '<stop offset="100%" stop-color="#ff2020" stop-opacity="0" />' +
        "</linearGradient>" +
        "</defs>" +
        grid +
        '<polygon points="' +
        area +
        '" fill="url(#weightFill)" />' +
        '<polyline points="' +
        line +
        '" fill="none" stroke="#ff2020" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />' +
        labels +
        dots +
        "</svg>";

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

        updateHealthyPace([]);

        renderProgressChart([]);

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

    updateHealthyPace(
        records
    );

    renderProgressChart(
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


            const existingRecords =
                await getProgressRecords();

            const paceWarning =
                getPaceWarningForSave(
                    existingRecords,
                    date,
                    weight
                );

            if (paceWarning) {

                const keepGoing =
                    confirm(
                        paceWarning +
                        "\n\nSave this weigh-in anyway?"
                    );

                if (!keepGoing) {

                    formMessage.textContent =
                        "Save cancelled. Adjust the pace and try again.";

                    return;

                }

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


function setTrackingMode(mode) {

    trackingMode =
        mode === "weekly"
            ? "weekly"
            : "daily";

    localStorage.setItem(
        "progressTrackingMode",
        trackingMode
    );

    applyTrackingMode();

    displayProgress();

}


if (dailyTrackingButton) {

    dailyTrackingButton.addEventListener(
        "click",
        function () {

            setTrackingMode("daily");

        }
    );

}


if (weeklyTrackingButton) {

    weeklyTrackingButton.addEventListener(
        "click",
        function () {

            setTrackingMode("weekly");

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


    applyTrackingMode();


    // ==================================================
    // LOAD PROGRESS FROM MONGODB
    // ==================================================

    await displayProgress();

}


// ==================================================
// START
// ==================================================

initializeProgress();
