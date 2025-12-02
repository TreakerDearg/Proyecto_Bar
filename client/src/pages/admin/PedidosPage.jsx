import { useState, useMemo } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import "../../styles/pages/PedidosPage.css";

export default function PedidosPage({ pedidosData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Aseguramos que pedidosData siempre sea un array
  const pedidos = useMemo(() => pedidosData || [], [pedidosData]);

  // Filtrado por búsqueda
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter(p =>
      p.usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pedidos, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const currentItems = pedidosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="pedidos-page">
      <AdminSidebar />
      <div className="pedidos-content">
        <h1>Pedidos</h1>

        <div className="pedidos-search">
          <input
            type="text"
            placeholder="Buscar por usuario..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(1); // resetear a página 1 al buscar
            }}
          />
        </div>

        {currentItems.length === 0 ? (
          <p className="no-pedidos-msg">No hay pedidos para mostrar.</p>
        ) : (
          <div className="pedidos-list">
            {currentItems.map((pedido, i) => (
              <div key={i} className="pedido-item">
                <div className="pedido-info">
                  <p className="pedido-usuario">
                    Usuario: <strong>{pedido.usuario}</strong>
                  </p>
                  <p className="pedido-trago">
                    Trago: <strong>{pedido.trago}</strong>
                  </p>
                  <p className="pedido-cantidad">
                    Cantidad: <strong>{pedido.cantidad}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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
      </div>
    </div>
  );
}
