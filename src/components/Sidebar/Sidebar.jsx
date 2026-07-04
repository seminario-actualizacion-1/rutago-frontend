import { NavLink } from "react-router-dom";
import { useLayout } from "../../context/LayoutContext";
import {
  LayoutDashboard,
  User,
  Users,
  UserCheck,
  Car,
  Truck,
  MapPin,
  Building2,
  Route,
  Clock,
  Navigation,
  Building,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const menus = {
  1: {
    titulo: "Administrador",
    modulos: [
      { to: "/dashboard", label: "Inicio", icon: LayoutDashboard },
      { to: "/perfil", label: "Mi perfil", icon: User },
      { to: "/usuarios", label: "Usuarios", icon: Users },
      { to: "/pasajeros", label: "Pasajeros", icon: UserCheck },
      { to: "/conductores", label: "Conductores", icon: Car },
      { to: "/vehiculos", label: "Vehículos", icon: Truck },
      { to: "/barrios", label: "Barrios", icon: MapPin },
      { to: "/comunas", label: "Comunas", icon: Building2 },
      { to: "/rutas", label: "Rutas", icon: Route },
      { to: "/horarios", label: "Horarios", icon: Clock },
      { to: "/viajes", label: "Viajes", icon: Navigation },
      { to: "/entidades", label: "Entidades", icon: Building },
    ],
  },
  2: {
    titulo: "Conductor",
    modulos: [
      { to: "/dashboard", label: "Inicio", icon: LayoutDashboard },
      { to: "/perfil", label: "Mi perfil", icon: User },
      { to: "/viajes", label: "Mis viajes", icon: Navigation },
    ],
  },
  3: {
    titulo: "Pasajero",
    modulos: [
      { to: "/dashboard", label: "Inicio", icon: LayoutDashboard },
      { to: "/perfil", label: "Mi perfil", icon: User },
      { to: "/viajes", label: "Solicitar viaje", icon: Navigation },
    ],
  },
  4: {
    titulo: "Entidad Externa",
    modulos: [
      { to: "/dashboard", label: "Inicio", icon: LayoutDashboard },
      { to: "/perfil", label: "Mi perfil", icon: User },
      { to: "/vehiculos", label: "Vehículos", icon: Truck },
    ],
  },
};

function obtenerRol(rolId) {
  if (!rolId) return menus[3];
  return menus[rolId] ?? menus[3];
}

export default function Sidebar({ rol }) {
  const { sidebarCollapsed } = useLayout();
  const config = obtenerRol(rol);

  return (
    <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          {config.titulo}
        </span>
        {!sidebarCollapsed && <span className={styles.badge}>RutaGo</span>}
      </div>
      <nav className={styles.nav}>
        <div className={styles.section}>
          {!sidebarCollapsed && <div className={styles.sectionTitle}>Módulos</div>}
          {config.modulos.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? styles.linkActive : styles.link
              }
              end={item.to === "/dashboard"}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className={styles.icon} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
