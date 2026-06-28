const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  title: String,

  startedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "ChatSession",
  chatSessionSchema
);