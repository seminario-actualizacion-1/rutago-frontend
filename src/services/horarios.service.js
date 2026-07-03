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

const normalizeHorarioPayload = (horario) => ({
  ...horario,
  vehiculoId:
    horario.vehiculoId === "" ||
    horario.vehiculoId == null ||
    Number.isNaN(horario.vehiculoId)
      ? null
      : Number(horario.vehiculoId),
  rutaId:
    horario.rutaId === "" ||
    horario.rutaId == null ||
    Number.isNaN(horario.rutaId)
      ? null
      : Number(horario.rutaId),
  frecuenciaMinutos:
    horario.frecuenciaMinutos === "" ||
    horario.frecuenciaMinutos == null ||
    Number.isNaN(horario.frecuenciaMinutos)
      ? null
      : Number(horario.frecuenciaMinutos),
});

export const horariosService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/horarios${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error al cargar horarios");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/horarios/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar horario");
    return response.json();
  },

  create: async (horario) => {
    const response = await fetch(`${API_URL}/horarios`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeHorarioPayload(horario)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al crear horario");
    }
    return response.json();
  },

  update: async (id, horario) => {
    const response = await fetch(`${API_URL}/horarios/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeHorarioPayload(horario)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al actualizar horario");
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/horarios/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al eliminar horario");
    }
    return response.json();
  },
};
