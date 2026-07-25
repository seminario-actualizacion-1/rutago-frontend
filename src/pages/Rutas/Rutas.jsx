import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import TableToolbar from "../../components/TableToolbar/TableToolbar";
import MapaRutas from "../../components/MapaRutas/MapaRutas";
import MapaCrearRuta from "../../components/MapaCrearRuta/MapaCrearRuta";
import { rutasService } from "../../services/rutas.service";
import { comunasService } from "../../services/comunas.service";
import { usePaginacion } from "../../hooks/usePaginacion";
import "./Rutas.css";

export default function Rutas() {
  const [rutas, setRutas] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRuta, setEditingRuta] = useState(null);
  const {
    currentPage,
    itemsPerPage,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    actualizarPaginacion,
    queryParams,
  } = usePaginacion();
  const [formData, setFormData] = useState({
    nombre: "",
    origenId: "",
    destinoId: "",
    descripcion: "",
    distanciaKm: "",
    tiempoEstimadoMinutos: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [vistaMapa, setVistaMapa] = useState(false);

  const fetchRutas = async () => {
    try {
      setLoading(true);
      const data = await rutasService.getAll({
        ...queryParams,
        q: searchTerm || undefined,
        sortBy,
        sortOrder,
      });
      setRutas(data.data || []);
      actualizarPaginacion(data.paginacion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [rutasData, comunasData] = await Promise.all([
          rutasService.getAll({
            ...queryParams,
            q: searchTerm || undefined,
            sortBy,
            sortOrder,
          }),
          comunasService.getAll({
            paginaActual: 1,
            registrosPorPagina: 100,
          }),
        ]);

        setRutas(rutasData.data || []);
        actualizarPaginacion(rutasData.paginacion);
        setComunas(comunasData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, itemsPerPage, searchTerm, sortBy, sortOrder]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleEditar = (ruta) => {
    setError("");
    setEditingRuta(ruta);
    setFormData({
      nombre: ruta.nombre,
      origenId: ruta.origen?.id,
      destinoId: ruta.destino?.id,
      descripcion: ruta.descripcion || "",
      distanciaKm: ruta.distanciaKm || "",
      tiempoEstimadoMinutos: ruta.tiempoEstimadoMinutos || "",
    });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      if (editingRuta) {
        await rutasService.update(editingRuta.id, formData);
      } else {
        await rutasService.create(formData);
      }
      await fetchRutas();
      setModalOpen(false);
      setEditingRuta(null);
      setFormData({
        nombre: "",
        origenId: "",
        destinoId: "",
        descripcion: "",
        distanciaKm: "",
        tiempoEstimadoMinutos: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarModal = () => {
    setError("");
    setModalOpen(false);
    setEditingRuta(null);
    setFormData({
      nombre: "",
      origenId: "",
      destinoId: "",
      descripcion: "",
      distanciaKm: "",
      tiempoEstimadoMinutos: "",
    });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      return;
    }

    try {
      await rutasService.delete(id);
      await fetchRutas();
    } catch (err) {
      setError(err.message);
    }
  };

  const getComunaNombre = (comunaId) => {
    const comuna = comunas.find((c) => c.id === comunaId);
    return comuna ? comuna.nombre : "Sin comuna";
  };

  const rutasPaginadas = rutas;

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "nombre", label: "Nombre" }
  ];

  return (
    <div className="rutas-container">
      <div className="page-header">
        <h1>Gestión de Rutas</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-actions" style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => {
            setEditingRuta(null);
            setFormData({
              nombre: "",
              origenId: "",
              destinoId: "",
              descripcion: "",
              distanciaKm: "",
              tiempoEstimadoMinutos: "",
            });
            setModalOpen(true);
          }}
          className="button button-primary"
        >
          + Nueva Ruta
        </button>
        <button
          onClick={() => setVistaMapa(!vistaMapa)}
          className="button button-outline"
        >
          {vistaMapa ? "Ver Tabla" : "Ver Mapa"}
        </button>
      </div>

      {vistaMapa ? (
        <div className="bg-white rounded-lg shadow-sm" style={{ padding: "1rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>Mapa de Rutas — Buenaventura</h3>
          <MapaRutas rutas={rutas} />
        </div>
      ) : (
      <div className="table-container">

      <TableToolbar
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Buscar por nombre, origen o destino..."
        sortOptions={sortOptions}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando rutas...</p>
            </div>
          ) : (
            <>
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th title="Identificador único de la ruta">ID</th>
                  <th title="Nombre descriptivo de la ruta">Nombre</th>
                  <th title="Comuna de origen de la ruta">Origen</th>
                  <th title="Comuna de destino de la ruta">Destino</th>
                  <th title="Distancia total de la ruta en kilómetros">Distancia (km)</th>
                  <th title="Tiempo estimado de recorrido en minutos">Tiempo (min)</th>
                  <th title="Opciones disponibles para este registro">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rutasPaginadas.length > 0 ? (
                  rutasPaginadas.map((ruta) => (
                    <tr key={ruta.id}>
                      <td>{ruta.id}</td>
                      <td>
                        <span className="font-medium">{ruta.nombre}</span>
                      </td>
                      <td>{getComunaNombre(ruta.origen?.id)}</td>
                      <td>{getComunaNombre(ruta.destino?.id)}</td>
                      <td>{ruta.distanciaKm || "-"}</td>
                      <td>{ruta.tiempoEstimadoMinutos || "-"}</td>
                      <td>
                        <ActionsMenu
                          onEdit={() => handleEditar(ruta)}
                          onDelete={() => handleEliminar(ruta.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No se encontraron rutas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {rutasPaginadas.length > 0 ? (
              <div className="mobile-cards-list">
                {rutasPaginadas.map((ruta) => (
                  <div key={ruta.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-info">
                        <h3>{ruta.nombre}</h3>
                        <p>Origen: {getComunaNombre(ruta.origen?.id)}</p>
                        <p>Destino: {getComunaNombre(ruta.destino?.id)}</p>
                        <p>Distancia: {ruta.distanciaKm || "-"} km</p>
                      </div>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-card-row">
                        <span>Tiempo</span>
                        <span>{ruta.tiempoEstimadoMinutos || "-"} min</span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <ActionsMenu
                        onEdit={() => handleEditar(ruta)}
                        onDelete={() => handleEliminar(ruta.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile-empty">No hay rutas disponibles</div>
            )}
          </div>
            </>
          )}
        </div>

        {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPaginas || 1}
          totalItems={pagination?.totalRegistros || rutas.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
        )}
      </div>)}

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={editingRuta ? "Editar Ruta" : "Nueva Ruta"}
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
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Selecciona origen y destino en el mapa
            </label>
            <MapaCrearRuta comunas={comunas} formData={formData} setFormData={setFormData} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="input"
              style={{ width: "100%", minHeight: "80px" }}
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
              Distancia (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.distanciaKm}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  distanciaKm: isNaN(parseFloat(e.target.value)) ? "" : parseFloat(e.target.value),
                })
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
              Tiempo Estimado (minutos)
            </label>
            <input
              type="number"
              value={formData.tiempoEstimadoMinutos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tiempoEstimadoMinutos: isNaN(parseInt(e.target.value, 10)) ? "" : parseInt(e.target.value, 10),
                })
              }
              className="input"
              style={{ width: "100%" }}
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
