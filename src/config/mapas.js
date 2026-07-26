export const BUENAVENTURA_CENTER = [3.8808, -77.0311];

export const COMUNA_CENTROS = {
  1: [3.88777, -77.07149],
  2: [3.88479, -77.0655],
  3: [3.87705, -77.0618],
  4: [3.87972, -77.07038],
  5: [3.88388, -77.05004],
  6: [3.88667, -77.0221],
  7: [3.87732, -77.03417],
  8: [3.8781, -77.01798],
  9: [3.88256, -77.00474],
  10: [3.8772, -76.99354],
  11: [3.86764, -77.00777],
  12: [3.86816, -76.9875],
};

export const COMUNA_PALETTE = [
  "#e74c3c",
  "#2ecc71",
  "#3498db",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#27ae60",
  "#8e44ad",
  "#d35400",
  "#2c3e50",
  "#2980b9",
];

export const MAP_STYLES = {
  Calle: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attr: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  Satélite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  OSM: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
  Oscuro: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attr: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
};

export const OSRM_BASE_URL =
  import.meta.env.VITE_OSRM_URL || "https://router.project-osrm.org";

export const ICONOS_MAPA = {
  markerUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  markerRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  markerShadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  markerVerde:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  markerRojo:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
};
