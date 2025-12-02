// src/components/TragosList.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TragoCard from "./TragoCard";
import "./../styles/tragosList.css";

/**
 * TragosList
 * - tragos: array de objetos { id, nombre, precio, tematica, img, descripcion, ingredientes }
 * - onSelect: fn(trago) -> accion cuando se selecciona (por defecto navega a /pedido)
 * - pageSize: cuantos items por página (default 12)
 */
export default function TragosList({ tragos = [], onSelect, pageSize = 12 }) {
  const navigate = useNavigate();

  // onSelect por defecto: navegar a /pedido con state
  const handleSelectDefault = (trago) => {
    navigate("/pedido", { state: { trago } });
  };

  const handleSelect = onSelect || handleSelectDefault;

  // ordenar por nombre (estable)
  const sorted = useMemo(() => {
    return [...tragos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [tragos]);

  // Asignación de variante estable por id -> evitar que cambie en cada render
  const variantFor = useMemo(() => {
    const variants = ["helmet", "disk", "holo", "arcPulse"];
    const map = new Map();
    sorted.forEach((t) => {
      // simple hash: id % n
      const seed = typeof t.id === "number" ? t.id : hashString(t.id || t.nombre);
      map.set(t.id, variants[seed % variants.length]);
    });
    return map;
  }, [sorted]);

  // PAGINACIÓN LIGERA
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const visible = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  return (
    <section className="tragos-list-wrapper" aria-label="Lista de cócteles">
      <header className="tragos-list-header">
        <div className="list-meta">
          <h2 className="tragos-list-title">
            <span className="neon-glow">Cócteles Disponibles</span>
          </h2>
          <div className="list-stats">
            <span>{sorted.length} resultados</span>
            <span>•</span>
            <span>Página {page} / {totalPages}</span>
          </div>
        </div>
      </header>

      <div className="tragos-grid" role="list">
        {visible.length === 0 ? (
          <div className="no-results">No hay cócteles que coincidan.</div>
        ) : (
          visible.map((trago) => (
            <div key={trago.id} role="listitem" className="tragos-grid-item">
              <TragoCard
                trago={trago}
                onSelect={handleSelect}
                variant={variantFor.get(trago.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* PAGINACIÓN SENCILLA */}
      {totalPages > 1 && (
        <div className="tragos-pagination" aria-label="Paginación de tragos">
          <button
            className="pg-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            ←
          </button>

          <div className="pg-pages">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`pg-num ${p === page ? "active" : ""}`}
                  onClick={() => setPage(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            className="pg-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Página siguiente"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}

/* -------------------------
   Helpers
   ------------------------- */
function hashString(str = "") {
  // djb2-ish simple hash to get a reproducible number for strings
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(h >>> 0);
}
