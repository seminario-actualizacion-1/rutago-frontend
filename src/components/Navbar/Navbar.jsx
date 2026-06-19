import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo/Logo";

export default function Navbar() {
  const location = useLocation();
  const ocultarEn = ["/login", "/registro", "/recuperar-password"];

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Logo />
      </Link>
      <div className="navbar-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        ) : (
          <div className="navbar-links">
            {!ocultarEn.includes(location.pathname) && (
              <>
                <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}>
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className={`nav-link ${location.pathname === "/registro" ? "active" : ""}`}>
                  Registrarse
                </Link>
              </>
            )}
            {location.pathname === "/login" && (
              <Link to="/registro" className="nav-btn nav-btn-accent">Registrarse</Link>
            )}
            {location.pathname === "/registro" && (
              <Link to="/login" className="nav-btn nav-btn-primary">Iniciar Sesión</Link>
            )}
            {location.pathname === "/recuperar-password" && (
              <Link to="/login" className="nav-btn nav-btn-primary">Volver a Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
