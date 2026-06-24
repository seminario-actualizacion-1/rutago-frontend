import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import { usuariosService } from "../../services/usuarios.service";
import "./Usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    rolId: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsuarios = async () => {
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEditar = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos || "",
      correo: usuario.correo,
      rolId: usuario.rolId,
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingUsuario) {
        await usuariosService.update(editingUsuario.id, formData);
      } else {
        await usuariosService.create(formData);
      }
      await fetchUsuarios();
      setModalOpen(false);
      setEditingUsuario(null);
      setFormData({ nombres: "", apellidos: "", correo: "", rolId: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingUsuario(null);
    setFormData({ nombres: "", apellidos: "", correo: "", rolId: "" });
  };



  const usuariosFiltrados =
    filtroRol === "todos"
      ? usuarios
      : usuarios.filter((u) => u.rolId === parseInt(filtroRol));

  // Pagination logic
  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usuariosPaginados = usuariosFiltrados.slice(startIndex, endIndex);

  const getRolNombre = (rolId) => {
    const roles = {
      1: "Administrador",
      2: "Conductor",
      3: "Pasajero",
      4: "Entidad Externa",
    };
    return roles[rolId] || "Desconocido";
  };

  const getRolColor = (rolId) => {
    const colors = {
      1: "badge-admin",
      2: "badge-conductor",
      3: "badge-pasajero",
      4: "badge-entidad",
    };
    return colors[rolId] || "badge-default";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="usuarios-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="usuarios-container">
        <p className="error">{error}</p>
      </div>
    );

  return (
    <div className="usuarios-container">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
      </div>

      <div className="filter-container">
        <label className="filter-label">
          Filtrar por rol:
          <select
            value={filtroRol}
            onChange={(e) => {
              setFiltroRol(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="1">Administrador</option>
            <option value="2">Conductor</option>
            <option value="3">Pasajero</option>
            <option value="4">Entidad Externa</option>
          </select>
        </label>
      </div>

      <div className="usuarios-table-wrapper">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
<div className="desktop-table">
             <table className="table">
               <thead>
                 <tr>
                   <th>ID</th>
                   <th>Nombres</th>
                   <th>Apellidos</th>
                   <th>Correo</th>
                   <th>Rol</th>
                   <th>Acciones</th>
                 </tr>
               </thead>
               <tbody>
                 {usuariosPaginados.length > 0 ? (
                   usuariosPaginados.map((usuario) => (
                     <tr key={usuario.id}>
                       <td>{usuario.id}</td>
                       <td><span className="font-medium">{usuario.nombres}</span></td>
                       <td>{usuario.apellidos || "-"}</td>
                       <td>{usuario.correo}</td>
                       <td><span className={`badge ${getRolColor(usuario.rolId)}`}>{getRolNombre(usuario.rolId)}</span></td>
                       <td>
                         <button onClick={() => handleEditar(usuario)} className="button button-primary">
                           Editar
                         </button>
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan="6" className="text-center">
                       No se encontraron usuarios
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {usuariosPaginados.length > 0 ? (
              <div className="mobile-cards-list">
                {usuariosPaginados.map((usuario) => (
                  <div key={usuario.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{usuario.nombres}</h3>
                        <p>{usuario.apellidos || "Sin apellidos"}</p>
                        <p>{usuario.correo}</p>
                      </div>
                      <span
                        className={`mobile-badge ${getRolColor(usuario.rolId)}`}
                      >
                        {getRolNombre(usuario.rolId).toUpperCase()}
                      </span>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>ID</span>
                        <span>{usuario.id}</span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <button
                        onClick={() => handleEditar(usuario)}
                        className="mobile-button mobile-button-edit"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay usuarios disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={usuariosFiltrados.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleGuardar(); }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Nombres
            </label>
            <input
              type="text"
              value={formData.nombres}
              onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Apellidos
            </label>
            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Correo
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Rol
            </label>
            <select
              value={formData.rolId}
              onChange={(e) => setFormData({ ...formData, rolId: parseInt(e.target.value) })}
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="1">Administrador</option>
              <option value="2">Conductor</option>
              <option value="3">Pasajero</option>
              <option value="4">Entidad Externa</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button type="button" onClick={handleCerrarModal} className="button button-outline">
              Cancelar
            </button>
            <button type="submit" className="button button-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
