import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/page/LoginPage.css";

export default function LoginPage({ setAuthUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Validación básica
    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }

    // Simulación de login (luego se reemplaza con backend)
    const usuarios = [
      { email: "admin@retrobar.com", password: "1234", rol: "Admin" },
      { email: "bartender@retrobar.com", password: "1234", rol: "Bartender" },
    ];

    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    // Guardar sesión (simulación)
    setAuthUser(usuario); // se puede usar Context
    navigate("/admin/pedidos"); // redirigir al dashboard admin
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
