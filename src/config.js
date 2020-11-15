function getAllowedHosts() {
  return process.env.ALLOWED_HOSTS && process.env.ALLOWED_HOSTS.split(",");
}

module.exports = {
  allowedHosts: getAllowedHosts(),
  port: process.env.PORT || 3000,
  mongo_user: process.env.MONGO_USER,
  mongo_pass: process.env.MONGO_PASS,
  mongo_clusterUrl: process.env.MONGO_CLUSTER_URL,
  mongo_dbName: process.env.MONGO_DB_NAME,
  mongo_collectionName: process.env.MONGO_COLLECTION_NAME,
};
