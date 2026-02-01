const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authcontroller");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/usermodel");

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
