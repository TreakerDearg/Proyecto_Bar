import React from "react";
import "../styles/ruletaResultado.css";

export default function RuletaResultado({ trago, onConfirm, onRetry }) {
  return (
    <div className="ruleta-resultado">
      <h2 className="titulo-retro">¡Tu trago es!</h2>
      <h1 className="resultado-nombre">{trago.nombre}</h1>
      <p className="resultado-desc">{trago.descripcion}</p>

      <div className="resultado-buttons">
        <button className="btn-retro solid" onClick={onConfirm}>
          Pedir este trago
        </button>
        <button className="btn-retro outline" onClick={onRetry}>
          Volver a tirar
        </button>
      </div>
    </div>
  );
}
