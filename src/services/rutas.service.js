import * as api from "../api/rutas";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

const normalizeRutaPayload = (ruta) => ({
  ...ruta,
  origenId:
    ruta.origenId === "" || ruta.origenId == null || Number.isNaN(ruta.origenId)
      ? null
      : Number(ruta.origenId),
  destinoId:
    ruta.destinoId === "" ||
    ruta.destinoId == null ||
    Number.isNaN(ruta.destinoId)
      ? null
      : Number(ruta.destinoId),
  distanciaKm:
    ruta.distanciaKm === "" ||
    ruta.distanciaKm == null ||
    Number.isNaN(ruta.distanciaKm)
      ? null
      : Number(ruta.distanciaKm),
  tiempoEstimadoMinutos:
    ruta.tiempoEstimadoMinutos === "" ||
    ruta.tiempoEstimadoMinutos == null ||
    Number.isNaN(ruta.tiempoEstimadoMinutos)
      ? null
      : Number(ruta.tiempoEstimadoMinutos),
});

export const rutasService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getRutas(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar rutas");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getRutaById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar ruta");
    }
  },
  create: async (ruta) => {
    try {
      const res = await api.createRuta(normalizeRutaPayload(ruta));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear ruta");
    }
  },
  update: async (id, ruta) => {
    try {
      const res = await api.updateRuta(id, normalizeRutaPayload(ruta));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar ruta");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteRuta(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar ruta");
    }
  },
};
