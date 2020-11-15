const express = require("express");
const createAppRouter = require("./router/router");
const createAdMockRouter = require("./router/mockRouter");
const createErrorsMiddleware = require("./middleware/errors");

const createApp = ({ mongoRepository, dateProvider, corsMiddleware }) => {
  const app = express();

  const {
    cors,
    errors: { clientError, serverError },
  } = {
    cors: corsMiddleware,
    errors: createErrorsMiddleware(),
  };

  app.use(express.text());

  app.use(cors);
  app.use(createAdMockRouter());
  app.use(createAppRouter(mongoRepository, dateProvider));
  app.use(clientError);
  app.use(serverError);

  return app;
};

module.exports = createApp;
