const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  chatWithFinanceBuddy
} = require("../controllers/chatController");

/*
|--------------------------------------------------------------------------
| Chat Routes
|--------------------------------------------------------------------------
*/

// AI Finance Buddy Chat
router.post(
  "/",
  authMiddleware,
  chatWithFinanceBuddy
);

module.exports = router;