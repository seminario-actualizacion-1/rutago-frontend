import { useState } from "react";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [user] = useState(getInitialUser);

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando perfil...</p>;
  }

  const rol = user.rolId ?? user.rol?.id;

  return (
    <div>
      <h1>Panel de {user.nombres}</h1>
      <p>Rol: {rol === 1 ? "Administrador" : rol === 2 ? "Conductor" : rol === 3 ? "Pasajero" : rol === 4 ? "Entidad Externa" : "Desconocido"}</p>

      <div style={{ marginTop: "1.5rem" }}>
        {rol === 1 && <p>Aquí irá la gestión de usuarios, roles, comunas y barrios.</p>}
        {rol === 2 && <p>Aquí irá el panel de conductor: viajes, estado y perfil.</p>}
        {rol === 3 && (
  <div>
    <h2>Buscar Ruta</h2>

    <input
      type="text"
      placeholder="¿A qué destino deseas viajar?"
      style={{
        padding: "10px",
        width: "300px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />

    <button
      style={{
        marginLeft: "10px",
        padding: "10px 15px",
        backgroundColor: "#08863A",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Buscar
    </button>

    <div style={{ marginTop: "20px" }}>
      <h3>Resultados</h3>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "10px",
        }}
      >
        <h4>Expreso Pacífico</h4>
        <p>Ruta: Buenaventura → Cali</p>
        <p>Horario: 08:00 AM</p>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
        }}
      >
        <h4>TransBuenaventura</h4>
        <p>Ruta: Buenaventura → Cali</p>
        <p>Horario: 10:00 AM</p>
      </div>
    </div>
  </div>
)}
        {rol === 4 && <p>Aquí irá el panel de entidad externa: vehículos y publicación.</p>}
      </div>
    </div>
  );
}
