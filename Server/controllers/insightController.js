const { GoogleGenAI } = require("@google/genai");

const FinanceRecord = require("../models/FinanceRecord");
const Goal = require("../models/Goal");
const LoanEligibility = require("../models/LoanEligibility");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

exports.getFinancialInsights = async (req, res) => {

  try {

    const userId = req.user.id;

    const currentFinance =
      await FinanceRecord.findOne({
        userId
      }).sort({
        year: -1,
        month: -1
      });

    const financeHistory =
      await FinanceRecord.find({
        userId
      })
        .sort({
          year: -1,
          month: -1
        })
        .limit(3);

    const goals = await Goal.find({
      userId
    });

    const latestLoan =
      await LoanEligibility.findOne({
        userId
      }).sort({
        createdAt: -1
      });

    const prompt = `

You are an expert Indian financial advisor.

Analyze the user's finances and provide concise dashboard insights.

IMPORTANT RULES:

- Respond ONLY in JSON.
- Do NOT use markdown.
- Do NOT use bullet symbols (*, -, •).
- Financial Health must be ONE short sentence only.
- Maximum 3 recommendations.
- Maximum 3 warnings.
- Maximum 3 opportunities.
- Each item must be under 18 words.
- Focus only on actionable insights.
- Avoid long explanations.
- Avoid repeating the same advice.
- Keep responses suitable for a financial dashboard card UI.

GOAL ANALYSIS RULES:

- Active goals must heavily influence all insights.
- If active goals exist, NEVER recommend creating new goals.
- Analyze whether current savings are sufficient to achieve existing goals.
- Mention if goal progress is good or poor.
- If progress is below 30%, generate a warning when appropriate.
- If savings are enough to meet goals, mention this positively.
- If deadlines appear unrealistic, generate a warning.
- Recommendations should prioritize helping the user complete existing goals.
- Opportunities should suggest ways to accelerate goal completion.
- Financial Health must consider goal progress in addition to savings.

JSON format:

{
  "financialHealth": "",
  "recommendations": [],
  "warnings": [],
  "opportunities": []
}

Example:

{
  "financialHealth": "Good savings habits but emergency preparedness needs improvement.",
  "recommendations": [
    "Create at least one long-term savings goal.",
    "Build an emergency fund covering six months of expenses.",
    "Track discretionary expenses monthly."
  ],
  "warnings": [
    "No active financial goals are defined.",
    "Loan liability information is incomplete."
  ],
  "opportunities": [
    "Start SIP investments for long-term wealth creation.",
    "Reduce variable expenses by ₹5,000 monthly.",
    "Use tax-saving investments under Section 80C."
  ]
}

Current Finance:

Income:
₹${currentFinance?.totalMinimumIncome || 0}
to
₹${currentFinance?.totalMaximumIncome || 0}

Expenses:
₹${currentFinance?.totalMinimumExpense || 0}
to
₹${currentFinance?.totalMaximumExpense || 0}

Savings:
₹${currentFinance?.conservativeNetSavings || 0}

Savings Ratio:
${currentFinance?.savingsRatio || 0}%

Financial Health:
${currentFinance?.financialHealth || "Unknown"}

Important Expenses:

${currentFinance?.expenses?.filter(e =>
      e.isImportant
    ).map(e =>
      `${e.expenseName}`
    ).join(", ") || "None"}

Last 3 Month History:

${financeHistory.map(record => `
Month ${record.month}/${record.year}
Savings ₹${record.conservativeNetSavings}
Health ${record.financialHealth}
`).join("\n")}

ACTIVE GOALS:

${goals.length
  ? goals.map(goal => {

      const progress = (
        ((goal.savedAmount || 0) /
        (goal.targetAmount || 1)) * 100
      ).toFixed(1);

      return `
Goal Name: ${goal.goalName}
Goal Type: ${goal.goalType}
Target Amount: ₹${goal.targetAmount}
Current Saved Amount: ₹${goal.savedAmount}
Progress: ${progress}%
Deadline: ${goal.deadline || "Not specified"}
Monthly Savings Available: ₹${currentFinance?.conservativeNetSavings || 0}

Estimated Months Remaining:
${Math.ceil(
  (goal.targetAmount - goal.savedAmount) /
  Math.max(currentFinance?.conservativeNetSavings || 1, 1)
)} months

Status:
${progress >= 100
  ? "Completed"
  : progress >= 70
  ? "On Track"
  : "Needs Attention"}
`;
    }).join("\n")
  : "No active goals available."
}

Loan:

${latestLoan
        ? `
Probability ${latestLoan.result?.probability || 0}%
EMI ₹${latestLoan.result?.emi || 0}
`
        : "No Loan Data"}

`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

    let reply = response.text;

    reply = reply
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

try {
  parsed = JSON.parse(reply);
} catch (err) {
  parsed = {
    financialHealth:
      "Unable to generate insights at this moment.",
    recommendations: [],
    warnings: [],
    opportunities: []
  };
}

    return res.status(200).json({
      success: true,
      insights: parsed
    });

  }
  catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};