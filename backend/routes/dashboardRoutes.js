import express from "express";
import { protect } from "../middleware/auth.js";
// import Task from "../models/Task.js";
// import Expense from "../models/Expense.js";
import Expense from '../models/Expense.js';
import Task from '../models/Task.js';

const router = express.Router();
router.use(protect);

router.get("/summary", async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  const expenses = await Expense.find({ user: req.user._id });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const categorizedExpenses = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  res.json({ totalTasks, completedTasks, pendingTasks, totalExpenses, categorizedExpenses });
});

export default router;
