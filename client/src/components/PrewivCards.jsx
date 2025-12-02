import React from "react";
import "../styles/previewCard.css";

export default function PreviewCard({ trago }) {
  return (
    <div className="preview-card">
      <div className="preview-img-wrapper">
        {trago.preview || trago.imagen ? (
          <img
            src={trago.preview || trago.imagen}
            alt={trago.nombre}
            className="preview-img"
          />
        ) : (
          <div className="placeholder-img">Imagen</div>
        )}
      </div>

      <div className="preview-info">
        <h3 className="trago-title">{trago.nombre || "Nombre"}</h3>
        <p className="trago-precio">Precio: ${trago.precio || 0}</p>
        <p className="trago-ingredientes">
          Ingredientes: {trago.ingredientes?.length ? trago.ingredientes.join(", ") : "..."}
        </p>
        {trago.tema && <p className="trago-tema">Tema: {trago.tema}</p>}
      </div>
    </div>
  );
}
