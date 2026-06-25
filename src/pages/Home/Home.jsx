import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import busImage from "../../assets/RutaGo.png";
import Input from "../../components/Input/Input";
import api from "../../api";
import "./Home.css";

const features = [
  {
    title: "Rutas inteligentes",
    desc: "Encuentra el mejor camino por comunas y barrios de Buenaventura.",
  },
  {
    title: "Conductores verificados",
    desc: "Viaja con conductores registrados y perfiles validados.",
  },
  {
    title: "Solicitudes rápidas",
    desc: "Pide un viaje en segundos y recibe respuestas en tiempo real.",
  },
  {
    title: "Control total",
    desc: "Administra usuarios, vehículos y rutas desde un solo lugar.",
  },
];

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [destino, setDestino] = useState("");
  const [resultados, setResultados] = useState([]);
  const [busSeleccionado, setBusSeleccionado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [toast, setToast] = useState("");

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(""), 4000);
  };

  const obtenerEstadoTexto = (estado) => {
    if (estado === "EN_RUTA") return "En ruta";
    if (estado === "PROXIMO") return "Próximo";
    return "En terminal";
  };

  const obtenerEstadoColor = (estado) => {
    if (estado === "EN_RUTA") return "#0d6efd";
    if (estado === "PROXIMO") return "#ffc107";
    return "#08863A";
  };

  const buscarDestino = async () => {
    try {
      const response = await api.get(
        `/rutas/destino/${encodeURIComponent(destino)}`
      );

      setResultados(response.data);
      setBusSeleccionado(null);
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al buscar destino:", error);
      setResultados([]);
      setBusquedaRealizada(true);
    }
  };

  const seleccionarBus = (ruta, horario) => {
    const vehiculo = horario.vehiculo;

    setBusSeleccionado({
      ruta,
      horario,
      vehiculo,
    });

    if (vehiculo?.estado === "PROXIMO") {
      mostrarToast("El bus está próximo a llegar.");
    } else {
      mostrarToast("Bus seleccionado correctamente.");
    }
  };

  return (
    <div className="home-container">
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            backgroundColor: "#08863A",
            color: "white",
            padding: "12px 18px",
            borderRadius: "8px",
            zIndex: 9999,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {toast}
        </div>
      )}

      <header className="home-hero">
        <div className="home-hero-content">
          <img src={busImage} alt="RutaGo" className="home-hero-image" />

          <h1 className="home-hero-title">
            <span className="text-verde">Ruta</span>
            <span className="text-amarillo">Go</span>
          </h1>

          <p className="home-subtitle">
            Movilidad inteligente para Buenaventura
          </p>

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

            {busquedaRealizada && resultados.length === 0 && (
              <div style={{ marginTop: "20px" }} className="feature-card">
                <h3>Sin resultados</h3>
                <p>No hay buses disponibles para ese destino.</p>
              </div>
            )}

            {resultados.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Resultados encontrados</h3>

                {resultados.map((ruta) => (
                  <div key={ruta.id} className="feature-card">
                    <h4>{ruta.nombre}</h4>

                    <p>
                      <strong>Origen:</strong> {ruta.origen?.nombre}
                    </p>
                    <p>
                      <strong>Destino:</strong> {ruta.destino?.nombre}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {ruta.descripcion}
                    </p>
                    <p>
                      <strong>Distancia:</strong> {ruta.distanciaKm} km
                    </p>
                    <p>
                      <strong>Tiempo estimado:</strong>{" "}
                      {ruta.tiempoEstimadoMinutos} minutos
                    </p>

                    <hr />

                    <h4>Autobuses disponibles</h4>

                    {ruta.horarios?.length > 0 ? (
                      ruta.horarios.map((horario) => (
                        <div key={horario.id} className="feature-card">
                          <p>
                            <strong>Placa:</strong> {horario.vehiculo?.placa}
                          </p>
                          <p>
                            <strong>Empresa:</strong>{" "}
                            {horario.vehiculo?.perfilEntidad?.razonSocial}
                          </p>
                          <p>
                            <strong>Capacidad:</strong>{" "}
                            {horario.vehiculo?.capacidadPasajeros} pasajeros
                          </p>
                          <p>
                            <strong>Hora de salida:</strong>{" "}
                            {horario.horaSalida}
                          </p>
                          <p>
                            <strong>Frecuencia:</strong> cada{" "}
                            {horario.frecuenciaMinutos} minutos
                          </p>

                          <p>
                            <strong>Estado:</strong>{" "}
                            <span
                              style={{
                                backgroundColor: obtenerEstadoColor(
                                  horario.vehiculo?.estado
                                ),
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              {obtenerEstadoTexto(horario.vehiculo?.estado)}
                            </span>
                          </p>

                          <Button
                            variant="accent"
                            onClick={() => seleccionarBus(ruta, horario)}
                          >
                            Ver resumen
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p>No hay buses disponibles para esta ruta.</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {busSeleccionado && (
              <div style={{ marginTop: "20px" }} className="feature-card">
                <h3>Resumen del bus seleccionado</h3>

                <p>
                  <strong>Destino:</strong>{" "}
                  {busSeleccionado.ruta?.destino?.nombre}
                </p>
                <p>
                  <strong>Horario:</strong>{" "}
                  {busSeleccionado.horario?.horaSalida}
                </p>
                <p>
                  <strong>Frecuencia:</strong> cada{" "}
                  {busSeleccionado.horario?.frecuenciaMinutos} minutos
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {obtenerEstadoTexto(busSeleccionado.vehiculo?.estado)}
                </p>
                <p>
                  <strong>Placa:</strong> {busSeleccionado.vehiculo?.placa}
                </p>
                <p>
                  <strong>Empresa:</strong>{" "}
                  {busSeleccionado.vehiculo?.perfilEntidad?.razonSocial}
                </p>
                <p>
                  <strong>Capacidad:</strong>{" "}
                  {busSeleccionado.vehiculo?.capacidadPasajeros} pasajeros
                </p>

                <hr />

                <h4>Ubicación del bus</h4>

                <div
                  style={{
                    height: "180px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #d9f5e6, #fef6c9)",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginTop: "10px",
                  }}
                >
                  <div style={{ fontSize: "34px" }}>🚌</div>
                  <p>
                    <strong>Latitud:</strong>{" "}
                    {busSeleccionado.vehiculo?.latitud || "3.8801"}
                  </p>
                  <p>
                    <strong>Longitud:</strong>{" "}
                    {busSeleccionado.vehiculo?.longitud || "-77.0312"}
                  </p>
                  <small>Ubicación simulada del bus</small>
                </div>
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