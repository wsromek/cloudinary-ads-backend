const { formatISO } = require("date-fns");
const formatAggregate = require("./formatter/aggregate");

const createMongoDbRepository = (db, config) => {
  const collection = db.collection(config.mongo_collectionName);

  return {
    async getEventsByDate(fromDate) {
      const aggregation = [
        {
          $match: {
            date: formatISO(fromDate, { representation: "date" }),
          },
        },
        {
          $group: {
            _id: {
              ad: "$ad",
              type: "$type",
            },
            count: { $sum: 1 },
          },
        },
      ];

      const cursor = await collection.aggregate(aggregation);

      return formatAggregate(await cursor.toArray());
    },
    async save(document) {
      await collection.insertOne(document);
    },
  };
};

module.exports = createMongoDbRepository;
