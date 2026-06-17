import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
      </main>
    </div>
  );
}

export default Home;
