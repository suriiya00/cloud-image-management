const multer = require("multer");
const config = require("../config/config.json");

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxFileSizeMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!config.upload.allowedTypes.includes(file.mimetype)) {
      const error = new Error("Unsupported image type");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  }
});