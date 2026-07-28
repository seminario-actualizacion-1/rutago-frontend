import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapaRutas from "../../components/MapaRutas/MapaRutas";
import { viajesService } from "../../services/viajes.service";

export default function ViajesMapaPage() {
  const { id } = useParams();
  const [viaje, setViaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await viajesService.getById(id);
        if (data && data.data) {
          setViaje(data.data);
        } else {
          setViaje(data);
        }
      } catch (err) {
        setError(err.message || "Error al cargar el viaje");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadData();
    }
  }, [id]);

  return (
    <div className="viajes-container" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Mapa del Viaje #{id}</h1>
        <button
          onClick={() => navigate("/viajes")}
          className="button button-outline"
        >
          Volver a Viajes
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="bg-white rounded-lg shadow-sm" style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
        {loading ? (
          <div className="loading-container" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div className="spinner"></div>
            <p>Cargando mapa...</p>
          </div>
        ) : !viaje?.ruta ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <p>Este viaje no tiene una ruta definida con coordenadas válidas.</p>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: "0.75rem" }}>
              {viaje.ruta.nombre}
            </h3>
            <div style={{ flex: 1, minHeight: "600px" }}>
              <MapaRutas rutas={[viaje.ruta]} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
