import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import "../../styles/pages/LoginPage.css";

export default function UsuariosPage() {
  // Simulación de datos iniciales, luego vendrán del backend
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Juan Pérez", email: "juan@mail.com", rol: "Cliente", activo: true },
    { id: 2, nombre: "Ana López", email: "ana@mail.com", rol: "Bartender", activo: true },
    { id: 3, nombre: "Carlos Ruiz", email: "carlos@mail.com", rol: "Admin", activo: false },
  ]);

  const toggleActivo = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, activo: !u.activo } : u
      )
    );
    // Aquí luego harías la llamada al backend para actualizar el estado
  };

  const cambiarRol = (id, nuevoRol) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, rol: nuevoRol } : u
      )
    );
    // Aquí luego harías la llamada al backend para actualizar el rol
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="usuarios-container">
        <h1>Administrar Usuarios</h1>
        <p>Aquí puedes activar/desactivar usuarios y cambiar sus roles.</p>

        {usuarios.length === 0 ? (
          <p className="no-usuarios-msg">No hay usuarios para mostrar.</p>
        ) : (
          <div className="usuarios-list">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="usuario-item">
                <div className="usuario-info">
                  <p className="usuario-nombre">{usuario.nombre}</p>
                  <p className="usuario-email">{usuario.email}</p>
                  <p className="usuario-rol">Rol: {usuario.rol}</p>
                  <p className="usuario-estado">
                    Estado: {usuario.activo ? "Activo" : "Desactivado"}
                  </p>
                </div>

                <div className="usuario-actions">
                  <button onClick={() => toggleActivo(usuario.id)}>
                    {usuario.activo ? "Desactivar" : "Activar"}
                  </button>

                  <select
                    value={usuario.rol}
                    onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Bartender">Bartender</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
