import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  const [cidadesSP, setCidadesSP] = useState([]); 
  
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [cityInput, setCityInput] = useState(""); 
  const [neighborhood, setNeighborhood] = useState("");
  const [weekday, setWeekday] = useState("");

  useEffect(() => {
    carregarDadosIniciais();
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios")
      .then(res => setCidadesSP(res.data.map(c => c.nome).sort()));
  }, []);

  async function carregarDadosIniciais() {
    try {
      // Carregamos as opções dos Selects primeiro
      const [resR, resV] = await Promise.all([
        api.get("/routes/"),
        api.get("/vehicles/")
      ]);
      setRoutes(resR.data || []);
      setVehicles(resV.data || []);

      // Carregamos a lista de baixo separadamente
      const resVi = await api.get("/route-city-day/");
      setVinculos(resVi.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }

  async function salvar() {
    if (!routeId || !cityInput || weekday === "") return alert("Preencha os campos obrigatórios!");
    try {
      const resC = await api.get("/cities/");
      let city = resC.data.find(c => c.name.toLowerCase() === cityInput.toLowerCase());
      let cityId = city ? city.id : (await api.post("/cities/", { name: cityInput })).data.id;

      await api.post("/route-city-day/", {
        route_id: Number(routeId),
        vehicle_id: vehicleId ? Number(vehicleId) : null,
        city_id: cityId,
        weekday: Number(weekday),
        neighborhood_name: neighborhood
      });

      alert("Salvo!");
      setCityInput(""); setNeighborhood(""); carregarDadosIniciais();
    } catch (err) { alert("Erro ao salvar"); }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "Arial" }}>
      <button onClick={() => window.location.href="/dashboard"} style={{ marginBottom: 20, cursor: "pointer" }}>← Menu Principal</button>
      
      <div style={{ background: "#fff", padding: 30, borderRadius: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        <h2>Vínculo de Atendimento</h2>
        <div style={{ display: "grid", gap: 15, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label>Cidade</label>
            <input list="cidades" value={cityInput} onChange={e => setQuery(e.target.value)} style={{ width: '100%', padding: 10 }} />
            <datalist id="cidades">{cidadesSP.map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <div>
            <label>Bairro</label>
            <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} style={{ width: '100%', padding: 10 }} />
          </div>
          <div>
            <label>Rota</label>
            <select value={routeId} onChange={e => setRouteId(e.target.value)} style={{ width: '100%', padding: 10 }}>
              <option value="">Selecione...</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label>Veículo</label>
            <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} style={{ width: '100%', padding: 10 }}>
              <option value="">Selecione...</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label>Dia da Semana</label>
            <select value={weekday} onChange={e => setWeekday(e.target.value)} style={{ width: '100%', padding: 10 }}>
              <option value="">Selecione...</option>
              <option value="0">Segunda</option>
              <option value="1">Terça</option>
              <option value="2">Quarta</option>
              <option value="3">Quinta</option>
              <option value="4">Sexta</option>
              <option value="7">Todos os dias</option>
            </select>
          </div>
        </div>
        <button onClick={salvar} style={{ width: "100%", marginTop: 20, padding: 15, background: "#403d7c", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>Salvar Vínculo</button>
      </div>
    </div>
  );
}