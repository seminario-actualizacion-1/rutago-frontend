import { useState, useCallback, useRef, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import {
  BUENAVENTURA_CENTER,
  COMUNA_CENTROS,
  MAP_STYLES,
  OSRM_BASE_URL,
  ICONOS_MAPA,
} from "../../config/mapas";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: ICONOS_MAPA.markerRetinaUrl,
  iconUrl: ICONOS_MAPA.markerUrl,
  shadowUrl: ICONOS_MAPA.markerShadowUrl,
});

const iconOrigen = new L.Icon({
  iconUrl: ICONOS_MAPA.markerVerde,
  shadowUrl: ICONOS_MAPA.markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const iconDestino = new L.Icon({
  iconUrl: ICONOS_MAPA.markerRojo,
  shadowUrl: ICONOS_MAPA.markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function distancia(latlng1, latlng2) {
  const [lat1, lng1] = latlng1;
  const [lat2, lng2] = latlng2;
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

function comunaMasCercana(latlng) {
  let minId = null,
    minDist = Infinity;
  for (const [id, centro] of Object.entries(COMUNA_CENTROS)) {
    const d = distancia(latlng, centro);
    if (d < minDist) {
      minDist = d;
      minId = parseInt(id);
    }
  }
  return minId;
}

function TileLayerSwitcher() {
  const map = useMap();
  useEffect(() => {
    const layers = {};
    const firstKey = Object.keys(MAP_STYLES)[0];
    layers[firstKey] = L.tileLayer(MAP_STYLES[firstKey].url, {
      attribution: MAP_STYLES[firstKey].attr,
    }).addTo(map);
    for (const [name, cfg] of Object.entries(MAP_STYLES).slice(1)) {
      layers[name] = L.tileLayer(cfg.url, { attribution: cfg.attr });
    }
    const control = L.control
      .layers(layers, null, { position: "bottomleft", collapsed: false })
      .addTo(map);
    return () => {
      map.removeControl(control);
      Object.values(layers).forEach((l) => map.removeLayer(l));
    };
  }, [map]);
  return null;
}

function ClickHandler({ onClick }) {
  useMapEvents({ click: (e) => onClick([e.latlng.lat, e.latlng.lng]) });
  return null;
}

function BuscadorMapa() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: { countrycodes: "CO", limit: 5 },
    });
    const control = new GeoSearchControl({
      provider,
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: 15,
      style: "bar",
    });
    map.addControl(control);
    return () => map.removeControl(control);
  }, [map]);
  return null;
}

export default function MapaCrearRuta({ formData, setFormData, comunas }) {
  const parseCoords = () => {
    if (formData?.rutaGeometria) {
      try {
        const parsed = JSON.parse(formData.rutaGeometria);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return null;
      }
    }
    return null;
  };

  const initialCoords = parseCoords();

  const [origen, setOrigen] = useState(() => {
    if (initialCoords) return initialCoords[0];
    if (formData?.origenId && COMUNA_CENTROS[formData.origenId])
      return COMUNA_CENTROS[formData.origenId];
    return null;
  });
  const [destino, setDestino] = useState(() => {
    if (initialCoords) return initialCoords[initialCoords.length - 1];
    if (formData?.destinoId && COMUNA_CENTROS[formData.destinoId])
      return COMUNA_CENTROS[formData.destinoId];
    return null;
  });
  const [rutaCoords, setRutaCoords] = useState(initialCoords);
  const [calculando, setCalculando] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const ultimoDestino = useRef(null);

  const comunaNombre = (id) =>
    comunas?.find((c) => c.id === id)?.nombre || `Comuna ${id}`;

  useEffect(() => {
    if (origen && destino && !rutaCoords) {
      setCalculando(true);
      const markerId = Date.now();
      ultimoDestino.current = markerId;
      fetch(
        `${OSRM_BASE_URL}/route/v1/driving/${origen[1]},${origen[0]};${destino[1]},${destino[0]}?geometries=geojson&overview=full`,
      )
        .then((r) => r.json())
        .then((data) => {
          if (ultimoDestino.current !== markerId) return;
          if (data.code !== "Ok") throw new Error();
          const ruta = data.routes[0];
          const coords = ruta.geometry.coordinates.map((c) => [c[1], c[0]]);
          setRutaCoords(coords);
          setOrigen(coords[0]);
          setDestino(coords[coords.length - 1]);
          setFormData((prev) => ({
            ...prev,
            rutaGeometria: JSON.stringify(coords),
          }));
        })
        .catch(() => {})
        .finally(() => {
          if (ultimoDestino.current === markerId) setCalculando(false);
        });
    }
  }, []);

  const handleClick = useCallback(
    (latlng) => {
      const comunaId = comunaMasCercana(latlng);
      if (!origen) {
        setOrigen(latlng);
        setRutaCoords(null);
        setFormData((prev) => ({ ...prev, origenId: comunaId }));
      } else if (!destino) {
        setDestino(latlng);
        setFormData((prev) => ({ ...prev, destinoId: comunaId }));
        setCalculando(true);
        const markerId = Date.now();
        ultimoDestino.current = markerId;
        fetch(
          `${OSRM_BASE_URL}/route/v1/driving/${origen[1]},${origen[0]};${latlng[1]},${latlng[0]}?geometries=geojson&overview=full`,
        )
          .then((r) => r.json())
          .then((data) => {
            if (ultimoDestino.current !== markerId) return;
            if (data.code !== "Ok") throw new Error();
            const ruta = data.routes[0];
            const coords = ruta.geometry.coordinates.map((c) => [c[1], c[0]]);
            setRutaCoords(coords);
            setOrigen(coords[0]);
            setDestino(coords[coords.length - 1]);
            setFormData((prev) => ({
              ...prev,
              distanciaKm: Math.round((ruta.distance / 1000) * 10) / 10,
              tiempoEstimadoMinutos: Math.max(
                1,
                Math.round(ruta.duration / 60),
              ),
              rutaGeometria: JSON.stringify(coords),
            }));
          })
          .catch(() => {
            if (ultimoDestino.current === markerId) {
              setFormData((prev) => ({
                ...prev,
                distanciaKm: "",
                tiempoEstimadoMinutos: "",
                rutaGeometria: "",
              }));
            }
          })
          .finally(() => {
            if (ultimoDestino.current === markerId) setCalculando(false);
          });
      } else {
        setOrigen(latlng);
        setDestino(null);
        setRutaCoords(null);
        setFormData((prev) => ({
          ...prev,
          origenId: comunaId,
          destinoId: "",
          distanciaKm: "",
          tiempoEstimadoMinutos: "",
          rutaGeometria: "",
        }));
      }
    },
    [origen, destino, setFormData],
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "0.25rem",
        }}
      >
        <button
          type="button"
          onClick={() => setExpandido(true)}
          style={{
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "0.8rem",
            cursor: "pointer",
            color: "#555",
          }}
        >
          Expandir mapa
        </button>
      </div>

      {!expandido && (
        <MapContainer
          center={BUENAVENTURA_CENTER}
          zoom={13}
          style={{ height: "220px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayerSwitcher />
          <ClickHandler onClick={handleClick} />
          {origen && <Marker position={origen} icon={iconOrigen} />}
          {destino && <Marker position={destino} icon={iconDestino} />}
          {rutaCoords && (
            <Polyline positions={rutaCoords} color="#2563eb" weight={4} />
          )}
        </MapContainer>
      )}

      <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#555" }}>
        {calculando && <p>Calculando ruta con OSRM...</p>}
        {!calculando && !origen && (
          <p>
            Haz clic en el mapa para marcar el <strong>origen</strong>.
          </p>
        )}
        {!calculando && origen && !destino && (
          <p>
            Ahora haz clic para marcar el <strong>destino</strong>.
          </p>
        )}
        {!calculando && origen && destino && (
          <p>
            <span style={{ color: "green" }}>●</span>{" "}
            {comunaNombre(formData?.origenId)} &rarr;{" "}
            <span style={{ color: "red" }}>●</span>{" "}
            {comunaNombre(formData?.destinoId)} &nbsp;|&nbsp;
            {formData?.distanciaKm} km &nbsp;|&nbsp; ~
            {formData?.tiempoEstimadoMinutos} min
          </p>
        )}
      </div>

      {expandido && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setExpandido(false)}
        >
          <div
            style={{
              width: "95vw",
              height: "90vh",
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Selecciona origen y destino en el mapa
              </span>
              <button
                type="button"
                onClick={() => setExpandido(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  color: "#666",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <MapContainer
                center={BUENAVENTURA_CENTER}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayerSwitcher />
                <ClickHandler onClick={handleClick} />
                <BuscadorMapa />
                {origen && <Marker position={origen} icon={iconOrigen} />}
                {destino && <Marker position={destino} icon={iconDestino} />}
                {rutaCoords && (
                  <Polyline positions={rutaCoords} color="#2563eb" weight={4} />
                )}
              </MapContainer>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderTop: "1px solid #e5e7eb",
                fontSize: "0.85rem",
                color: "#555",
              }}
            >
              {calculando && <p>Calculando ruta con OSRM...</p>}
              {!calculando && !origen && (
                <p>
                  Haz clic en el mapa para marcar el <strong>origen</strong>.
                </p>
              )}
              {!calculando && origen && !destino && (
                <p>
                  Ahora haz clic para marcar el <strong>destino</strong>.
                </p>
              )}
              {!calculando && origen && destino && (
                <p>
                  <span style={{ color: "green" }}>●</span>{" "}
                  {comunaNombre(formData?.origenId)} &rarr;{" "}
                  <span style={{ color: "red" }}>●</span>{" "}
                  {comunaNombre(formData?.destinoId)} &nbsp;|&nbsp;
                  {formData?.distanciaKm} km &nbsp;|&nbsp; ~
                  {formData?.tiempoEstimadoMinutos} min
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
