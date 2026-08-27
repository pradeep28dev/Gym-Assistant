const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const workoutRoutes = require("./routes/workout");
const progressRoutes = require("./routes/progress");
const nutritionRoutes =
    require("./routes/nutrition");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());


// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/progress",progressRoutes);
app.use("/api", nutritionRoutes);
// ===============================
// MONGODB CONNECTION
// ===============================

console.log("Trying to connect to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.send("Gym Assistant Backend is running!");
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

