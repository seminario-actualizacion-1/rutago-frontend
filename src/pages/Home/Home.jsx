import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import busImage from "../../assets/RutaGo.png";
import "./Home.css";

const features = [
  { title: "Rutas inteligentes", desc: "Encuentra el mejor camino por comunas y barrios de Buenaventura." },
  { title: "Conductores verificados", desc: "Viaja con conductores registrados y perfiles validados." },
  { title: "Solicitudes rápidas", desc: "Pide un viaje en segundos y recibe respuestas en tiempo real." },
  { title: "Control total", desc: "Administra usuarios, vehículos y rutas desde un solo lugar." },
];

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="home-container">
      <header className="home-hero">
        <div className="home-hero-content">
          <img
            src={busImage}
            alt="RutaGo"
            className="home-hero-image"
          />
          <h1 className="home-hero-title">
            <span style={{ color: "#08863A" }}>Ruta</span>
            <span style={{ color: "#FDC202", marginLeft: 6 }}>Go</span>
          </h1>
          <p className="home-subtitle">Movilidad inteligente para Buenaventura</p>
          <p className="home-description">
            Conecta pasajeros, conductores y entidades en una sola plataforma.
            Gestiona rutas, solicita viajes y administra el sistema desde un solo lugar.
          </p>

          <div className="home-actions">
            {!isLoggedIn ? (
              <>
                <Button variant="primary" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
                <Button variant="accent" onClick={() => navigate("/registro")}>Crear cuenta</Button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <section className="home-features">
        <h2>¿Qué puedes hacer en RutaGo?</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;