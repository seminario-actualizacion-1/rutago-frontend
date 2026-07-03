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

const normalizeRutaPayload = (ruta) => ({
  ...ruta,
  origenId:
    ruta.origenId === "" || ruta.origenId == null || Number.isNaN(ruta.origenId)
      ? null
      : Number(ruta.origenId),
  destinoId:
    ruta.destinoId === "" ||
    ruta.destinoId == null ||
    Number.isNaN(ruta.destinoId)
      ? null
      : Number(ruta.destinoId),
  distanciaKm:
    ruta.distanciaKm === "" ||
    ruta.distanciaKm == null ||
    Number.isNaN(ruta.distanciaKm)
      ? null
      : Number(ruta.distanciaKm),
  tiempoEstimadoMinutos:
    ruta.tiempoEstimadoMinutos === "" ||
    ruta.tiempoEstimadoMinutos == null ||
    Number.isNaN(ruta.tiempoEstimadoMinutos)
      ? null
      : Number(ruta.tiempoEstimadoMinutos),
});

export const rutasService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/rutas${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error al cargar rutas");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/rutas/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar ruta");
    return response.json();
  },

  create: async (ruta) => {
    const response = await fetch(`${API_URL}/rutas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeRutaPayload(ruta)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al crear ruta");
    }
    return response.json();
  },

  update: async (id, ruta) => {
    const response = await fetch(`${API_URL}/rutas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeRutaPayload(ruta)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al actualizar ruta");
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/rutas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al eliminar ruta");
    }
    return response.json();
  },
};
