const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

// ---------- Global Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (dev friendly)
app.use(morgan("dev"));

// ---------- API Routes ----------
app.use("/api", routes);

// ---------- Health Check ----------
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Video Sensitivity API is running"
    });
});

// ---------- Global Error Handler ----------
app.use(errorHandler);

module.exports = app;
