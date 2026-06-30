import { useState, useEffect } from "react";
import api from "../../api";
import { perfilConductorService } from "../../services/perfilConductor.service";
import { perfilEntidadService } from "../../services/perfilEntidad.service";
import "./Perfil.css";

function obtenerRol(rolId) {
  switch (rolId) {
    case 1:
      return "Administrador";
    case 2:
      return "Conductor";
    case 3:
      return "Pasajero";
    case 4:
      return "Entidad Externa";
    default:
      return "Usuario";
  }
}

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
  const [editingEntidad, setEditingEntidad] = useState(false);
  const [editingConductor, setEditingConductor] = useState(false);
  const [entidadFormData, setEntidadFormData] = useState({
    razonSocial: "",
    nit: "",
    telefonoContacto: "",
  });
  const [conductorFormData, setConductorFormData] = useState({
    licenciaConducir: "",
    estado: "DISPONIBLE",
  });

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

  const obtenerEstadoTexto = (estado) => {
    if (estado === "EN_RUTA") return "En ruta";
    if (estado === "PROXIMO") return "Próximo";
    return "En terminal";
  };

  const obtenerEstadoClase = (estado) => {
    if (estado === "EN_RUTA") return "estado-ruta";
    if (estado === "PROXIMO") return "estado-proximo";
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

      if (usuario.rolId === 2) {
        try {
          const perfilResponse = await perfilConductorService.getMiPerfil();
          const perfilConductor = perfilResponse.data || null;
          setPerfilEspecializado(perfilConductor);
          setConductorFormData({
            licenciaConducir: perfilConductor?.licenciaConducir || "",
            estado: perfilConductor?.estado || "DISPONIBLE",
          });
        } catch {
          const perfilConductor = usuario.perfilConductor || null;
          setPerfilEspecializado(perfilConductor);
          setConductorFormData({
            licenciaConducir: perfilConductor?.licenciaConducir || "",
            estado: perfilConductor?.estado || "DISPONIBLE",
          });
        }
      } else if (usuario.rolId === 4) {
        try {
          const perfilResponse = await perfilEntidadService.getMiPerfil();
          const perfilEntidad = perfilResponse.data || null;
          setPerfilEspecializado(perfilEntidad);
          setEntidadFormData({
            razonSocial: perfilEntidad?.razonSocial || "",
            nit: perfilEntidad?.nit || "",
            telefonoContacto: perfilEntidad?.telefonoContacto || "",
          });
        } catch {
          const perfilEntidad = usuario.perfilEntidad || null;
          setPerfilEspecializado(perfilEntidad);
          setEntidadFormData({
            razonSocial: perfilEntidad?.razonSocial || "",
            nit: perfilEntidad?.nit || "",
            telefonoContacto: perfilEntidad?.telefonoContacto || "",
          });
        }
      } else {
        setPerfilEspecializado(null);
        setEntidadFormData({
          razonSocial: "",
          nit: "",
          telefonoContacto: "",
        });
        setConductorFormData({
          licenciaConducir: "",
          estado: "DISPONIBLE",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPerfil = async () => {
      await fetchPerfil();
    };

    loadPerfil();
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

  const handleEntidadChange = (e) => {
    setEntidadFormData({
      ...entidadFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConductorChange = (e) => {
    setConductorFormData({
      ...conductorFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEntidadSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await perfilEntidadService.updateMiPerfil(entidadFormData);
      setMessage("Perfil de entidad actualizado correctamente");
      setEditingEntidad(false);
      await fetchPerfil();
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil de entidad");
    } finally {
      setLoading(false);
    }
  };

  const handleEntidadCancel = () => {
    setEditingEntidad(false);
    setEntidadFormData({
      razonSocial: perfilEspecializado?.razonSocial || "",
      nit: perfilEspecializado?.nit || "",
      telefonoContacto: perfilEspecializado?.telefonoContacto || "",
    });
    setMessage("");
    setError("");
  };

  const handleConductorSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await perfilConductorService.updateMiPerfil(conductorFormData);
      setMessage("Perfil de conductor actualizado correctamente");
      setEditingConductor(false);
      await fetchPerfil();
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil de conductor");
    } finally {
      setLoading(false);
    }
  };

  const handleConductorCancel = () => {
    setEditingConductor(false);
    setConductorFormData({
      licenciaConducir: perfilEspecializado?.licenciaConducir || "",
      estado: perfilEspecializado?.estado || "DISPONIBLE",
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
                <span className="perfil-value">{obtenerRol(user.rolId)}</span>
              </div>

              {user.rolId === 2 && perfilEspecializado && (
                <>
                  <div className="perfil-row">
                    <span className="perfil-label">Licencia:</span>
                    <span className="perfil-value">
                      {perfilEspecializado.licenciaConducir || "No registrada"}
                    </span>
                  </div>

                  <div className="perfil-row">
                    <span className="perfil-label">Vehículo asignado:</span>
                    <span className="perfil-value">
                      {perfilEspecializado.vehiculo
                        ? `${perfilEspecializado.vehiculo.placa} - ${perfilEspecializado.vehiculo.marca} ${perfilEspecializado.vehiculo.modelo}`
                        : "Sin vehículo asignado"}
                    </span>
                  </div>

                  <div className="perfil-row">
                    <span className="perfil-label">Estado:</span>
                    <span className="perfil-value">
                      {perfilEspecializado.estado || "No definido"}
                    </span>
                  </div>
                </>
              )}

              {user.rolId === 4 && perfilEspecializado && (
                <>
                  <div className="perfil-row">
                    <span className="perfil-label">Razón social:</span>
                    <span className="perfil-value">
                      {perfilEspecializado.razonSocial || "No registrada"}
                    </span>
                  </div>

                  <div className="perfil-row">
                    <span className="perfil-label">NIT:</span>
                    <span className="perfil-value">
                      {perfilEspecializado.nit || "No registrado"}
                    </span>
                  </div>

                  <div className="perfil-row">
                    <span className="perfil-label">Teléfono de contacto:</span>
                    <span className="perfil-value">
                      {perfilEspecializado.telefonoContacto || "No registrado"}
                    </span>
                  </div>
                </>
              )}

              <div className="perfil-actions">
                <button
                  onClick={() => setEditing(true)}
                  className="button button-primary"
                >
                  Editar Perfil
                </button>
                {user.rolId === 2 && perfilEspecializado && (
                  <button
                    onClick={() => setEditingConductor(true)}
                    className="button button-outline"
                    style={{ marginLeft: "0.75rem" }}
                  >
                    Editar Perfil de Conductor
                  </button>
                )}
                {user.rolId === 4 && perfilEspecializado && (
                  <button
                    onClick={() => setEditingEntidad(true)}
                    className="button button-outline"
                    style={{ marginLeft: "0.75rem" }}
                  >
                    Editar Perfil de Entidad
                  </button>
                )}
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

      {user.rolId === 2 && perfilEspecializado && editingConductor && (
        <div className="perfil-content">
          <div className="bg-white rounded-lg shadow-sm">
            <h2>Editar perfil de conductor</h2>
            <form onSubmit={handleConductorSave} className="perfil-form">
              <label>Licencia de conducir</label>
              <input
                type="text"
                name="licenciaConducir"
                value={conductorFormData.licenciaConducir}
                onChange={handleConductorChange}
                className="input"
              />

              <label>Estado</label>
              <select
                name="estado"
                value={conductorFormData.estado}
                onChange={handleConductorChange}
                className="input"
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="EN_VIAJE">En viaje</option>
                <option value="INACTIVO">Inactivo</option>
              </select>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleConductorCancel}
                  className="button button-outline"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Perfil de Conductor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {user.rolId === 4 && perfilEspecializado && editingEntidad && (
        <div className="perfil-content">
          <div className="bg-white rounded-lg shadow-sm">
            <h2>Editar perfil de entidad</h2>
            <form onSubmit={handleEntidadSave} className="perfil-form">
              <label>Razón social</label>
              <input
                type="text"
                name="razonSocial"
                value={entidadFormData.razonSocial}
                onChange={handleEntidadChange}
                className="input"
                required
              />

              <label>NIT</label>
              <input
                type="text"
                name="nit"
                value={entidadFormData.nit}
                onChange={handleEntidadChange}
                className="input"
              />

              <label>Teléfono de contacto</label>
              <input
                type="text"
                name="telefonoContacto"
                value={entidadFormData.telefonoContacto}
                onChange={handleEntidadChange}
                className="input"
              />

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleEntidadCancel}
                  className="button button-outline"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Perfil de Entidad"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
                              horario.vehiculo?.estado,
                            )}`}
                          >
                            {obtenerEstadoTexto(horario.vehiculo?.estado)}
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
                {obtenerEstadoTexto(busSeleccionado.vehiculo?.estado)}
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
