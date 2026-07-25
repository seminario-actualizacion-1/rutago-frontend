import * as api from "../api/comunas";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

export const comunasService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getComunas(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar comunas");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getComunaById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar comuna");
    }
  },
  create: async (comuna) => {
    try {
      const res = await api.createComuna(comuna);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear comuna");
    }
  },
  update: async (id, comuna) => {
    try {
      const res = await api.updateComuna(id, comuna);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar comuna");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteComuna(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar comuna");
    }
  },
};
