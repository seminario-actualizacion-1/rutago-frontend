import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const menus = {
  1: {
    titulo: "Administrador",
    modulos: [
      { to: "/dashboard", label: "Inicio" },
      { to: "/perfil", label: "Mi perfil" },
      { to: "/usuarios", label: "Usuarios" },
      { to: "/pasajeros", label: "Pasajeros" },
      { to: "/conductores", label: "Conductores" },
      { to: "/vehiculos", label: "Vehículos" },
      { to: "/barrios", label: "Barrios" },
      { to: "/comunas", label: "Comunas" },
      { to: "/rutas", label: "Rutas" },
      { to: "/horarios", label: "Horarios" },
      { to: "/viajes", label: "Viajes" },
      { to: "/entidades", label: "Entidades" },
    ],
  },
  2: {
    titulo: "Conductor",
    modulos: [
      { to: "/dashboard", label: "Inicio" },
      { to: "/perfil", label: "Mi perfil" },
      { to: "/viajes", label: "Mis viajes" },
    ],
  },
  3: {
    titulo: "Pasajero",
    modulos: [
      { to: "/dashboard", label: "Inicio" },
      { to: "/perfil", label: "Mi perfil" },
      { to: "/viajes", label: "Solicitar viaje" },
    ],
  },
  4: {
    titulo: "Entidad Externa",
    modulos: [
      { to: "/dashboard", label: "Inicio" },
      { to: "/perfil", label: "Mi perfil" },
      { to: "/vehiculos", label: "Vehículos" },
    ],
  },
};

function obtenerRol(rolId) {
  if (!rolId) return menus[3];
  return menus[rolId] ?? menus[3];
}

export default function Sidebar({ rol }) {
  const config = obtenerRol(rol);
  const titulo = config.titulo;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>{titulo}</span>
        <span className={styles.badge}>RutaGo</span>
      </div>
      <nav className={styles.nav}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Módulos</div>
          {config.modulos.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? styles.linkActive : styles.link
              }
              end={item.to === "/dashboard"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

      </nav>
    </aside>
  );
}
