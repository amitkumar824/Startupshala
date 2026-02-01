const express = require("express");
const router = express.Router();
const {
  getAllDeals,
  getDealById,
} = require("../controllers/dealcontroller");

router.get("/", getAllDeals);
router.get("/:id", getDealById);

module.exports = router;
