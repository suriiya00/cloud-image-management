const express = require("express");
require("dotenv").config();

const cors = require("cors");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/images", imageRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

module.exports = app;