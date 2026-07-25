export default function UsuariosEntidad({ formData, onChange }) {
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Razón Social
        </label>
        <input
          type="text"
          value={formData.razonSocial}
          onChange={(e) => onChange("razonSocial", e.target.value)}
          className="input"
          style={{ width: "100%" }}
          required
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          NIT
        </label>
        <input
          type="text"
          value={formData.nit}
          onChange={(e) => onChange("nit", e.target.value)}
          className="input"
          style={{ width: "100%" }}
          required
        />
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Teléfono de Contacto
        </label>
        <input
          type="text"
          value={formData.telefonoContacto}
          onChange={(e) => onChange("telefonoContacto", e.target.value)}
          className="input"
          style={{ width: "100%" }}
          required
        />
      </div>
    </>
  );
}
