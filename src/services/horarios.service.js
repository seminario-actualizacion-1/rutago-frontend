import * as api from "../api/horarios";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

const normalizeHorarioPayload = (horario) => ({
  ...horario,
  vehiculoId:
    horario.vehiculoId === "" ||
    horario.vehiculoId == null ||
    Number.isNaN(horario.vehiculoId)
      ? null
      : Number(horario.vehiculoId),
  rutaId:
    horario.rutaId === "" ||
    horario.rutaId == null ||
    Number.isNaN(horario.rutaId)
      ? null
      : Number(horario.rutaId),
  frecuenciaMinutos:
    horario.frecuenciaMinutos === "" ||
    horario.frecuenciaMinutos == null ||
    Number.isNaN(horario.frecuenciaMinutos)
      ? null
      : Number(horario.frecuenciaMinutos),
});

export const horariosService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getHorarios(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar horarios");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getHorarioById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar horario");
    }
  },
  getByRuta: async (rutaId) => {
    try {
      const res = await api.getHorariosByRuta(rutaId);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar horarios de la ruta");
    }
  },
  create: async (horario) => {
    try {
      const res = await api.createHorario(normalizeHorarioPayload(horario));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear horario");
    }
  },
  update: async (id, horario) => {
    try {
      const res = await api.updateHorario(id, normalizeHorarioPayload(horario));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar horario");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteHorario(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar horario");
    }
  },
};
