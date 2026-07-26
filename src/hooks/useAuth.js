import { authService } from "../services/auth.service";

export function useAuth() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated = !!token;
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("token", data.token);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem(
      "rutago_user",
      JSON.stringify({
        id: data.usuario?.id,
        nombres: data.usuario?.nombres,
        rolId: data.usuario?.rol?.id,
        rol: data.usuario?.rol,
      }),
    );
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rutago_user");
  };
  return { isAuthenticated, login, logout };
}
