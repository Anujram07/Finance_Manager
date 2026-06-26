const mongoose = require("mongoose");

const loanEligibilitySchema = new mongoose.Schema({
  age: { type: Number, required: true },
  empType: { type: String, required: true },
  workExperience: { type: Number, required: true },
  income: { type: Number, required: true },
  credit: { type: Number, required: true },
  currentDebt: { type: Number, required: true },
  loanPurpose: { type: String, required: true },
  loanAmt: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: Number, required: true },
  result: {
    probability: Number,
    eligibleAmount: Number,
    emi: Number,
    tips: [String],
    calculated: Boolean
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoanEligibility", loanEligibilitySchema);
