import api from "./axios";

export const getTiposDocumento = () => api.get("/tipos-documento");
