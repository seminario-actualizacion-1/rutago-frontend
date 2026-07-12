import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLayout } from "../../context/LayoutContext";
import Logo from "../Logo/Logo";
import "./Navbar.css";

function getInitialUser() {
  try {
    const stored = localStorage.getItem("rutago_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const location = useLocation();
  const { toggleCollapse, sidebarCollapsed } = useLayout();
  const user = getInitialUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rutago_user");
    window.location.replace("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");
  const ocultarEn = ["/login", "/registro", "/recuperar-password"];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isLoggedIn && (
            <button className={`nav-icon-btn hamburger-btn ${sidebarCollapsed ? "collapsed" : ""}`} onClick={toggleCollapse} aria-label="Menú">
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          )}
        <Link to="/" className="navbar-brand">
          <Logo />
        </Link>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="user-dropdown" ref={dropdownRef}>
            <button
              className="user-dropdown-toggle"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span className="user-avatar">{user?.nombres?.charAt(0) || "U"}</span>
              <span className="user-name">{user?.nombres || "Usuario"}</span>
              <span className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>&#9660;</span>
            </button>
            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <Link to="/perfil" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Mi Perfil
                </Link>
                <hr className="dropdown-divider" />
                <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-links">
            {!ocultarEn.includes(location.pathname) && (
              <>
                <Link
                  to="/login"
                  className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className={`nav-link ${location.pathname === "/registro" ? "active" : ""}`}
                >
                  Registrarse
                </Link>
              </>
            )}
            {location.pathname === "/login" && (
              <Link to="/registro" className="nav-btn nav-btn-accent">
                Registrarse
              </Link>
            )}
            {location.pathname === "/registro" && (
              <Link to="/login" className="nav-btn nav-btn-primary">
                Iniciar Sesión
              </Link>
            )}
            {location.pathname === "/recuperar-password" && (
              <Link to="/login" className="nav-btn nav-btn-primary">
                Volver a Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
