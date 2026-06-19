import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./Perfil.css";

function obtenerRol(rolId) {
  switch (rolId) {
    case 1:
      return "Administrador";
    case 2:
      return "Conductor";
    case 3:
      return "Pasajero";
    case 4:
      return "Entidad Externa";
    default:
      return "Usuario";
  }
}

function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const response = await api.get("/usuarios/me/perfil");
      setUser(response.data.data);
      setFormData({
        nombres: response.data.data.nombres,
        apellidos: response.data.data.apellidos,
        correo: response.data.data.correo,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.put("/usuarios/me/perfil", formData);
      setMessage("Perfil actualizado correctamente");
      setEditing(false);
      fetchPerfil();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
    });
    setMessage("");
    setError("");
  };

  if (loading && !user) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando perfil...</p>;
  }

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>No se pudo cargar el perfil</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Mi Perfil</h1>
      
      <Card title="Información Personal">
        {message && (
          <div style={{ 
            padding: "0.75rem", 
            marginBottom: "1rem", 
            backgroundColor: "#e8f5e9", 
            borderRadius: "6px", 
            color: "#2e7d32" 
          }}>
            {message}
          </div>
        )}
        
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

        {!editing ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <strong>Nombre:</strong> {user.nombres}
            </div>
            <div>
              <strong>Apellidos:</strong> {user.apellidos}
            </div>
            <div>
              <strong>Correo:</strong> {user.correo}
            </div>
            <div>
              <strong>Rol:</strong> {obtenerRol(user.rolId)}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Button variant="primary" onClick={() => setEditing(true)}>
                Editar Perfil
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: "grid", gap: "1rem" }}>
            <Input
              name="nombres"
              label="Nombres"
              value={formData.nombres}
              onChange={handleChange}
            />
            <Input
              name="apellidos"
              label="Apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />
            <Input
              name="correo"
              label="Correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
            />
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Perfil;
