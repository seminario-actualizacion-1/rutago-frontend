import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
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
      navigate("/dashboard");
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
          />
          <Input
            name="contrasena"
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
          />
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
