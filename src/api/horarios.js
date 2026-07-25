import api from "./axios";

export const getHorarios = (params) => api.get("/horarios", { params });

export const getHorarioById = (id) => api.get(`/horarios/${id}`);

export const getHorariosByRuta = (rutaId) =>
  api.get(`/horarios/ruta/${rutaId}`);

export const createHorario = (data) => api.post("/horarios", data);

export const updateHorario = (id, data) => api.put(`/horarios/${id}`, data);

export const deleteHorario = (id) => api.delete(`/horarios/${id}`);
