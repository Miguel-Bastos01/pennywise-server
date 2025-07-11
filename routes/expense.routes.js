const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET all expenses (with optional filter for "this-month")
router.get("/expenses", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  const filter = req.query.filter;

  let query = { user: userId };

  if (filter === "this-month") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    query.createdAt = { $gte: startOfMonth, $lt: endOfMonth };
  }

  try {
    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error in GET /expenses:", err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});


// POST create new expense
router.post("/expenses", isAuthenticated, async (req, res, next) => {
  const { category, amount, title, notes, mood } = req.body;
  const userId = req.payload._id;

  if (!category || !amount || !title) {
    return res.status(400).json({ message: "Missing required field" });
  }

  try {
    const newExpense = await Expense.create({
      user: userId,
      category,
      amount,
      title,
      notes,
      mood,
    });
    res.status(201).json(newExpense);
  } catch (err) {
    next(err);
  }
});

// GET single expense by ID
router.get("/expenses/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOne({ _id: id, user: req.payload._id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (err) {
    next(err);
  }
});

// PUT update expense by ID
router.put("/expenses/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { category, amount, title, notes, mood } = req.body;

  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: req.payload._id },
      { category, amount, title, notes, mood },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.status(200).json(updatedExpense);
  } catch (err) {
    next(err);
  }
});

// DELETE expense by ID
router.delete("/expenses/:expenseId", isAuthenticated, async (req, res, next) => {
  const { expenseId } = req.params;

  try {
    const deleted = await Expense.findByIdAndDelete(expenseId);

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;
