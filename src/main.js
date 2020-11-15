const config = require("./config");

const { HTTP_OK } = require("./http_codes");
const dateProvider = require("./provider/date");
const createMongoDbConnection = require("./database/mongo");
const createMongoRepository = require("./repository/mongoRepository");

const corsMiddleware = require("cors")({
  origin: process.env.NODE_ENV === "prod" ? config.allowedHosts : "*",
  optionsSuccessStatus: HTTP_OK,
});

const createApp = require("./app");

(async () => {
  const { connection } = await createMongoDbConnection(config);
  const mongoRepository = createMongoRepository(connection, config);

  const app = createApp({ mongoRepository, dateProvider, corsMiddleware });

  app.listen(config.port, () => {
    console.log(`Express server listening on  ${config.port}`);
  });
})();
