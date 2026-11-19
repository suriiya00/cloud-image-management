const gcsStorage = require("./gcsStorage");
const s3Storage = require("./s3Storage");
const azureStorage = require("./azureStorage");

function getStorage(provider) {
  switch (provider) {
    case "GCP":
      return gcsStorage;

    case "AWS":
      return s3Storage;

    case "AZURE":
      return azureStorage;

    default:
      throw new Error("Unsupported cloud provider");
  }
}

module.exports = { getStorage };