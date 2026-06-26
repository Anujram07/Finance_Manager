const mongoose = require("mongoose");

const financeRecordSchema = new mongoose.Schema({
  income: { type: Number, required: true },
  expenses: [
    {
      id: String,
      name: String,
      amount: Number,
      category: String
    }
  ],
  totalExpenses: { type: Number, required: true },
  netSavings: { type: Number, required: true },
  burnRatePercent: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FinanceRecord", financeRecordSchema);
