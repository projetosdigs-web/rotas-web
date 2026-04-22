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

  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    carregarDadosIniciais();
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios")
      .then(res => setCidadesSP(res.data.map(c => c.nome).sort()));
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function carregarDadosIniciais() {
    setLoading(true);
    try {
      const [resR, resV, resVi] = await Promise.all([
        api.get("/routes/"),
        api.get("/vehicles/"),
        api.get("/route-city-day/")
      ]);
      setRoutes(resR.data || []);
      setVehicles(resV.data || []);
      setVinculos(resVi.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!routeId || !cityInput || weekday === "") {
      return alert("Por favor, preencha Cidade, Rota e Dia da Semana.");
    }
    
    try {
      setLoading(true);
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

      alert("Vínculo salvo com sucesso!");
      setCityInput(""); setNeighborhood(""); setRouteId(""); setVehicleId(""); setWeekday("");
      carregarDadosIniciais();
    } catch (err) {
      alert("Erro ao salvar vínculo.");
    } finally {
      setLoading(false);
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este atendimento?")) return;
    try {
      await api.delete(`/route-city-day/${id}/`);
      carregarDadosIniciais();
    } catch { alert("Erro ao excluir"); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", padding: isMobile ? "15px" : "40px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        {/* BOTÃO VOLTAR */}
        <button 
          onClick={() => window.location.href = "/dashboard"} 
          style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 20px", borderRadius: 12, cursor: "pointer", fontWeight: "bold", color: "#403d7c", marginBottom: 20 }}
        >
          ← Menu Principal
        </button>

        {/* CARD DE FORMULÁRIO */}
        <div style={{ background: "#fff", padding: isMobile ? 20 : 35, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: 30 }}>
          <h1 style={{ color: "#403d7c", fontSize: 24, marginBottom: 25, marginTop: 0 }}>Vínculo de Atendimento Logístico</h1>
          
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Cidade (Busca SP)</label>
              <input list="cidades" value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Ex: Jundiaí" style={inputStyle} />
              <datalist id="cidades">{cidadesSP.map(c => <option key={c} value={c} />)}</datalist>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Bairro ou Região</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Ex: Centro" style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Rota</label>
              <select value={routeId} onChange={e => setRouteId(e.target.value)} style={inputStyle}>
                <option value="">Selecione a Rota...</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Veículo</label>
              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} style={inputStyle}>
                <option value="">Selecione o Veículo...</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>)}
              </select>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Dia da Semana</label>
              <select value={weekday} onChange={e => setWeekday(e.target.value)} style={inputStyle}>
                <option value="">Selecione o dia...</option>
                <option value="0">Segunda-feira</option>
                <option value="1">Terça-feira</option>
                <option value="2">Quarta-feira</option>
                <option value="3">Quinta-feira</option>
                <option value="4">Sexta-feira</option>
                <option value="7">Todos os dias</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button 
                onClick={salvar} 
                disabled={loading} 
                style={{ width: "100%", padding: "15px", borderRadius: 14, background: "#403d7c", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: 16, boxShadow: "0 8px 20px rgba(64,61,124,0.2)" }}
              >
                {loading ? "Processando..." : "Salvar Vínculo"}
              </button>
            </div>
          </div>
        </div>

        {/* LISTA DE VÍNCULOS */}
        <h3 style={{ color: "#64748b", marginBottom: 15, marginLeft: 10 }}>Atendimentos Cadastrados</h3>
        <div style={{ display: "grid", gap: 15 }}>
          {vinculos.map(v => (
            <div key={v.id} style={{ background: "#fff", padding: 20, borderRadius: 20, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
              <div style={{ borderLeft: "4px solid #403d7c", paddingLeft: 15 }}>
                <div style={{ fontSize: 12, color: "#ed823c", fontWeight: "bold", textTransform: "uppercase" }}>{v.route_name}</div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: "#403d7c" }}>{v.city_name}</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>{v.neighborhood_name || "Atendimento Geral"}</div>
              </div>
              <button 
                onClick={() => excluir(v.id)} 
                style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "10px 15px", borderRadius: 12, fontWeight: "bold", cursor: "pointer" }}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputGroup = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 13, fontWeight: "bold", color: "#64748b", marginLeft: 4 };
const inputStyle = { padding: "14px", borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", background: "#fcfcff" };