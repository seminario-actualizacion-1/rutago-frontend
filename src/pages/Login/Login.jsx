import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/usuarios/login", formData);
      // Guardar el token para mantener la sesión
      localStorage.setItem("token", response.data.token);

      // Redirigir al inicio después de loguear
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}

        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          required
        />
        <input
          name="contrasena"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />

        <button type="submit">Ingresar</button>

        <div className="links">
          <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
          <p>
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
