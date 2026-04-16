import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vinculos, setVinculos] = useState([]);

  const [routeId, setRouteId] = useState("");
  const [cityId, setCityId] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [weekday, setWeekday] = useState("");

  async function carregarTudo() {
    try {
      const [r, c, n, v, vc] = await Promise.all([
        api.get("/routes/"),
        api.get("/cities/"),
        api.get("/neighborhoods/"),
        api.get("/vehicles/"),
        api.get("/route-city-day/")
      ]);

      setRoutes(r.data || []);
      setCities(c.data || []);
      setNeighborhoods(n.data || []);
      setVehicles(v.data || []);
      setVinculos(vc.data || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados");
    }
  }

  async function criarVinculo() {
    if (!routeId || !cityId || !neighborhoodId || !vehicleId || !weekday) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await api.post("/route-city-day/", {
        route_id: Number(routeId),
        city_id: Number(cityId),
        neighborhood_id: Number(neighborhoodId),
        vehicle_id: Number(vehicleId),
        weekday,
      });

      setRouteId("");
      setCityId("");
      setNeighborhoodId("");
      setVehicleId("");
      setWeekday("");

      carregarTudo();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar vínculo");
    }
  }

  async function deletarVinculo(id) {
    if (!confirm("Deseja excluir esse vínculo?")) return;

    try {
      await api.delete(`/route-city-day/${id}`);
      carregarTudo();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir vínculo");
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Vínculo de Rotas</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          <option value="">Rota</option>
          {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <select value={cityId} onChange={(e) => setCityId(e.target.value)}>
          <option value="">Cidade</option>
          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select value={neighborhoodId} onChange={(e) => setNeighborhoodId(e.target.value)}>
          <option value="">Bairro</option>
          {neighborhoods
            .filter(n => !cityId || n.city_id === Number(cityId))
            .map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>

        <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
          <option value="">Veículo</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>

        <select value={weekday} onChange={(e) => setWeekday(e.target.value)}>
          <option value="">Dia</option>
          <option value="segunda">Segunda</option>
          <option value="terca">Terça</option>
          <option value="quarta">Quarta</option>
          <option value="quinta">Quinta</option>
          <option value="sexta">Sexta</option>
          <option value="sabado">Sábado</option>
        </select>

        <button onClick={criarVinculo}>Criar</button>
      </div>

      <h3 style={{ marginTop: 30 }}>Vínculos criados</h3>

      {vinculos.map(v => (
        <div key={v.id} style={{
          border: "1px solid #ccc",
          padding: 10,
          marginTop: 10,
          borderRadius: 8
        }}>
          <strong>{v.route_name}</strong> - {v.city_name} / {v.neighborhood_name} <br />
          Dia: {v.weekday} | Veículo: {v.vehicle_name}

          <div>
            <button onClick={() => deletarVinculo(v.id)}>
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}