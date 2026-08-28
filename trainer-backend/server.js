const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDatabase = require("./config/database");
const trainerRoutes = require("./routes/trainers");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/api/trainers", trainerRoutes);

app.get("/", (req, res) => {
    res.send("Gym Assistant Trainer Backend is running!");
});

if (require.main === module) {
    connectDatabase()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Trainer backend running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Trainer backend startup failed:", error.message);
            process.exitCode = 1;
        });
}

module.exports = app;
