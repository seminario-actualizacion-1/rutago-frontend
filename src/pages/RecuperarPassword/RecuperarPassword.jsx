import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosService } from "../../services/usuarios.service";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
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
      await usuariosService.solicitarRecuperacion(correo);
      setMensaje("Si el correo está registrado, recibirás instrucciones.");
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setMensaje("Si el correo está registrado, recibirás instrucciones.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="Recuperar Contraseña">
        <p className="description">
          Introduce tu correo y te enviaremos instrucciones.
        </p>
        {mensaje && <p className="status-message">{mensaje}</p>}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            name="correo"
            label="Correo"
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
          />
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </Button>
        </form>
        <div className="login-links">
          <Link to="/login">Volver al inicio</Link>
        </div>
      </Card>
    </div>
  );
}

export default RecuperarPassword;
