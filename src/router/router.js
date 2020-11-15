const express = require("express");

const createEventHandler = require("./handler/eventHandler");
const createReportHandler = require("./handler/reportHandler");
const validateContentType = require("../middleware/contentType");

const createAppRouter = (mongoRepository, dateProvider) => {
  const router = express.Router();

  router.post(
    "/event",
    validateContentType,
    createEventHandler(mongoRepository, dateProvider)
  );
  router.get("/report/:date", createReportHandler(mongoRepository));

  return router;
};

module.exports = createAppRouter;
