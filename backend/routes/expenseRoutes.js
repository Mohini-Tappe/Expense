import express from "express";
import Expense from "../models/Expense.js";
import { protect } from '../middleware/auth.js';

const router = express.Router();


// CREATE Expense
router.post("/", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// READ All Expenses
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE Expense
router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE Expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;





// import express from 'express';
// import Expense from '../models/Expense.js';
// import { protect } from '../middleware/auth.js';   // ADD THIS LINE

// const router = express.Router();

// // Protect all expense routes (user must be logged in)
// router.use(protect);   // ADD THIS LINE

// // Create expense (POST)
// router.post('/', async (req, res) => {
//   const expense = new Expense({
//     ...req.body,
//     user: req.user._id   // ADD THIS LINE – associate expense with logged-in user
//   });
//   await expense.save();
//   res.json(expense);
// });

// // Get all expenses for the logged-in user (GET)
// router.get('/', async (req, res) => {
//   const expenses = await Expense.find({ user: req.user._id });   // ADD filter
//   res.json(expenses);
// });

// export default router;





// import express from 'express';
// //import Expense from '../models/Expense.js';
// import Expense from '../models/Expense.js';

// const router = express.Router();

// // Create expense
// router.post('/', async (req, res) => {
//   const expense = new Expense(req.body);
//   await expense.save();
//   res.json(expense);
// });

// // Get all expenses
// router.get('/', async (req, res) => {
//   const expenses = await Expense.find();
//   res.json(expenses);
// });

// export default router;