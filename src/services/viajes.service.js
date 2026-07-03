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

export const viajesService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/viajes${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error al cargar viajes");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/viajes/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar viaje");
    return response.json();
  },

  create: async (viaje) => {
    const response = await fetch(`${API_URL}/viajes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(viaje),
    });
    if (!response.ok) throw new Error("Error al crear viaje");
    return response.json();
  },
};
