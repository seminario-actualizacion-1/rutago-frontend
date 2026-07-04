import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import "./Registro.css";

function Registro() {
  const [formData, setFormData] = useState({ nombres: "", apellidos: "", correo: "", contrasena: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/usuarios/registro", formData);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse.");
    }
  };

  return (
    <div className="login-container">
      <Card title="Crear Cuenta">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input name="nombres" label="Nombres" placeholder="Tus nombres" value={formData.nombres} onChange={handleChange} autoComplete="given-name" />
          <Input name="apellidos" label="Apellidos" placeholder="Tus apellidos" value={formData.apellidos} onChange={handleChange} autoComplete="family-name" />
          <Input name="correo" label="Correo" type="email" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} autoComplete="email" />
          <Input name="contrasena" label="Contraseña" type="password" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} autoComplete="new-password" />
          <Button type="submit" variant="primary" fullWidth>Registrarse</Button>
        </form>
        <div className="login-links">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Registro;
