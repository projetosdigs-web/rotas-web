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
  const [neighborhood, setNeighborhood] = useState(""); // Campo de texto
  const [weekday, setWeekday] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      // ATENÇÃO: Removido o '/neighborhoods/' que dava erro 404
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
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      alert("Erro ao carregar dados. Verifique o console.");
    }
  }

  async function salvar() {
    if (!routeId || !cityId || weekday === "") return alert("Preencha os campos!");
    try {
      await api.post("/route-city-day/", {
        route_id: Number(routeId),
        vehicle_id: vehicleId ? Number(vehicleId) : null,
        city_id: Number(cityId),
        weekday: Number(weekday),
        neighborhood_name: neighborhood // Salva como texto
      });
      alert("Vínculo criado!");
      setNeighborhood("");
      carregarDados();
    } catch (err) { alert("Erro ao salvar"); }
  }

  return (
    <div style={{ padding: 40, background: "#f8f7fc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", padding: 30, borderRadius: 20 }}>
        <h2>Vínculo de Rotas</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
          <select value={routeId} onChange={e => setRouteId(e.target.value)} style={inputStyle}>
            <option value="">Selecione a rota</option>
            {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          <select value={cityId} onChange={e => setCityId(e.target.value)} style={inputStyle}>
            <option value="">Selecione a cidade</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input 
            placeholder="Bairro (Digite o nome)" 
            value={neighborhood} 
            onChange={e => setNeighborhood(e.target.value)} 
            style={inputStyle} 
          />

          <select value={weekday} onChange={e => setWeekday(e.target.value)} style={inputStyle}>
            <option value="">Dia da Semana</option>
            <option value="0">Segunda</option><option value="1">Terça</option>
            <option value="2">Quarta</option><option value="3">Quinta</option>
            <option value="4">Sexta</option><option value="7">Todos os dias</option>
          </select>
        </div>
        <button onClick={salvar} style={btnStyle}>Criar Vínculo</button>
      </div>
    </div>
  );
}

const inputStyle = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btnStyle = { marginTop: 20, width: "100%", padding: 15, background: "#403d7c", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" };