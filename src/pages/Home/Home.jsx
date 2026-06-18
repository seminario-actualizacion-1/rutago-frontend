import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <main className="home-content">
        <h1>Bienvenido a RutaGo</h1>
        <p>Movilidad inteligente para Buenaventura</p>
        <div className="home-actions">
          <Button variant="primary" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
          <Button variant="accent" onClick={() => navigate("/registro")}>Crear cuenta</Button>
        </div>
      </main>
    </div>
  );
}

export default Home;
