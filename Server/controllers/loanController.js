const axios = require("axios");
const LoanEligibility = require("../models/LoanEligibility");

/*
|--------------------------------------------------------------------------
| Predict Loan Eligibility
|--------------------------------------------------------------------------
*/
exports.predictLoanEligibility = async (req, res) => {

  try {

    const flaskResponse = await axios.post(
      "http://127.0.0.1:5001/predict",
      req.body
    );

    const prediction =
      flaskResponse.data.prediction;

    // Optional: if Flask later returns probability directly
    const modelProbability =
      flaskResponse.data.probability || null;

    const annualIncome =
      Number(req.body.annual_income);

    const loanAmount =
      Number(req.body.loan_amount);

    const interestRate =
      Number(req.body.interest_rate);

    // Assume 5 years (60 months) for now
    const tenure = 60;

    const monthlyIncome =
      annualIncome / 12;

    // EMI Formula
    const monthlyRate =
      interestRate / (12 * 100);

    let emi = 0;

    if (monthlyRate > 0) {

      emi =
        (loanAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1);

    } else {

      emi = loanAmount / tenure;

    }

    // Safe EMI threshold (50% FOIR)
    const maxSafeEmi =
      monthlyIncome * 0.5;

    // Reverse EMI formula to estimate eligibility
    let eligibleAmount = 0;

    if (monthlyRate > 0) {

      eligibleAmount =
        maxSafeEmi *
        (
          (Math.pow(1 + monthlyRate, tenure) - 1)
          /
          (
            monthlyRate *
            Math.pow(1 + monthlyRate, tenure)
          )
        );

    } else {

      eligibleAmount =
        maxSafeEmi * tenure;

    }

    // Probability
    let probability = 0;

    if (modelProbability !== null) {

  probability =
    Number(modelProbability.toFixed(2));

} else {

  probability =
    prediction === 1 ? 85 : 30;

}

    const riskCategory =
      probability >= 75
        ? "Low Risk"
        : probability >= 50
        ? "Moderate Risk"
        : "High Risk";

    const tips = [];

    if (prediction === 1) {

      tips.push(
        "Profile appears eligible for approval."
      );

      if (probability >= 80)
        tips.push(
          "Strong credit profile detected."
        );

    } else {

      tips.push(
        "Current profile indicates elevated lending risk."
      );

      tips.push(
        "Consider reducing liabilities before reapplying."
      );

    }

    if (
      Number(req.body.credit_score) < 700
    ) {

      tips.push(
        "Improving credit score can significantly increase approval chances."
      );

    }

    if (
      Number(req.body.current_debt) >
      annualIncome * 0.4
    ) {

      tips.push(
        "Existing debt burden is relatively high."
      );

    }

    const result = {

      probability,

      eligibleAmount:
        Math.round(eligibleAmount),

      emi:
        Math.round(emi),

      riskCategory,

      tips,

      calculated: true

    };

    await LoanEligibility.create({

      userId: req.user.id,

      ...req.body,

      result

    });

    return res.status(200).json({

      success: true,

      result

    });

  }
  catch (error) {

    console.error(
      "Loan Prediction Error:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


/*
|--------------------------------------------------------------------------
| Get Latest Loan Prediction
|--------------------------------------------------------------------------
*/
exports.getLatestLoan = async (req, res) => {

  try {

    const loan =
      await LoanEligibility.findOne({
        userId: req.user.id
      })
      .sort({
        createdAt: -1
      });

    return res.status(200).json({

      success: true,

      loan

    });

  }
  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};