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
    
    // Carrega cidades do IBGE para o auxílio na digitação
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios")
      .then(res => setCidadesSP(res.data.map(c => c.nome).sort()))
      .catch(err => console.error("Erro IBGE:", err));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function carregarDadosIniciais() {
    setLoading(true);
    try {
      console.log("Tentando buscar dados do backend...");
      
      // Buscamos cada um individualmente para não travar se um falhar
      const resRoutes = await api.get("/routes/");
      setRoutes(resRoutes.data || []);

      const resVehicles = await api.get("/vehicles/");
      setVehicles(resVehicles.data || []);

      const resVinculos = await api.get("/route-city-day/");
      setVinculos(resVinculos.data || []);

      console.log("Dados carregados com sucesso!");
    } catch (err) {
      console.error("Erro crítico ao carregar dados:", err.response || err);
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!routeId || !cityInput || !weekday) {
      return alert("Preencha Cidade, Rota e Dia da Semana!");
    }
    
    try {
      setLoading(true);
      // 1. Verificar/Criar Cidade
      const resC = await api.get("/cities/");
      let city = resC.data.find(c => c.name.toLowerCase() === cityInput.toLowerCase());
      let cityId = city ? city.id : null;

      if (!cityId) {
        const novaC = await api.post("/cities/", { name: cityInput });
        cityId = novaC.data.id;
      }

      // 2. Criar Vínculo
      await api.post("/route-city-day/", {
        route_id: Number(routeId),
        vehicle_id: vehicleId ? Number(vehicleId) : null,
        city_id: Number(cityId),
        weekday: Number(weekday),
        neighborhood_name: neighborhood
      });

      alert("Vínculo criado com sucesso!");
      setCityInput("");
      setNeighborhood("");
      carregarDadosIniciais();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar vínculo.");
    } finally {
      setLoading(false);
    }
  }

  // Estilos rápidos internos
  const cardStyle = { background: "#fff", padding: 25, borderRadius: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: 20 };
  const inputStyle = { padding: "12px", borderRadius: 12, border: "1px solid #ddd", fontSize: 15, width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", padding: isMobile ? "15px" : "40px", fontFamily: "Arial" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        <button onClick={() => window.location.href = "/dashboard"} style={{ marginBottom: 20, border: "none", background: "#eee", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: "bold" }}>
          ← Menu Principal
        </button>

        <div style={cardStyle}>
          <h2 style={{ color: "#403d7c", marginTop: 0 }}>Vínculo de Atendimento</h2>
          
          <div style={{ display: "grid", gap: 15, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: "bold", color: "#64748b" }}>Cidade</label>
              <input list="cidades" value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Ex: Jundiaí" style={inputStyle} />
              <datalist id="cidades">{cidadesSP.map(c => <option key={c} value={c} />)}</datalist>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: "bold", color: "#64748b" }}>Bairro (Opcional)</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Ex: Centro" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: "bold", color: "#64748b" }}>Rota</label>
              <select value={routeId} onChange={e => setRouteId(e.target.value)} style={inputStyle}>
                <option value="">Selecione...</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: "bold", color: "#64748b" }}>Veículo</label>
              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} style={inputStyle}>
                <option value="">Selecione...</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: "bold", color: "#64748b" }}>Dia da Semana</label>
              <select value={weekday} onChange={e => setWeekday(e.target.value)} style={inputStyle}>
                <option value="">Escolha o dia...</option>
                <option value="0">Segunda-feira</option>
                <option value="1">Terça-feira</option>
                <option value="2">Quarta-feira</option>
                <option value="3">Quinta-feira</option>
                <option value="4">Sexta-feira</option>
                <option value="7">Todos os dias</option>
              </select>
            </div>
          </div>

          <button onClick={salvar} disabled={loading} style={{ width: "100%", marginTop: 25, padding: 15, background: "#403d7c", color: "#fff", border: "none", borderRadius: 12, fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "Processando..." : "Salvar Vínculo"}
          </button>
        </div>

        {/* LISTA DE VÍNCULOS EXISTENTES */}
        <div style={{ marginTop: 30 }}>
          <h3 style={{ color: "#64748b" }}>Atendimentos Cadastrados</h3>
          {vinculos.map(v => (
            <div key={v.id} style={{ background: "#fff", padding: 15, borderRadius: 15, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
              <div>
                <b style={{ color: "#403d7c" }}>{v.city_name}</b> - <span style={{ color: "#ed823c" }}>{v.route_name}</span>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{v.neighborhood_name || "Geral"}</div>
              </div>
              <button onClick={async () => { if(confirm("Excluir?")) { await api.delete(`/route-city-day/${v.id}/`); carregarDadosIniciais(); } }} style={{ border: "none", background: "#fee2e2", color: "#ef4444", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>Excluir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}