const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
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

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Income", incomeSchema);