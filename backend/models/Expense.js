import mongoose from "mongoose";

// const expenseSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     amount: { type: Number, required: true, min: 0 },
//     category: {
//       type: String,
//       enum: ["Food", "Travel", "Bills", "Shopping", "Health", "Entertainment", "Other"],
//       default: "Other"
//     },
//     date: { type: Date, required: true, default: Date.now },
//    // date: { type: Date, required: true },
//     description: { type: String, default: "" }
//   },
//   { timestamps: true }
// );

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Expense", expenseSchema);

// // Frontend example
// {
//   amount: 50,
//   category: "Food",
//   date: new Date().toISOString(),   // must be provided
//   description: "Lunch"
// }
