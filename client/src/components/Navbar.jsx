import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiUsers, FiPackage, FiCoffee, FiSettings } from "react-icons/fi";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <>
      <nav className="navbar-container">
        {/* LUCES HUD SUPERIORES */}
        <div className="hud-lights">
          <div className="hud-dot red"></div>
          <div className="hud-dot yellow"></div>
          <div className="hud-dot green"></div>
        </div>

        {/* LOGO */}
        <div className="navbar-left">
          <svg className="navbar-icon" viewBox="0 0 80 20">
            <defs>
              <linearGradient id="navGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#0ff" />
                <stop offset="1" stopColor="#ff00e1" />
              </linearGradient>
            </defs>

            <text
              x="40"
              y="15"
              textAnchor="middle"
              fontSize="14"
              fill="url(#navGrad)"
              className="icon-glow"
              fontFamily="Orbitron, sans-serif"
            >
              RB
            </text>
          </svg>

          <Link to="/" className="navbar-logo">
            RETROBAR
          </Link>
        </div>

        {/* LINKS DESKTOP */}
        <ul className={`navbar-links ${open ? "open" : ""}`}>
          {["Inicio", "Ruleta", "Tragos", "Productos"].map((item, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="hud-button"
            >
              <Link
                to={item === "Inicio" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
              >
                {item}
              </Link>
            </motion.li>
          ))}

          {/* BOTÓN ADMIN */}
          <li
            className="hud-button admin-btn"
            onClick={() => setAdminOpen(true)}
          >
            Admin Panel
          </li>
        </ul>

        {/* BOTÓN MOBILE */}
        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* LÍNEA NEÓN */}
        <div className="navbar-neon-line"></div>
      </nav>

      {/* SLIDE LATERAL ADMIN */}
      {adminOpen && (
        <motion.div
          className="admin-panel-slide"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <div className="admin-header">
            <h2>Panel de Administración</h2>
            <FiX className="admin-close" onClick={() => setAdminOpen(false)} />
          </div>

          <div className="admin-links">
            <Link to="/admin/pedidos" onClick={() => setAdminOpen(false)}>
              <FiPackage className="admin-icon" /> Pedidos
            </Link>

            <Link to="/admin/tragos" onClick={() => setAdminOpen(false)}>
              <FiCoffee className="admin-icon" /> Administrar Tragos
            </Link>

            <Link to="/admin/crud" onClick={() => setAdminOpen(false)}>
              <FiSettings className="admin-icon" /> CRUD de Tragos
            </Link>

            <Link to="/admin/usuarios" onClick={() => setAdminOpen(false)}>
              <FiUsers className="admin-icon" /> Administrar Usuarios
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
