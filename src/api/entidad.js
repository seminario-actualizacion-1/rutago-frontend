import api from "./axios";

export const getEntidades = (params) =>
  api.get("/entidades", { params });

export const getEntidadById = (id) => api.get(`/entidades/${id}`);

export const getMiPerfilEntidad = () => api.get("/entidades/me/perfil");

export const updateMiPerfilEntidad = (data) =>
  api.put("/entidades/me/perfil", data);

export const createEntidad = (data) => api.post("/entidades", data);

export const updateEntidad = (id, data) =>
  api.put(`/entidades/${id}`, data);

export const deleteEntidad = (id) => api.delete(`/entidades/${id}`);

export const crearEntidadConUsuario = (data) =>
  api.post("/entidades/crear-usuario", data);
