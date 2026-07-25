import api from "./axios";

export const getConductores = (params) =>
  api.get("/perfiles-conductor", { params });

export const getConductorById = (id) => api.get(`/perfiles-conductor/${id}`);

export const getMiPerfilConductor = () =>
  api.get("/perfiles-conductor/me/perfil");

export const updateMiPerfilConductor = (data) =>
  api.put("/perfiles-conductor/me/perfil", data);

export const createConductor = (data) => api.post("/perfiles-conductor", data);

export const updateConductor = (id, data) =>
  api.put(`/perfiles-conductor/${id}`, data);

export const deleteConductor = (id) => api.delete(`/perfiles-conductor/${id}`);

export const crearConductorConUsuario = (data) =>
  api.post("/perfiles-conductor/crear-usuario", data);
