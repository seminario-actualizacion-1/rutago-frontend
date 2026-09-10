import * as api from "../api/auth";

const extractError = (err, fallback) =>
  new Error(err.response?.data?.message || err.message || fallback);

export const authService = {
  login: async (credentials) => {
    try {
      const res = await api.loginRequest(credentials);
      return res.data;
    } catch (err) {
      throw extractError(err, "Error al iniciar sesión");
    }
  },
};
