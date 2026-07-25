import api from "./axios";

export const getComunas = (params) => api.get("/comunas", { params });

export const getComunaById = (id) => api.get(`/comunas/${id}`);

export const createComuna = (data) => api.post("/comunas", data);

export const updateComuna = (id, data) => api.put(`/comunas/${id}`, data);

export const deleteComuna = (id) => api.delete(`/comunas/${id}`);
