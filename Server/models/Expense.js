const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  expenseName: {
    type: String,
    required: true
  },

  category: {
    type: String,
    default: "General"
  },

  type: {
    type: String,
    enum: ["Fixed", "Variable"],
    required: true
  },

  minimumAmount: {
    type: Number,
    required: true
  },

  maximumAmount: {
    type: Number,
    required: true
  },

  isImportant: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", expenseSchema);