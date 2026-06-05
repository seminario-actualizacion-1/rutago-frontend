import { useState } from "react";
import axios from "axios";

function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuma = async (e) => {
    e.preventDefault();
    setMensaje("");
    setResultado(null);
    setLoading(true);

    // Lee la URL de la API (en tu PC usará http://localhost:8082, en el VPS usará la del secreto)
    const apiURL = import.meta.env.VITE_APP_API_URL;

    try {
      const response = await axios.post(`${apiURL}/api/sumar`, {
        num1: num1,
        num2: num2,
      });

      if (response.data.success) {
        setResultado(response.data.resultado);
        setMensaje(response.data.message);
        // Limpiamos los campos del formulario
        setNum1("");
        setNum2("");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setMensaje("Error al conectar con el servidor o registrar la suma.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2>Prueba de Despliegue: Sumar Dígitos</h2>

      <form
        onSubmit={handleSuma}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Primer Número:
          </label>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Segundo Número:
          </label>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Procesando..." : "Sumar y Guardar en BD"}
        </button>
      </form>

      {mensaje && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f4f4f4",
            borderLeft: "4px solid #007bff",
          }}
        >
          <strong>Estado:</strong> {mensaje}
        </div>
      )}

      {resultado !== null && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "4px",
          }}
        >
          <strong>
            ¡Resultado de la Suma obtenido desde el Back!: {resultado}
          </strong>
        </div>
      )}
    </div>
  );
}

export default App;
