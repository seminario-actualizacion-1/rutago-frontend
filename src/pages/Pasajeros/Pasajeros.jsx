import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import { usuariosService } from "../../services/usuarios.service";
import "./Pasajeros.css";

export default function Pasajeros() {
  const [pasajeros, setPasajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPasajero, setEditingPasajero] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPasajeros = async () => {
    try {
      const data = await usuariosService.getAll();
      const pasajerosFiltrados = (data.data || []).filter((u) => u.rolId === 3);
      setPasajeros(pasajerosFiltrados);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPasajeros = async () => {
      await fetchPasajeros();
    };

    loadPasajeros();
  }, []);

  const handleEditar = (pasajero) => {
    setEditingPasajero(pasajero);
    setFormData({
      nombres: pasajero.nombres,
      apellidos: pasajero.apellidos || "",
      correo: pasajero.correo,
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingPasajero) {
        await usuariosService.update(editingPasajero.id, formData);
      }
      await fetchPasajeros();
      setModalOpen(false);
      setEditingPasajero(null);
      setFormData({ nombres: "", apellidos: "", correo: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setEditingPasajero(null);
    setFormData({ nombres: "", apellidos: "", correo: "" });
  };

  const handleEliminar = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este pasajero?")
    ) {
      return;
    }

    try {
      await usuariosService.delete(id);
      await fetchPasajeros();
    } catch (err) {
      setError(err.message);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(pasajeros.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pasajerosPaginados = pasajeros.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="pasajeros-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando pasajeros...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="pasajeros-container">
        <p className="error">{error}</p>
      </div>
    );

  return (
    <div className="pasajeros-container">
      <div className="page-header">
        <h1>Gestión de Pasajeros</h1>
      </div>

      <div className="table-container">
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pasajerosPaginados.length > 0 ? (
                  pasajerosPaginados.map((pasajero) => (
                    <tr key={pasajero.id}>
                      <td>{pasajero.id}</td>
                      <td>
                        <span className="font-medium">{pasajero.nombres}</span>
                      </td>
                      <td>{pasajero.apellidos || "-"}</td>
                      <td>{pasajero.correo}</td>
                      <td>
                        <ActionsMenu
                          onEdit={() => handleEditar(pasajero)}
                          onDelete={() => handleEliminar(pasajero.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No se encontraron pasajeros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {pasajerosPaginados.length > 0 ? (
              <div className="mobile-cards-list">
                {pasajerosPaginados.map((pasajero) => (
                  <div key={pasajero.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{pasajero.nombres}</h3>
                        <p>{pasajero.apellidos || "Sin apellidos"}</p>
                        <p>{pasajero.correo}</p>
                      </div>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>ID</span>
                        <span>{pasajero.id}</span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <ActionsMenu
                        onEdit={() => handleEditar(pasajero)}
                        onDelete={() => handleEliminar(pasajero.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay pasajeros disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={pasajeros.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingPasajero ? "Editar Pasajero" : "Nuevo Pasajero"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Nombres
            </label>
            <input
              type="text"
              value={formData.nombres}
              onChange={(e) =>
                setFormData({ ...formData, nombres: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Apellidos
            </label>
            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) =>
                setFormData({ ...formData, apellidos: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Correo
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleCerrarModal}
              className="button button-outline"
            >
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
