import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { isAdmin, protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, isAdmin);

router.get("/users", async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Required fields missing" });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: role || "user" });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

router.delete("/users/:id", async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

export default router;
