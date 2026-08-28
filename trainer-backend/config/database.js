const mongoose = require("mongoose");

async function connectDatabase() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Trainer backend connected to MongoDB");
}

module.exports = connectDatabase;
