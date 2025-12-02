import { useState, useMemo } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import PreviewCard from "../../components/PrewivCards"; // reutilizamos la preview card
import "../../styles/pages/TragosPage.css";

export default function TragosPage({ tragos = [], setTragos }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [temaFiltro, setTemaFiltro] = useState("");
  const itemsPerPage = 6;

  // Filtrado por búsqueda y tema
  const tragosFiltrados = useMemo(() => {
    return (tragos || []).filter(t => {
      const matchNombre = t.nombre.toLowerCase().includes(search.toLowerCase());
      const matchTema = temaFiltro ? t.tema === temaFiltro : true;
      return matchNombre && matchTema;
    });
  }, [tragos, search, temaFiltro]);

  const totalPages = Math.ceil(tragosFiltrados.length / itemsPerPage);
  const currentItems = tragosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Funciones de administración
  const toggleDisponible = id => {
    setTragos(prev => (prev || []).map(t =>
      t.id === id ? { ...t, disponible: !t.disponible } : t
    ));
  };

  const cambiarTema = (id, nuevaTema) => {
    setTragos(prev => (prev || []).map(t =>
      t.id === id ? { ...t, tema: nuevaTema } : t
    ));
  };

  // Extraemos todos los temas únicos
  const temasUnicos = [...new Set((tragos || []).map(t => t.tema).filter(Boolean))];

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="tragos-page-content">
        <h1>Administrar Tragos</h1>

        {/* Filtros */}
        <div className="filtros-container">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            value={temaFiltro}
            onChange={e => { setTemaFiltro(e.target.value); setPage(1); }}
          >
            <option value="">Todos los temas</option>
            {temasUnicos.map((tema, i) => (
              <option key={i} value={tema}>{tema}</option>
            ))}
          </select>
        </div>

        {/* Grid de tragos */}
        <div className="tragos-grid">
          {currentItems.map(t => (
            <div key={t.id} className="tragos-admin-card">
              <PreviewCard trago={t} />
              <div className="acciones-admin">
                <button
                  className={t.disponible ? "btn-desactivar" : "btn-activar"}
                  onClick={() => toggleDisponible(t.id)}
                >
                  {t.disponible ? "Desactivar" : "Activar"}
                </button>
                <input
                  type="text"
                  placeholder="Cambiar tema..."
                  value={t.tema || ""}
                  onChange={e => cambiarTema(t.id, e.target.value)}
                />
              </div>
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
      </div>
    </div>
  );
}
