import { useState, useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, Tooltip, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

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

const COMUNA_PALETTE = ["#e74c3c", "#2ecc71", "#3498db", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22", "#27ae60", "#8e44ad", "#d35400", "#2c3e50", "#2980b9"];

function svgMarkerIcon(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 20 32"><path d="M10 0C4.5 0 0 4.5 0 10c0 7.5 10 22 10 22s10-14.5 10-22C20 4.5 15.5 0 10 0Z" fill="${color}" stroke="#fff" stroke-width="1.2"/><circle cx="10" cy="10" r="4" fill="#fff" opacity="0.9"/></svg>`;
  return new L.Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [1, -28],
  });
}

const iconCache = {};

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

    return () => {
      map.removeControl(control);
      Object.values(layers).forEach((l) => map.removeLayer(l));
    };
  }, [map]);

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

export default function MapaRutas({ rutas = [], showSearch = false }) {
  const [horariosPorRuta, setHorariosPorRuta] = useState({});

  useEffect(() => {
    fetch(`/api/horarios?registrosPorPagina=100`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((res) => {
        const datos = res.data ?? res.horarios ?? [];
        const agrupados = {};
        datos.forEach((h) => {
          const rutaId = h.ruta?.id ?? h.rutaId;
          if (!agrupados[rutaId]) agrupados[rutaId] = [];
          agrupados[rutaId].push(h);
        });
        setHorariosPorRuta(agrupados);
      })
      .catch(() => {});
  }, []);

  const rutasVisibles = rutas.filter((r) => {
    const oCoord = COMUNA_CENTROS[r.origen?.id];
    const dCoord = COMUNA_CENTROS[r.destino?.id];
    return oCoord && dCoord;
  });

  return (
    <MapContainer
      center={BUENAVENTURA_CENTER}
      zoom={13}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
        <style>{`.ruta-tooltip { font-size: 0.7rem; padding: 2px 6px; white-space: nowrap; } .ruta-hover-tooltip { font-size: 0.75rem; padding: 4px 8px; white-space: nowrap; background: #333; color: #fff; border: none; border-radius: 4px; }`}</style>
        <TileLayerSwitcher />
        {showSearch && <BuscadorMapa />}
        {!rutasVisibles.length ? (
        <Marker position={BUENAVENTURA_CENTER}>
          <Popup>Buenaventura — las rutas aparecerán aquí cuando tengan coordenadas</Popup>
        </Marker>
      ) : (
        rutasVisibles.map((ruta) => {
          const comunaId = ruta.origen?.id;
          const idx = Object.keys(COMUNA_CENTROS).indexOf(String(comunaId));
          const colorHex = idx !== -1 ? COMUNA_PALETTE[idx % COMUNA_PALETTE.length] : "#3498db";
          if (!iconCache[colorHex]) iconCache[colorHex] = svgMarkerIcon(colorHex);
          const icono = iconCache[colorHex];
          const geometria = ruta.rutaGeometria ? JSON.parse(ruta.rutaGeometria) : null;
          const oCoord = geometria ? geometria[0] : COMUNA_CENTROS[ruta.origen.id];
          const dCoord = geometria ? geometria[geometria.length - 1] : COMUNA_CENTROS[ruta.destino.id];
          return (
            <div key={ruta.id}>
              <Marker position={oCoord} icon={icono}>
                <Tooltip permanent direction="top" offset={[0, -20]} className="ruta-tooltip">{ruta.nombre}</Tooltip>
                <Popup>
                  <b>{ruta.nombre}</b>
                  <br />Origen: {ruta.origen.nombre}
                  {horariosPorRuta[ruta.id]?.length > 0 && (
                    <>
                      <hr style={{ margin: "4px 0" }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Horarios:</span>
                      {horariosPorRuta[ruta.id].map((h) => (
                        <div key={h.id} style={{ fontSize: "0.8rem", marginTop: "2px" }}>
                          {h.horaSalida?.slice(0, 5)} {h.frecuenciaMinutos ? `· c/${h.frecuenciaMinutos}min` : ""}
                          <span style={{ color: "#666" }}> · {h.vehiculo?.placa || ""}</span>
                        </div>
                      ))}
                    </>
                  )}
                </Popup>
              </Marker>
              <Marker position={dCoord} icon={icono}>
                <Popup>
                  <b>{ruta.nombre}</b>
                  <br />Destino: {ruta.destino.nombre}
                  {horariosPorRuta[ruta.id]?.length > 0 && (
                    <>
                      <hr style={{ margin: "4px 0" }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Horarios:</span>
                      {horariosPorRuta[ruta.id].map((h) => (
                        <div key={h.id} style={{ fontSize: "0.8rem", marginTop: "2px" }}>
                          {h.horaSalida?.slice(0, 5)} {h.frecuenciaMinutos ? `· c/${h.frecuenciaMinutos}min` : ""}
                          <span style={{ color: "#666" }}> · {h.vehiculo?.placa || ""}</span>
                        </div>
                      ))}
                    </>
                  )}
                </Popup>
              </Marker>
              <Polyline
                positions={geometria || [oCoord, dCoord]}
                color={colorHex}
                weight={3}
                opacity={0.7}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 7, opacity: 1, color: "#ff6600" });
                    e.target.bindTooltip(`<b>${ruta.nombre}</b><br/>${ruta.origen?.nombre} → ${ruta.destino?.nombre}`, { direction: "top", offset: [0, -10], className: "ruta-hover-tooltip" }).openTooltip();
                    e.target.bringToFront();
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 3, opacity: 0.7, color: colorHex });
                    e.target.unbindTooltip();
                  },
                }}
              />
            </div>
          );
        })
      )}
    </MapContainer>
  );
}
