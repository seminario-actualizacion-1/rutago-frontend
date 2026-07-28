import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { viajesService } from "../../services/viajes.service";
import { useEstadosViaje } from "../../hooks/useEstadosViaje";
import { obtenerEstadoColor } from "./dashboardUtils";

export default function PasajeroDashboard() {
  const { nombre } = useEstadosViaje();
  const [ultimosViajes, setUltimosViajes] = useState([]);
  const [totalViajes, setTotalViajes] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await viajesService.getMisViajes({
          paginaActual: 1,
          registrosPorPagina: 5,
        });
        if (!mounted) return;
        const lista = data.data || [];
        setUltimosViajes(lista);
        setTotalViajes(data.paginacion?.totalRegistros || lista.length);
      } catch (error) {
        if (!mounted) return;
        console.error("Error al cargar datos del pasajero:", error);
      }
    })();
    return () => {
      mounted = false;
    };
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
        <Link
          to="/viajes"
          className="button button-primary"
          style={{ marginBottom: "1rem" }}
        >
          Solicitar nuevo viaje
        </Link>
      </div>

      {ultimosViajes.length > 0 && (
        <div className="dashboard-card">
          <h2>Últimos viajes</h2>
          {ultimosViajes.map((v) => (
            <div key={v.id} className="viaje-row">
              <span>
                {v.ruta?.origen?.nombre || v.ruta?.nombre || "—"} →{" "}
                {v.ruta?.destino?.nombre || v.ruta?.nombre || "—"}
              </span>
              <span className={`badge ${obtenerEstadoColor(v.estado?.id)}`}>
                {v.estado?.nombre ||
                  nombre(v.estado?.id) ||
                  v.estado?.id}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
