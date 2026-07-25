import api from "./axios";

export const getBarrios = (params) => api.get("/barrios", { params });

export const getBarrioById = (id) => api.get(`/barrios/${id}`);

export const getBarriosByComuna = (comunaId) =>
  api.get(`/barrios/comuna/${comunaId}`);

export const createBarrio = (data) => api.post("/barrios", data);

export const updateBarrio = (id, data) => api.put(`/barrios/${id}`, data);

export const deleteBarrio = (id) => api.delete(`/barrios/${id}`);
