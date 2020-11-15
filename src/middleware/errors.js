const { HTTP_NOT_FOUND, HTTP_INTERNAL_SERVER_ERROR } = require("../http_codes");

function createErrorMiddleware() {
  return {
    clientError(req, res, next) {
      res.status(HTTP_NOT_FOUND).send({
        status: HTTP_NOT_FOUND,
        error: "Not found",
      });
    },
    serverError(err, req, res, next) {
      const status = err.status || HTTP_INTERNAL_SERVER_ERROR;
      const error = err.message || "Internal server error!";

      res.status(status).send({
        status,
        error,
      });
    },
  };
}

module.exports = createErrorMiddleware;
