import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/User.js';
//import User from "../models/User.js";
import { protect } from "../middleware/auth.js";





const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// SIGNUP - only one route handler
router.post("/signup", async (req, res) => {
  console.log("✅ Signup route hit");
  const { name, email, password } = req.body;

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already in use" });

  // Hash password and create user
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  // Return token and user info
  res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// GET current logged-in user (protected)
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

export default router;

// const router = express.Router();

// const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
//   if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
// });

// router.post("/signup", async (req, res) => {
//   console.log("✅ Signup route hit");


//   const existing = await User.findOne({ email });
//   if (existing) return res.status(409).json({ message: "Email already in use" });

//   const hashed = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hashed });
//   res.status(201).json({
//     token: signToken(user._id),
//     user: { id: user._id, name: user.name, email: user.email, role: user.role }
//   });
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(401).json({ message: "Invalid credentials" });

//   const ok = await bcrypt.compare(password, user.password);
//   if (!ok) return res.status(401).json({ message: "Invalid credentials" });

//   res.json({
//     token: signToken(user._id),
//     user: { id: user._id, name: user.name, email: user.email, role: user.role }
//   });
// });

// router.get("/me", protect, async (req, res) => {
//   res.json(req.user);
// });

// export default router;
