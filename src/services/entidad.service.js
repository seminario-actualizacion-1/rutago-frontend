import * as api from "../api/entidad";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

const normalizePayload = (entidad, isUpdate = false) => {
  const p = { ...entidad };
  if (isUpdate) delete p.usuarioId;
  if (
    p.usuarioId !== undefined &&
    (p.usuarioId === "" || p.usuarioId == null || Number.isNaN(p.usuarioId))
  )
    p.usuarioId = null;
  else if (p.usuarioId !== undefined) p.usuarioId = Number(p.usuarioId);
  return p;
};

export const entidadService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.getEntidades(params);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar entidades");
    }
  },
  getById: async (id) => {
    try {
      const res = await api.getEntidadById(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar entidad");
    }
  },
  getMiPerfil: async () => {
    try {
      const res = await api.getMiPerfilEntidad();
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al cargar tu perfil de entidad");
    }
  },
  create: async (entidad) => {
    try {
      const res = await api.createEntidad(normalizePayload(entidad));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear entidad");
    }
  },
  update: async (id, entidad) => {
    try {
      const res = await api.updateEntidad(id, normalizePayload(entidad, true));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar entidad");
    }
  },
  updateMiPerfil: async (entidad) => {
    try {
      const res = await api.updateMiPerfilEntidad(normalizePayload(entidad));
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al actualizar tu perfil de entidad");
    }
  },
  delete: async (id) => {
    try {
      const res = await api.deleteEntidad(id);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al eliminar entidad");
    }
  },
  crearConUsuario: async (data) => {
    try {
      const res = await api.crearEntidadConUsuario(data);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al crear entidad");
    }
  },
};
