import { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const iconOrigen = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const iconDestino = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const BUENAVENTURA_CENTER = [3.8808, -77.0311];

const COMUNA_CENTROS = {
  1: [3.88777, -77.07149],
  2: [3.88479, -77.06550],
  3: [3.87705, -77.06180],
  4: [3.87972, -77.07038],
  5: [3.88388, -77.05004],
  6: [3.88667, -77.02210],
  7: [3.87732, -77.03417],
  8: [3.87810, -77.01798],
  9: [3.88256, -77.00474],
  10: [3.87720, -76.99354],
  11: [3.86764, -77.00777],
  12: [3.86816, -76.98750],
};

function distancia(latlng1, latlng2) {
  const [lat1, lng1] = latlng1;
  const [lat2, lng2] = latlng2;
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

function comunaMasCercana(latlng) {
  let minId = null, minDist = Infinity;
  for (const [id, centro] of Object.entries(COMUNA_CENTROS)) {
    const d = distancia(latlng, centro);
    if (d < minDist) { minDist = d; minId = parseInt(id); }
  }
  return minId;
}

const MAP_STYLES = {
  Calle: { url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", attr: '&copy; <a href="https://carto.com/">CARTO</a>' },
  Satélite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: '&copy; <a href="https://www.esri.com/">Esri</a>' },
  OSM: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' },
  Oscuro: { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attr: '&copy; <a href="https://carto.com/">CARTO</a>' },
};

function TileLayerSwitcher() {
  const map = useMap();
  useEffect(() => {
    const layers = {};
    const firstKey = Object.keys(MAP_STYLES)[0];
    layers[firstKey] = L.tileLayer(MAP_STYLES[firstKey].url, { attribution: MAP_STYLES[firstKey].attr }).addTo(map);
    for (const [name, cfg] of Object.entries(MAP_STYLES).slice(1)) {
      layers[name] = L.tileLayer(cfg.url, { attribution: cfg.attr });
    }
    const control = L.control.layers(layers, null, { position: "bottomleft", collapsed: false }).addTo(map);
    return () => { map.removeControl(control); Object.values(layers).forEach((l) => map.removeLayer(l)); };
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
    const provider = new OpenStreetMapProvider({ params: { countrycodes: "CO", limit: 5 } });
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
  const [origen, setOrigen] = useState(() => {
    if (formData?.origenId && COMUNA_CENTROS[formData.origenId]) return COMUNA_CENTROS[formData.origenId];
    return null;
  });
  const [destino, setDestino] = useState(() => {
    if (formData?.destinoId && COMUNA_CENTROS[formData.destinoId]) return COMUNA_CENTROS[formData.destinoId];
    return null;
  });
  const [rutaCoords, setRutaCoords] = useState(null);
  const [calculando, setCalculando] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const ultimoDestino = useRef(null);

  const comunaNombre = (id) => comunas?.find((c) => c.id === id)?.nombre || `Comuna ${id}`;

  useEffect(() => {
    if (origen && destino && !rutaCoords) {
      setCalculando(true);
      const markerId = Date.now();
      ultimoDestino.current = markerId;
      fetch(`https://router.project-osrm.org/route/v1/driving/${origen[1]},${origen[0]};${destino[1]},${destino[0]}?geometries=geojson&overview=full`)
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

  const handleClick = useCallback((latlng) => {
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
      fetch(`https://router.project-osrm.org/route/v1/driving/${origen[1]},${origen[0]};${latlng[1]},${latlng[0]}?geometries=geojson&overview=full`)
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
            tiempoEstimadoMinutos: Math.max(1, Math.round(ruta.duration / 60)),
            rutaGeometria: JSON.stringify(coords),
          }));
        })
        .catch(() => {
          if (ultimoDestino.current === markerId) {
            setFormData((prev) => ({ ...prev, distanciaKm: "", tiempoEstimadoMinutos: "", rutaGeometria: "" }));
          }
        })
        .finally(() => {
          if (ultimoDestino.current === markerId) setCalculando(false);
        });
    } else {
      setOrigen(latlng);
      setDestino(null);
      setRutaCoords(null);
      setFormData((prev) => ({ ...prev, origenId: comunaId, destinoId: "", distanciaKm: "", tiempoEstimadoMinutos: "", rutaGeometria: "" }));
    }
  }, [origen, destino, setFormData]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.25rem" }}>
        <button
          type="button"
          onClick={() => setExpandido(true)}
          style={{
            background: "none", border: "1px solid #ccc", borderRadius: "4px",
            padding: "2px 8px", fontSize: "0.8rem", cursor: "pointer", color: "#555",
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
          {rutaCoords && <Polyline positions={rutaCoords} color="#2563eb" weight={4} />}
        </MapContainer>
      )}

      <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#555" }}>
        {calculando && <p>Calculando ruta con OSRM...</p>}
        {!calculando && !origen && <p>Haz clic en el mapa para marcar el <strong>origen</strong>.</p>}
        {!calculando && origen && !destino && <p>Ahora haz clic para marcar el <strong>destino</strong>.</p>}
        {!calculando && origen && destino && (
          <p>
            <span style={{ color: "green" }}>●</span> {comunaNombre(formData?.origenId)} &rarr;{" "}
            <span style={{ color: "red" }}>●</span> {comunaNombre(formData?.destinoId)} &nbsp;|&nbsp;
            {formData?.distanciaKm} km &nbsp;|&nbsp; ~{formData?.tiempoEstimadoMinutos} min
          </p>
        )}
      </div>

      {expandido && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999, backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setExpandido(false)}
        >
          <div
            style={{
              width: "95vw", height: "90vh",
              backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Selecciona origen y destino en el mapa</span>
              <button
                type="button"
                onClick={() => setExpandido(false)}
                style={{
                  background: "none", border: "none", fontSize: "1.3rem",
                  cursor: "pointer", color: "#666", lineHeight: 1,
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
                {rutaCoords && <Polyline positions={rutaCoords} color="#2563eb" weight={4} />}
              </MapContainer>
            </div>
            <div style={{ padding: "8px 12px", borderTop: "1px solid #e5e7eb", fontSize: "0.85rem", color: "#555" }}>
              {calculando && <p>Calculando ruta con OSRM...</p>}
              {!calculando && !origen && <p>Haz clic en el mapa para marcar el <strong>origen</strong>.</p>}
              {!calculando && origen && !destino && <p>Ahora haz clic para marcar el <strong>destino</strong>.</p>}
              {!calculando && origen && destino && (
                <p>
                  <span style={{ color: "green" }}>●</span> {comunaNombre(formData?.origenId)} &rarr;{" "}
                  <span style={{ color: "red" }}>●</span> {comunaNombre(formData?.destinoId)} &nbsp;|&nbsp;
                  {formData?.distanciaKm} km &nbsp;|&nbsp; ~{formData?.tiempoEstimadoMinutos} min
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
