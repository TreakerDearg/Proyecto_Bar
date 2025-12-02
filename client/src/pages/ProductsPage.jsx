// src/pages/ProductsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import TragosList from "../components/TragosList";
import "../styles/productsPage.css";

export default function ProductsPage() {
  const [tragos, setTragos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [order, setOrder] = useState("none");

  useEffect(() => {
    const loadTragos = async () => {
      const res = await fetch("/data/tragos.json");
      const data = await res.json();

      setTragos(data);
      setLoading(false);
    };

    loadTragos();
  }, []);

  // FILTRADO + ORDENAMIENTO
  const filtered = useMemo(() => {
    let result = [...tragos];

    // BUSQUEDA
    if (search.trim() !== "") {
      result = result.filter((t) =>
        t.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    // TEMÁTICA
    if (theme !== "all") {
      result = result.filter((t) => t.tematica === theme);
    }

    // PRECIO
    if (minPrice !== "") {
      result = result.filter((t) => t.precio >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((t) => t.precio <= Number(maxPrice));
    }

    // ORDENAR
    if (order === "priceAsc") {
      result.sort((a, b) => a.precio - b.precio);
    }

    if (order === "priceDesc") {
      result.sort((a, b) => b.precio - a.precio);
    }

    if (order === "alphaAsc") {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    if (order === "alphaDesc") {
      result.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    return result;
  }, [tragos, search, theme, minPrice, maxPrice, order]);

  return (
    <div className="products-page">

      <h1 className="products-title">Menú Digital — Cócteles</h1>

      {/* ==========================
           SISTEMA DE FILTROS
      ========================== */}
      <div className="filters-panel">
        {/* BUSCAR */}
        <input
          type="text"
          placeholder="Buscar trago..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-filter"
        />

        {/* TEMÁTICA */}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="select-filter"
        >
          <option value="all">Todas las temáticas</option>
          <option value="neon">Neon</option>
          <option value="clasico">Clásico</option>
          <option value="dulce">Dulce</option>
          <option value="fuerte">Fuerte</option>
          <option value="tropical">Tropical</option>
          <option value="futurista">Futurista</option>
        </select>

        {/* PRECIO */}
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input-filter"
        />

        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input-filter"
        />

        {/* ORDEN */}
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="select-filter"
        >
          <option value="none">Sin ordenar</option>
          <option value="priceAsc">Precio: menor a mayor</option>
          <option value="priceDesc">Precio: mayor a menor</option>
          <option value="alphaAsc">A → Z</option>
          <option value="alphaDesc">Z → A</option>
        </select>
      </div>

      {/* LISTA */}
      {!loading && <TragosList tragos={filtered} onSelect={() => {}} />}

      {loading && <p className="loading-text">Cargando menú...</p>}
    </div>
  );
}
