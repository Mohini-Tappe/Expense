import { useEffect, useState } from "react";
import api from "../api";

const initial = { title: "", description: "", dueDate: "", priority: "Medium" };

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initial);
  const [editId, setEditId] = useState(null);

  const load = () => api.get("/tasks").then((r) => setTasks(r.data));
  useEffect(() => void load(), []);

  const save = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/tasks/${editId}`, form);
    else await api.post("/tasks", form);
    setForm(initial);
    setEditId(null);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/tasks/${id}`);
    load();
  };

  const toggleStatus = async (task) => {
    await api.put(`/tasks/${task._id}`, { status: task.status === "Completed" ? "Pending" : "Completed" });
    load();
  };

  return (
    <>
      <h2>Tasks</h2>
      <form className="card form-grid" onSubmit={save}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit">{editId ? "Update Task" : "Add Task"}</button>
      </form>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Due Date</th><th>Priority</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td className="actions">
                  <button onClick={() => toggleStatus(task)}>Toggle</button>
                  <button onClick={() => { setEditId(task._id); setForm(task); }}>Edit</button>
                  <button className="danger" onClick={() => remove(task._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Tasks;
