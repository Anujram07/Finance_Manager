const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  source: String,
  type: {
    type: String,
    enum: ["Fixed", "Variable"]
  },
  minimumAmount: Number,
  maximumAmount: Number,
  actualAmount: Number
});

const expenseSchema = new mongoose.Schema({
  expenseName: String,
  category: String,
  type: {
    type: String,
    enum: ["Fixed", "Variable"]
  },
  minimumAmount: Number,
  maximumAmount: Number,
  actualAmount: Number,
  isImportant: Boolean
});

const financeRecordSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  month: {
    type: Number,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  incomes: [incomeSchema],

  expenses: [expenseSchema],

  totalMinimumIncome: Number,

  totalMaximumIncome: Number,

  totalMinimumExpense: Number,

  totalMaximumExpense: Number,

  conservativeNetSavings: Number,

  optimisticNetSavings: Number,

  savingsRatio: Number,

  financialHealth: {
    type: String,
    enum: [
      "Excellent",
      "Good",
      "Average",
      "Poor"
    ]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "FinanceRecord",
  financeRecordSchema
);