import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { viajesService } from "../../services/viajes.service";
import { useEstadosViaje } from "../../hooks/useEstadosViaje";
import { obtenerEstadoColor } from "./dashboardUtils";
import { formatearHora } from "../../utils/formato";

export default function ConductorDashboard() {
  const { nombre, ESTADO, loading: loadingEstados } = useEstadosViaje();
  const [enCurso, setEnCurso] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [totalViajes, setTotalViajes] = useState(0);
  const [disponibles, setDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accionando, setAccionando] = useState(null);

  const fetchData = async () => {
    try {
      const [viajesData, disponiblesData] = await Promise.all([
        viajesService.getMisViajes({ paginaActual: 1, registrosPorPagina: 50 }),
        viajesService.getDisponibles(),
      ]);
      const lista = viajesData.data || [];
      setTotalViajes(viajesData.paginacion?.totalRegistros || lista.length);
      setEnCurso(lista.filter((v) => v.estado?.id === ESTADO.EN_CURSO));
      setAsignados(lista.filter((v) => v.estado?.id === ESTADO.ACEPTADO));
      setDisponibles(disponiblesData.data || []);
    } catch (error) {
      console.error("Error al cargar datos del conductor:", error);
    }
  };

  useEffect(() => {
    if (loadingEstados) return;
    let mounted = true;
    fetchData().finally(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [loadingEstados]);

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

  const viajeCard = (viaje, acciones) => (
    <div
      key={viaje.id}
      className="dashboard-card"
      style={{ marginTop: "0.75rem", padding: "1rem" }}
    >
      <p>
        <strong>Origen:</strong> {viaje.ruta?.origen?.nombre || "—"}{" "}
        &rarr; <strong>Destino:</strong>{" "}
        {viaje.ruta?.destino?.nombre || "—"}
      </p>
      <p>
        <strong>Ruta:</strong> {viaje.ruta?.nombre || "—"}
      </p>
      <p>
        <strong>Horario:</strong>{" "}
        {formatearHora(viaje.horario?.horaSalida) || "Sin horario"}
      </p>
      {viaje.pasajeros?.length > 0 && (
        <p>
          <strong>Solicitudes:</strong> {viaje.pasajeros.length} —{" "}
          {viaje.pasajeros
            .map((p) => `${p.pasajero?.nombres || ""} ${p.pasajero?.apellidos || ""}`)
            .join(", ")}
        </p>
      )}
      {viaje.precioEstimado != null && (
        <p>
          <strong>Precio estimado:</strong> $
          {Number(viaje.precioEstimado).toLocaleString("es-CO")}
        </p>
      )}
      <p>
        <strong>Estado:</strong>{" "}
        <span className={`badge ${obtenerEstadoColor(viaje.estado?.id)}`}>
          {viaje.estado?.nombre || nombre(viaje.estado?.id)}
        </span>
      </p>
      {acciones && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {acciones}
        </div>
      )}
    </div>
  );

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
          <span className="stat-number">{enCurso.length}</span>
          <span className="stat-label">En curso</span>
        </div>
      </div>

      {enCurso.length > 0 && (
        <div className="dashboard-card">
          <h2>Viajes en curso ({enCurso.length})</h2>
          {enCurso.map((viaje) =>
            viajeCard(viaje, (
              <>
                <button
                  className="button button-success"
                  onClick={() => handleAction(viaje.id, "finalizar")}
                  disabled={accionando === `${viaje.id}-finalizar`}
                >
                  {accionando === `${viaje.id}-finalizar` ? "..." : "Finalizar viaje"}
                </button>
                <button
                  className="button button-danger"
                  onClick={() => handleAction(viaje.id, "cancelar")}
                  disabled={accionando === `${viaje.id}-cancelar`}
                >
                  {accionando === `${viaje.id}-cancelar` ? "..." : "Cancelar viaje"}
                </button>
              </>
            ))
          )}
        </div>
      )}

      {asignados.length > 0 && (
        <div className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <h2>Viajes asignados ({asignados.length})</h2>
          {asignados.map((viaje) =>
            viajeCard(viaje, (
              <>
                <button
                  className="button button-primary"
                  onClick={() => handleAction(viaje.id, "iniciar")}
                  disabled={accionando === `${viaje.id}-iniciar`}
                >
                  {accionando === `${viaje.id}-iniciar` ? "..." : "Iniciar viaje"}
                </button>
                <button
                  className="button button-danger"
                  onClick={() => handleAction(viaje.id, "cancelar")}
                  disabled={accionando === `${viaje.id}-cancelar`}
                >
                  {accionando === `${viaje.id}-cancelar` ? "..." : "Cancelar viaje"}
                </button>
              </>
            ))
          )}
        </div>
      )}

      {enCurso.length === 0 && asignados.length === 0 && (
        <div className="dashboard-card">
          <h2>Sin viajes pendientes</h2>
          <p>Actualmente no tienes viajes en curso ni asignados.</p>
        </div>
      )}

      {disponibles.length > 0 && (
        <div className="dashboard-card" style={{ marginTop: "1.5rem" }}>
          <h2>Viajes disponibles ({disponibles.length})</h2>
          {disponibles.map((viaje) =>
            viajeCard(viaje, (
              <button
                className="button button-primary"
                onClick={() => handleAction(viaje.id, "aceptar")}
                disabled={accionando === `${viaje.id}-aceptar`}
              >
                {accionando === `${viaje.id}-aceptar` ? "..." : "Aceptar viaje"}
              </button>
            ))
          )}
        </div>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/viajes" className="button button-primary">
          Ver todos mis viajes
        </Link>
      </div>
    </>
  );
}
