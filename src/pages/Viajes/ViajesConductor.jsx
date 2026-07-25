import { useState, useEffect } from "react";
import { viajesService } from "../../services/viajes.service";
import { ESTADOS_VIAJE } from "../../config/estados";
import { obtenerEstadoId, obtenerEstadoColor, textoCuposPasajero, horarioLabel } from "./viajesHelpers";
import { Route, Clock, DollarSign, Users, MapPin } from "lucide-react";

export default function ViajesConductor({ onVerDetalle }) {
  const [viajesDisponibles, setViajesDisponibles] = useState([]);
  const [misViajes, setMisViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accionConductorId, setAccionConductorId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [disp, mis] = await Promise.all([
        viajesService.getDisponibles(),
        viajesService.getMisViajes(),
      ]);
      setViajesDisponibles(disp.data || []);
      setMisViajes(mis.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAceptarViaje = async (viajeId) => {
    setAccionConductorId(`aceptar-${viajeId}`);
    setError("");
    try {
      await viajesService.patchAction(viajeId, "aceptar");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAccionConductorId(null);
    }
  };

  const handleIniciarViaje = async (viajeId) => {
    setAccionConductorId(`iniciar-${viajeId}`);
    setError("");
    try {
      await viajesService.patchAction(viajeId, "iniciar");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAccionConductorId(null);
    }
  };

  const handleFinalizarViaje = async (viajeId) => {
    setAccionConductorId(`finalizar-${viajeId}`);
    setError("");
    try {
      await viajesService.patchAction(viajeId, "finalizar");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAccionConductorId(null);
    }
  };

  const handleCancelar = async (viajeId) => {
    setAccionConductorId(`cancelar-${viajeId}`);
    setError("");
    try {
      await viajesService.patchAction(viajeId, "cancelar");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAccionConductorId(null);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Mis viajes (Conductor)</h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Viajes disponibles y tus viajes asignados
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Cargando viajes...</p>
        </div>
      ) : (
        <>
          <div className="dashboard-section">
            <h2>Viajes disponibles</h2>
            {(() => {
              const conCupo = viajesDisponibles.filter((v) => {
                const ocupados = (v.pasajeros || []).length;
                const capacidad = v.horario?.capacidadPasajeros || 0;
                return ocupados < capacidad;
              });
              return conCupo.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: "center", padding: "2rem" }}>
                  <Route size={36} style={{ color: "#d1d5db", marginBottom: "0.75rem" }} />
                  <p style={{ color: "#6b7280" }}>No hay viajes disponibles</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                  {conCupo.map((viaje) => (
                    <div key={viaje.id} className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
                      <div style={{ padding: "1rem 1rem 0 1rem" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1f2937", margin: "0 0 0.4rem 0" }}>
                          {viaje.ruta?.nombre || "Ruta sin nombre"}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", color: "#374151", marginBottom: "0.75rem" }}>
                          <span style={{ fontWeight: 600 }}>{viaje.ruta?.origen?.nombre || "?"}</span>
                          <span style={{ color: "#9ca3af" }}>&rarr;</span>
                          <span style={{ fontWeight: 600 }}>{viaje.ruta?.destino?.nombre || "?"}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem", fontSize: "0.8rem", color: "#6b7280" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Clock size={13} /> {horarioLabel(viaje)}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <DollarSign size={13} /> ${viaje.precioEstimado || "—"}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Users size={13} /> {textoCuposPasajero(viaje)} cupos
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: "0.6rem 1rem", background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                        <button
                          className="button button-primary"
                          style={{ width: "100%", fontSize: "0.85rem" }}
                          disabled={accionConductorId === `aceptar-${viaje.id}`}
                          onClick={() => handleAceptarViaje(viaje.id)}
                        >
                          {accionConductorId === `aceptar-${viaje.id}` ? "Aceptando..." : "Aceptar viaje"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="dashboard-section" style={{ marginTop: "2rem" }}>
            <h2>Mis viajes</h2>
            {misViajes.length === 0 ? (
              <div className="dashboard-card" style={{ textAlign: "center", padding: "2rem" }}>
                <p style={{ color: "#6b7280" }}>Aún no tienes viajes asignados</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {misViajes.map((viaje) => {
                  const estadoId = obtenerEstadoId(viaje);
                  return (
                    <div key={viaje.id} className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
                      <div style={{ padding: "1rem 1rem 0 1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1f2937", margin: 0 }}>
                            {viaje.ruta?.nombre || "Ruta sin nombre"}
                          </h3>
                          <span className={`badge ${obtenerEstadoColor(estadoId)}`}>
                            {viaje.estado?.nombre || ESTADOS_VIAJE[estadoId] || estadoId || "-"}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", color: "#374151", marginBottom: "0.75rem" }}>
                          <span style={{ fontWeight: 600 }}>{viaje.ruta?.origen?.nombre || "?"}</span>
                          <span style={{ color: "#9ca3af" }}>&rarr;</span>
                          <span style={{ fontWeight: 600 }}>{viaje.ruta?.destino?.nombre || "?"}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem", fontSize: "0.8rem", color: "#6b7280" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Clock size={13} /> {horarioLabel(viaje)}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <DollarSign size={13} /> ${viaje.precioEstimado || "—"}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Users size={13} /> {textoCuposPasajero(viaje)} cupos
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: "0.6rem 1rem", background: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", gap: "0.4rem" }}>
                        <button
                          className="button button-outline"
                          style={{ flex: 1, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}
                          onClick={() => onVerDetalle(viaje)}
                        >
                          <MapPin size={13} /> Ruta
                        </button>
                        {estadoId === 2 && (
                          <>
                            <button
                              className="button button-primary"
                              style={{ flex: 1, fontSize: "0.8rem" }}
                              disabled={accionConductorId === `iniciar-${viaje.id}`}
                              onClick={() => handleIniciarViaje(viaje.id)}
                            >
                              {accionConductorId === `iniciar-${viaje.id}` ? "..." : "Iniciar"}
                            </button>
                            <button
                              className="button button-danger"
                              style={{ flex: 1, fontSize: "0.8rem" }}
                              disabled={accionConductorId === `cancelar-${viaje.id}`}
                              onClick={() => handleCancelar(viaje.id)}
                            >
                              {accionConductorId === `cancelar-${viaje.id}` ? "..." : "Cancelar"}
                            </button>
                          </>
                        )}
                        {estadoId === 3 && (
                          <>
                            <button
                              className="button button-success"
                              style={{ flex: 1, fontSize: "0.8rem" }}
                              disabled={accionConductorId === `finalizar-${viaje.id}`}
                              onClick={() => handleFinalizarViaje(viaje.id)}
                            >
                              {accionConductorId === `finalizar-${viaje.id}` ? "..." : "Finalizar"}
                            </button>
                            <button
                              className="button button-danger"
                              style={{ flex: 1, fontSize: "0.8rem" }}
                              disabled={accionConductorId === `cancelar-${viaje.id}`}
                              onClick={() => handleCancelar(viaje.id)}
                            >
                              {accionConductorId === `cancelar-${viaje.id}` ? "..." : "Cancelar"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
