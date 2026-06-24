import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import { comunasService } from "../../services/comunas.service";
import "./Comunas.css";

export default function Comunas() {
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComuna, setEditingComuna] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchComunas = async () => {
    try {
      const data = await comunasService.getAll();
      setComunas(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComunas();
  }, []);

  const handleEditar = (comuna) => {
    setEditingComuna(comuna);
    setFormData({
      nombre: comuna.nombre,
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingComuna) {
        await comunasService.update(editingComuna.id, formData);
      } else {
        await comunasService.create(formData);
      }
      await fetchComunas();
      setModalOpen(false);
      setEditingComuna(null);
      setFormData({
        nombre: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingComuna(null);
    setFormData({
      nombre: "",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(comunas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const comunasPaginadas = comunas.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) return (
    <div className="comunas-container">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando comunas...</p>
      </div>
    </div>
  );
  
  if (error) return <div className="comunas-container"><p className="error">{error}</p></div>;

  return (
    <div className="comunas-container">
      <div className="page-header">
        <h1>Gestión de Comunas</h1>
      </div>

      <div className="table-container">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comunasPaginadas.length > 0 ? (
                  comunasPaginadas.map((comuna) => (
                    <tr key={comuna.id}>
                      <td>{comuna.id}</td>
                      <td><span className="font-medium">{comuna.nombre}</span></td>
                      <td>
                        <button onClick={() => handleEditar(comuna)} className="button button-primary">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No se encontraron comunas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {comunasPaginadas.length > 0 ? (
              <div className="mobile-cards-list">
                {comunasPaginadas.map((comuna) => (
                  <div key={comuna.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{comuna.nombre}</h3>
                        <p>ID: {comuna.id}</p>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <button onClick={() => handleEditar(comuna)} className="mobile-button mobile-button-edit">
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay comunas disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={comunas.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingComuna ? "Editar Comuna" : "Nueva Comuna"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleGuardar(); }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="input"
              style={{ width: "100%" }}
              required
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

