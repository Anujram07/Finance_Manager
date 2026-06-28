const FinanceRecord = require("../models/FinanceRecord");

/*
|--------------------------------------------------------------------------
| Create or Update Current Month Finance Record
|--------------------------------------------------------------------------
*/
exports.saveFinanceRecord = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      month,
      year,
      incomes,
      expenses,
      totalMinimumIncome,
      totalMaximumIncome,
      totalMinimumExpense,
      totalMaximumExpense,
      conservativeNetSavings,
      optimisticNetSavings
    } = req.body;

    // Calculate Savings Ratio
    const savingsRatio =
      totalMinimumIncome > 0
        ? ((conservativeNetSavings / totalMinimumIncome) * 100).toFixed(2)
        : 0;

    // Determine Financial Health
    let financialHealth = "Poor";

    if (savingsRatio >= 40)
      financialHealth = "Excellent";
    else if (savingsRatio >= 25)
      financialHealth = "Good";
    else if (savingsRatio >= 10)
      financialHealth = "Average";

    // Update if current month already exists
    let record = await FinanceRecord.findOne({
      userId,
      month,
      year
    });

    if (record) {
      record.incomes = incomes;
      record.expenses = expenses;
      record.totalMinimumIncome = totalMinimumIncome;
      record.totalMaximumIncome = totalMaximumIncome;
      record.totalMinimumExpense = totalMinimumExpense;
      record.totalMaximumExpense = totalMaximumExpense;
      record.conservativeNetSavings = conservativeNetSavings;
      record.optimisticNetSavings = optimisticNetSavings;
      record.savingsRatio = savingsRatio;
      record.financialHealth = financialHealth;

      await record.save();

      return res.status(200).json({
        success: true,
        message: "Finance record updated",
        record
      });
    }

    // Create new month record
    record = await FinanceRecord.create({
      userId,
      month,
      year,
      incomes,
      expenses,
      totalMinimumIncome,
      totalMaximumIncome,
      totalMinimumExpense,
      totalMaximumExpense,
      conservativeNetSavings,
      optimisticNetSavings,
      savingsRatio,
      financialHealth
    });

    res.status(201).json({
      success: true,
      message: "Finance record saved",
      record
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
|--------------------------------------------------------------------------
| Get Current Month Record
|--------------------------------------------------------------------------
*/
exports.getCurrentFinance = async (req, res) => {
  try {

    const today = new Date();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const record = await FinanceRecord.findOne({
      userId: req.user.id,
      month,
      year
    });

    res.status(200).json({
      success: true,
      record
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
|--------------------------------------------------------------------------
| Get Last 3 Months History
|--------------------------------------------------------------------------
*/
exports.getFinanceHistory = async (req, res) => {
  try {

    const records = await FinanceRecord.find({
      userId: req.user.id
    })
      .sort({ year: -1, month: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      count: records.length,
      records
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
|--------------------------------------------------------------------------
| Dashboard Summary API
|--------------------------------------------------------------------------
*/
exports.getDashboardSummary = async (req, res) => {
  try {

    const current = await FinanceRecord.findOne({
      userId: req.user.id
    }).sort({
      year: -1,
      month: -1
    });

    const history = await FinanceRecord.find({
      userId: req.user.id
    })
      .sort({
        year: -1,
        month: -1
      })
      .limit(6);

    /*
    ==========================================================
    INCOME BREAKDOWN
    ==========================================================
    */

    const incomeBreakdown =
      current?.incomes?.map(income => ({
        name: income.source,
        value:
          income.maximumAmount ||
          income.minimumAmount ||
          0
      })) || [];

    /*
    ==========================================================
    EXPENSE BREAKDOWN
    ==========================================================
    */

    const expenseBreakdown =
      current?.expenses?.map(expense => ({
        name: expense.expenseName,
        value:
          expense.maximumAmount ||
          expense.minimumAmount ||
          0
      })) || [];

    res.status(200).json({
      success: true,

      dashboard: {

        totalIncome:
          current?.totalMinimumIncome || 0,

        totalExpense:
          current?.totalMaximumExpense || 0,

        savings:
          current?.conservativeNetSavings || 0,

        financialHealth:
          current?.financialHealth || "N/A",

        savingsRatio:
          current?.savingsRatio || 0,

        trends: history.reverse(),

        incomeBreakdown,

        expenseBreakdown
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};