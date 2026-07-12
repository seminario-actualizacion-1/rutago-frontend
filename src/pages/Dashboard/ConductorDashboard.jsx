import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { viajesService } from "../../services/viajes.service";
import { ESTADOS_VIAJE } from "../../config/estados";
import { obtenerEstadoColor } from "./dashboardUtils";

export default function ConductorDashboard() {
  const [viajeActivo, setViajeActivo] = useState(null);
  const [totalViajes, setTotalViajes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await viajesService.getMisViajes({
          paginaActual: 1,
          registrosPorPagina: 10,
        });
        const lista = data.data || [];
        setTotalViajes(data.paginacion?.totalRegistros || lista.length);
        const activo = lista.find(
          (v) => v.estadoId === 2 || v.estadoId === 3,
        );
        setViajeActivo(activo || null);
      } catch (error) {
        console.error("Error al cargar datos del conductor:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Panel de Conductor</h1>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-green">
          <span className="stat-number">{totalViajes}</span>
          <span className="stat-label">Viajes totales</span>
        </div>
        <div className="stat-card stat-card-blue">
          <span className="stat-number">{viajeActivo ? 1 : 0}</span>
          <span className="stat-label">Viaje activo</span>
        </div>
      </div>

      {viajeActivo ? (
        <div className="dashboard-card">
          <h2>Viaje en curso</h2>
          <p><strong>Origen:</strong> {viajeActivo.barrioOrigen?.nombre || "—"}</p>
          <p><strong>Destino:</strong> {viajeActivo.barrioDestino?.nombre || "—"}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`badge ${obtenerEstadoColor(viajeActivo.estadoId)}`}>
              {ESTADOS_VIAJE[viajeActivo.estadoId] || viajeActivo.estadoId}
            </span>
          </p>
          <Link to="/viajes" className="button button-primary" style={{ marginTop: "1rem" }}>
            Ver todos mis viajes
          </Link>
        </div>
      ) : (
        <div className="dashboard-card">
          <h2>Sin viaje activo</h2>
          <p>Actualmente no tienes ningún viaje en curso. Espera a que te asignen uno.</p>
          <Link to="/viajes" className="button button-primary" style={{ marginTop: "1rem" }}>
            Historial de viajes
          </Link>
        </div>
      )}
    </>
  );
}
