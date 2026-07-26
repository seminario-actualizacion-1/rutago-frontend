import { useState } from "react";
import { perfilConductorService } from "../../services/perfilConductor.service";
import { ESTADOS_CONDUCTOR } from "../../config/estados";

export default function PerfilConductor({ perfil, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    licenciaConducir: perfil?.licenciaConducir || "",
    estadoId: perfil?.estadoId || 1,
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
      await perfilConductorService.updateMiPerfil(formData);
      setMessage("Perfil de conductor actualizado correctamente");
      setEditing(false);
      onRefresh();
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil de conductor");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      licenciaConducir: perfil?.licenciaConducir || "",
      estadoId: perfil?.estadoId || 1,
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
            <span className="perfil-label">Licencia:</span>
            <span className="perfil-value">
              {perfil?.licenciaConducir || "No registrada"}
            </span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Vehículo asignado:</span>
            <span className="perfil-value">
              {perfil?.vehiculo
                ? `${perfil.vehiculo.placa} - ${perfil.vehiculo.marca} ${perfil.vehiculo.modelo}`
                : "Sin vehículo asignado"}
            </span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Estado:</span>
            <span className="perfil-value">
              {ESTADOS_CONDUCTOR[perfil?.estadoId] ||
                perfil?.estadoId ||
                "No definido"}
            </span>
          </div>
          <div className="perfil-actions">
            <button
              onClick={() => setEditing(true)}
              className="button button-outline"
            >
              Editar Perfil de Conductor
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
      <h2>Editar perfil de conductor</h2>
      <form onSubmit={handleSave} className="perfil-form">
        <label>Licencia de conducir</label>
        <input
          type="text"
          name="licenciaConducir"
          value={formData.licenciaConducir}
          onChange={handleChange}
          className="input"
        />

        <label>Estado</label>
        <select
          name="estadoId"
          value={formData.estadoId}
          onChange={handleChange}
          className="input"
        >
          <option value="1">Disponible</option>
          <option value="2">En viaje</option>
          <option value="3">Inactivo</option>
        </select>

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
            {loading ? "Guardando..." : "Guardar Perfil de Conductor"}
          </button>
        </div>
      </form>
    </div>
  );
}
