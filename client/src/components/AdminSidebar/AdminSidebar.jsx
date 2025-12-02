import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaClipboardList, FaCocktail, FaPlus } from "react-icons/fa";
import "../../styles/components/AdminSidebar.css";

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!location.pathname.startsWith("/admin")) return null;

  const links = [
    { path: "/admin/pedidos", label: "Ver Pedidos", icon: <FaClipboardList /> },
    { path: "/admin/tragos", label: "Administrar Tragos", icon: <FaCocktail /> },
    { path: "/admin/crud", label: "CRUD de Tragos", icon: <FaPlus /> },
  ];

  const handleLinkClick = () => {
    if (isMobile) setOpen(false);
  };

  return (
    <>
      <button
        className={`sidebar-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Ocultar sidebar" : "Mostrar sidebar"}
      >
        <FaBars />
      </button>

      <aside className={`admin-sidebar ${open ? "open" : "closed"}`}>
        <h2 className="admin-title">Panel Admin</h2>
        <div className="admin-links">
          {links.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={handleLinkClick}
              className={location.pathname === path ? "active" : ""}
            >
              <span className="link-icon">{icon}</span>
              <span className="link-label">{label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
