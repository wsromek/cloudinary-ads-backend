const { HTTP_BAD_REQUEST } = require("../../http_codes");
const enGB = require("date-fns/locale/en-GB");
const { parse, isValid } = require("date-fns");

const createReportHandler = (mongoRepository) => {
  return async (req, res, next) => {
    const date = req.params.date;
    const parsedDate = parse(date, "yyyy-MM-dd", new Date(), {
      locale: enGB,
    });

    if (!isValid(parsedDate)) {
      return next({
        status: HTTP_BAD_REQUEST,
        message: "Incorrect date! Please input date in yyyy-MM-dd format!",
      });
    }

    res.send(await mongoRepository.getEventsByDate(parsedDate));
  };
};

module.exports = createReportHandler;
