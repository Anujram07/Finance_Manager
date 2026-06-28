const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
} = require("../controllers/goalController");

/*
|--------------------------------------------------------------------------
| Goal Routes
|--------------------------------------------------------------------------
*/

// Create New Goal
router.post("/", authMiddleware, createGoal);

// Get All Goals of Logged-in User
router.get("/", authMiddleware, getGoals);

// Update Existing Goal
router.put("/:id", authMiddleware, updateGoal);

// Delete Goal
router.delete("/:id", authMiddleware, deleteGoal);

module.exports = router;