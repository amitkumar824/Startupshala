const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllDeals,
  updateClaimStatus
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Admin routes
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/deals", protect, adminOnly, getAllDeals);
router.put("/claims/:id", protect, adminOnly, updateClaimStatus);

module.exports = router;
