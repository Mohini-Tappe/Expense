import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  if (!title || !dueDate) return res.status(400).json({ message: "Title and due date are required" });
  const task = await Task.create({ user: req.user._id, title, description, dueDate, priority });
  res.status(201).json(task);
});

router.put("/:id", async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});

export default router;
