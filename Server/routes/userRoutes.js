const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Example protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data",
    userId: req.user.id
  });
});

module.exports = router;
