const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  saveFinanceRecord,
  getCurrentFinance,
  getFinanceHistory,
  getDashboardSummary
} = require("../controllers/financeController");

/*
|--------------------------------------------------------------------------
| Finance Routes
|--------------------------------------------------------------------------
*/

// Create or Update Current Month Finance Data
router.post(
  "/",
  authMiddleware,
  saveFinanceRecord
);

// Get Current Month Finance Record
router.get(
  "/current",
  authMiddleware,
  getCurrentFinance
);

// Get Last 3 Months Finance History
router.get(
  "/history",
  authMiddleware,
  getFinanceHistory
);

// Get Dashboard Summary
router.get(
  "/dashboard",
  authMiddleware,
  getDashboardSummary
);

module.exports = router;