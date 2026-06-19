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
        {rol === 3 && <p>Aquí irá el panel de pasajero: solicitar/ver viajes.</p>}
        {rol === 4 && <p>Aquí irá el panel de entidad externa: vehículos y publicación.</p>}
      </div>
    </div>
  );
}
