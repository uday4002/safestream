const fs = require("fs");
const path = require("path");
const Video = require("../modules/videos/video.model");
const { getIO } = require("../sockets");

const PROCESSED_DIR = path.join(__dirname, "../../processed");

// --- Simple AI-like sensitivity analyzer ---
const analyzeSensitivity = (video) => {
    const sensitiveKeywords = ["adult", "explicit", "violence", "nsfw", "18+"];

    const fileName = video.originalFileName.toLowerCase();

    const keywordMatch = sensitiveKeywords.some(keyword =>
        fileName.includes(keyword)
    );

    const largeFile = video.size > 50 * 1024 * 1024; // >50MB
    const longVideo = video.size > 100 * 1024 * 1024; // proxy for duration

    if (keywordMatch || largeFile || longVideo) {
        return {
            result: "FLAGGED",
            confidence: 0.82
        };
    }

    return {
        result: "SAFE",
        confidence: 0.95
    };
};

const processVideo = async (videoId) => {
    const io = getIO();

    const video = await Video.findById(videoId);
    if (!video) return;

    video.status = "PROCESSING";
    await video.save();

    let progress = 0;

    const interval = setInterval(async () => {
        progress += 20;

        io.emit("video:progress", {
            videoId,
            progress
        });

        if (progress >= 100) {
            clearInterval(interval);

            // 🔥 AI-like sensitivity decision
            const analysis = analyzeSensitivity(video);

            video.status = analysis.result;
            video.sensitivity = analysis.result;
            video.confidenceScore = analysis.confidence;

            const newPath = path.join(PROCESSED_DIR, video.storedFileName);
            fs.renameSync(video.filePath, newPath);

            video.filePath = newPath;
            await video.save();

            io.emit("video:completed", {
                videoId,
                status: video.status,
                confidence: analysis.confidence
            });
        }
    }, 1000);
};

module.exports = { processVideo };
