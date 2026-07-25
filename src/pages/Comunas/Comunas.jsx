import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { comunasService } from "../../services/comunas.service";
import { usePaginacion } from "../../hooks/usePaginacion";
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

  const {
    currentPage,
    itemsPerPage,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    actualizarPaginacion,
    queryParams,
  } = usePaginacion();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchComunas = async () => {
    try {
      setLoading(true);
      const data = await comunasService.getAll({
        ...queryParams,
        q: searchTerm || undefined,
        sortBy,
        sortOrder,
      });
      setComunas(data.data || []);
      actualizarPaginacion(data.paginacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComunas(); }, [queryParams, searchTerm, sortBy, sortOrder]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "nombre", label: "Nombre" },
  ];

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleEditar = (comuna) => {
    setError("");
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
    setError("");
    setModalOpen(false);
    setEditingComuna(null);
    setFormData({
      nombre: "",
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta comuna?")) {
      return;
    }

    try {
      await comunasService.delete(id);
      await fetchComunas();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="comunas-container">
      <div className="page-header">
        <h1>Gestión de Comunas</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => {
              setError("");
              setEditingComuna(null);
              setFormData({ nombre: "" });
              setModalOpen(true);
            }}
            className="button button-primary"
          >
            + Nueva Comuna
          </button>
        </div>

      <TableToolbar
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Buscar por nombre..."
        sortOptions={sortOptions}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando comunas...</p>
            </div>
          ) : (
            <>
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th title="Identificador único de la comuna">ID</th>
                  <th title="Nombre de la comuna">Nombre</th>
                  <th title="Opciones disponibles para este registro">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comunas.length > 0 ? (
                  comunas.map((comuna) => (
                    <tr key={comuna.id}>
                      <td>{comuna.id}</td>
                      <td>
                        <span className="font-medium">{comuna.nombre}</span>
                      </td>
                      <td>
                        <ActionsMenu
                          onEdit={() => handleEditar(comuna)}
                          onDelete={() => handleEliminar(comuna.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No se encontraron comunas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {comunas.length > 0 ? (
              <div className="mobile-cards-list">
                {comunas.map((comuna) => (
                  <div key={comuna.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{comuna.nombre}</h3>
                        <p>ID: {comuna.id}</p>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <ActionsMenu
                        onEdit={() => handleEditar(comuna)}
                        onDelete={() => handleEliminar(comuna.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay comunas disponibles</div>
            )}
          </div>
            </>
          )}
        </div>

        {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPaginas || 1}
          totalItems={pagination?.totalRegistros || comunas.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingComuna ? "Editar Comuna" : "Nueva Comuna"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="input"
              style={{ width: "100%" }}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
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
