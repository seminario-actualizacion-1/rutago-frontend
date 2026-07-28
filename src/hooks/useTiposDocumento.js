import { useState, useEffect } from "react";
import { getTiposDocumento } from "../api/tiposDocumento";

export function useTiposDocumento() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    getTiposDocumento()
      .then(r => setData(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function nombre(id) {
    return data.find(t => t.id === id)?.nombre || "";
  }

  function opciones() {
    return data.map(t => ({ value: t.id, label: `${t.nombre} - ${t.descripcion || ""}` }));
  }

  return { data, loading, nombre, opciones };
}
