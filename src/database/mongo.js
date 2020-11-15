const { MongoClient } = require("mongodb");

const createMongoDbConnection = async (config) => {
  const uri = `mongodb+srv://${config.mongo_user}:${config.mongo_pass}@${config.mongo_clusterUrl}/${config.mongo_dbName}?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    useUnifiedTopology: true,
  });

  await client.connect();

  return {
    client,
    connection: client.db(config.mongo_dbName),
  };
};

module.exports = createMongoDbConnection;
