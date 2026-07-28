import { useState, useEffect } from "react";
import { getRoles } from "../api/roles";

export function useRoles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    getRoles()
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function nombre(id) {
    return data.find(r => r.id === id)?.nombreRol || "";
  }

  function obtenerId(nombreRol) {
    return data.find(r => r.nombreRol?.toLowerCase() === nombreRol.toLowerCase())?.id;
  }

  function opciones() {
    return data.map(r => ({ value: r.id, label: `${r.nombreRol} - ${r.descripcion || ""}` }));
  }

  return { data, loading, nombre, obtenerId, opciones };
}
