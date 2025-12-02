import { useState, useMemo } from "react";
import PreviewCard from "./PrewivCards";
import "./../styles/pages/EditarTrago.css";

export default function EditarTrago({ tragos, setTragos }) {
  const [editarId, setEditarId] = useState(null);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    imagen: null,
    preview: "",
    ingredientes: "",
    tema: "",
    preparacion: ""
  });
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // 4 por fila x 2 filas

  // Filtrado por nombre
  const filtrados = useMemo(() => {
    return tragos.filter(t =>
      (t.nombre || "").toLowerCase().includes(filtro.toLowerCase())
    );
  }, [tragos, filtro]);

  // Paginación
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const currentItems = filtrados.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Inicia edición
  const iniciarEdicion = trago => {
    setEditarId(trago.id);
    setNuevo({
      nombre: trago.nombre || "",
      precio: trago.precio || "",
      imagen: null,
      preview: trago.imagen || "",
      ingredientes: Array.isArray(trago.ingredientes) ? trago.ingredientes.join(", ") : trago.ingredientes || "",
      tema: trago.tema || "",
      preparacion: trago.preparacion || ""
    });
    setError("");
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) setNuevo(prev => ({ ...prev, imagen: file, preview: URL.createObjectURL(file) }));
  };

  const guardarEdicion = () => {
    if (!nuevo.nombre || !nuevo.precio || !nuevo.ingredientes) {
      setError("Completa todos los campos correctamente.");
      return;
    }

    setTragos(tragos.map(t =>
      t.id === editarId
        ? {
            ...t,
            nombre: nuevo.nombre,
            precio: Number(nuevo.precio),
            ingredientes: nuevo.ingredientes.split(",").map(i => i.trim()),
            tema: nuevo.tema,
            preparacion: nuevo.preparacion,
            imagen: nuevo.preview || t.imagen
          }
        : t
    ));

    setEditarId(null);
    setNuevo({ nombre: "", precio: "", imagen: null, preview: "", ingredientes: "", tema: "", preparacion: "" });
    setError("");
  };

  return (
    <div className="editar-trago-container">
      {!editarId && (
        <>
          <div className="editar-filtro">
            <input
              type="text"
              placeholder="Buscar trago..."
              value={filtro}
              onChange={e => {
                setFiltro(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="editar-grid">
            {currentItems.map(t => (
              <div key={t.id} className="editar-item" onClick={() => iniciarEdicion(t)}>
                <PreviewCard
                  trago={{
                    id: t.id,
                    nombre: t.nombre,
                    precio: t.precio,
                    ingredientes: Array.isArray(t.ingredientes) ? t.ingredientes : t.ingredientes.split(","),
                    tema: t.tema,
                    preview: t.imagen,
                    imagen: t.imagen
                  }}
                />
              </div>
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
        </>
      )}

      {editarId && (
        <div className="editar-form-preview-wrapper">
          <div className="form-editar-trago">
            {error && <p className="error">{error}</p>}

            <input type="text" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
            <input type="number" placeholder="Precio" value={nuevo.precio} onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {nuevo.preview && <img className="preview-img" src={nuevo.preview} alt="Preview" />}
            <input type="text" placeholder="Ingredientes (coma separada)" value={nuevo.ingredientes} onChange={e => setNuevo({ ...nuevo, ingredientes: e.target.value })} />
            <input type="text" placeholder="Tema" value={nuevo.tema} onChange={e => setNuevo({ ...nuevo, tema: e.target.value })} />
            <textarea placeholder="Método de preparación" value={nuevo.preparacion} onChange={e => setNuevo({ ...nuevo, preparacion: e.target.value })} />

            <div className="editar-btns">
              <button onClick={guardarEdicion}>Guardar Cambios</button>
              <button className="cancelar-btn" onClick={() => {
                setEditarId(null);
                setNuevo({ nombre: "", precio: "", imagen: null, preview: "", ingredientes: "", tema: "", preparacion: "" });
                setError("");
              }}>Cancelar</button>
            </div>
          </div>

          <div className="editar-preview-wrapper">
            <h3>Vista Previa</h3>
            <PreviewCard
              trago={{
                id: editarId,
                nombre: nuevo.nombre,
                precio: nuevo.precio,
                ingredientes: nuevo.ingredientes ? nuevo.ingredientes.split(",").map(i => i.trim()) : [],
                tema: nuevo.tema,
                preview: nuevo.preview,
                imagen: nuevo.preview
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
