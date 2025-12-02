// src/components/Presentacion.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/presentacion.css";

export default function Presentacion({ onContinue }) {
  const navigate = useNavigate();

  return (
    <div className="presentacion-container">
      <h1 className="titulo-cyber">Bienvenido al Bar Digital</h1>

      <p className="texto-intro">
        Explora nuestro menú de cócteles futuristas creados con tecnología y sabor.
      </p>

      <button 
        className="btn-neon"
        onClick={() => navigate("/productos")}  // ⬅ Aquí lo enviamos a la página correcta
      >
        Ir al Menú
      </button>
    </div>
  );
}
