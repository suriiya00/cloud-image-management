
const express = require("express");
const router = express.Router();

const imageService = require("../services/imageService");
const upload = require("../middleware/uploadMiddleware");

function getMode(req) {
  const mode =
    req.query.storageMode ||
    req.body.storageMode ||
    "BLOB";

  if (!["BLOB", "OBJECT"].includes(mode)) {
    throw new Error("Invalid storage mode");
  }

  return mode;
}

// Get configuration
router.get("/config", (req, res) => {
  res.json({
    cloudProvider: process.env.CLOUD_PROVIDER || "GCP",
    storageMode: process.env.DEFAULT_STORAGE_MODE || "BLOB"
  });
});

// List metadata
router.get("/", async (req, res, next) => {
  try {
    const mode = getMode(req);

    const data = await imageService.getImages({
      storageMode: mode
    });

    res.json({
      success: true,
      storageMode: mode,
      data
    });
  } catch (error) {
    next(error);
  }
});

// Upload
router.post(
  "/upload",
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Image file required"
        });
      }

      const result = await imageService.uploadImage({
        file: req.file,
        storageMode: getMode(req)
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

// Preview
router.get("/:id/content", async (req, res, next) => {
  try {
    const result = await imageService.downloadImage({
      id: req.params.id,
      storageMode: getMode(req)
    });

    res.setHeader("Content-Type", result.contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");

    res.send(result.buffer);
  } catch (error) {
    next(error);
  }
});

// Download
router.get("/:id/download", async (req, res, next) => {
  try {
    const result = await imageService.downloadImage({
      id: req.params.id,
      storageMode: getMode(req)
    });

    res.setHeader("Content-Type", result.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(result.name)}`
    );

    res.send(result.buffer);
  } catch (error) {
    next(error);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    await imageService.deleteImage({
      id: req.params.id,
      storageMode: getMode(req)
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
