import { useEffect, useMemo, useState } from "react";
import api from "../api";

const categories = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

const initial = {
  amount: "",
  category: "Food",
  date: "",
  description: "",
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initial);
  const [filter, setFilter] = useState("");
  const [editId, setEditId] = useState(null);

  // Error + Success states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load Expenses
  const load = async () => {
    try {
      setError("");

      const response = await api.get("/expenses", {
        params: filter ? { category: filter } : {},
      });

      setExpenses(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load expenses");
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  // Save Expense
  const save = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.amount || Number(form.amount) <= 0) {
      return alert("Please enter valid amount");
    }

    if (!form.date) {
      return alert("Please select date");
    }

    if (!form.description.trim()) {
      return alert("Description is required");
    }

    try {
      // setError("");
      // setSuccess("");



      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editId) {
        await api.put(`/expenses/${editId}`, payload);
        alert("Expense updated successfully");
      } else {
        await api.post("/expenses", payload);
        alert("Expense added successfully");
      }

      setForm(initial);
      setEditId(null);

      load();
    } 
    //catch (err) {
    //   console.log(err);
    //   alert("Something went wrong");

    // }
     catch (err) {
       console.log(err);

        alert(
        err.response?.data?.message ||
        err.message ||
"Something went wrong"
);
}
  };

  // Delete Expense
  const remove = async (id) => {
    try {
      // setError("");
      // setSuccess("");

      await api.delete(`/expenses/${id}`);

      alert("Expense deleted successfully");

      load();
    } catch (err) {
      console.log(err);
      alert("Failed to delete expense");
    }
  };

  // Total Amount
  const total = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount), 0),
    [expenses]
  );

  // Category Wise Total
  const byCategory = useMemo(() => {
    const map = {};

    for (const e of expenses) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }

    return map;
  }, [expenses]);

  return (
    <>
      <h2>Expenses</h2>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Success Message */}
      {success && <p className="success">{success}</p>}

      {/* Form */}
      <form className="card form-grid" onSubmit={save}>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button type="submit">
          {editId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Header */}
      <div className="card expense-header">
        <div>
          <strong>Total Spending:</strong> Rs {total.toFixed(2)}
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>Rs {Number(exp.amount).toFixed(2)}</td>

                  <td>{exp.category}</td>

                  <td>
                    {new Date(exp.date).toLocaleDateString()}
                  </td>

                  <td>{exp.description}</td>

                  <td className="actions">
                    <button
                      onClick={() => {
                        setEditId(exp._id);

                        setForm({
                          ...exp,
                          date: exp.date.slice(0, 10),
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="danger"
                      onClick={() => remove(exp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No expenses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Summary */}
      <div className="card chips">
        {Object.entries(byCategory).map(([cat, value]) => (
          <span key={cat}>
            {cat}: Rs {value.toFixed(2)}
          </span>
        ))}
      </div>
    </>
  );
};

export default Expenses;







// import { useEffect, useMemo, useState } from "react";
// import api from "../api";

// const categories = ["Food", "Travel", "Bills", "Shopping", "Health", "Entertainment", "Other"];
// const initial = { amount: "", category: "Food", date: "", description: "" };

// const Expenses = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [form, setForm] = useState(initial);
//   const [filter, setFilter] = useState("");
//   const [editId, setEditId] = useState(null);

//   const load = () => api.get("/expenses", { params: filter ? { category: filter } : {} }).then((r) => setExpenses(r.data));
//   useEffect(() => void load(), [filter]);

//   const save = async (e) => {
//     e.preventDefault();
//     const payload = { ...form, amount: Number(form.amount) };
//     if (editId) await api.put(`/expenses/${editId}`, payload);
//     else await api.post("/expenses", payload);
//     setForm(initial);
//     setEditId(null);
//     load();
//   };

//   const remove = async (id) => {
//     await api.delete(`/expenses/${id}`);
//     load();
//   };

//   const total = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses]);
//   const byCategory = useMemo(() => {
//     const map = {};
//     for (const e of expenses) map[e.category] = (map[e.category] || 0) + e.amount;
//     return map;
//   }, [expenses]);

//   return (
//     <>
//       <h2>Expenses</h2>
//       <form className="card form-grid" onSubmit={save}>
//         <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
//         <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
//           {categories.map((c) => <option key={c}>{c}</option>)}
//         </select>
//         <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
//         <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
//         <button type="submit">{editId ? "Update Expense" : "Add Expense"}</button>
//       </form>

//       <div className="card expense-header">
//         <div><strong>Total Spending:</strong> Rs {total.toFixed(2)}</div>
//         <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//           <option value="">All Categories</option>
//           {categories.map((c) => <option key={c}>{c}</option>)}
//         </select>
//       </div>

//       <div className="table-wrap card">
//         <table>
//           <thead>
//             <tr><th>Amount</th><th>Category</th><th>Date</th><th>Description</th><th>Actions</th></tr>
//           </thead>
//           <tbody>
//             {expenses.map((exp) => (
//               <tr key={exp._id}>
//                 <td>Rs {Number(exp.amount).toFixed(2)}</td>
//                 <td>{exp.category}</td>
//                 <td>{new Date(exp.date).toLocaleDateString()}</td>
//                 <td>{exp.description}</td>
//                 <td className="actions">
//                   <button onClick={() => { setEditId(exp._id); setForm({ ...exp, date: exp.date.slice(0, 10) }); }}>Edit</button>
//                   <button className="danger" onClick={() => remove(exp._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="card chips">
//         {Object.entries(byCategory).map(([cat, value]) => (
//           <span key={cat}>{cat}: Rs {value.toFixed(2)}</span>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Expenses;
