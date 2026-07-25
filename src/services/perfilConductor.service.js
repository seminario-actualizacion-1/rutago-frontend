import * as api from "../api/perfilConductor";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

const normalizePayload = (perfil, isUpdate = false) => {
  const p = { ...perfil };
  if (isUpdate) delete p.usuarioId;
  if (p.vehiculoId === "" || p.vehiculoId == null || Number.isNaN(p.vehiculoId))
    p.vehiculoId = null;
  else p.vehiculoId = Number(p.vehiculoId);
  if (
    p.usuarioId !== undefined &&
    (p.usuarioId === "" || p.usuarioId == null || Number.isNaN(p.usuarioId))
  )
    p.usuarioId = null;
  else if (p.usuarioId !== undefined) p.usuarioId = Number(p.usuarioId);
  return p;
};

export const perfilConductorService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getConductores(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar conductores");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getConductorById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar conductor");
    }
  },
  getMiPerfil: async () => {
    try {
      const res = await api.getMiPerfilConductor();
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar perfil de conductor");
    }
  },
  create: async (perfil) => {
    try {
      const res = await api.createConductor(normalizePayload(perfil));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear conductor");
    }
  },
  update: async (id, perfil) => {
    try {
      const res = await api.updateConductor(id, normalizePayload(perfil, true));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar conductor");
    }
  },
  updateMiPerfil: async (perfil) => {
    try {
      const res = await api.updateMiPerfilConductor(normalizePayload(perfil));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar perfil de conductor");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteConductor(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar conductor");
    }
  },
  crearConUsuario: async (data) => {
    try {
      const res = await api.crearConductorConUsuario(data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear conductor");
    }
  },
};
