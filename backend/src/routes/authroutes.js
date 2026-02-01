const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authcontroller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authMiddleware, async (req, res) => {
    res.status(200).json({ message: "This is a protected route ", user: req.user });
});

module.exports = router;
