import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Mount all routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch(err => console.error(" MongoDB connection failed:", err));

app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running and healthy" });
});

app.get("/test", (req, res) => {
  res.json({ message: "TEST WORKING" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// import dotenv from 'dotenv';
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import taskRoutes from "./routes/taskRoutes.js"; // ✅ ADD THIS
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use("/api/auth", authRoutes);

// // ✅ USE ROUTES
// app.use("/api/tasks", taskRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch(err => console.error("❌ MongoDB connection failed:", err));

// app.get('/', (req, res) => {
//   res.status(200).json({ message: "Server is running and healthy" });
// });

// app.get("/test", (req, res) => {
//   res.json({ message: "TEST WORKING" });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server listening on http://localhost:${PORT}`);
// });