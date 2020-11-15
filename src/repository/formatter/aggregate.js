const formatAggregate = (aggregate) =>
  aggregate.reduce((prev, value) => {
    let ad = value["_id"]["ad"];
    let type = value["_id"]["type"];
    let count = value["count"];

    prev[ad] = {
      ...prev[ad],
      [type]: count,
    };

    return prev;
  }, {});

module.exports = formatAggregate;
