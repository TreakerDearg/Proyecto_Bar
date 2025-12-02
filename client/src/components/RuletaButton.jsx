import React from "react";
import "../styles/ruletaButton.css";

export default function RuletaButton({ onClick, disabled, onReset }) {
  return (
    <div className="ruleta-buttons">
      <button className="btn-ruleta" onClick={onClick} disabled={disabled}>
        {disabled ? "Girando..." : "Girar Ruleta"}
      </button>
    </div>
  );
}
