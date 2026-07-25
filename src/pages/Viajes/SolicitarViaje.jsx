import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Clock, DollarSign, Users, Plus, Search, X } from "lucide-react";
import { viajesService } from "../../services/viajes.service";
import { rutasService } from "../../services/rutas.service";
import { horariosService } from "../../services/horarios.service";
import "./Viajes.css";

export default function SolicitarViaje() {
  const navigate = useNavigate();

  const [viajesDisponibles, setViajesDisponibles] = useState([]);
  const [loadingViajes, setLoadingViajes] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCrearForm, setShowCrearForm] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    rutaId: "",
    horarioId: "",
    precioEstimado: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [viajesData, rutasData] = await Promise.all([
          viajesService.obtenerDisponiblesPasajero(),
          rutasService.getAll({ registrosPorPagina: 100 }),
        ]);
        setViajesDisponibles(viajesData.data || []);
        setRutas(rutasData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingViajes(false);
      }
    };
    load();
  }, []);

  const handleRutaChange = async (e) => {
    const rutaId = e.target.value;
    setFormData((prev) => ({ ...prev, rutaId, horarioId: "" }));
    if (!rutaId) { setHorarios([]); return; }
    try {
      const data = await horariosService.getByRuta(rutaId);
      const horariosList = data.data || [];
      setHorarios(horariosList);
      if (horariosList.length > 0) {
        setFormData((prev) => ({ ...prev, horarioId: String(horariosList[0].id) }));
      }
    } catch {
      setHorarios([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rutaId) { setError("Selecciona una ruta"); return; }
    setSaving(true);
    setError("");

    const payload = { rutaId: Number(formData.rutaId) };
    if (formData.horarioId) payload.horarioId = Number(formData.horarioId);
    if (formData.precioEstimado) payload.precioEstimado = Number(formData.precioEstimado);

    try {
      await viajesService.create(payload);
      setShowCrearForm(false);
      setFormData({ rutaId: "", horarioId: "", precioEstimado: "" });
      setHorarios([]);
      const viajesData = await viajesService.obtenerDisponiblesPasajero();
      setViajesDisponibles(viajesData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnirse = async (viajeId) => {
    setJoiningId(viajeId);
    setError("");
    try {
      await viajesService.unirse(viajeId);
      setViajesDisponibles((prev) => prev.filter((v) => v.id !== viajeId));
    } catch (err) {
      setError(err.message);
    } finally {
      setJoiningId(null);
    }
  };

  const textoCupos = (viaje) => {
    const ocupados = (viaje.pasajeros || []).length;
    const capacidad = viaje.horario?.capacidadPasajeros || 0;
    return `${ocupados}/${capacidad}`;
  };

  const horarioLabel = (viaje) =>
    viaje.horario?.horaSalida?.slice(0, 5) || "Sin horario";

  const viajesFiltrados = viajesDisponibles.filter((v) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      v.ruta?.nombre?.toLowerCase().includes(q) ||
      v.ruta?.origen?.nombre?.toLowerCase().includes(q) ||
      v.ruta?.destino?.nombre?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="viajes-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Viajes disponibles</h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Encuentra un viaje y solicita tu cupo
          </p>
        </div>
        <button
          className="button button-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          onClick={() => { setShowCrearForm(!showCrearForm); setError(""); }}
        >
          <Plus size={16} />
          {showCrearForm ? "Cerrar" : "Crear nuevo viaje"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showCrearForm && (
        <div className="dashboard-card" style={{ maxWidth: "500px", marginBottom: "1.5rem", border: "2px solid #08863a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Crear nuevo viaje</h2>
            <button
              onClick={() => setShowCrearForm(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "0.25rem" }}
            >
              <X size={18} />
            </button>
          </div>
          {loadingForm ? (
            <div className="loading-spinner" />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ruta *</label>
                <select
                  className="input"
                  value={formData.rutaId}
                  onChange={handleRutaChange}
                  required
                >
                  <option value="">Seleccionar ruta</option>
                  {rutas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} ({r.origen?.nombre} &rarr; {r.destino?.nombre})
                    </option>
                  ))}
                </select>
              </div>

              {formData.horarioId && horarios.length > 0 && (
                <div className="form-group">
                  <label>Horario</label>
                  <div className="input" style={{ background: "#f9fafb", cursor: "default", userSelect: "none" }}>
                    {horarios.find((h) => String(h.id) === formData.horarioId)?.horaSalida?.slice(0, 5)}
                    {horarios.find((h) => String(h.id) === formData.horarioId)?.frecuenciaMinutos
                      ? ` (cada ${horarios.find((h) => String(h.id) === formData.horarioId).frecuenciaMinutos} min)`
                      : ""}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Precio estimado (opcional)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="COP"
                  value={formData.precioEstimado}
                  onChange={(e) => setFormData((prev) => ({ ...prev, precioEstimado: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="submit" className="button button-primary" disabled={saving}>
                  {saving ? "Creando..." : "Crear viaje"}
                </button>
                <button type="button" className="button button-outline" onClick={() => setShowCrearForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!showCrearForm && (
        <div style={{ marginBottom: "1rem", maxWidth: "400px" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              className="input"
              style={{ paddingLeft: "2.25rem" }}
              placeholder="Buscar por ruta, origen o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {loadingViajes ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Cargando viajes disponibles...</p>
        </div>
      ) : viajesFiltrados.length === 0 ? (
        <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <Route size={48} style={{ color: "#d1d5db", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
            {searchTerm ? "Sin resultados" : "No hay viajes disponibles"}
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Aún no hay viajes publicados. Crea uno nuevo para encontrar conductor."}
          </p>
          {!searchTerm && (
            <button
              className="button button-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              onClick={() => { setShowCrearForm(true); setError(""); }}
            >
              <Plus size={16} />
              Crear nuevo viaje
            </button>
          )}
        </div>
      ) : (
        <div className="viajes-grid" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {viajesFiltrados.map((viaje) => (
            <div key={viaje.id} className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.25rem 0 1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1f2937", margin: 0 }}>
                    {viaje.ruta?.nombre || "Ruta sin nombre"}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem", color: "#374151" }}>
                  <span style={{ fontWeight: 600 }}>{viaje.ruta?.origen?.nombre || "?"}</span>
                  <span style={{ color: "#9ca3af" }}>&rarr;</span>
                  <span style={{ fontWeight: 600 }}>{viaje.ruta?.destino?.nombre || "?"}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "#6b7280" }}>
                    <Clock size={14} />
                    <span>{horarioLabel(viaje)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "#6b7280" }}>
                    <DollarSign size={14} />
                    <span>${viaje.precioEstimado || "Por definir"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "#6b7280" }}>
                    <Users size={14} />
                    <span>{textoCupos(viaje)} cupos</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", color: "#6b7280" }}>
                    <Route size={14} />
                    <span>{viaje.ruta?.distanciaKm ? `${viaje.ruta.distanciaKm} km` : "-"}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: "0.75rem 1.25rem", background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                <button
                  className="button button-primary"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                  disabled={joiningId === viaje.id}
                  onClick={() => handleUnirse(viaje.id)}
                >
                  {joiningId === viaje.id ? (
                    "Uniendo..."
                  ) : (
                    <>Solicitar cupo <Users size={14} /></>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}