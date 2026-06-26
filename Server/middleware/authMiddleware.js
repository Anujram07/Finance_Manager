const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json("No token, authorization denied");
    }

    // Format: "Bearer token"
    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || "secretkey");

    req.user = decoded; // contains { id: user._id }

    next();
  } catch (err) {
    res.status(401).json("Token is not valid");
  }
};

module.exports = authMiddleware;