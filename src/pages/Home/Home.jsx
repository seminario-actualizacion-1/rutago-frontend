import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import busImage from "../../assets/RutaGo.png";
import Input from "../../components/Input/Input";
import api from "../../api";
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

  const [destino, setDestino] = useState("");
  const [resultados, setResultados] = useState([]);

  const buscarDestino = async () => {
    try {
      const response = await api.get(`/rutas/destino/${destino}`);
      setResultados(response.data);
    } catch (error) {
      console.error("Error al buscar destino:", error);
    }
  };

  return (
    <div className="home-container">
      <header className="home-hero">
        <div className="home-hero-content">
          <img src={busImage} alt="RutaGo" className="home-hero-image" />

          <h1 className="home-hero-title">
            <span style={{ color: "#08863A" }}>Ruta</span>
            <span style={{ color: "#FDC202", marginLeft: 6 }}>Go</span>
          </h1>

          <p className="home-subtitle">Movilidad inteligente para Buenaventura</p>

          <p className="home-description">
            Conecta pasajeros, conductores y entidades en una sola plataforma.
            Gestiona rutas, solicita viajes y administra el sistema desde un solo lugar.
          </p>

          <div style={{ marginTop: "20px" }}>
            <Input
              name="destino"
              placeholder="Ingrese destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />

            <Button variant="primary" onClick={buscarDestino}>
              Buscar
            </Button>

            {resultados.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Resultados encontrados:</h3>

                {resultados.map((ruta) => (
                  <div key={ruta.id} className="feature-card">
                    <h4>{ruta.nombre}</h4>
                    <p>Origen: {ruta.origen?.nombre}</p>
                    <p>Destino: {ruta.destino?.nombre}</p>
                    <p>Descripción: {ruta.descripcion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="home-actions">
            {!isLoggedIn ? (
              <>
                <Button variant="primary" onClick={() => navigate("/login")}>
                  Iniciar Sesión
                </Button>
                <Button variant="accent" onClick={() => navigate("/registro")}>
                  Crear cuenta
                </Button>
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