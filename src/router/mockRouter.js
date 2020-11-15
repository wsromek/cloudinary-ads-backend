const express = require("express");

const createAdMockRouter = () => {
  const router = express.Router();

  //add a mocking function and place it under /mock-ad/:name
  router.get("/mock-ad/:name", (req, res) => {
    res.send({
      ad: `https://${req.params.name}.com`,
    });
  });

  return router;
};

module.exports = createAdMockRouter;
