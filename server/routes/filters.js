const express = require("express");
const router = express.Router();

const { queryOrders } = require("../query-db/query.js");
const { queryUsers } = require("../query-db/query.js");
const { queryTotalOrders } = require("../query-db/query.js");

router.get("/orders/:dateMin/:dateMax", async (req, res) => {
  const { dateMin, dateMax } = req.params;

  const response = await queryOrders(dateMin, dateMax);

  res.json(response);
});

router.get("/users/:dateMin/:dateMax", async (req, res) => {
  const { dateMin, dateMax } = req.params;

  const response = await queryUsers(dateMin, dateMax);

  res.json(response);
});

router.get("/total-orders/:dateMin/:dateMax", async (req, res) => {
  const { dateMin, dateMax } = req.params;

  const response = await queryTotalOrders(dateMin, dateMax);

  res.json(response);
});

module.exports = router;
