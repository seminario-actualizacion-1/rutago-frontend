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

export const comunasService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/comunas${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error al cargar comunas");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/comunas/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar comuna");
    return response.json();
  },

  create: async (comuna) => {
    const response = await fetch(`${API_URL}/comunas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(comuna),
    });
    if (!response.ok) throw new Error("Error al crear comuna");
    return response.json();
  },

  update: async (id, comuna) => {
    const response = await fetch(`${API_URL}/comunas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(comuna),
    });
    if (!response.ok) throw new Error("Error al actualizar comuna");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/comunas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar comuna");
    return response.json();
  },
};
