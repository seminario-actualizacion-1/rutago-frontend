import api from "./axios";

export const getRoles = () => api.get("/roles");
