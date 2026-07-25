import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import MapaRutas from "../../components/MapaRutas/MapaRutas";
import { ESTADOS_VIAJE } from "../../config/estados";
import { viajesService } from "../../services/viajes.service";
import {
  obtenerEstadoId,
  obtenerNombrePersona,
  textoCupos,
  getInitialUser,
} from "./viajesHelpers";
import ViajesPasajero from "./ViajesPasajero";
import ViajesConductor from "./ViajesConductor";
import ViajesAdmin from "./ViajesAdmin";
import "./Viajes.css";

export default function Viajes() {
  const [detalleViaje, setDetalleViaje] = useState(null);
  const [mapaExpandido, setMapaExpandido] = useState(false);
  const [editandoViaje, setEditandoViaje] = useState(null);
  const [error, setError] = useState("");
  const [formEdit, setFormEdit] = useState({
    rutaId: "",
    horarioId: "",
    conductorId: "",
    estadoId: "",
    precioEstimado: "",
  });
  const [rutas, setRutas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [conductores, setConductores] = useState([]);

  const user = getInitialUser();
  const esAdmin = user?.rol?.id === 1;
  const esPasajero = user?.rol?.id === 3;
  const esConductor = user?.rol?.id === 2;

  const handleVerDetalle = async (viaje) => {
    try {
      const res = await viajesService.getById(viaje.id);
      setDetalleViaje(res.data || viaje);
    } catch {
      setDetalleViaje(viaje);
    }
  };

  const abrirEditar = async (viaje) => {
    setError("");
    setEditandoViaje(viaje);
    setFormEdit({
      rutaId: viaje.ruta?.id || "",
      horarioId: viaje.horario?.id || "",
      conductorId: viaje.conductor?.id || "",
      estadoId: viaje.estado?.id || "",
      precioEstimado: viaje.precioEstimado || "",
    });
    const [rRes, cRes] = await Promise.all([
      import("../../services/rutas.service").then((m) =>
        m.rutasService.getAll(),
      ),
      import("../../services/perfilConductor.service").then((m) =>
        m.perfilConductorService.getAll(),
      ),
    ]);
    setRutas(rRes.data || []);
    setConductores(cRes.data || []);
    if (viaje.ruta?.id) {
      const hRes = await import("../../services/horarios.service").then((m) =>
        m.horariosService.getByRuta(viaje.ruta.id),
      );
      setHorarios(hRes.data || []);
    }
  };

  const handleRutaChange = async (rutaId) => {
    setFormEdit((prev) => ({ ...prev, rutaId, horarioId: "" }));
    if (rutaId) {
      const hRes = await import("../../services/horarios.service").then((m) =>
        m.horariosService.getByRuta(rutaId),
      );
      setHorarios(hRes.data || []);
    } else {
      setHorarios([]);
    }
  };

  if (esPasajero) {
    return (
      <div className="viajes-container">
        <ViajesPasajero onVerDetalle={handleVerDetalle} />
        {renderModales()}
      </div>
    );
  }

  if (esConductor) {
    return (
      <div className="viajes-container">
        <ViajesConductor onVerDetalle={handleVerDetalle} />
        {renderModales()}
      </div>
    );
  }

  return (
    <div className="viajes-container">
      <ViajesAdmin onVerDetalle={handleVerDetalle} onEditar={abrirEditar} />
      {renderModales()}
    </div>
  );

  function renderModales() {
    return (
      <>
        {detalleViaje && (
          <div className="modal-overlay" onClick={() => setDetalleViaje(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "600px" }}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  Detalle del Viaje #{detalleViaje.id}
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "0.4rem",
                    alignItems: "center",
                  }}
                >
                  {detalleViaje.ruta && (
                    <button
                      type="button"
                      onClick={() => setMapaExpandido(true)}
                      style={{
                        background: "none",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    >
                      Expandir mapa
                    </button>
                  )}
                  <button
                    className="modal-close"
                    onClick={() => setDetalleViaje(null)}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <div className="detalle-grid">
                  <div className="detalle-field">
                    <label>ID</label>
                    <span>{detalleViaje.id}</span>
                  </div>
                  <div className="detalle-field">
                    <label>Estado</label>
                    <span>
                      {detalleViaje.estado?.nombre ||
                        ESTADOS_VIAJE[obtenerEstadoId(detalleViaje)] ||
                        obtenerEstadoId(detalleViaje) ||
                        "-"}
                    </span>
                  </div>
                  <div className="detalle-field">
                    <label>Ruta</label>
                    <span>{detalleViaje.ruta?.nombre || "No definida"}</span>
                  </div>
                  <div className="detalle-field">
                    <label>Horario</label>
                    <span>
                      {detalleViaje.horario?.horaSalida?.slice(0, 5) || "-"}
                    </span>
                  </div>
                  <div className="detalle-field">
                    <label>Conductor</label>
                    <span>{obtenerNombrePersona(detalleViaje.conductor)}</span>
                  </div>
                  <div className="detalle-field">
                    <label>Cupos</label>
                    <span>{textoCupos(detalleViaje)}</span>
                  </div>
                  <div className="detalle-field">
                    <label>Precio</label>
                    <span>${detalleViaje.precioEstimado || "-"}</span>
                  </div>
                  <div
                    className="detalle-field"
                    style={{ gridColumn: "span 2" }}
                  >
                    <label>Pasajeros</label>
                    {esAdmin &&
                    detalleViaje.pasajeros &&
                    detalleViaje.pasajeros.length > 0 ? (
                      <span>
                        {detalleViaje.pasajeros
                          .map((p) => obtenerNombrePersona(p))
                          .join(", ")}
                      </span>
                    ) : (
                      <span>
                        {detalleViaje.pasajeros?.length || 0} pasajero(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mapaExpandido && detalleViaje?.ruta && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setMapaExpandido(false)}
          >
            <div
              style={{
                width: "95vw",
                height: "90vh",
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                  {detalleViaje.ruta.nombre}
                </span>
                <button
                  type="button"
                  onClick={() => setMapaExpandido(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.3rem",
                    cursor: "pointer",
                    color: "#666",
                    lineHeight: 1,
                  }}
                >
                  &times;
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <MapaRutas rutas={[detalleViaje.ruta]} showSearch />
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={!!editandoViaje}
          onClose={() => setEditandoViaje(null)}
          title={editandoViaje ? `Editar Viaje #${editandoViaje.id}` : ""}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuardarEditar();
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Ruta
              </label>
              <select
                value={formEdit.rutaId}
                onChange={(e) => handleRutaChange(e.target.value)}
                className="input"
                style={{ width: "100%" }}
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Horario
              </label>
              <select
                value={formEdit.horarioId}
                onChange={(e) =>
                  setFormEdit((prev) => ({
                    ...prev,
                    horarioId: e.target.value,
                  }))
                }
                className="input"
                style={{ width: "100%" }}
              >
                <option value="">Seleccione un horario</option>
                {horarios.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.horaSalida?.slice(0, 5)} - {h.diasSemana || ""}
                  </option>
                ))}
              </select>
            </div>
            {esAdmin && (
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Conductor
                </label>
                <select
                  value={formEdit.conductorId}
                  onChange={(e) =>
                    setFormEdit((prev) => ({
                      ...prev,
                      conductorId: e.target.value,
                    }))
                  }
                  className="input"
                  style={{ width: "100%" }}
                >
                  <option value="">Seleccione un conductor</option>
                  {conductores.map((c) => (
                    <option
                      key={c.usuario?.id || c.id}
                      value={c.usuario?.id || ""}
                    >
                      {obtenerNombrePersona(c.usuario)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Estado
              </label>
              <select
                value={formEdit.estadoId}
                onChange={(e) =>
                  setFormEdit((prev) => ({ ...prev, estadoId: e.target.value }))
                }
                className="input"
                style={{ width: "100%" }}
              >
                <option value="">Seleccione un estado</option>
                {Object.entries(ESTADOS_VIAJE).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Precio
              </label>
              <input
                type="number"
                value={formEdit.precioEstimado}
                onChange={(e) =>
                  setFormEdit((prev) => ({
                    ...prev,
                    precioEstimado: e.target.value,
                  }))
                }
                className="input"
                style={{ width: "100%" }}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setEditandoViaje(null)}
                className="button button-outline"
              >
                Cancelar
              </button>
              <button type="submit" className="button button-primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  async function handleGuardarEditar() {
    try {
      await viajesService.update(editandoViaje.id, formEdit);
      setEditandoViaje(null);
      setFormEdit({
        rutaId: "",
        horarioId: "",
        conductorId: "",
        estadoId: "",
        precioEstimado: "",
      });
    } catch (err) {
      setError(err.message);
    }
  }
}
