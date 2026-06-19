import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import busImage from "../../assets/RutaGo.png";
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
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!destino.trim()) return;

    setLoading(true);
    setError("");
    setRutas([]);

    try {
      const response = await api.get(`/rutas/destino/${destino}`);
      setRutas(response.data);
      if (response.data.length === 0) {
        setError("No hay rutas disponibles para este destino");
      }
    } catch (err) {
      setError("Error al buscar rutas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

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
          
          {/* Buscador de rutas */}
          <div className="home-search">
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", maxWidth: "500px", margin: "0 auto" }}>
              <Input
                name="destino"
                label="¿A dónde quieres ir?"
                placeholder="Ingresa el destino (ej: Centro, Ladrilleros...)"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </form>
          </div>

          {/* Resultados de búsqueda */}
          {error && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#fee", borderRadius: "8px", color: "#c33" }}>
              {error}
            </div>
          )}

          {rutas.length > 0 && (
            <div style={{ marginTop: "2rem", width: "100%" }}>
              <h3 style={{ marginBottom: "1rem" }}>Rutas encontradas:</h3>
              <div style={{ display: "grid", gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
                {rutas.map((ruta) => (
                  <Card key={ruta.id} title={`${ruta.origen?.nombre || "Origen"} → ${ruta.destino?.nombre || "Destino"}`}>
                    <p><strong>Descripción:</strong> {ruta.descripcion || "Sin descripción"}</p>
                    <p><strong>Distancia:</strong> {ruta.distanciaKm || "N/A"} km</p>
                    <p><strong>Tiempo estimado:</strong> {ruta.tiempoEstimadoMinutos || "N/A"} min</p>
                    
                    {ruta.horarios && ruta.horarios.length > 0 && (
                      <div style={{ marginTop: "1rem" }}>
                        <h4 style={{ marginBottom: "0.5rem" }}>Horarios disponibles:</h4>
                        <div style={{ display: "grid", gap: "0.5rem" }}>
                          {ruta.horarios.map((horario) => (
                            <div key={horario.id} style={{ 
                              padding: "0.75rem", 
                              backgroundColor: "#f5f5f5", 
                              borderRadius: "6px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}>
                              <div>
                                <strong>{horario.horaSalida}</strong>
                                {horario.frecuenciaMinutos && (
                                  <span style={{ marginLeft: "0.5rem", color: "#666" }}>
                                    (cada {horario.frecuenciaMinutos} min)
                                  </span>
                                )}
                              </div>
                              {horario.vehiculo && (
                                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                                  Bus: {horario.vehiculo.placa} - {horario.vehiculo.marca} {horario.vehiculo.modelo}
                                  <span style={{ 
                                    marginLeft: "0.5rem", 
                                    padding: "0.25rem 0.5rem", 
                                    borderRadius: "4px",
                                    fontSize: "0.8rem",
                                    backgroundColor: horario.vehiculo.estado === "EN_TERMINAL" ? "#e3f2fd" : 
                                                   horario.vehiculo.estado === "EN_RUTA" ? "#fff3e0" : "#e8f5e9",
                                    color: horario.vehiculo.estado === "EN_TERMINAL" ? "#1976d2" : 
                                          horario.vehiculo.estado === "EN_RUTA" ? "#f57c00" : "#388e3c"
                                  }}>
                                    {horario.vehiculo.estado.replace("_", " ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

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