const Goal = require("../models/Goal");

/*
|--------------------------------------------------------------------------
| Create Goal
|--------------------------------------------------------------------------
*/
exports.createGoal = async (req, res) => {
  try {
    const {
      goalName,
      goalType,
      targetAmount,
      savedAmount,
      deadline
    } = req.body;

    const userId = req.user.id;

if (!goalName || !targetAmount || !deadline) {
  return res.status(400).json({
    success: false,
    message: "Please fill all required fields"
  });
}

const progress =
  savedAmount && targetAmount
    ? Math.min(
        100,
        Math.round(
          (savedAmount / targetAmount) * 100
        )
      )
    : 0;

let status = "In Progress";

if (progress >= 100) {
  status = "Completed";
}
else if (new Date(deadline) < new Date()) {
  status = "Overdue";
}

const goal = await Goal.create({
  userId,
  goalName,
  goalType,
  customGoalType: req.body.customGoalType,
  image: req.body.image,
  targetAmount,
  savedAmount,
  progress,
  deadline,
  status
});

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal
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
| Get All Goals of Logged In User
|--------------------------------------------------------------------------
*/
exports.getGoals = async (req, res) => {
  try {

    const goals = await Goal.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals
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
| Update Goal
|--------------------------------------------------------------------------
*/
exports.updateGoal = async (req, res) => {
  try {

    const goal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      req.body,
      {
        new: true
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal
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
| Delete Goal
|--------------------------------------------------------------------------
*/
exports.deleteGoal = async (req, res) => {
  try {

    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};