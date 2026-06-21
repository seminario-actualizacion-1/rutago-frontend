export function useAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated = !!token;
  const apiUrl = import.meta.env.VITE_API_URL || "/api";

  const login = async (credentials) => {
    const response = await fetch(`${apiUrl}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Credenciales incorrectas");
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "rutago_user",
      JSON.stringify({
        id: data.usuario?.id,
        nombres: data.usuario?.nombres,
        rolId: data.usuario?.rolId,
        rol: data.usuario?.rol,
      })
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rutago_user");
  };

  return { isAuthenticated, login, logout };
}
