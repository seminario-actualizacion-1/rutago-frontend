import * as api from "../api/barrios";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

export const barriosService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getBarrios(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar barrios");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getBarrioById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar barrio");
    }
  },
  getByComuna: async (comunaId) => {
    try {
      const res = await api.getBarriosByComuna(comunaId);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar barrios por comuna");
    }
  },
  create: async (barrio) => {
    try {
      const res = await api.createBarrio(barrio);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear barrio");
    }
  },
  update: async (id, barrio) => {
    try {
      const res = await api.updateBarrio(id, barrio);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar barrio");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteBarrio(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar barrio");
    }
  },
};
