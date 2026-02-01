const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authheader = req.headers.authorization;

   if (!authheader || !authheader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authheader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;       // contains userId & isAdmin
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
