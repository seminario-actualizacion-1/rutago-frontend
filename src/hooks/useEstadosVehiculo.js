import { useState, useEffect } from "react";
import { getEstadosVehiculo } from "../api/estados";

export function useEstadosVehiculo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    getEstadosVehiculo()
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function nombre(id) {
    return data.find(e => e.id === id)?.nombre || "";
  }

  function opciones() {
    return data.map(e => ({ value: e.id, label: `${e.nombre} - ${e.descripcion || ""}` }));
  }

  return { data, loading, nombre, opciones };
}
