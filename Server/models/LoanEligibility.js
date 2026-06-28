const mongoose = require("mongoose");

const loanEligibilitySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  age: Number,

  occupation_status: String,

  years_employed: Number,

  annual_income: Number,

  credit_score: Number,

  credit_history_years: Number,

  savings_assets: Number,

  current_debt: Number,

  defaults_on_file: Number,

  delinquencies_last_2yrs: Number,

  derogatory_marks: Number,

  product_type: String,

  loan_intent: String,

  loan_amount: Number,

  interest_rate: Number,

  debt_to_income_ratio: Number,

  loan_to_income_ratio: Number,

  payment_to_income_ratio: Number,

  result: {

    probability: Number,

    eligibleAmount: Number,

    emi: Number,

    riskCategory: String,

    tips: [String],

    calculated: {
      type: Boolean,
      default: false
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
  mongoose.model(
    "LoanEligibility",
    loanEligibilitySchema
  );