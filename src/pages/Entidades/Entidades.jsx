import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import { entidadesService } from "../../services/entidades.service";
import { usuariosService } from "../../services/usuarios.service";
import "./Entidades.css";

export default function Entidades() {
  const [entidades, setEntidades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntidad, setEditingEntidad] = useState(null);
  const [formData, setFormData] = useState({
    usuarioId: "",
    razonSocial: "",
    nit: "",
    telefonoContacto: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchEntidades = async () => {
    try {
      const data = await entidadesService.getAll();
      setEntidades(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data.data || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  useEffect(() => {
    fetchEntidades();
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditar = (entidad) => {
    setEditingEntidad(entidad);
    setFormData({
      usuarioId: entidad.usuarioId,
      razonSocial: entidad.razonSocial,
      nit: entidad.nit || "",
      telefonoContacto: entidad.telefonoContacto || "",
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingEntidad) {
        await entidadesService.update(editingEntidad.id, formData);
      } else {
        await entidadesService.create(formData);
      }
      await fetchEntidades();
      setModalOpen(false);
      setEditingEntidad(null);
      setFormData({ usuarioId: "", razonSocial: "", nit: "", telefonoContacto: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingEntidad(null);
    setFormData({ usuarioId: "", razonSocial: "", nit: "", telefonoContacto: "" });
  };

  const getUsuarioNombre = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    return usuario ? `${usuario.nombres} ${usuario.apellidos || ""}` : "Sin usuario";
  };

  // Pagination logic
  const totalPages = Math.ceil(entidades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const entidadesPaginadas = entidades.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="entidades-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando entidades...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="entidades-container">
        <p className="error">{error}</p>
      </div>
    );

  return (
    <div className="entidades-container">
      <div className="page-header">
        <h1>Gestión de Entidades</h1>
      </div>

      <div className="table-container">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Razón Social</th>
                  <th>NIT</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entidadesPaginadas.length > 0 ? (
                  entidadesPaginadas.map((entidad) => (
                    <tr key={entidad.id}>
                      <td>{entidad.id}</td>
                      <td><span className="font-medium">{getUsuarioNombre(entidad.usuarioId)}</span></td>
                      <td>{entidad.razonSocial}</td>
                      <td>{entidad.nit || "-"}</td>
                      <td>{entidad.telefonoContacto || "-"}</td>
                      <td>
                        <button onClick={() => handleEditar(entidad)} className="button button-primary">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No se encontraron entidades</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {entidadesPaginadas.length > 0 ? (
              <div className="mobile-cards-list">
                {entidadesPaginadas.map((entidad) => (
                  <div key={entidad.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{entidad.razonSocial}</h3>
                        <p>{getUsuarioNombre(entidad.usuarioId)}</p>
                        <p>NIT: {entidad.nit || "-"}</p>
                      </div>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>Teléfono</span>
                        <span>{entidad.telefonoContacto || "-"}</span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <button onClick={() => handleEditar(entidad)} className="mobile-button mobile-button-edit">
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay entidades disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={entidades.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingEntidad ? "Editar Entidad" : "Nueva Entidad"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleGuardar(); }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Usuario
            </label>
            <select
              value={formData.usuarioId}
              onChange={(e) => setFormData({ ...formData, usuarioId: parseInt(e.target.value) })}
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombres} {usuario.apellidos || ""}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Razón Social
            </label>
            <input
              type="text"
              value={formData.razonSocial}
              onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              NIT
            </label>
            <input
              type="text"
              value={formData.nit}
              onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Teléfono Contacto
            </label>
            <input
              type="text"
              value={formData.telefonoContacto}
              onChange={(e) => setFormData({ ...formData, telefonoContacto: e.target.value })}
              className="input"
              style={{ width: "100%" }}
            />
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