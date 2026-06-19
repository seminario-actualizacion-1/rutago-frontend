import { useState, useEffect } from "react";
import api from "../../api";
import Card from "../../components/Card/Card";
import "./Viajes.css";

function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchViajes();
  }, []);

  const fetchViajes = async () => {
    try {
      const response = await api.get("/viajes/me/mis-viajes");
      setViajes(response.data.data || []);
    } catch (err) {
      setError("Error al cargar los viajes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando viajes...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Mis Viajes</h1>
      
      {error && (
        <div style={{ 
          padding: "0.75rem", 
          marginBottom: "1rem", 
          backgroundColor: "#ffebee", 
          borderRadius: "6px", 
          color: "#c62828" 
        }}>
          {error}
        </div>
      )}

      {viajes.length === 0 ? (
        <Card title="Sin viajes">
          <p>No tienes viajes registrados.</p>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {viajes.map((viaje) => (
            <Card key={viaje.id} title={`Viaje #${viaje.id}`}>
              <p><strong>Estado:</strong> {viaje.estado}</p>
              <p><strong>Precio estimado:</strong> ${viaje.precioEstimado}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Viajes;
