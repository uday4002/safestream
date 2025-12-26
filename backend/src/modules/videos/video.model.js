const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        originalFileName: {
            type: String,
            required: true
        },
        storedFileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["UPLOADED", "PROCESSING", "SAFE", "FLAGGED"],
            default: "UPLOADED",
            index: true
        },
        sensitivity: {
            type: String,
            enum: ["SAFE", "FLAGGED", "UNKNOWN"],
            default: "UNKNOWN"
        },
        size: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Video", videoSchema);
