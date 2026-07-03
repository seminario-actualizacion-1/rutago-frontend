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

const normalizeConductorPayload = (conductor) => ({
  ...conductor,
  usuarioId:
    conductor.usuarioId === "" ||
    conductor.usuarioId == null ||
    Number.isNaN(conductor.usuarioId)
      ? null
      : Number(conductor.usuarioId),
  vehiculoId:
    conductor.vehiculoId === "" ||
    conductor.vehiculoId == null ||
    Number.isNaN(conductor.vehiculoId)
      ? null
      : Number(conductor.vehiculoId),
});

const normalizeConductorUpdatePayload = (conductor) => {
  const payload = { ...conductor };
  delete payload.usuarioId;
  payload.vehiculoId =
    payload.vehiculoId === "" ||
    payload.vehiculoId == null ||
    Number.isNaN(payload.vehiculoId)
      ? null
      : Number(payload.vehiculoId);
  return payload;
};

export const conductoresService = {
  getAll: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await fetch(
      `${API_URL}/perfiles-conductor${query ? `?${query}` : ""}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Error al cargar conductores");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar conductor");
    return response.json();
  },

  create: async (conductor) => {
    const response = await fetch(`${API_URL}/perfiles-conductor`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeConductorPayload(conductor)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al crear conductor");
    }
    return response.json();
  },

  update: async (id, conductor) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeConductorUpdatePayload(conductor)),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al actualizar conductor");
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/perfiles-conductor/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al eliminar conductor");
    }
    return response.json();
  },
};
