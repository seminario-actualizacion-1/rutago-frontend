import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { viajesService } from "../../services/viajes.service";
import { ESTADOS_VIAJE } from "../../config/estados";
import { obtenerEstadoColor } from "./dashboardUtils";

export default function PasajeroDashboard() {
  const [ultimosViajes, setUltimosViajes] = useState([]);
  const [totalViajes, setTotalViajes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await viajesService.getMisViajes({
          paginaActual: 1,
          registrosPorPagina: 5,
        });
        const lista = data.data || [];
        setUltimosViajes(lista);
        setTotalViajes(data.paginacion?.totalRegistros || lista.length);
      } catch (error) {
        console.error("Error al cargar datos del pasajero:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Panel de Pasajero</h1>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-purple">
          <span className="stat-number">{totalViajes}</span>
          <span className="stat-label">Mis viajes</span>
        </div>
      </div>

      <div className="dashboard-section">
        <Link to="/viajes" className="button button-primary" style={{ marginBottom: "1rem" }}>
          Solicitar nuevo viaje
        </Link>
      </div>

      {ultimosViajes.length > 0 && (
        <div className="dashboard-card">
          <h2>Últimos viajes</h2>
          {ultimosViajes.map((v) => (
            <div key={v.id} className="viaje-row">
              <span>
                {v.barrioOrigen?.nombre || "—"} → {v.barrioDestino?.nombre || "—"}
              </span>
              <span className={`badge ${obtenerEstadoColor(v.estadoId)}`}>{ESTADOS_VIAJE[v.estadoId] || v.estadoId}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
