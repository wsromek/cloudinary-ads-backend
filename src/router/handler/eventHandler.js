const { HTTP_CREATED } = require("../../http_codes");
const { formatISO } = require("date-fns");

const createEventHandler = (mongoRepository, dateProvider) => {
  return async (req, res, next) => {
    const event = JSON.parse(req.body);
    event.date = formatISO(dateProvider.now(), { representation: "date" });

    try {
      await mongoRepository.save(event);
    } catch (error) {
      return next({
        message: "Could not save the event!",
      });
    }

    res.sendStatus(HTTP_CREATED);
  };
};

module.exports = createEventHandler;
