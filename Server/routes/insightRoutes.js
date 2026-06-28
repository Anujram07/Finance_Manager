const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getFinancialInsights
} = require("../controllers/insightController");

/*
|--------------------------------------------------------------------------
| Financial Insights Route
|--------------------------------------------------------------------------
*/

// Get AI Generated Financial Insights
router.get(
  "/",
  authMiddleware,
  getFinancialInsights
);

module.exports = router;