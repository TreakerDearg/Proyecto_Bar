import { useState, useEffect } from "react";
import "../../styles/pages/CrudTragosPage.css";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import CrearTrago from "../../components/CrearTrago";
import EditarTrago from "../../components/EditarTrago";
import BorrarTrago from "../../components/BorrarTrago";


export default function CrudTragosPage() {
  const [tragos, setTragos] = useState([]);
  const [modo, setModo] = useState("crear"); // crear, editar, borrar
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("/data/tragos.json")
      .then(r => r.json())
      .then(data => setTragos(data))
      .catch(() => setTragos([]));
  }, []);

  const filtrados = tragos.filter(t =>
    t.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="crud-tragos-page">
      <AdminSidebar />

      <h1>CRUD de Tragos</h1>

      {/* Selector de modo */}
      <div className="modo-buttons">
        {["crear", "editar", "borrar"].map(m => (
          <button
            key={m}
            className={modo === m ? "active" : ""}
            onClick={() => setModo(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Filtros solo en modo borrar */}
      {modo === "borrar" && (
        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar trago..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </div>
      )}

      {modo === "crear" && <CrearTrago tragos={tragos} setTragos={setTragos} />}
      {modo === "editar" && <EditarTrago tragos={tragos} setTragos={setTragos} />}
      {modo === "borrar" && <BorrarTrago tragos={filtrados} setTragos={setTragos} />}
    </div>
  );
}
