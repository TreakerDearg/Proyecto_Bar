// src/pages/PedidoPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PedidoForm from "../components/PedidoForm";
import "../styles/page/pedidoPage.css";

export default function PedidoPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const tragoSeleccionado = state?.trago || null;

  return (
    <div className="pedido-page">

      {!tragoSeleccionado ? (
        <div className="sin-trago">
          <h2>No seleccionaste ningún cóctel.</h2>
          <button
            className="btn-neon"
            onClick={() => navigate("/productos")}
          >
            Ir al Menú
          </button>
        </div>
      ) : (
        <PedidoForm
          tragoSeleccionado={tragoSeleccionado}
          onVolver={() => navigate("/productos")}
          onReset={() => navigate("/productos")}
        />
      )}

    </div>
  );
}
