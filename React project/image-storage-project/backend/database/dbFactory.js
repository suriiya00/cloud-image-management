const cloudSql = require("./cloudSql");
const azureSql = require("./azureSql");
const rds = require("./rds");

function getDatabase(provider) {
  switch (provider) {
    case "GCP":
      return cloudSql;

    case "AZURE":
      return azureSql;

    case "AWS":
      return rds;

    default:
      throw new Error("Unsupported database provider");
  }
}

module.exports = { getDatabase };