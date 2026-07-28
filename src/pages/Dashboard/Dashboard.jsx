import { useRoles } from "../../hooks/useRoles";
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
  const { obtenerId: obtenerIdRol, loading } = useRoles();

  if (!user || loading) {
    return (
      <div className="dashboard-container">
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Cargando perfil...
        </p>
      </div>
    );
  }

  const rol = user.rol?.id;

  return (
    <div className="dashboard-container">
      {rol === obtenerIdRol("Administrador") && <AdminDashboard />}
      {rol === obtenerIdRol("Conductor") && <ConductorDashboard />}
      {rol === obtenerIdRol("Pasajero") && <PasajeroDashboard />}
      {rol === obtenerIdRol("Entidad Externa") && <EntidadDashboard />}
    </div>
  );
}
