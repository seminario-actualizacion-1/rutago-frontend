const API_URL = import.meta.env.VITE_API_URL || "/api";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const perfilPasajeroService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/perfiles-pasajero${query ? `?${query}` : ""}`,
      { headers: getAuthHeaders() },
    );
    if (!response.ok) throw new Error("Error al cargar pasajeros");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-pasajero/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar pasajero");
    return response.json();
  },

  getByUsuario: async (usuarioId) => {
    const response = await fetch(`${API_URL}/perfiles-pasajero/usuario/${usuarioId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar perfil del pasajero");
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/perfiles-pasajero`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear pasajero");
    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/perfiles-pasajero/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar pasajero");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-pasajero/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar pasajero");
    return response.json();
  },
};
