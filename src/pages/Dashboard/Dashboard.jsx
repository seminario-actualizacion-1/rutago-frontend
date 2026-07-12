import { ROLES } from "../../config/roles";
import AdminDashboard from "./AdminDashboard";
import ConductorDashboard from "./ConductorDashboard";
import PasajeroDashboard from "./PasajeroDashboard";
import EntidadDashboard from "./EntidadDashboard";
import "./Dashboard.css";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const user = getInitialUser();

  if (!user) {
    return (
      <div className="dashboard-container">
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando perfil...</p>
      </div>
    );
  }

  const rol = user.rolId;

  return (
    <div className="dashboard-container">
      {rol === ROLES.ADMIN && <AdminDashboard />}
      {rol === ROLES.CONDUCTOR && <ConductorDashboard />}
      {rol === ROLES.PASAJERO && <PasajeroDashboard />}
      {rol === ROLES.ENTIDAD && <EntidadDashboard />}
    </div>
  );
}
