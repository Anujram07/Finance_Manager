const express = require("express");

const router = express.Router();

const {
  predictLoanEligibility,
  getLatestLoan
} = require(
  "../controllers/loanController"
);

const authMiddleware =
  require("../middleware/authMiddleware");

router.post(
  "/predict",
  authMiddleware,
  predictLoanEligibility
);

router.get(
  "/latest",
  authMiddleware,
  getLatestLoan
);

module.exports = router;