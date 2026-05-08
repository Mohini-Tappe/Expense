import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Tasks", path: "/tasks" },
  { label: "Expenses", path: "/expenses" }
];

const Layout = () => {
  const { user, logout } = useAuth();
  const [quote, setQuote] = useState("Stay focused and keep shipping.");

  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((r) => r.json())
      .then((data) => setQuote(`${data.content} - ${data.author}`))
      .catch(() => {});
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>TrackFlow</h2>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="nav-link">
              {item.label}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="nav-link">
              Admin Panel
            </NavLink>
          )}
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="quote">{quote}</div>
          <div className="profile-actions">
            <span>{user?.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </header>
        <section className="page-wrap">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
