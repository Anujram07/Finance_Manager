const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  goalName: {
    type: String,
    required: true
  },

  goalType: {
    type: String,
    required: true
  },

  customGoalType: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: ""
  },

  targetAmount: {
    type: Number,
    required: true
  },

  savedAmount: {
    type: Number,
    default: 0
  },

  progress: {
    type: Number,
    default: 0
  },

  deadline: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: [
      "In Progress",
      "Completed",
      "Overdue"
    ],
    default: "In Progress"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Goal",
  goalSchema
);