import { useState, useEffect } from "react";
import api from "../../api";
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

  const [destino, setDestino] = useState("");
  const [resultados, setResultados] = useState([]);
  const [busSeleccionado, setBusSeleccionado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [toast, setToast] = useState("");

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(""), 4000);
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
      setUser(response.data.data);
      setFormData({
        nombres: response.data.data.nombres,
        apellidos: response.data.data.apellidos,
        correo: response.data.data.correo,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
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
        `/rutas/destino/${encodeURIComponent(destino)}`
      );

      setResultados(response.data);
      setBusSeleccionado(null);
      setBusquedaRealizada(true);
    } catch (err) {
      console.error("Error al buscar destino:", err);
      setResultados([]);
      setBusquedaRealizada(true);
    }
  };

  const seleccionarBus = (ruta, horario) => {
    setBusSeleccionado({
      ruta,
      horario,
      vehiculo: horario.vehiculo,
    });

    mostrarToast("Bus seleccionado correctamente");
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

      <div className="perfil-content">
        <div className="bg-white rounded-lg shadow-sm">
          <h2>Buscar buses por destino</h2>
          <p className="perfil-description">
            Consulta rutas, buses disponibles, horarios y estado del vehículo.
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
              <h3>Resultados encontrados</h3>

              {resultados.map((ruta) => (
                <div key={ruta.id} className="ruta-card">
                  <h3>{ruta.nombre}</h3>

                  <p>
                    <strong>Origen:</strong> {ruta.origen?.nombre}
                  </p>
                  <p>
                    <strong>Destino:</strong> {ruta.destino?.nombre}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {ruta.descripcion}
                  </p>
                  <p>
                    <strong>Distancia:</strong> {ruta.distanciaKm} km
                  </p>
                  <p>
                    <strong>Tiempo estimado:</strong>{" "}
                    {ruta.tiempoEstimadoMinutos} minutos
                  </p>

                  <hr />

                  <h3>Autobuses disponibles</h3>

                  {ruta.horarios?.length > 0 ? (
                    ruta.horarios.map((horario) => (
                      <div key={horario.id} className="bus-card">
                        <p>
                          <strong>Placa:</strong> {horario.vehiculo?.placa}
                        </p>
                        <p>
                          <strong>Empresa:</strong>{" "}
                          {horario.vehiculo?.perfilEntidad?.razonSocial}
                        </p>
                        <p>
                          <strong>Capacidad:</strong>{" "}
                          {horario.vehiculo?.capacidadPasajeros} pasajeros
                        </p>
                        <p>
                          <strong>Hora de salida:</strong>{" "}
                          {horario.horaSalida}
                        </p>
                        <p>
                          <strong>Frecuencia:</strong> cada{" "}
                          {horario.frecuenciaMinutos} minutos
                        </p>
                        <p>
                          <strong>Estado:</strong>{" "}
                          <span
                            className={`estado-badge ${obtenerEstadoClase(
                              horario.vehiculo?.estado
                            )}`}
                          >
                            {obtenerEstadoTexto(horario.vehiculo?.estado)}
                          </span>
                        </p>

                        <button
                          className="button button-primary"
                          onClick={() => seleccionarBus(ruta, horario)}
                        >
                          Ver resumen
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No hay buses disponibles para esta ruta.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {busSeleccionado && (
            <div className="resumen-card">
              <h3>Resumen del bus seleccionado</h3>

              <p>
                <strong>Destino:</strong>{" "}
                {busSeleccionado.ruta?.destino?.nombre}
              </p>
              <p>
                <strong>Horario:</strong>{" "}
                {busSeleccionado.horario?.horaSalida}
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

              <hr />

              <h4>Ubicación del bus</h4>

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