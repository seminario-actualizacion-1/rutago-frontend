import api from "./axios";

export const loginRequest = (credentials) =>
  api.post("/auth/login", credentials);
