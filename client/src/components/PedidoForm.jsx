import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import "../styles/pedidoForm.css";

export default function PedidoForm({ tragoSeleccionado }) {
  const [nombre, setNombre] = useState("");
  const [mesa, setMesa] = useState("");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviarPedido = async () => {
    if (!nombre.trim()) return alert("Debes ingresar tu nombre");
    if (!mesa.trim()) return alert("Debes ingresar tu mesa");

    const data = {
      nombreCliente: nombre,
      bebida: tragoSeleccionado.nombre,
      mesa,
      extras: notas
    };

    try {
      setEnviando(true);
      await axiosClient.post("/pedidos", data);
      alert("¡Pedido enviado con éxito!");
    } catch (err) {
      console.error(err);
      alert("Error al enviar el pedido");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pedido-form">

      {/* ENCABEZADO CON GLOW */}
      <h2 className="pedido-title">
        📡 Confirmar Pedido
        <span className="glow-pulse"></span>
      </h2>

      {/* TARJETA DEL TRAGO */}
      <div className="pedido-trago-card">
        <h3 className="trago-title">{tragoSeleccionado.nombre}</h3>
        <p className="trago-desc">{tragoSeleccionado.descripcion}</p>
      </div>

      {/* INPUTS */}
      <input
        className="input-retro"
        type="text"
        placeholder="Tu nombre..."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="input-retro"
        type="number"
        placeholder="Número de mesa..."
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
      />

      <textarea
        className="input-retro textarea-retro"
        placeholder="Notas adicionales (opcional)..."
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
      />

      {/* BOTÓN */}

      <button
        className={`btn-retro ${enviando ? "disabled" : ""}`}
        onClick={enviarPedido}
        disabled={enviando}
      >
        {enviando ? "Enviando..." : "Confirmar pedido"}
      </button>
    </div>
  );
}
