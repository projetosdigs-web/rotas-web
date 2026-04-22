import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [cities, setCities] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [cityId, setCityId] = useState(""); 
  const [neighborhood, setNeighborhood] = useState("");
  const [weekday, setWeekday] = useState("");

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [resC, resR, resV, resVi] = await Promise.all([
        api.get("/cities/"),
        api.get("/routes/"),
        api.get("/vehicles/"),
        api.get("/route-city-day/")
      ]);
      setCities(resC.data || []);
      setRoutes(resR.data || []);
      setVehicles(resV.data || []);
      setVinculos(resVi.data || []);
    } catch (err) { console.error("Erro ao carregar:", err); }
  }

  async function salvar() {
    if (!routeId || !cityId || weekday === "") return alert("Preencha os campos!");
    try {
      await api.post("/route-city-day/", {
        route_id: Number(routeId),
        vehicle_id: vehicleId ? Number(vehicleId) : null,
        city_id: Number(cityId),
        weekday: Number(weekday),
        neighborhood_name: neighborhood
      });
      alert("Salvo com sucesso!");
      setNeighborhood(""); carregarDados();
    } catch (err) { alert("Erro ao salvar"); }
  }

  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: "0 auto", fontFamily: "Arial" }}>
      <button onClick={() => window.location.href="/dashboard"} style={{ marginBottom: 20 }}>← Voltar</button>
      <div style={{ background: "#fff", padding: 25, borderRadius: 15, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <h2>Novo Vínculo de Atendimento</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
          <select value={routeId} onChange={e => setRouteId(e.target.value)} style={inputS}>
            <option value="">Selecione a Rota</option>
            {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select value={cityId} onChange={e => setCityId(e.target.value)} style={inputS}>
            <option value="">Selecione a Cidade</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Bairro (Texto)" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} style={inputS} />
          <select value={weekday} onChange={e => setWeekday(e.target.value)} style={inputS}>
            <option value="0">Segunda</option><option value="1">Terça</option>
            <option value="2">Quarta</option><option value="3">Quinta</option>
            <option value="4">Sexta</option><option value="7">Todos os dias</option>
          </select>
        </div>
        <button onClick={salvar} style={btnS}>Salvar Atendimento</button>
      </div>
      <div style={{ marginTop: 20 }}>
        {vinculos.map(v => (
          <div key={v.id} style={{ background: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
            <span><b>{v.city_name}</b> - {v.route_name} ({v.neighborhood_name || "Geral"})</span>
            <button onClick={async () => { await api.delete(`/route-city-day/${v.id}/`); carregarDados(); }} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
const inputS = { padding: 12, borderRadius: 8, border: "1px solid #ddd" };
const btnS = { width: "100%", marginTop: 15, padding: 15, background: "#403d7c", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" };