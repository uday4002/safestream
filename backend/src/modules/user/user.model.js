const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false // important: password never returned by default
        },
        role: {
            type: String,
            enum: ["viewer", "editor", "admin"],
            default: "viewer"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
