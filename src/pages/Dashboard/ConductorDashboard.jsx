import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { viajesService } from "../../services/viajes.service";
import { ESTADOS_VIAJE } from "../../config/estados";
import { obtenerEstadoColor } from "./dashboardUtils";

export default function ConductorDashboard() {
  const [viajeActivo, setViajeActivo] = useState(null);
  const [totalViajes, setTotalViajes] = useState(0);
  const [disponibles, setDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accionando, setAccionando] = useState(null);

  const fetchData = async () => {
    try {
      const [viajesData, disponiblesData] = await Promise.all([
        viajesService.getMisViajes({ paginaActual: 1, registrosPorPagina: 10 }),
        viajesService.getDisponibles(),
      ]);
      const lista = viajesData.data || [];
      setTotalViajes(viajesData.paginacion?.totalRegistros || lista.length);
      setViajeActivo(lista.find((v) => v.estado?.id === 2 || v.estado?.id === 3) || null);
      setDisponibles(disponiblesData.data || []);
    } catch (error) {
      console.error("Error al cargar datos del conductor:", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchData().finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleAction = async (viajeId, action) => {
    setAccionando(`${viajeId}-${action}`);
    try {
      await viajesService.patchAction(viajeId, action);
      await fetchData();
    } catch (error) {
      alert(error.message);
    } finally {
      setAccionando(null);
    }
  };

  if (loading) return <div className="loading-spinner" />;

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
          <p><strong>Origen:</strong> {viajeActivo.ruta?.origen?.nombre || "—"}</p>
          <p><strong>Destino:</strong> {viajeActivo.ruta?.destino?.nombre || "—"}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`badge ${obtenerEstadoColor(viajeActivo.estado?.id)}`}>
              {viajeActivo.estado?.nombre || ESTADOS_VIAJE[viajeActivo.estado?.id]}
            </span>
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {viajeActivo.estado?.id === 2 && (
              <button
                className="button button-primary"
                onClick={() => handleAction(viajeActivo.id, "iniciar")}
                disabled={accionando === `${viajeActivo.id}-iniciar`}
              >
                {accionando === `${viajeActivo.id}-iniciar` ? "..." : "Iniciar viaje"}
              </button>
            )}
            {viajeActivo.estado?.id === 3 && (
              <button
                className="button button-success"
                onClick={() => handleAction(viajeActivo.id, "finalizar")}
                disabled={accionando === `${viajeActivo.id}-finalizar`}
              >
                {accionando === `${viajeActivo.id}-finalizar` ? "..." : "Finalizar viaje"}
              </button>
            )}
            {(viajeActivo.estado?.id === 2 || viajeActivo.estado?.id === 3) && (
              <button
                className="button button-danger"
                onClick={() => handleAction(viajeActivo.id, "cancelar")}
                disabled={accionando === `${viajeActivo.id}-cancelar`}
              >
                {accionando === `${viajeActivo.id}-cancelar` ? "..." : "Cancelar viaje"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="dashboard-card">
          <h2>Sin viaje activo</h2>
          <p>Actualmente no tienes ningún viaje en curso.</p>
        </div>
      )}

      {disponibles.length > 0 && (
        <div className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <h2>Viajes disponibles ({disponibles.length})</h2>
          {disponibles.map((viaje) => (
            <div key={viaje.id} className="dashboard-card" style={{ marginTop: "0.75rem", padding: "1rem" }}>
              <p><strong>Origen:</strong> {viaje.ruta?.origen?.nombre || "—"} &rarr; <strong>Destino:</strong> {viaje.ruta?.destino?.nombre || "—"}</p>
              <p><strong>Ruta:</strong> {viaje.ruta?.nombre || "—"}</p>
              <p>
                <strong>Pasajero:</strong>{" "}
                {viaje.pasajeros?.map((p) => `${p.pasajero?.nombres || ""} ${p.pasajero?.apellidos || ""}`).join(", ") || "—"}
              </p>
              <p><strong>Horario:</strong> {viaje.horario?.horaSalida || "Sin horario"}</p>
              {viaje.precioEstimado != null && <p><strong>Precio estimado:</strong> ${Number(viaje.precioEstimado).toLocaleString("es-CO")}</p>}
              <button
                className="button button-primary"
                onClick={() => handleAction(viaje.id, "aceptar")}
                disabled={accionando === `${viaje.id}-aceptar`}
                style={{ marginTop: "0.5rem" }}
              >
                {accionando === `${viaje.id}-aceptar` ? "..." : "Aceptar viaje"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/viajes" className="button button-primary">Ver todos mis viajes</Link>
      </div>
    </>
  );
}
