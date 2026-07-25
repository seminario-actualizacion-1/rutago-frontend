import { useState } from "react";
import { perfilPasajeroService } from "../../services/perfilPasajero.service";

export default function PerfilPasajero({ perfil, onRefresh, tipoDocumentoOptions }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    telefono: perfil?.telefono || "",
    direccion: perfil?.direccion || "",
    tipoDocumentoId: perfil?.tipoDocumentoId || 1,
    numeroDocumento: perfil?.numeroDocumento || "",
    fechaNacimiento: perfil?.fechaNacimiento
      ? perfil.fechaNacimiento.split("T")[0]
      : "",
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
      await perfilPasajeroService.updateMiPerfil(formData);
      setMessage("Perfil de pasajero actualizado correctamente");
      setEditing(false);
      onRefresh();
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil de pasajero");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      telefono: perfil?.telefono || "",
      direccion: perfil?.direccion || "",
      tipoDocumentoId: perfil?.tipoDocumentoId || 1,
      numeroDocumento: perfil?.numeroDocumento || "",
      fechaNacimiento: perfil?.fechaNacimiento
        ? perfil.fechaNacimiento.split("T")[0]
        : "",
    });
    setMessage("");
    setError("");
  };

  if (!editing) {
    return (
      <div className="bg-white rounded-lg shadow-sm" style={{ marginTop: "1rem" }}>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="perfil-info">
          <div className="perfil-row">
            <span className="perfil-label">Documento:</span>
            <span className="perfil-value">
              {perfil?.tipoDocumento
                ? `${perfil.tipoDocumento.abreviatura || perfil.tipoDocumento.nombre} — ${perfil.tipoDocumento.descripcion || ""}`
                : "No registrado"}{" "}
              {perfil?.numeroDocumento || ""}
            </span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Teléfono:</span>
            <span className="perfil-value">{perfil?.telefono || "No registrado"}</span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Dirección:</span>
            <span className="perfil-value">{perfil?.direccion || "No registrada"}</span>
          </div>
          <div className="perfil-row">
            <span className="perfil-label">Fecha de nacimiento:</span>
            <span className="perfil-value">
              {perfil?.fechaNacimiento
                ? new Date(perfil.fechaNacimiento).toLocaleDateString()
                : "No registrada"}
            </span>
          </div>
          <div className="perfil-actions">
            <button onClick={() => setEditing(true)} className="button button-outline">
              Editar Perfil de Pasajero
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm" style={{ marginTop: "1rem" }}>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <h2>Editar perfil de pasajero</h2>
      <form onSubmit={handleSave} className="perfil-form">
        <label>Tipo de documento</label>
        <select
          name="tipoDocumentoId"
          value={formData.tipoDocumentoId}
          onChange={handleChange}
          className="input"
        >
          {(tipoDocumentoOptions || []).map((td) => (
            <option key={td.id} value={td.id}>
              {td.abreviatura} — {td.descripcion}
            </option>
          ))}
        </select>

        <label>Número de documento</label>
        <input
          type="text"
          name="numeroDocumento"
          value={formData.numeroDocumento}
          onChange={handleChange}
          className="input"
        />

        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
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

        <label>Fecha de nacimiento</label>
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          className="input"
        />

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="button button-outline">
            Cancelar
          </button>
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Perfil de Pasajero"}
          </button>
        </div>
      </form>
    </div>
  );
}
