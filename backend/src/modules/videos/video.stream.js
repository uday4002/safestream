const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken"); // Make sure to import this
const Video = require("./video.model");

const streamVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.query.token; // Get token from URL ?token=...

        // 1. Manual Auth Check (since authMiddleware was removed)
        let user = req.user; // If middleware exists, use it

        if (!user && token) {
            try {
                // Verify the token manually
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user = decoded;
            } catch (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }
        }

        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // 2. Fetch Video
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // 3. Status Check
        if (!["SAFE", "FLAGGED", "approved"].includes(video.status)) {
            return res.status(400).json({ message: "Video not ready for streaming" });
        }

        // 4. RBAC Check: Block viewers from FLAGGED videos
        if (video.status === "FLAGGED" && user.role === "viewer") {
            return res.status(403).json({
                message: "This video is flagged and restricted for your role"
            });
        }

        // 5. Multi-tenant Check
        // Allow if: User is Admin OR User is the Owner OR (Video is SAFE and user is authenticated)
        const isOwner = video.ownerId.toString() === user.id;
        const isAdmin = user.role === "admin";
        const isSafe = video.status === "SAFE" || video.status === "approved";

        if (!isAdmin && !isOwner && !isSafe) {
            return res.status(403).json({ message: "Access denied" });
        }

        // 6. Streaming Logic
        const videoPath = path.resolve(video.filePath);
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ message: "Physical file not found" });
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (!range) {
            // If no range, send the whole file (some browsers require this initially)
            res.writeHead(200, {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            });
            return fs.createReadStream(videoPath).pipe(res);
        }

        // Handle Range Request
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).send("Requested range not satisfiable\n" + start + " >= " + fileSize);
            return;
        }

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, head);
        file.pipe(res);

    } catch (err) {
        console.error("Streaming Error:", err);
        res.status(500).json({ message: "Internal server error during streaming" });
    }
};

module.exports = { streamVideo };