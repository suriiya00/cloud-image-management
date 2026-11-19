let nextId = 1;
const records = new Map();

function publicRecord(record) {
  return {
    id: record.id,
    name: record.name,
    contentType: record.contentType,
    size: record.size,
    storageType: record.storageType
  };
}

module.exports = {
  saveImage({ name, contentType, buffer }) {
    const id = String(nextId++);
    records.set(id, {
      id,
      name,
      contentType,
      size: buffer.length,
      storageType: "DATABASE_BLOB",
      buffer
    });
    return publicRecord(records.get(id));
  },

  saveImageMetadata({ name, contentType, size, objectKey, storageType }) {
    const id = String(nextId++);
    records.set(id, { id, name, contentType, size, storageType, objectKey });
    return publicRecord(records.get(id));
  },

  getImages({ storageMode }) {
    return Array.from(records.values())
      .filter(record =>
        storageMode === "BLOB"
          ? record.storageType === "DATABASE_BLOB"
          : record.storageType !== "DATABASE_BLOB"
      )
      .map(publicRecord);
  },

  getImageContent(id) {
    const record = records.get(String(id));
    if (!record || record.storageType !== "DATABASE_BLOB") {
      const error = new Error("Image not found");
      error.status = 404;
      throw error;
    }
    return {
      buffer: record.buffer,
      contentType: record.contentType,
      name: record.name
    };
  },

  getImageMetadata(id) {
    const record = records.get(String(id));
    if (!record || record.storageType === "DATABASE_BLOB") {
      const error = new Error("Image not found");
      error.status = 404;
      throw error;
    }
    return record;
  },

  deleteImage(id) {
    if (!records.delete(String(id))) {
      const error = new Error("Image not found");
      error.status = 404;
      throw error;
    }
  },

  deleteImageMetadata(id) {
    return this.deleteImage(id);
  }
};
