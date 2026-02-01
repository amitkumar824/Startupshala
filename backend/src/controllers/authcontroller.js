const  User  = require('../models/usermodel.js');
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: "User registered successfully",
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
            }
        });
        console.log("User registered:", { token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

module.exports = { login, register };
