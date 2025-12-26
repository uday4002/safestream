const fs = require("fs");
const path = require("path");
const {
    createVideo,
    listAllVideos,
    listMyVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    processVideo
} = require("./video.service");

const uploadVideo = async (req, res) => {
    try {
        const video = await createVideo({
            title: req.body.title,
            description: req.body.description || "",
            ownerId: req.user.id,
            file: req.file
        });
        processVideo(video._id, req.user.id);
        res.status(201).json({ success: true, data: video });
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
};

const getVideos = async (req, res) => {
    try {
        const videos = await listAllVideos();
        res.json({ success: true, data: videos });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch videos" });
    }
};

const getMyVideos = async (req, res) => {
    try {
        const videos = await listMyVideos(req.user.id);
        res.json({ success: true, data: videos });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your videos" });
    }
};

const updateVideoDetails = async (req, res) => {
    try {
        const video = await getVideoById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Logic: Admin can do anything, Editor only their own
        if (req.user.role !== "admin" && video.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this video" });
        }

        const updatedVideo = await updateVideo(req.params.id, {
            title: req.body.title || video.title,
            description: req.body.description || video.description
        });
        res.json({ success: true, data: updatedVideo });
    } catch (err) {
        res.status(500).json({ message: "Failed to update video" });
    }
};

const deleteVideoById = async (req, res) => {
    try {
        const video = await getVideoById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        if (req.user.role !== "admin" && video.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this video" });
        }

        if (fs.existsSync(video.filePath)) {
            fs.unlinkSync(video.filePath);
        }

        await deleteVideo(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete video" });
    }
};

const flagVideo = async (req, res) => {
    try {
        const updatedVideo = await updateVideo(req.params.id, {
            status: "FLAGGED",
            sensitivity: "FLAGGED"
        });
        res.json({ success: true, data: updatedVideo });
    } catch (err) {
        res.status(500).json({ message: "Failed to flag video" });
    }
};

const unflagVideo = async (req, res) => {
    try {
        const updatedVideo = await updateVideo(req.params.id, {
            status: "SAFE",
            sensitivity: "SAFE"
        });
        res.json({ success: true, data: updatedVideo });
    } catch (err) {
        res.status(500).json({ message: "Failed to unflag video" });
    }
};

module.exports = {
    uploadVideo,
    getVideos,
    getMyVideos,
    flagVideo,
    unflagVideo,
    updateVideo: updateVideoDetails,
    deleteVideo: deleteVideoById
};