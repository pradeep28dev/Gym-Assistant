const mongoose = require("mongoose");

const trainerProfileSchema = new mongoose.Schema(
    {
        bio: { type: String, default: "", trim: true },
        specialization: { type: String, default: "", trim: true },
        certifications: { type: [String], default: [] },
        experience: { type: String, default: "", trim: true }
    },
    { _id: false }
);

const fitnessProfileSchema = new mongoose.Schema(
    {
        gender: { type: String, default: "" },
        age: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        weight: { type: Number, default: 0 },
        neck: { type: Number, default: 0 },
        waist: { type: Number, default: 0 },
        hip: { type: Number, default: 0 },
        bodyFat: { type: Number, default: 0 },
        activity: { type: String, default: "" },
        experience: { type: String, default: "" },
        goal: { type: String, default: "" }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ["client", "trainer", "admin"], default: "client", required: true },
        gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", default: null, index: true },
        assignedTrainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
        trainerProfile: { type: trainerProfileSchema, default: () => ({}) },
        fitnessProfile: { type: fitnessProfileSchema, default: () => ({}) }
    },
    {
        collection: "users",
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
