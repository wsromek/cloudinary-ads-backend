const request = require("supertest");
const createApp = require("../src/app");

const {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_CREATED,
} = require("../src/http_codes");
const { formatISO } = require("date-fns");
const dateProvider = require("../src/provider/date");
const createMongoDbConnection = require("../src/database/mongo");
const createMongoRepository = require("../src/repository/mongoRepository");

const config = require("../src/config");
const corsMiddleware = (req, res, next) => {
  next();
};

const prepareTest = async () => {
  const { client, connection } = await createMongoDbConnection(config);
  const mongoRepository = createMongoRepository(connection, config);

  return {
    prepareAppForTest: async (mockDateProvider) =>
      await createApp({
        mongoRepository,
        dateProvider: mockDateProvider || dateProvider,
        corsMiddleware,
      }),
    client,
    connection,
  };
};

const trackEvent = async (app, ad, type) => {
  await request(app)
    .post("/event")
    .send(`{"ad":"${ad}", "type": "${type}"}`)
    .set("Content-Type", "text/plain");
};

describe("Event Mocking", () => {
  it("serves ad mocks on /mock-ad/:name endpoint", async () => {
    const { prepareAppForTest, client } = await prepareTest();
    const app = await prepareAppForTest();

    try {
      return request(app)
        .get("/mock-ad/test")
        .expect("Content-Type", /json/)
        .expect(HTTP_OK, {
          ad: "https://test.com",
        });
    } finally {
      await client.close();
    }
  });
});

describe("Event Tracking", () => {
  before(async () => {
    const { client, connection } = await prepareTest();

    await connection.collection(config.mongo_collectionName).deleteMany({});

    await client.close();
  });

  describe("Errors and validation", () => {
    it("handles incorrect date parameter on /report endpoint", async () => {
      const { prepareAppForTest, client } = await prepareTest();
      const app = await prepareAppForTest();

      try {
        return request(app)
          .get("/report/2020-111-111")
          .expect("Content-Type", /json/)
          .expect(HTTP_BAD_REQUEST, {
            error: "Incorrect date! Please input date in yyyy-MM-dd format!",
            status: HTTP_BAD_REQUEST,
          });
      } finally {
        await client.close();
      }
    });

    it("handles 404 gracefully", async () => {
      const { prepareAppForTest, client } = await prepareTest();
      const app = await prepareAppForTest();

      try {
        return request(app)
          .get("/incorrect-url")
          .expect("Content-Type", /json/)
          .expect(HTTP_NOT_FOUND, {
            error: "Not found",
            status: HTTP_NOT_FOUND,
          });
      } finally {
        await client.close();
      }
    });

    it("handles incorrect Content-Type gracefully", async () => {
      const { prepareAppForTest, client } = await prepareTest();
      const app = await prepareAppForTest();

      try {
        return await request(app)
          .post("/event")
          .send('{"ad":"yahoo.com", "type": "load"}')
          .set("Content-Type", "application/json")
          .expect(HTTP_BAD_REQUEST, {
            error: "Please use text/plain Content-Type",
            status: HTTP_BAD_REQUEST,
          });
      } finally {
        await client.close();
      }
    });
  });

  describe("Event tracking", () => {
    it("tracks events through /event endpoint", async () => {
      const { prepareAppForTest, client } = await prepareTest();
      const app = await prepareAppForTest();

      try {
        return await request(app)
          .post("/event")
          .send('{"ad":"yahoo.com", "type": "load"}')
          .set("Content-Type", "text/plain")
          .expect(201);
      } finally {
        await client.close();
      }
    });
  });

  describe("Event reporting", () => {
    it("generates daily reports through /report/:date endpoint", async () => {
      //let's move the date, generate events and see report for 3 days in future
      let mockDateProvider = {
        now: () => {
          let date = new Date();
          date.setDate(date.getDate() + 3);
          return date;
        },
      };

      const { prepareAppForTest, client } = await prepareTest();

      const app = await prepareAppForTest(mockDateProvider);
      const today = formatISO(mockDateProvider.now(), {
        representation: "date",
      });

      const expectedResult = {
        "google.com": { load: 1, click: 1 },
        "cloudinary.com": { click: 2 },
      };

      await trackEvent(app, "google.com", "load");
      await trackEvent(app, "google.com", "click");
      await trackEvent(app, "cloudinary.com", "click");
      await trackEvent(app, "cloudinary.com", "click");

      try {
        return await request(app)
          .get(`/report/${today}`)
          .expect(200, expectedResult);
      } finally {
        await client.close();
      }
    });
  });
});
