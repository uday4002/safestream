const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const room = `user:${decoded.id}`;

            socket.join(room);
            console.log("Socket joined:", room);
        } catch (err) {
            console.log("Socket auth failed");
        }
    });
}

function emitProgress(userId, videoId, progress) {
    if (!io) return;
    io.to(`user:${userId}`).emit("video:progress", { videoId, progress });
}

function emitCompleted(userId, videoId, status, confidence) {
    if (!io) return;
    io.to(`user:${userId}`).emit("video:completed", { videoId, status, confidence });
}

function getIO() {
    return io;
}

module.exports = { initSocket, emitProgress, emitCompleted, getIO };
