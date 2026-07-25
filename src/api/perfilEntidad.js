import api from "./axios";

export const getEntidades = (params) =>
  api.get("/perfiles-entidad", { params });

export const getEntidadById = (id) => api.get(`/perfiles-entidad/${id}`);

export const getMiPerfilEntidad = () => api.get("/perfiles-entidad/me/perfil");

export const updateMiPerfilEntidad = (data) =>
  api.put("/perfiles-entidad/me/perfil", data);

export const createEntidad = (data) => api.post("/perfiles-entidad", data);

export const updateEntidad = (id, data) =>
  api.put(`/perfiles-entidad/${id}`, data);

export const deleteEntidad = (id) => api.delete(`/perfiles-entidad/${id}`);

export const crearEntidadConUsuario = (data) =>
  api.post("/perfiles-entidad/crear-usuario", data);
