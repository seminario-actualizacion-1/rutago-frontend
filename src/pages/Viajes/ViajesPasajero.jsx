import { useState, useEffect, useMemo } from "react";
import { viajesService } from "../../services/viajes.service";
import { rutasService } from "../../services/rutas.service";
import { horariosService } from "../../services/horarios.service";
import { useEstadosViaje } from "../../hooks/useEstadosViaje";
import {
  obtenerEstadoId,
  obtenerEstadoColor,
  obtenerNombrePersona,
  textoCuposPasajero,
  horarioLabel,
} from "./viajesHelpers";
import { Route, Clock, DollarSign, Users, LogOut, MapPin, Plus, Search, X } from "lucide-react";

export default function ViajesPasajero({ onVerDetalle }) {
  const { data: estadosViaje, nombre, ESTADO } = useEstadosViaje();
  const [viajesDisponibles, setViajesDisponibles] = useState([]);
  const [misViajes, setMisViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState(null);
  const [leavingId, setLeavingId] = useState(null);

  const [showCrearForm, setShowCrearForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rutas, setRutas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ rutaId: "", horarioId: "", precioEstimado: "" });

  const tieneViajeEnCurso = useMemo(() => {
    return misViajes.some((v) => {
      const eid = obtenerEstadoId(v);
      return eid === ESTADO.EN_CURSO;
    });
  }, [misViajes]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [disp, mis, rutasData] = await Promise.all([
        viajesService.obtenerDisponiblesPasajero(),
        viajesService.getMisViajes(),
        rutasService.getAll({ registrosPorPagina: 100 }),
      ]);
      setViajesDisponibles(disp.data || []);
      setMisViajes(mis.data || []);
      setRutas(rutasData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRutaChange = async (e) => {
    const rutaId = e.target.value;
    setFormData((prev) => ({ ...prev, rutaId, horarioId: "" }));
    if (!rutaId) { setHorarios([]); return; }
    try {
      const data = await horariosService.getByRuta(rutaId);
      const horariosList = data.data || [];
      setHorarios(horariosList);
      if (horariosList.length > 0) setFormData((prev) => ({ ...prev, horarioId: String(horariosList[0].id) }));
    } catch { setHorarios([]); }
  };

  const handleCrearViaje = async (e) => {
    e.preventDefault();
    if (!formData.rutaId) { setError("Selecciona una ruta"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = { rutaId: Number(formData.rutaId) };
      if (formData.horarioId) payload.horarioId = Number(formData.horarioId);
      if (formData.precioEstimado) payload.precioEstimado = Number(formData.precioEstimado);
      await viajesService.create(payload);
      setShowCrearForm(false);
      setFormData({ rutaId: "", horarioId: "", precioEstimado: "" });
      setHorarios([]);
      const disp = await viajesService.obtenerDisponiblesPasajero();
      setViajesDisponibles(disp.data || []);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const handleViajar = async (viajeId) => {
    setJoiningId(viajeId);
    setError("");
    try {
      await viajesService.unirse(viajeId);
      setViajesDisponibles((prev) => prev.filter((v) => v.id !== viajeId));
      const mis = await viajesService.getMisViajes();
      setMisViajes(mis.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setJoiningId(null);
    }
  };

  const handleBajarse = async (viajeId) => {
    setLeavingId(viajeId);
    setError("");
    try {
      await viajesService.bajarse(viajeId);
      setMisViajes((prev) => prev.filter((v) => v.id !== viajeId));
      const disp = await viajesService.obtenerDisponiblesPasajero();
      setViajesDisponibles(disp.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLeavingId(null);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Mis viajes</h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}
        >
          Viajes disponibles y tus viajes activos
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1, maxWidth: "400px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input className="input" style={{ paddingLeft: "2.25rem", width: "100%" }} placeholder="Buscar viajes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className="button button-primary" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }} onClick={() => { setShowCrearForm(!showCrearForm); setError(""); }}>
          <Plus size={16} /> {showCrearForm ? "Cerrar" : "Solicitar nuevo viaje"}
        </button>
      </div>

      {showCrearForm && (
        <div className="dashboard-card" style={{ maxWidth: "500px", marginBottom: "1.5rem", border: "2px solid #08863a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Solicitar nuevo viaje</h2>
            <button onClick={() => setShowCrearForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "0.25rem" }}><X size={18} /></button>
          </div>
          <form onSubmit={handleCrearViaje}>
            <div className="form-group">
              <label>Ruta *</label>
              <select className="input" value={formData.rutaId} onChange={handleRutaChange} required>
                <option value="">Seleccionar ruta</option>
                {rutas.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre} ({r.origen?.nombre} &rarr; {r.destino?.nombre})</option>
                ))}
              </select>
            </div>
            {formData.horarioId && horarios.length > 0 && (
              <div className="form-group">
                <label>Horario</label>
                <div className="input" style={{ background: "#f9fafb", cursor: "default", userSelect: "none" }}>
                  {horarios.find((h) => String(h.id) === formData.horarioId)?.horaSalida?.slice(0, 5)}
                  {horarios.find((h) => String(h.id) === formData.horarioId)?.frecuenciaMinutos ? ` (cada ${horarios.find((h) => String(h.id) === formData.horarioId).frecuenciaMinutos} min)` : ""}
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Precio estimado (opcional)</label>
              <input className="input" type="number" min="0" step="100" placeholder="COP" value={formData.precioEstimado} onChange={(e) => setFormData((prev) => ({ ...prev, precioEstimado: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button type="submit" className="button button-primary" disabled={saving}>{saving ? "Solicitando..." : "Solicitar viaje"}</button>
              <button type="button" className="button button-outline" onClick={() => setShowCrearForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

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
                if (searchTerm) {
                  const q = searchTerm.toLowerCase();
                  const match = v.ruta?.nombre?.toLowerCase().includes(q) || v.ruta?.origen?.nombre?.toLowerCase().includes(q) || v.ruta?.destino?.nombre?.toLowerCase().includes(q);
                  if (!match) return false;
                }
                const ocupados = (v.pasajeros || []).length;
                const capacidad = v.horario?.capacidadPasajeros || 0;
                return ocupados < capacidad;
              });
              return conCupo.length === 0 ? (
                <div
                  className="dashboard-card"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <Route
                    size={36}
                    style={{ color: "#d1d5db", marginBottom: "0.75rem" }}
                  />
                  <p style={{ color: "#6b7280" }}>
                    No hay viajes disponibles con cupo libre
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "0.75rem",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                  }}
                >
                  {conCupo.map((viaje) => (
                    <div
                      key={viaje.id}
                      className="dashboard-card"
                      style={{ padding: 0, overflow: "hidden" }}
                    >
                      <div style={{ padding: "1rem 1rem 0 1rem" }}>
                        <h3
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: "#1f2937",
                            margin: "0 0 0.4rem 0",
                          }}
                        >
                          {viaje.ruta?.nombre || "Ruta sin nombre"}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontSize: "0.85rem",
                            color: "#374151",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>
                            {viaje.ruta?.origen?.nombre || "?"}
                          </span>
                          <span style={{ color: "#9ca3af" }}>&rarr;</span>
                          <span style={{ fontWeight: 600 }}>
                            {viaje.ruta?.destino?.nombre || "?"}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.5rem",
                            marginBottom: "0.75rem",
                            fontSize: "0.8rem",
                            color: "#6b7280",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Clock size={13} /> {horarioLabel(viaje)}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <DollarSign size={13} /> $
                            {viaje.precioEstimado || "—"}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Users size={13} /> {textoCuposPasajero(viaje)}{" "}
                            cupos
                          </span>
                          {viaje.horario?.vehiculoPlaca && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              {viaje.horario.vehiculoPlaca}
                            </span>
                          )}
                          {viaje.conductor && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                gridColumn: "span 2",
                              }}
                            >
                              Conductor:{" "}
                              {viaje.conductor.nombres}{" "}
                              {viaje.conductor.apellidos || ""}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "0.6rem 1rem",
                          background: "#f9fafb",
                          borderTop: "1px solid #e5e7eb",
                          display: "flex",
                          gap: "0.4rem",
                        }}
                      >
                        <button
                          className="button button-outline"
                          style={{
                            flex: 1,
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.25rem",
                          }}
                          onClick={() => onVerDetalle(viaje)}
                        >
                          <MapPin size={13} /> Ruta
                        </button>
                        <button
                          className="button button-primary"
                          style={{
                            flex: 1,
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.3rem",
                            opacity: tieneViajeEnCurso ? 0.5 : 1,
                          }}
                          disabled={joiningId === viaje.id || tieneViajeEnCurso}
                          title={
                            tieneViajeEnCurso ? "Ya tienes un viaje en curso" : ""
                          }
                          onClick={() => handleViajar(viaje.id)}
                        >
                          {tieneViajeEnCurso ? (
                            "Ya tienes un viaje en curso"
                          ) : joiningId === viaje.id ? (
                            "Uniendo..."
                          ) : (
                            <>
                              Viajar <Users size={13} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="dashboard-section" style={{ marginTop: "2rem" }}>
            <h2>Viajes activos</h2>
            {(() => {
              const activos = misViajes.filter((v) => {
                const eid = obtenerEstadoId(v);
                return ![ESTADO.FINALIZADO, ESTADO.CANCELADO].includes(eid);
              });
              return activos.length === 0 ? (
                <div
                  className="dashboard-card"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <p style={{ color: "#6b7280" }}>No tienes viajes activos</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "0.75rem",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                  }}
                >
                  {activos.map((viaje) => {
                    const estadoId = obtenerEstadoId(viaje);
                    return (
                      <div
                        key={viaje.id}
                        className="dashboard-card"
                        style={{ padding: 0, overflow: "hidden" }}
                      >
                        <div style={{ padding: "1rem 1rem 0 1rem" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "0.4rem",
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                color: "#1f2937",
                                margin: 0,
                              }}
                            >
                              {viaje.ruta?.nombre || "Ruta sin nombre"}
                            </h3>
                            <span
                              className={`badge ${obtenerEstadoColor(estadoId)}`}
                            >
                              {viaje.estado?.nombre ||
                                nombre(estadoId) ||
                                estadoId ||
                                "-"}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontSize: "0.85rem",
                              color: "#374151",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              {viaje.ruta?.origen?.nombre || "?"}
                            </span>
                            <span style={{ color: "#9ca3af" }}>&rarr;</span>
                            <span style={{ fontWeight: 600 }}>
                              {viaje.ruta?.destino?.nombre || "?"}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "0.5rem",
                              marginBottom: "0.75rem",
                              fontSize: "0.8rem",
                              color: "#6b7280",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <Clock size={13} /> {horarioLabel(viaje)}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <DollarSign size={13} /> $
                              {viaje.precioEstimado || "—"}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <Users size={13} /> {textoCuposPasajero(viaje)}{" "}
                              cupos
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                gridColumn: "span 2",
                              }}
                            >
                              Conductor: {obtenerNombrePersona(viaje.conductor)}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "0.6rem 1rem",
                            background: "#f9fafb",
                            borderTop: "1px solid #e5e7eb",
                            display: "flex",
                            gap: "0.4rem",
                          }}
                        >
                          <button
                            className="button button-outline"
                            style={{
                              flex: 1,
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.25rem",
                            }}
                            onClick={() => onVerDetalle(viaje)}
                          >
                            <MapPin size={13} /> Ruta
                          </button>
                          <button
                            className="button button-outline"
                            style={{
                              flex: 1,
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.25rem",
                              borderColor: "#ef4444",
                              color: "#ef4444",
                            }}
                            disabled={leavingId === viaje.id}
                            onClick={() => handleBajarse(viaje.id)}
                          >
                            {leavingId === viaje.id ? (
                              "Saliendo..."
                            ) : (
                              <>
                                <LogOut size={13} /> Bajarme
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })()}
        </div>

        {misViajes.some((v) => {
          const eid = obtenerEstadoId(v);
          return [ESTADO.FINALIZADO, ESTADO.CANCELADO].includes(eid);
        }) && (
          <div className="dashboard-section" style={{ marginTop: "2rem" }}>
            <h2>Historial</h2>
            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {misViajes
                .filter((v) => {
                  const eid = obtenerEstadoId(v);
                  return [ESTADO.FINALIZADO, ESTADO.CANCELADO].includes(eid);
                })
                .map((viaje) => {
                    const estadoId = obtenerEstadoId(viaje);
                    return (
                      <div
                        key={viaje.id}
                        className="dashboard-card"
                        style={{ padding: 0, overflow: "hidden", opacity: 0.7 }}
                      >
                        <div style={{ padding: "1rem 1rem 0 1rem" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "0.4rem",
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                color: "#1f2937",
                                margin: 0,
                              }}
                            >
                              {viaje.ruta?.nombre || "Ruta sin nombre"}
                            </h3>
                            <span
                              className={`badge ${obtenerEstadoColor(estadoId)}`}
                            >
                              {viaje.estado?.nombre ||
                                nombre(estadoId) ||
                                estadoId ||
                                "-"}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontSize: "0.85rem",
                              color: "#374151",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              {viaje.ruta?.origen?.nombre || "?"}
                            </span>
                            <span style={{ color: "#9ca3af" }}>&rarr;</span>
                            <span style={{ fontWeight: 600 }}>
                              {viaje.ruta?.destino?.nombre || "?"}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "0.5rem",
                              marginBottom: "0.75rem",
                              fontSize: "0.8rem",
                              color: "#6b7280",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <Clock size={13} /> {horarioLabel(viaje)}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <DollarSign size={13} /> $
                              {viaje.precioEstimado || "—"}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <Users size={13} /> {textoCuposPasajero(viaje)}{" "}
                              cupos
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
