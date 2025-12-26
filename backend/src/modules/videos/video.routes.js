const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../../middlewares/auth.middleware");
const { rbacMiddleware } = require("../../middlewares/rbac.middleware");
const {
    uploadVideo,
    getVideos,
    getMyVideos,
    flagVideo,
    unflagVideo,
    updateVideo,
    deleteVideo
} = require("./video.controller");
const { streamVideo } = require("./video.stream");

const storage = multer.diskStorage({
    destination: "/tmp/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Public/Viewer routes
router.get("/", authMiddleware, getVideos);
router.get("/:id/stream", streamVideo);

// Editor/Admin only: Own videos
router.get("/my-videos", authMiddleware, rbacMiddleware(["editor", "admin"]), getMyVideos);

// Editor/Admin: Flagging
router.put("/:id/flag", authMiddleware, rbacMiddleware(["editor", "admin"]), flagVideo);
router.put("/:id/unflag", authMiddleware, rbacMiddleware(["editor", "admin"]), unflagVideo);

// Management (Controller checks ownership for Editors)
router.post("/upload", authMiddleware, rbacMiddleware(["editor", "admin"]), upload.single("video"), uploadVideo);
router.put("/:id", authMiddleware, rbacMiddleware(["editor", "admin"]), updateVideo);
router.delete("/:id", authMiddleware, rbacMiddleware(["editor", "admin"]), deleteVideo);

module.exports = router;