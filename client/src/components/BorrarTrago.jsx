import { useState, useMemo } from "react";
import "./../styles/pages/BorrarTrago.css";

export default function BorrarTrago({ tragos, setTragos }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // número de tragos por página

  const eliminarTrago = id => {
    if (window.confirm("¿Seguro que quieres eliminar este trago?")) {
      setTragos(prev => prev.filter(t => t.id !== id));
      // en el futuro aquí se llamaría al backend para eliminarlo
    }
  };

  // Filtrado por búsqueda
  const filteredTragos = useMemo(() => {
    return tragos.filter(t =>
      t.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (t.tema && t.tema.toLowerCase().includes(search.toLowerCase()))
    );
  }, [tragos, search]);

  // Paginación
  const totalPages = Math.ceil(filteredTragos.length / itemsPerPage);
  const currentItems = filteredTragos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="borrar-tragos-container">
      {/* Buscador */}
      <input
        type="text"
        className="search-input"
        placeholder="Buscar por nombre o tema..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />

      {filteredTragos.length === 0 ? (
        <p className="no-tragos-msg">No hay tragos que coincidan.</p>
      ) : (
        <>
          <div className="borrar-tragos-list">
            {currentItems.map(trago => (
              <div key={trago.id} className="borrar-trago-item">
                {trago.imagen && (
                  <div className="trago-img-preview">
                    <img src={trago.imagen} alt={trago.nombre} />
                  </div>
                )}

                <div className="borrar-trago-info">
                  <p className="trago-nombre">{trago.nombre}</p>
                  <p className="trago-precio">Precio: ${trago.precio}</p>
                  {trago.tema && <p className="trago-tema">Tema: {trago.tema}</p>}
                </div>

                <button
                  className="borrar-btn"
                  onClick={() => eliminarTrago(trago.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={page === i + 1 ? "active" : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
