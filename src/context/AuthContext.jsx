import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("rutago_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("rutago_user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = async (credentials) => {
    const response = await fetch("http://localhost:8082/api/usuarios/login", {
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
      })
    );
    setUser({
      id: data.usuario?.id,
      nombres: data.usuario?.nombres,
      rolId: data.usuario?.rolId,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rutago_user");
    setUser(null);
  };

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
