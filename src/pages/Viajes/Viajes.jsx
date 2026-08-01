import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import MapaRutas from "../../components/MapaRutas/MapaRutas";
import { useEstadosViaje } from "../../hooks/useEstadosViaje";
import { useRoles } from "../../hooks/useRoles";
import { viajesService } from "../../services/viajes.service";
import {
  obtenerEstadoId,
  obtenerNombrePersona,
  textoCupos,
  getInitialUser,
} from "./viajesHelpers";
import { formatearHora } from "../../utils/formato";
import ViajesPasajero from "./ViajesPasajero";
import ViajesConductor from "./ViajesConductor";
import ViajesAdmin from "./ViajesAdmin";
import "./Viajes.css";

export default function Viajes() {
  const navigate = useNavigate();
  const [detalleViaje, setDetalleViaje] = useState(null);
  const [editandoViaje, setEditandoViaje] = useState(null);
  const [recargarAdmin, setRecargarAdmin] = useState(0);
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

  const { nombre, opciones } = useEstadosViaje();
  const { obtenerId: obtenerIdRol, loading: loadingRoles } = useRoles();
  const user = getInitialUser();
  const rolUsuario = user?.rol?.id;
  const esAdmin = rolUsuario === obtenerIdRol("Administrador");
  const esPasajero = rolUsuario === obtenerIdRol("Pasajero");
  const esConductor = rolUsuario === obtenerIdRol("Conductor");

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
      import("../../services/conductor.service").then((m) =>
        m.conductorService.getAll(),
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

  if (loadingRoles) return <div className="viajes-container"><p style={{ textAlign: "center", padding: "2rem" }}>Cargando...</p></div>;

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
      <ViajesAdmin onVerDetalle={handleVerDetalle} onEditar={abrirEditar} recargar={recargarAdmin} />
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
                      onClick={() => navigate(`/viajes/${detalleViaje.id}/mapa`)}
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
                        nombre(obtenerEstadoId(detalleViaje)) ||
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
                      {formatearHora(detalleViaje.horario?.horaSalida) || "-"}
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
                    {formatearHora(h.horaSalida)}{h.fechaInicio ? ` - ${h.fechaInicio.split("-").reverse().join("/")} al ${h.fechaFin ? h.fechaFin.split("-").reverse().join("/") : ""}` : ""}
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
                {opciones().map(({ value: id, label }) => (
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
      const datos = Object.fromEntries(
        Object.entries(formEdit).filter(([, v]) => v !== "")
      );
      await viajesService.update(editandoViaje.id, datos);
      setEditandoViaje(null);
      setRecargarAdmin((v) => v + 1);
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
