const mongoose = require("mongoose");

const financialAnalysisSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  month: String,

  year: Number,

  totalIncome: Number,

  totalExpense: Number,

  savings: Number,

  savingsRatio: Number,

  foir: Number,

  dti: Number,

  financialHealth: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "FinancialAnalysis",
  financialAnalysisSchema
);