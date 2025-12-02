import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// COMPONENTES
import Navbar from "./components/Navbar";

// PAGES — PÚBLICAS
import Home from "./pages/Home";           // Home.jsx
import Ruleta from "./pages/RuletaPage";   // RuletaPage.jsx
import Tragos from "./pages/PedidoPage";   // PedidoPage.jsx
import ProductsPage from "./pages/ProductsPage"; // ProductsPage.jsx

// PAGES — ADMIN
import PedidosPage from "./pages/admin/PedidosPage";       // PedidosPage.jsx
import TragosAdminPage from "./pages/admin/TragosPage";    // TragosPage.jsx
import CrudTragosPage from "./pages/admin/CrudTragosPage"; // CrudTragosPage.jsx
import UsuariosPage from "./pages/admin/UsuariosPage";  // UsuariosPage.jsx

function App() {
  return (
    <Router>
      <Navbar />

      <div className="app-container">
<Routes>
  {/* PUBLICAS */}
  <Route path="/" element={<Home />} />
  <Route path="/ruleta" element={<Ruleta />} />
  <Route path="/tragos" element={<Tragos />} />
  <Route path="/productos" element={<ProductsPage />} />

  {/* ADMIN */}
  <Route path="/admin/pedidos" element={<PedidosPage />} />
  <Route path="/admin/tragos" element={<TragosAdminPage />} />
  <Route path="/admin/crud" element={<CrudTragosPage />} />
  <Route path="/admin/usuarios" element={<UsuariosPage />} />

  {/* PAGE 404 */}
  <Route
    path="*"
    element={
      <h1 style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
        Página no encontrada
      </h1>
    }
  />
</Routes>
      </div>
    </Router>
  );
}

export default App;
