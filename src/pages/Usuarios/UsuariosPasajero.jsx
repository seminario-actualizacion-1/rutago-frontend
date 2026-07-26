import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UsuariosPasajero({ formData, onChange }) {
  const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
    api
      .get("/tipos-documento")
      .then((res) => {
        if (res.data?.success) setTiposDocumento(res.data.data);
      })
      .catch(() => {});
  }, []);

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
          Teléfono
        </label>
        <input
          type="text"
          value={formData.telefono}
          onChange={(e) => onChange("telefono", e.target.value)}
          className="input"
          style={{ width: "100%" }}
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
          Dirección
        </label>
        <input
          type="text"
          value={formData.direccion}
          onChange={(e) => onChange("direccion", e.target.value)}
          className="input"
          style={{ width: "100%" }}
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
          Tipo de Documento
        </label>
        <select
          value={formData.tipoDocumentoId}
          onChange={(e) =>
            onChange("tipoDocumentoId", parseInt(e.target.value) || "")
          }
          className="input"
          style={{ width: "100%" }}
        >
          <option value="">Seleccionar</option>
          {tiposDocumento.map((td) => (
            <option key={td.id} value={td.id}>
              {td.nombre}
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
          Número de Documento
        </label>
        <input
          type="text"
          value={formData.numeroDocumento}
          onChange={(e) => onChange("numeroDocumento", e.target.value)}
          className="input"
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
          }}
        >
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          value={formData.fechaNacimiento}
          onChange={(e) => onChange("fechaNacimiento", e.target.value)}
          className="input"
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}
