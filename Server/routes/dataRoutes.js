const express = require("express");
const router = express.Router();
const LoanEligibility = require("../models/LoanEligibility");
const FinanceRecord = require("../models/FinanceRecord");

router.post("/loan", async (req, res) => {
  try {
    const record = new LoanEligibility(req.body);
    await record.save();
    res.status(201).json({ success: true, message: "Loan data saved", data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/finance", async (req, res) => {
  try {
    const record = new FinanceRecord(req.body);
    await record.save();
    res.status(201).json({ success: true, message: "Finance data saved", data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
