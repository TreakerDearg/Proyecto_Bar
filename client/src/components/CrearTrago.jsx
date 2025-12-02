import { useState, useMemo } from "react";
import PreviewCard from "./PrewivCards"; 
import "./../styles/pages/CrearTrago.css";

export default function CrearTrago({ tragos, setTragos }) {
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    imagen: null,
    preview: "",
    ingredientes: "",
    tema: "",
    preparacion: "" // Nueva propiedad para método de preparación
  });

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // VALIDACIÓN EN TIEMPO REAL
  const validateForm = () => {
    if (!nuevo.nombre.trim()) return "El nombre es obligatorio.";
    if (!nuevo.precio || Number(nuevo.precio) <= 0) return "Ingresa un precio válido.";
    if (!nuevo.ingredientes.trim()) return "Agrega al menos un ingrediente.";
    return "";
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) setNuevo(prev => ({ ...prev, imagen: file, preview: URL.createObjectURL(file) }));
  };

  const crearTrago = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const tragoFinal = {
      id: Date.now(),
      nombre: nuevo.nombre,
      precio: Number(nuevo.precio),
      ingredientes: nuevo.ingredientes.split(",").map(i => i.trim()),
      tema: nuevo.tema,
      preparacion: nuevo.preparacion,
      imagen: nuevo.preview,
      disponible: true
    };

    setTragos([...tragos, tragoFinal]);
    setNuevo({ nombre: "", precio: "", imagen: null, preview: "", ingredientes: "", tema: "", preparacion: "" });
    setError("");
    setPage(1); // vuelve a la primera página para mostrar el nuevo trago
  };

  // PAGINACIÓN
  const ultimosTragos = useMemo(() => tragos.slice().reverse(), [tragos]);
  const totalPages = Math.ceil(ultimosTragos.length / itemsPerPage);
  const currentItems = ultimosTragos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="crear-trago-container">
      {/* ==================================================
          FORMULARIO + PREVIEW
          Ajusta margin-left o padding en CSS para mover todo más a la izquierda
      ================================================== */}
      <div className="form-preview-wrapper" style={{ justifyContent: "flex-start" }}>
        
        {/* ------------------------------
             FORMULARIO
        ------------------------------- */}
        <div className="form-nuevo-trago">
          <h2>Crear Nuevo Trago</h2>
          {error && <p className="error">{error}</p>}

          <input
            type="text"
            placeholder="Nombre del trago"
            value={nuevo.nombre}
            onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
          />

          <input
            type="number"
            placeholder="Precio ($)"
            value={nuevo.precio}
            onChange={e => setNuevo({ ...nuevo, precio: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <input
            type="text"
            placeholder="Ingredientes (separados por coma)"
            value={nuevo.ingredientes}
            onChange={e => setNuevo({ ...nuevo, ingredientes: e.target.value })}
          />

          <input
            type="text"
            placeholder="Tema (opcional)"
            value={nuevo.tema}
            onChange={e => setNuevo({ ...nuevo, tema: e.target.value })}
          />

          {/* Solo visible para administrador */}
          <textarea
            placeholder="Método de preparación (solo admin)"
            value={nuevo.preparacion}
            onChange={e => setNuevo({ ...nuevo, preparacion: e.target.value })}
          />

          <button className="crear-btn" onClick={crearTrago}>Crear Trago</button>
        </div>

        {/* ------------------------------
             PREVIEW
        ------------------------------- */}
        <div className="preview-wrapper">
          <h3>Vista Previa</h3>
          <PreviewCard
            trago={{
              id: 0,
              nombre: nuevo.nombre || "Nombre",
              precio: nuevo.precio || 0,
              ingredientes: nuevo.ingredientes ? nuevo.ingredientes.split(",").map(i => i.trim()) : [],
              tema: nuevo.tema || "N/A",
              preparacion: nuevo.preparacion || "—",
              preview: nuevo.preview,
              imagen: nuevo.preview
            }}
          />
        </div>
      </div>

      {/* ==================================================
          ÚLTIMOS TRAGOS CREADOS CON PAGINACIÓN
      ================================================== */}
      {ultimosTragos.length > 0 && (
        <div className="ultimos-tragos">
          <h3>Últimos Tragos Creados</h3>
          <div className="ultimos-tragos-list">
            {currentItems.map(t => (
              <PreviewCard key={t.id} trago={t} />
            ))}
          </div>

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
      )}
    </div>
  );
}
