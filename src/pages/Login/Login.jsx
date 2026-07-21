import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/Input/Input";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { ROLES } from "../../config/roles";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      const user = JSON.parse(localStorage.getItem("rutago_user") || "{}");
      const rol = user.rol?.id;
      if (rol === ROLES.CONDUCTOR) navigate("/viajes");
      else if (rol === ROLES.PASAJERO) navigate("/viajes");
      else if (rol === ROLES.ENTIDAD) navigate("/vehiculos");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <Card title="Iniciar Sesión">
        {error && <p className="error-message">{error}</p>}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            name="correo"
            label="Correo"
            type="email"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            autoComplete="email"
          />
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem", color: "#333" }}>
              Contraseña
            </label>
            <PasswordInput
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              placeholder="Contraseña"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" variant="primary" fullWidth>
            Ingresar
          </Button>
        </form>
        <div className="login-links">
          <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
          <p>
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Login;
