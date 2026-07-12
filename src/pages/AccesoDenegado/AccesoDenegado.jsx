import { Link } from "react-router-dom";
import "./AccesoDenegado.css";

export default function AccesoDenegado() {
  return (
    <div className="acceso-denegado">
      <h1>403</h1>
      <h2>Acceso Denegado</h2>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/dashboard" className="button button-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
