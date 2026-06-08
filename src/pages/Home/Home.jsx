import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminamos el token de la sesión
    navigate("/login"); // Enviamos al usuario de vuelta al login
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>RutaGo</h1>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </nav>

      <main className="home-content">
        <h2>Bienvenido al panel principal</h2>
        <p>Aquí verás toda la información de tu cuenta y servicios.</p>
        {/* Aquí irán tus futuras funcionalidades */}
      </main>
    </div>
  );
}

export default Home;
