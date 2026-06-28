const { GoogleGenAI } = require("@google/genai");

const FinanceRecord = require("../models/FinanceRecord");
const Goal = require("../models/Goal");
const LoanEligibility = require("../models/LoanEligibility");
const ChatHistory = require("../models/ChatHistory");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.chatWithFinanceBuddy = async (req, res) => {
  try {

    const userId = req.user.id;
    const {
  message,
  liveFinanceData
} = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    /*
    ==========================================================
    FETCH DATA
    ==========================================================
    */

const dbFinanceData = await FinanceRecord.findOne({
  userId
}).sort({ year: -1, month: -1 });

const financeData = liveFinanceData || dbFinanceData;

    const financeHistory = await FinanceRecord.find({
      userId
    })
      .sort({ year: -1, month: -1 })
      .limit(3);

    const goals = await Goal.find({
      userId
    });

    const latestLoan = await LoanEligibility.findOne({
      userId
    }).sort({ createdAt: -1 });

    const recentChats = await ChatHistory.find({
      userId
    })
      .sort({ createdAt: -1 })
      .limit(5);

    /*
    ==========================================================
    PROMPT
    ==========================================================
    */

    const systemPrompt = `

You are "Finance Buddy".

You are an AI-powered Indian Personal Finance Advisor integrated inside an AI-driven Financial Manager application.

You are NOT a general chatbot.

You specialize only in:

1. Budget Optimization
2. Savings Planning
3. Expense Reduction
4. Goal Planning
5. Loan Advice
6. Financial Health Analysis
7. Risk Analysis
8. Emergency Fund Planning
9. Financial Education
10. Debt Management

STRICT RULES:

- Always answer in INR (₹).
- Keep answers practical.
- Prefer savings before debt.
- Never encourage irresponsible borrowing.
- Never suggest gambling.
- Respect expenses marked IMPORTANT.
- Use historical trends while answering.
- Use active goals while answering.
- Use loan information while answering.
- Use numbered actionable steps whenever possible.
- Keep responses concise but detailed.

==========================================================
CURRENT FINANCIAL SNAPSHOT
==========================================================

Minimum Income:
₹${financeData?.totalMinimumIncome || 0}

Maximum Income:
₹${financeData?.totalMaximumIncome || 0}

Minimum Expenses:
₹${financeData?.totalMinimumExpense || 0}

Maximum Expenses:
₹${financeData?.totalMaximumExpense || 0}

Conservative Savings:
₹${financeData?.conservativeNetSavings || 0}

Optimistic Savings:
₹${financeData?.optimisticNetSavings || 0}

Savings Ratio:
${financeData?.savingsRatio || 0}%

Financial Health:
${financeData?.financialHealth || "Unavailable"}

==========================================================
CURRENT INCOME SOURCES
==========================================================

${financeData?.incomes?.length
        ? financeData.incomes.map(i => `
Source: ${i.source || i.name}
Type: ${i.type}

Minimum: ₹${
  i.minimumAmount ??
  i.min ??
  0
}

Maximum: ₹${
  i.maximumAmount ??
  i.max ??
  0
}
`).join("\n")
        : "No income sources available."}

==========================================================
CURRENT EXPENSES
==========================================================

${financeData?.expenses?.length
        ? financeData.expenses.map(e => `
Expense: ${e.expenseName || e.name}

Category: ${e.category || "General"}

Type: ${e.type}

Minimum: ₹${
  e.minimumAmount ??
  e.min ??
  0
}

Maximum: ₹${
  e.maximumAmount ??
  e.max ??
  0
}

Important: ${
  e.isImportant ??
  e.important
    ? "YES"
    : "NO"
}
`).join("\n")
        : "No expense records available."}

==========================================================
LAST 3 MONTH HISTORY
==========================================================

${financeHistory.length
        ? financeHistory.map(record => `
Month: ${record.month}/${record.year}
Income: ₹${record.totalMinimumIncome}
Expenses: ₹${record.totalMaximumExpense}
Savings: ₹${record.conservativeNetSavings}
Savings Ratio: ${record.savingsRatio}%
Financial Health: ${record.financialHealth}
`).join("\n")
        : "No historical data available."}

==========================================================
ACTIVE GOALS
==========================================================

${goals.length
        ? goals.map(goal => `
Goal Name: ${goal.goalName}
Goal Type: ${goal.goalType}
Target Amount: ₹${goal.targetAmount}
Saved Amount: ₹${goal.savedAmount}
Status: ${goal.status}
Deadline: ${goal.deadline || "Not specified"}
`).join("\n")
        : "No active goals available."}

==========================================================
LATEST LOAN ANALYSIS
==========================================================

${latestLoan
        ? `
Approval Probability: ${latestLoan.result?.probability || 0}%
Eligible Loan Amount: ₹${latestLoan.result?.eligibleAmount || 0}
Monthly EMI: ₹${latestLoan.result?.emi || 0}

Credit Score: ${latestLoan.credit}
Monthly Income: ₹${latestLoan.income}
Current Debt: ₹${latestLoan.currentDebt}
`
        : "No loan analysis available."}

==========================================================
RECENT CONVERSATION MEMORY
==========================================================

${recentChats.length
        ? recentChats.reverse().map(chat => `
User: ${chat.userMessage}
Assistant: ${chat.aiResponse}
`).join("\n")
        : "No previous conversations."}

==========================================================
USER QUESTION
==========================================================

${message}

`;

    /*
    ==========================================================
    GEMINI CALL
    ==========================================================
    */

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt
    });

    const reply = response.text;

    /*
    ==========================================================
    SAVE CHAT
    ==========================================================
    */

    await ChatHistory.create({
      userId,
      userMessage: message,
      aiResponse: reply
    });

    return res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {

    console.error("Finance Buddy Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};