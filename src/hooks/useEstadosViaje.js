import { useState, useEffect } from "react";
import { getEstadosViaje } from "../api/estados";

export function useEstadosViaje() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    getEstadosViaje()
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ESTADO = Object.fromEntries(
    data.map(e => [e.nombre.replace(/ /g, "_").toUpperCase(), e.id])
  );

  function nombre(id) {
    return data.find(e => e.id === id)?.nombre || "";
  }

  function opciones() {
    return data.map(e => ({ value: e.id, label: `${e.nombre} - ${e.descripcion || ""}` }));
  }

  return { data, loading, ESTADO, nombre, opciones };
}
