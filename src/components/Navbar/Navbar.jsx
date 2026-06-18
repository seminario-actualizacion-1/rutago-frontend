import './Navbar.css';
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo/Logo";

export default function Navbar() {
  const location = useLocation();
  const ocultarEn = ["/login", "/registro", "/recuperar-password"];
  const mostrar = !ocultarEn.includes(location.pathname);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Logo />
      </Link>
      {mostrar ? (
        <div className="navbar-links">
          <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}>
            Iniciar Sesión
          </Link>
          <Link to="/registro" className={`nav-link ${location.pathname === "/registro" ? "active" : ""}`}>
            Registrarse
          </Link>
        </div>
      ) : (
        <div className="navbar-actions">
          {location.pathname === "/login" && (
            <Link to="/registro" className="btn btn-accent">Registrarse</Link>
          )}
          {location.pathname === "/registro" && (
            <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
          )}
          {location.pathname === "/recuperar-password" && (
            <Link to="/login" className="btn btn-outline">Volver a Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
