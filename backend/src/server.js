const http = require("http");
const app = require("./app");
const { initSocket } = require("./sockets");
const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
initSocket(server);

// Connect to database and then start server
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    });
