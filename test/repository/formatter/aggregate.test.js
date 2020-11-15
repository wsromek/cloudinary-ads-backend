const assert = require("assert");
const formatter = require("../../../src/repository/formatter/aggregate");

describe("Aggregate formatter", () => {
  it("maps and aggregation object to a readable format", () => {
    const aggregate = [
      { _id: { ad: "onet.pl", type: "load" }, count: 3 },
      { _id: { ad: "cloudinary.com", type: "click" }, count: 3 },
      { _id: { ad: "onet.pl", type: "click" }, count: 4 },
      { _id: { ad: "google.com", type: "click" }, count: 4 },
      { _id: { ad: "google.com", type: "load" }, count: 2 },
    ];

    const mapped = {
      "onet.pl": { load: 3, click: 4 },
      "google.com": { load: 2, click: 4 },
      "cloudinary.com": { click: 3 },
    };

    assert.deepStrictEqual(formatter(aggregate), mapped);
  });
});
