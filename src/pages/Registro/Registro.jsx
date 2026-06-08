import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import "./Registro.css";

function Registro() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviamos el objeto sin preocuparnos por el rolId, el backend se encarga
      await api.post("/usuarios/registro", formData);

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      console.error(
        "Error al registrar el usuario:",
        err.response?.data || err,
      );
      // Mostramos el mensaje que viene desde el backend (ej: correo ya registrado)
      setError(err.response?.data?.message || "Error al registrarse.");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>

        {error && (
          <p
            className="error-message"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {error}
          </p>
        )}

        <input
          name="nombres"
          placeholder="Nombres"
          onChange={handleChange}
          required
        />
        <input
          name="apellidos"
          placeholder="Apellidos"
          onChange={handleChange}
          required
        />
        <input
          name="correo"
          type="email"
          autoComplete="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          required
        />
        <input
          name="contrasena"
          type="password"
          autoComplete="new-password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>

        <p className="links" style={{ marginTop: "15px" }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default Registro;
