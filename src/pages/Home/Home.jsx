import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="home-container">
      <main className="home-content">
        <h1>Bienvenido a RutaGo</h1>
        <p>Movilidad inteligente para Buenaventura</p>
        {!isLoggedIn && (
          <div className="home-actions">
            <Button variant="primary" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
            <Button variant="accent" onClick={() => navigate("/registro")}>Crear cuenta</Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
