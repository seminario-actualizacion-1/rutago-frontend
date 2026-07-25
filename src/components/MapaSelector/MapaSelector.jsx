import { useState, useEffect } from "react";
import { MapContainer, Marker, useMapEvents, useMap } from "react-leaflet";
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

const BUENAVENTURA_CENTER = [3.8808, -77.0311];
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

function BuscadorMapa() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider({ params: { countrycodes: "CO", limit: 5 } });
    const control = new GeoSearchControl({
      provider, showMarker: false, showPopup: false, autoClose: true, retainZoomLevel: 15, style: "bar",
    });
    map.addControl(control);
    return () => map.removeControl(control);
  }, [map]);
  return null;
}

function ClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick([e.latlng.lat, e.latlng.lng]); } });
  return null;
}

export default function MapaSelector({ latitud, longitud, onCoordenadasChange }) {
  const [pos, setPos] = useState(latitud && longitud ? [latitud, longitud] : null);
  const [expandido, setExpandido] = useState(false);

  const handleClick = (coords) => {
    setPos(coords);
    onCoordenadasChange(coords[0], coords[1]);
  };

  const mapaChico = (
    <MapContainer
      center={pos || BUENAVENTURA_CENTER}
      zoom={pos ? 15 : 13}
      style={{ height: "220px", width: "100%", borderRadius: "8px", cursor: "crosshair" }}
    >
      <TileLayerSwitcher />
      <ClickHandler onMapClick={handleClick} />
      {pos && <Marker position={pos} />}
    </MapContainer>
  );

  const mapaGrande = (
    <MapContainer
      center={pos || BUENAVENTURA_CENTER}
      zoom={pos ? 15 : 13}
      style={{ width: "100%", height: "100%", cursor: "crosshair" }}
    >
      <TileLayerSwitcher />
      <ClickHandler onMapClick={handleClick} />
      <BuscadorMapa />
      {pos && <Marker position={pos} />}
    </MapContainer>
  );

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

      {!expandido && mapaChico}

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
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Selecciona la ubicación del vehículo</span>
              <button
                type="button"
                onClick={() => setExpandido(false)}
                style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#666", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div style={{ flex: 1 }}>{mapaGrande}</div>
            {pos && (
              <div style={{ padding: "8px 12px", borderTop: "1px solid #e5e7eb", fontSize: "0.85rem", color: "#555" }}>
                Lat: {pos[0].toFixed(5)}, Lng: {pos[1].toFixed(5)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
