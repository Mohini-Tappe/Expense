import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import api from "../api";

const COLORS = ["#6C63FF", "#00B894", "#FF7675", "#FDCB6E", "#74B9FF", "#A29BFE", "#55EFC4"];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/dashboard/summary").then((res) => setSummary(res.data));
  }, []);

  const categoryData = useMemo(
    () =>
      summary
        ? Object.entries(summary.categorizedExpenses || {}).map(([name, value]) => ({ name, value }))
        : [],
    [summary]
  );

  if (!summary) return <p>Loading dashboard...</p>;

  const cards = [
    ["Total Tasks", summary.totalTasks],
    ["Completed Tasks", summary.completedTasks],
    ["Pending Tasks", summary.pendingTasks],
    ["Total Expenses", `Rs ${summary.totalExpenses.toFixed(2)}`],
    ["Expense Categories", categoryData.length]
  ];

  return (
    <>
      <h2>Dashboard Overview</h2>
      <div className="grid-cards">
        {cards.map(([label, value]) => (
          <article className="card" key={label}>
            <h4>{label}</h4>
            <p>{value}</p>
          </article>
        ))}
      </div>
      <div className="chart-grid">
        <div className="card chart-card">
          <h4>Expenses by Category</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90}>
                {categoryData.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h4>Task Status</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[{ name: "Tasks", Completed: summary.completedTasks, Pending: summary.pendingTasks }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Completed" fill="#00B894" />
              <Bar dataKey="Pending" fill="#FF7675" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
