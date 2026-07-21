import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import { barriosService } from "../../services/barrios.service";
import { comunasService } from "../../services/comunas.service";
import "./Barrios.css";

export default function Barrios() {
  const [barrios, setBarrios] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBarrio, setEditingBarrio] = useState(null);
  const [pagination, setPagination] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    totalPaginas: 1,
    totalRegistros: 0,
    tienePaginaAnterior: false,
    tienePaginaSiguiente: false,
  });
  const [formData, setFormData] = useState({
    nombre: "",
    comunaId: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ comunaId: "" });
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchBarrios = async (page = currentPage, limit = itemsPerPage, q = searchTerm, comunaId = filters.comunaId) => {
    try {
      setLoading(true);
      const data = await barriosService.getAll({
        paginaActual: page,
        registrosPorPagina: limit,
        q: q || undefined,
        ...(comunaId && { comunaId }),
        sortBy,
        sortOrder,
      });
      setBarrios(data.data || []);
      setPagination(
        data.paginacion || {
          paginaActual: page,
          registrosPorPagina: limit,
          totalPaginas: 1,
          totalRegistros: data.data?.length || 0,
          tienePaginaAnterior: false,
          tienePaginaSiguiente: false,
        },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComunas = async () => {
    try {
      const data = await comunasService.getAll({ paginaActual: 1, registrosPorPagina: 100 });
      setComunas(data.data || []);
    } catch (err) {
      console.error("Error al cargar comunas:", err);
    }
  };

  useEffect(() => {
    fetchComunas();
  }, []);

  useEffect(() => {
    fetchBarrios(currentPage, itemsPerPage, searchTerm, filters.comunaId || undefined);
  }, [currentPage, itemsPerPage, searchTerm, filters, sortBy, sortOrder]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "nombre", label: "Nombre" },
    { value: "comunaId", label: "Comuna" },
  ];

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleEditar = (barrio) => {
    setError("");
    setEditingBarrio(barrio);
    setFormData({
      nombre: barrio.nombre,
      comunaId: barrio.comuna?.id,
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingBarrio) {
        await barriosService.update(editingBarrio.id, formData);
      } else {
        await barriosService.create(formData);
      }
      setCurrentPage(1);
      await fetchBarrios(1, itemsPerPage, searchTerm, filters.comunaId || undefined);
      setModalOpen(false);
      setEditingBarrio(null);
      setFormData({
        nombre: "",
        comunaId: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setError("");
    setModalOpen(false);
    setEditingBarrio(null);
    setFormData({
      nombre: "",
      comunaId: "",
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este barrio?")) {
      return;
    }

    try {
      await barriosService.delete(id);
      setCurrentPage(1);
      await fetchBarrios(1, itemsPerPage, searchTerm, filters.comunaId || undefined);
    } catch (err) {
      setError(err.message);
    }
  };

  const getComunaNombre = (comunaId) => {
    const comuna = comunas.find((c) => c.id === comunaId);
    return comuna ? comuna.nombre : "Sin comuna";
  };

  const barriosPaginados = barrios;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="barrios-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando barrios...</p>
        </div>
      </div>
    );

  return (
    <div className="barrios-container">
      <div className="page-header">
        <h1>Gestión de Barrios</h1>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => {
              setError("");
              setEditingBarrio(null);
              setFormData({ nombre: "", comunaId: "" });
              setModalOpen(true);
            }}
            className="button button-primary"
          >
            + Nuevo Barrio
          </button>
        </div>

      <TableToolbar
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Buscar por nombre..."
        filters={[
          {
            name: "comunaId",
            label: "Todas las comunas",
            value: filters.comunaId,
            options: comunas.map(c => ({ value: String(c.id), label: c.nombre })),
          },
        ]}
        onFilterChange={handleFilterChange}
        sortOptions={sortOptions}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Comuna</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {barriosPaginados.length > 0 ? (
                  barriosPaginados.map((barrio) => (
                    <tr key={barrio.id}>
                      <td>{barrio.id}</td>
                      <td>
                        <span className="font-medium">{barrio.nombre}</span>
                      </td>
                      <td>{getComunaNombre(barrio.comuna?.id)}</td>
                      <td>
                        <ActionsMenu
                          onEdit={() => handleEditar(barrio)}
                          onDelete={() => handleEliminar(barrio.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No se encontraron barrios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {barriosPaginados.length > 0 ? (
              <div className="mobile-cards-list">
                {barriosPaginados.map((barrio) => (
                  <div key={barrio.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{barrio.nombre}</h3>
                        <p>Comuna: {getComunaNombre(barrio.comuna?.id)}</p>
                        <p>ID: {barrio.id}</p>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <ActionsMenu
                        onEdit={() => handleEditar(barrio)}
                        onDelete={() => handleEliminar(barrio.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay barrios disponibles</div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPaginas || 1}
          totalItems={pagination.totalRegistros || barrios.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingBarrio ? "Editar Barrio" : "Nuevo Barrio"}
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
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Comuna
            </label>
            <select
              value={formData.comunaId}
              onChange={(e) =>
                setFormData({ ...formData, comunaId: parseInt(e.target.value) })
              }
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar comuna</option>
              {comunas.map((comuna) => (
                <option key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </option>
              ))}
            </select>
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
