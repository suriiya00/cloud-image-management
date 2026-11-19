const objects = new Map();

module.exports = {
  async upload({ buffer, contentType }) {
    const objectKey = `s3-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    objects.set(objectKey, { buffer, contentType });
    return objectKey;
  },
  async download(objectKey) {
    const object = objects.get(objectKey);
    if (!object) {
      const error = new Error("Object not found");
      error.status = 404;
      throw error;
    }
    return object.buffer;
  },
  async delete(objectKey) {
    objects.delete(objectKey);
  }
};