import { useState } from "react";
import { perfilEntidadService } from "../../services/perfilEntidad.service";

export default function PerfilEntidad({ perfil, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    telefonoContacto: perfil?.telefonoContacto || "",
    direccion: perfil?.direccion || "",
    sitioWeb: perfil?.sitioWeb || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await perfilEntidadService.updateMiPerfil(formData);
      setMessage("Perfil de entidad actualizado correctamente");
      setEditing(false);
      onRefresh();
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil de entidad");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      telefonoContacto: perfil?.telefonoContacto || "",
      direccion: perfil?.direccion || "",
      sitioWeb: perfil?.sitioWeb || "",
    });
    setMessage("");
    setError("");
  };

  if (!editing) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm"
        style={{ marginTop: "1rem" }}
      >
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="perfil-info">
          <div className="perfil-row">
            <span className="perfil-label">Teléfono de contacto:</span>
            <span className="perfil-value">
              {perfil?.telefonoContacto || "No registrado"}
            </span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Dirección:</span>
            <span className="perfil-value">
              {perfil?.direccion || "No registrada"}
            </span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Sitio web:</span>
            <span className="perfil-value">
              {perfil?.sitioWeb ? (
                <a
                  href={perfil.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {perfil.sitioWeb}
                </a>
              ) : (
                "No registrado"
              )}
            </span>
          </div>
          <div className="perfil-actions">
            <button
              onClick={() => setEditing(true)}
              className="button button-outline"
            >
              Editar Perfil de Entidad
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm"
      style={{ marginTop: "1rem" }}
    >
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <h2>Editar perfil de entidad</h2>
      <form onSubmit={handleSave} className="perfil-form">
        <label>Teléfono de contacto</label>
        <input
          type="text"
          name="telefonoContacto"
          value={formData.telefonoContacto}
          onChange={handleChange}
          className="input"
        />

        <label>Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="input"
        />

        <label>Sitio web</label>
        <input
          type="url"
          name="sitioWeb"
          value={formData.sitioWeb}
          onChange={handleChange}
          className="input"
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
            {loading ? "Guardando..." : "Guardar Perfil de Entidad"}
          </button>
        </div>
      </form>
    </div>
  );
}
