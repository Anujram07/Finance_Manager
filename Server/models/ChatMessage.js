const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatSession"
  },

  sender: {
    type: String,
    enum: ["User", "AI"]
  },

  message: String,

  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);