const Video = require("./video.model");
const { emitProgress, emitCompleted } = require("../../sockets");

const createVideo = async ({ title, description, ownerId, file }) => {
    return await Video.create({
        title,
        description,
        ownerId,
        originalFileName: file.originalname,
        storedFileName: file.filename,
        filePath: file.path,
        size: file.size,
        status: "PROCESSING"
    });
};

const listAllVideos = async () => {
    return Video.find().sort({ createdAt: -1 });
};

const listMyVideos = async (userId) => {
    return Video.find({ ownerId: userId }).sort({ createdAt: -1 });
};

const getVideoById = async (id) => {
    return await Video.findById(id);
};

const updateVideo = async (id, updateData) => {
    return await Video.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteVideo = async (id) => {
    return await Video.findByIdAndDelete(id);
};

const processVideo = async (videoId, userId) => {
    try {
        const steps = ["Analyzing", "Checking", "Reporting"];
        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 1000));
            emitProgress(userId, videoId, Math.round(((i + 1) / steps.length) * 100));
        }

        const isSafe = Math.random() > 0.2;
        const status = isSafe ? "SAFE" : "FLAGGED";

        await updateVideo(videoId, { status, sensitivity: status });
        emitCompleted(userId, videoId, status, 100);
    } catch (error) {
        await updateVideo(videoId, { status: "ERROR" });
    }
};

module.exports = {
    createVideo,
    listAllVideos,
    listMyVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    processVideo
};