import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";
import { rutasService } from "../../services/rutas.service";
import { comunasService } from "../../services/comunas.service";
import "./Rutas.css";

export default function Rutas() {
  const [rutas, setRutas] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRuta, setEditingRuta] = useState(null);
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
    origenId: "",
    destinoId: "",
    descripcion: "",
    distanciaKm: "",
    tiempoEstimadoMinutos: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchRutas = async (page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      const data = await rutasService.getAll({
        paginaActual: page,
        registrosPorPagina: limit,
      });
      setRutas(data.data || []);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [rutasData, comunasData] = await Promise.all([
          rutasService.getAll({
            paginaActual: currentPage,
            registrosPorPagina: itemsPerPage,
          }),
          comunasService.getAll({
            paginaActual: 1,
            registrosPorPagina: 100,
          }),
        ]);

        setRutas(rutasData.data || []);
        setPagination(
          rutasData.paginacion || {
            paginaActual: currentPage,
            registrosPorPagina: itemsPerPage,
            totalPaginas: 1,
            totalRegistros: rutasData.data?.length || 0,
            tienePaginaAnterior: false,
            tienePaginaSiguiente: false,
          },
        );
        setComunas(comunasData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, itemsPerPage]);

  const handleEditar = (ruta) => {
    setError("");
    setEditingRuta(ruta);
    setFormData({
      nombre: ruta.nombre,
      origenId: ruta.origenId,
      destinoId: ruta.destinoId,
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
      setCurrentPage(1);
      await fetchRutas(1, itemsPerPage);
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
      setCurrentPage(1);
      await fetchRutas(1, itemsPerPage);
    } catch (err) {
      setError(err.message);
    }
  };

  const getComunaNombre = (comunaId) => {
    const comuna = comunas.find((c) => c.id === comunaId);
    return comuna ? comuna.nombre : "Sin comuna";
  };

  const rutasPaginadas = rutas;

  if (loading)
    return (
      <div className="rutas-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando rutas...</p>
        </div>
      </div>
    );

  return (
    <div className="rutas-container">
      <div className="page-header">
        <h1>Gestión de Rutas</h1>
      </div>
      {error && !modalOpen && <p className="error">{error}</p>}

      <div className="table-container">
        <div className="table-actions" style={{ marginBottom: "1rem" }}>
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
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="desktop-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Distancia (km)</th>
                  <th>Tiempo (min)</th>
                  <th>Acciones</th>
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
                      <td>{getComunaNombre(ruta.origenId)}</td>
                      <td>{getComunaNombre(ruta.destinoId)}</td>
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
                        <p>Origen: {getComunaNombre(ruta.origenId)}</p>
                        <p>Destino: {getComunaNombre(ruta.destinoId)}</p>
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
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPaginas || 1}
          totalItems={pagination.totalRegistros || rutas.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n);
            setCurrentPage(1);
          }}
        />
      </div>

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
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Origen
            </label>
            <select
              value={formData.origenId}
              onChange={(e) =>
                setFormData({ ...formData, origenId: parseInt(e.target.value) })
              }
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar origen</option>
              {comunas.map((comuna) => (
                <option key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Destino
            </label>
            <select
              value={formData.destinoId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destinoId: parseInt(e.target.value),
                })
              }
              className="input"
              style={{ width: "100%" }}
              required
            >
              <option value="">Seleccionar destino</option>
              {comunas.map((comuna) => (
                <option key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </option>
              ))}
            </select>
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
                  distanciaKm: parseFloat(e.target.value),
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
                  tiempoEstimadoMinutos: parseInt(e.target.value),
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
