import { useState, useEffect } from "react";
import api from "../../api/axios";
import { perfilConductorService } from "../../services/perfilConductor.service";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import { perfilPasajeroService } from "../../services/perfilPasajero.service";
import { ESTADOS_VEHICULO } from "../../config/estados";
import { obtenerRol } from "../../config/roles";
import PerfilConductor from "./PerfilConductor";
import PerfilPasajero from "./PerfilPasajero";
import PerfilEntidad from "./PerfilEntidad";
import "./Perfil.css";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [perfilEspecializado, setPerfilEspecializado] = useState(null);
  const [tipoDocumentoOptions, setTipoDocumentoOptions] = useState([]);

  const [destino, setDestino] = useState("");
  const [resultados, setResultados] = useState([]);
  const [busSeleccionado, setBusSeleccionado] = useState(null);
  const [detalleActivo, setDetalleActivo] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [toast, setToast] = useState("");

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(""), 3500);
  };

  const obtenerEstadoTexto = (estadoId) => {
    return ESTADOS_VEHICULO[estadoId] || "En terminal";
  };

  const obtenerEstadoClase = (estadoId) => {
    if (estadoId === 2) return "estado-ruta";
    if (estadoId === 3) return "estado-proximo";
    return "estado-terminal";
  };

  const fetchPerfil = async () => {
    try {
      const response = await api.get("/usuarios/me/perfil");
      const usuario = response.data.data;

      setUser(usuario);
      setFormData({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
      });

      if (usuario.rol?.id === 2) {
        try {
          const perfilResponse = await perfilConductorService.getMiPerfil();
          setPerfilEspecializado(perfilResponse.data || null);
        } catch {
          setPerfilEspecializado(usuario.perfilConductor || null);
        }
      } else if (usuario.rol?.id === 3) {
        try {
          const perfilResponse = await perfilPasajeroService.getMiPerfil();
          setPerfilEspecializado(perfilResponse.data || null);
        } catch {
          setPerfilEspecializado(usuario.perfilPasajero || null);
        }
      } else if (usuario.rol?.id === 4) {
        try {
          const perfilResponse = await perfilEntidadService.getMiPerfil();
          setPerfilEspecializado(perfilResponse.data || null);
        } catch {
          setPerfilEspecializado(usuario.perfilEntidad || null);
        }
      } else {
        setPerfilEspecializado(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const fetchTipoDocumentoOptions = async () => {
    try {
      const response = await api.get("/tipos-documento");
      setTipoDocumentoOptions(response.data?.data || []);
    } catch {
      // fallback vacío
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchPerfil();
      await fetchTipoDocumentoOptions();
    };
    load();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.put("/usuarios/me/perfil", formData);
      setMessage("Perfil actualizado correctamente");
      setEditing(false);
      fetchPerfil();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
    });
    setMessage("");
    setError("");
  };

  const buscarDestino = async () => {
    try {
      const response = await api.get(
        `/rutas/destino/${encodeURIComponent(destino)}`,
      );

      setResultados(response.data?.data || []);
      setBusSeleccionado(null);
      setDetalleActivo("");
      setBusquedaRealizada(true);
    } catch (err) {
      console.error("Error al buscar destino:", err);
      setResultados([]);
      setBusSeleccionado(null);
      setDetalleActivo("");
      setBusquedaRealizada(true);
    }
  };

  const mostrarDetalle = (ruta, horario, tipoDetalle) => {
    setBusSeleccionado({
      ruta,
      horario,
      vehiculo: horario.vehiculo,
    });

    setDetalleActivo(tipoDetalle);
    mostrarToast("Información cargada correctamente");
  };

  if (loading && !user) {
    return (
      <div className="perfil-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="perfil-container">
        <p className="error-message">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-header">
        <h1>Mi Perfil</h1>
      </div>

      <div className="perfil-content">
        <div className="bg-white rounded-lg shadow-sm">
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {!editing ? (
            <div className="perfil-info">
              <div className="perfil-row">
                <span className="perfil-label">Nombre:</span>
                <span className="perfil-value">{user.nombres}</span>
              </div>

              <div className="perfil-row">
                <span className="perfil-label">Apellidos:</span>
                <span className="perfil-value">{user.apellidos}</span>
              </div>

              <div className="perfil-row">
                <span className="perfil-label">Correo:</span>
                <span className="perfil-value">{user.correo}</span>
              </div>

              <div className="perfil-row">
                <span className="perfil-label">Rol:</span>
                <span className="perfil-value">{obtenerRol(user.rol?.id)}</span>
              </div>

              <div className="perfil-actions">
                <button
                  onClick={() => setEditing(true)}
                  className="button button-primary"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="perfil-form">
              <label>Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="input"
                required
              />

              <label>Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="input"
                required
              />

              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="input"
                required
              />

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="button button-outline"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {user.rol?.id === 2 && perfilEspecializado && (
        <PerfilConductor perfil={perfilEspecializado} onRefresh={fetchPerfil} />
      )}

      {user.rol?.id === 3 && perfilEspecializado && (
        <PerfilPasajero
          perfil={perfilEspecializado}
          onRefresh={fetchPerfil}
          tipoDocumentoOptions={tipoDocumentoOptions}
        />
      )}

      {user.rol?.id === 4 && perfilEspecializado && (
        <PerfilEntidad perfil={perfilEspecializado} onRefresh={fetchPerfil} />
      )}

      <div className="perfil-content">
        <div className="bg-white rounded-lg shadow-sm">
          <h2>Buscar buses por destino</h2>
          <p className="perfil-description">
            Escribe el destino y consulta los buses disponibles paso a paso.
          </p>

          <div className="buscador-rutas">
            <input
              className="input"
              placeholder="Ingrese destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />

            <button className="button button-primary" onClick={buscarDestino}>
              Buscar
            </button>
          </div>

          {busquedaRealizada && resultados.length === 0 && (
            <div className="ruta-card">
              <h3>Sin resultados</h3>
              <p>No hay buses disponibles para ese destino.</p>
            </div>
          )}

          {resultados.length > 0 && (
            <div className="resultados-rutas">
              <h3>Buses encontrados</h3>

              {resultados.map((ruta) => (
                <div key={ruta.id} className="ruta-card">
                  <h3>{ruta.nombre}</h3>

                  <p>
                    <strong>Origen:</strong> {ruta.origen?.nombre}
                  </p>

                  <p>
                    <strong>Destino:</strong> {ruta.destino?.nombre}
                  </p>

                  <hr />

                  {ruta.horarios?.length > 0 ? (
                    ruta.horarios.map((horario) => (
                      <div key={horario.id} className="bus-card">
                        <h3>Bus {horario.vehiculo?.placa}</h3>

                        <p>
                          <strong>Empresa:</strong>{" "}
                          {horario.vehiculo?.perfilEntidad?.razonSocial}
                        </p>

                        <p>
                          <strong>Capacidad:</strong>{" "}
                          {horario.vehiculo?.capacidadPasajeros} pasajeros
                        </p>

                        <p>
                          <strong>Estado:</strong>{" "}
                          <span
                            className={`estado-badge ${obtenerEstadoClase(
                              horario.vehiculo?.estadoId,
                            )}`}
                          >
                            {obtenerEstadoTexto(horario.vehiculo?.estadoId)}
                          </span>
                        </p>

                        <div className="botones-detalle">
                          <button
                            className="button button-outline"
                            onClick={() =>
                              mostrarDetalle(ruta, horario, "horario")
                            }
                          >
                            Ver horario
                          </button>

                          <button
                            className="button button-outline"
                            onClick={() =>
                              mostrarDetalle(ruta, horario, "frecuencia")
                            }
                          >
                            Ver frecuencia
                          </button>

                          <button
                            className="button button-primary"
                            onClick={() =>
                              mostrarDetalle(ruta, horario, "resumen")
                            }
                          >
                            Ver resumen
                          </button>

                          <button
                            className="button button-outline"
                            onClick={() =>
                              mostrarDetalle(ruta, horario, "ubicacion")
                            }
                          >
                            Ver ubicación
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay buses disponibles para esta ruta.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {busSeleccionado && detalleActivo === "horario" && (
            <div className="resumen-card">
              <h3>Horario del bus</h3>
              <p>
                <strong>Bus:</strong> {busSeleccionado.vehiculo?.placa}
              </p>
              <p>
                <strong>Destino:</strong>{" "}
                {busSeleccionado.ruta?.destino?.nombre}
              </p>
              <p>
                <strong>Hora de salida:</strong>{" "}
                {busSeleccionado.horario?.horaSalida}
              </p>
            </div>
          )}

          {busSeleccionado && detalleActivo === "frecuencia" && (
            <div className="resumen-card">
              <h3>Frecuencia del bus</h3>
              <p>
                <strong>Bus:</strong> {busSeleccionado.vehiculo?.placa}
              </p>
              <p>
                <strong>Frecuencia:</strong> cada{" "}
                {busSeleccionado.horario?.frecuenciaMinutos} minutos
              </p>
            </div>
          )}

          {busSeleccionado && detalleActivo === "resumen" && (
            <div className="resumen-card">
              <h3>Resumen del bus seleccionado</h3>

              <p>
                <strong>Destino:</strong>{" "}
                {busSeleccionado.ruta?.destino?.nombre}
              </p>

              <p>
                <strong>Horario:</strong> {busSeleccionado.horario?.horaSalida}
              </p>

              <p>
                <strong>Frecuencia:</strong> cada{" "}
                {busSeleccionado.horario?.frecuenciaMinutos} minutos
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                {obtenerEstadoTexto(busSeleccionado.vehiculo?.estadoId)}
              </p>

              <p>
                <strong>Placa:</strong> {busSeleccionado.vehiculo?.placa}
              </p>

              <p>
                <strong>Empresa:</strong>{" "}
                {busSeleccionado.vehiculo?.perfilEntidad?.razonSocial}
              </p>

              <p>
                <strong>Capacidad:</strong>{" "}
                {busSeleccionado.vehiculo?.capacidadPasajeros} pasajeros
              </p>
            </div>
          )}

          {busSeleccionado && detalleActivo === "ubicacion" && (
            <div className="resumen-card">
              <h3>Ubicación del bus</h3>

              <p>
                <strong>Bus:</strong> {busSeleccionado.vehiculo?.placa}
              </p>

              <div className="mapa-simulado">
                <div className="bus-icon">🚌</div>

                <p>
                  <strong>Latitud:</strong>{" "}
                  {busSeleccionado.vehiculo?.latitud || "3.8801"}
                </p>

                <p>
                  <strong>Longitud:</strong>{" "}
                  {busSeleccionado.vehiculo?.longitud || "-77.0312"}
                </p>

                <small>Ubicación simulada del bus</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
