import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapaRutas from "../../components/MapaRutas/MapaRutas";
import { rutasService } from "../../services/rutas.service";

export default function RutasMapaPage() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch a large number of routes to show on the map
        const data = await rutasService.getAll({
          paginaActual: 1,
          registrosPorPagina: 100,
        });
        setRutas(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="rutas-container" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="page-header">
        <h1>Mapa de Rutas — Buenaventura</h1>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="table-actions" style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => navigate("/rutas")}
          className="button button-outline"
        >
          Ver Tabla
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm" style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
        {loading ? (
          <div className="loading-container" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div className="spinner"></div>
            <p>Cargando rutas en el mapa...</p>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: "600px" }}>
            <MapaRutas rutas={rutas} showSearch={true} />
          </div>
        )}
      </div>
    </div>
  );
}
