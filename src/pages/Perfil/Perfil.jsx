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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <p className="error">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="page-header">
        <h1>Mi Perfil</h1>
      </div>

      <div className="perfil-content">
        <div className="bg-white rounded-lg shadow-sm">
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

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
                <button onClick={() => setEditing(true)} className="button button-primary">
                  Editar Perfil
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="perfil-form">
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Nombres
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="input"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Apellidos
                </label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="input"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="input"
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={handleCancel} className="button button-outline">
                  Cancelar
                </button>
                <button type="submit" className="button button-primary" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}