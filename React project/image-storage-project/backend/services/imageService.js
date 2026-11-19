const config = require("../config/config.json");

const { getDatabase } = require("../database/dbFactory");
const { getStorage } = require("../storage/storageFactory");

const provider = config.cloudProvider;

async function uploadImage({ file, storageMode }) {
  const db = await getDatabase(provider);

  if (storageMode === "BLOB") {
    return db.saveImage({
      name: file.originalname,
      contentType: file.mimetype,
      buffer: file.buffer
    });
  }

  const storage = getStorage(provider);

  const objectKey = await storage.upload({
    buffer: file.buffer,
    contentType: file.mimetype
  });

  return db.saveImageMetadata({
    name: file.originalname,
    contentType: file.mimetype,
    size: file.size,
    objectKey,
    storageType: provider
  });
}

async function getImages({ storageMode }) {
  const db = await getDatabase(provider);

  return db.getImages({
    storageMode
  });
}

async function downloadImage({ id, storageMode }) {
  const db = await getDatabase(provider);

  if (storageMode === "BLOB") {
    return db.getImageContent(id);
  }

  const metadata = await db.getImageMetadata(id);

  const storage = getStorage(provider);

  const buffer = await storage.download(metadata.objectKey);

  return {
    buffer,
    contentType: metadata.contentType,
    name: metadata.name
  };
}

async function deleteImage({ id, storageMode }) {
  const db = await getDatabase(provider);

  if (storageMode === "BLOB") {
    return db.deleteImage(id);
  }

  const metadata = await db.getImageMetadata(id);
  const storage = getStorage(provider);

  await storage.delete(metadata.objectKey);

  return db.deleteImageMetadata(id);
}

module.exports = {
  uploadImage,
  getImages,
  downloadImage,
  deleteImage
};