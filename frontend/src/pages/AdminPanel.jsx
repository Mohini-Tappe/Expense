import { useEffect, useState } from "react";
import api from "../api";

const initial = { name: "", email: "", password: "", role: "user" };

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initial);

  const load = () => api.get("/admin/users").then((r) => setUsers(r.data));
  useEffect(() => void load(), []);

  const addUser = async (e) => {
    e.preventDefault();
    await api.post("/admin/users", form);
    setForm(initial);
    load();
  };

  const removeUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <>
      <h2>Admin Panel - User Management</h2>
      <form className="card form-grid" onSubmit={addUser}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <div className="table-wrap card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="actions">
                  <button className="danger" onClick={() => removeUser(u._id || u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPanel;
