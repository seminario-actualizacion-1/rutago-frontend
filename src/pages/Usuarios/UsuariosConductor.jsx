import { ESTADOS_CONDUCTOR } from "../../config/estados";

export default function UsuariosConductor({ formData, onChange, vehiculos }) {
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
          }}
        >
          Licencia de Conducir
        </label>
        <input
          type="text"
          value={formData.licenciaConducir}
          onChange={(e) => onChange("licenciaConducir", e.target.value)}
          className="input"
          style={{ width: "100%" }}
          required
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
          }}
        >
          Vehículo
        </label>
        <select
          value={formData.vehiculoId}
          onChange={(e) => onChange("vehiculoId", parseInt(e.target.value))}
          className="input"
          style={{ width: "100%" }}
        >
          <option value="">Sin vehículo asignado</option>
          {(vehiculos || []).map((vehiculo) => (
            <option key={vehiculo.id} value={vehiculo.id}>
              {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
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
          Estado
        </label>
        <select
          value={formData.estadoConductor}
          onChange={(e) =>
            onChange("estadoConductor", parseInt(e.target.value))
          }
          className="input"
          style={{ width: "100%" }}
        >
          {Object.entries(ESTADOS_CONDUCTOR).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
