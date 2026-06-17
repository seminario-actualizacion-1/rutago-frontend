import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import "./RecuperarPassword.css";

function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      await api.post("/usuarios/recuperar-password", { correo });
      setMensaje("Si el correo está registrado, recibirás instrucciones.");

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Error al solicitar recuperación de contraseña:", err);
      setMensaje("Si el correo está registrado, recibirás instrucciones.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Recuperar Contraseña</h2>
        <p className="description">
          Introduce tu correo y te enviaremos instrucciones.
        </p>

        {mensaje && <p className="status-message">{mensaje}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setCorreo(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar instrucciones"}
        </button>

        <div className="links">
          <Link to="/login">Volver al inicio</Link>
        </div>
      </form>
    </div>
  );
}

export default RecuperarPassword;
