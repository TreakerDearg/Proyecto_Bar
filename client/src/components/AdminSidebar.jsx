import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../styles/AdminSidebar.css";

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  // Mostrar solo en rutas de admin
  if (!location.pathname.startsWith("/admin")) return null;

  const links = [
    { path: "/admin/pedidos", label: "📦 Ver Pedidos" },
    { path: "/admin/tragos", label: "🍸 Administrar Tragos" },
    { path: "/admin/crud", label: "🛠️ CRUD de Tragos" },
  ];

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Ocultar sidebar" : "Mostrar sidebar"}
      >
        <FaBars />
      </button>

      <aside className={`admin-sidebar ${open ? "open" : "closed"}`}>
        <h2 className="admin-title">Panel Admin</h2>
        <div className="admin-links">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={location.pathname === path ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
