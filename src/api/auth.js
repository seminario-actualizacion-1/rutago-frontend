import api from "./axios";

export const loginRequest = (credentials) =>
  api.post("/auth/login", credentials);

export const refreshTokenRequest = (refreshToken) =>
  api.post("/auth/refresh", { refreshToken });

export const verificarTokenRequest = () => api.get("/auth/verificar-token");

export const solicitarRecuperacionRequest = (correo) =>
  api.post("/usuarios/recuperar-password", { correo });
