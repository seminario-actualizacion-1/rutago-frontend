import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosService } from "../../services/usuarios.service";
import Input from "../../components/Input/Input";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import "./Registro.css";

function Registro() {
  const [formData, setFormData] = useState({ nombres: "", apellidos: "", correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await usuariosService.create(formData);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Error al registrarse.");
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
          <div>
            <label htmlFor="contrasena" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem", color: "#333" }}>
              Contraseña
            </label>
            <PasswordInput name="contrasena" id="contrasena" placeholder="Tu contraseña" value={formData.contrasena} onChange={handleChange} autoComplete="new-password" />
          </div>
          <Button type="submit">Crear Cuenta</Button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  );
}

export default Registro;
