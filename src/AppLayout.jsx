import { Outlet, NavLink } from "react-router-dom";
import Logo from "../components/Logo/Logo";
import "./App.css";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const menu = [
  { to: "/", label: "Inicio", end: true },
  { to: "/dashboard", label: "Panel" },
  { to: "/profile", label: "Mi perfil" },
  { to: "/logout", label: "Salir", logout: true },
];

function obtenerRol(rolId) {
  if (!rolId) return "Pasajero";
  switch (rolId) {
    case 1:
      return "Administrador";
    case 2:
      return "Conductor";
    case 3:
      return "Pasajero";
    case 4:
      return "Entidad Externa";
    default:
      return "Usuario";
  }
}

export default function AppLayout() {
  const user = getInitialUser();
  if (!user) return null;
  const rolId = user.rol?.id ?? 3;
  const tituloRol = obtenerRol(rolId);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rutago_user");
    window.location.replace("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo />
          <span className="sidebar-badge">{tituloRol}</span>
        </div>
        <nav className="sidebar-nav">
          {menu.map((item) => {
            const baseClass = "sidebar-link";
            const activeClass = item.logout
              ? ""
              : ({ isActive }) =>
                  isActive ? `${baseClass} ${baseClass}--active` : baseClass;
            const className =
              typeof activeClass === "function" ? activeClass : baseClass;
            if (item.logout) {
              return (
                <button key={item.to} className="sidebar-link sidebar-link--logout" onClick={handleLogout}>
                  {item.label}
                </button>
              );
            }
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={className}>
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
