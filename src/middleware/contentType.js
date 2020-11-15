const { HTTP_BAD_REQUEST } = require("../http_codes");

module.exports = (req, res, next) => {
  if (!req.is("text/plain")) {
    next({
      status: HTTP_BAD_REQUEST,
      message: "Please use text/plain Content-Type",
    });
  } else {
    next();
  }
};
