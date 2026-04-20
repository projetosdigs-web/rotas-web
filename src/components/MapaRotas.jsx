import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function getCorPorRota(nome) {
  const cores = ["blue", "red", "green", "orange", "violet", "gold"];

  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }

  return cores[Math.abs(hash) % cores.length];
}

function criarIcone(cor) {
  const mapaCores = {
    blue: "blue",
    red: "red",
    green: "green",
    orange: "orange",
    violet: "violet",
    gold: "yellow",
  };

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${mapaCores[cor]}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export default function MapaRotas({ dados }) {
  if (!dados || dados.length === 0) return null;

  const pontosValidos = dados.filter(
    (item) => item.latitude && item.longitude
  );

  if (pontosValidos.length === 0) return null;

  return (
    <MapContainer
      center={[pontosValidos[0].latitude, pontosValidos[0].longitude]}
      zoom={11}
      scrollWheelZoom={false}
      style={{
        height: "420px",
        borderRadius: 20,
        marginBottom: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pontosValidos.map((item, index) => (
        <Marker
          key={index}
          position={[item.latitude, item.longitude]}
          icon={criarIcone(getCorPorRota(item.route_name || ""))}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
                {item.route_name || "-"}
              </div>

              <div style={{ marginBottom: 4 }}>
                <strong>Bairro:</strong> {item.neighborhood_name || "-"}
              </div>

              <div style={{ marginBottom: 4 }}>
                <strong>Veículo:</strong> {item.vehicle_name || "-"}
              </div>

              <div>
                <strong>Placa:</strong> {item.vehicle_plate || "-"}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}