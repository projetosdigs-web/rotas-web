import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  const [cidadesSP, setCidadesSP] = useState([]); // Lista global do IBGE
  
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [cityInput, setCityInput] = useState(""); 
  const [neighborhood, setNeighborhood] = useState("");
  const [weekday, setWeekday] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    carregarDadosIniciais();
    carregarCidadesIBGE(); // Carrega o "cérebro" do IBGE
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function carregarCidadesIBGE() {
    try {
      // Código 35 é São Paulo
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      const nomesCidades = res.data.map(c => c.nome).sort();
      setCidadesSP(nomesCidades);
    } catch (err) {
      console.error("Erro IBGE:", err);
    }
  }

  async function carregarDadosIniciais() {
    try {
      setLoading(true);
      const [r, v, vi] = await Promise.all([
        api.get("/routes/"),
        api.get("/vehicles/"),
        api.get("/route-neighborhoods/"),
      ]);
      setRoutes(r.data || []);
      setVehicles(v.data || []);
      setVinculos(vi.data || []);
    } catch (err) {
      console.error("Erro Backend:", err);
    } finally {
      setLoading(false);
    }
  }

  async function obterOuCriarCidade(nomeCidade) {
    const resCidades = await api.get("/cities/");
    const cidadeExistente = resCidades.data.find(
      c => c.name.trim().toLowerCase() === nomeCidade.trim().toLowerCase()
    );

    if (cidadeExistente) return cidadeExistente.id;

    // Se a cidade do IBGE não está no seu banco, cadastra agora
    const novaCidade = await api.post("/cities/", { name: nomeCidade.trim() });
    return novaCidade.data.id;
  }

  async function salvarVinculo() {
    if (!routeId || !vehicleId || !cityInput || !weekday) {
      alert("Preencha os campos obrigatórios (Rota, Veículo, Cidade e Dia)");
      return;
    }

    try {
      setSalvando(true);
      const cityId = await obterOuCriarCidade(cityInput);

      const payload = {
        route_id: Number(routeId),
        vehicle_id: Number(vehicleId),
        city_id: cityId,
        neighborhood_name: neighborhood.trim(),
        weekday: Number(weekday),
      };

      if (editandoId) {
        await api.patch(`/route-neighborhoods/${editandoId}/`, payload);
      } else {
        await api.post("/route-neighborhoods/", payload);
      }

      limparFormulario();
      carregarDadosIniciais();
    } catch (err) {
      alert("Erro ao salvar vínculo");
    } finally {
      setSalvando(false);
    }
  }

  function prepararEdicao(item) {
    setEditandoId(item.id);
    setRouteId(item.route_id);
    setVehicleId(item.vehicle_id);
    setCityInput(item.city_name);
    setNeighborhood(item.neighborhood_name || "");
    setWeekday(item.weekday);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function limparFormulario() {
    setEditandoId(null);
    setRouteId("");
    setVehicleId("");
    setCityInput("");
    setNeighborhood("");
    setWeekday("");
  }

  async function excluir(id) {
    if (!window.confirm("Remover este atendimento?")) return;
    try {
      await api.delete(`/route-neighborhoods/${id}/`);
      carregarDadosIniciais();
    } catch { alert("Erro ao excluir"); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", padding: isMobile ? "15px" : "30px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        <div style={{ background: "#fff", padding: isMobile ? 20 : 30, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: 25 }}>
          <h1 style={{ color: "#403d7c", fontSize: 24, marginBottom: 20 }}>{editandoId ? "Editar Atendimento" : "Novo Atendimento Logístico"}</h1>
          
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 15 }}>
            <div style={inputGroup}>
              <label style={labelStyle}>Cidade (SP - IBGE)</label>
              <input 
                list="lista-ibge" 
                value={cityInput} 
                onChange={e => setCityInput(e.target.value)} 
                placeholder="Busque qualquer cidade de SP..." 
                style={inputStyle}
              />
              <datalist id="lista-ibge">
                {cidadesSP.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Bairro / Região</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Ex: Centro" style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Rota</label>
              <select value={routeId} onChange={e => setRouteId(e.target.value)} style={inputStyle}>
                <option value="">Selecione...</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Veículo</label>
              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} style={inputStyle}>
                <option value="">Selecione...</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>)}
              </select>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Dia</label>
              <select value={weekday} onChange={e => setWeekday(e.target.value)} style={inputStyle}>
                <option value="">Selecione...</option>
                <option value="0">Segunda</option>
                <option value="1">Terça</option>
                <option value="2">Quarta</option>
                <option value="3">Quinta</option>
                <option value="4">Sexta</option>
                <option value="5">Todos os dias</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <button onClick={salvarVinculo} disabled={salvando} style={btnStyle}>
                {salvando ? "Aguarde..." : editandoId ? "Atualizar" : "Vincular"}
              </button>
              {editandoId && <button onClick={limparFormulario} style={btnCancel}>X</button>}
            </div>
          </div>
        </div>

        {/* Listagem compacta */}
        <div style={{ display: "grid", gap: 10 }}>
          {vinculos.map(v => (
            <div key={v.id} style={cardItem}>
              <div>
                <strong style={{ color: "#403d7c" }}>{v.city_name}</strong> - {v.neighborhood_name || "Geral"}
                <div style={{ fontSize: 12, color: "#64748b" }}>Rota: {v.route_name} | {v.vehicle_name}</div>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => prepararEdicao(v)} style={btnAcao}>Edit</button>
                <button onClick={() => excluir(v.id)} style={{ ...btnAcao, color: "red" }}>Sair</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputGroup = { display: "flex", flexDirection: "column", gap: 5 };
const labelStyle = { fontSize: 12, fontWeight: "bold", color: "#64748b" };
const inputStyle = { padding: "12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15 };
const btnStyle = { flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "#403d7c", color: "#fff", fontWeight: "bold", cursor: "pointer" };
const btnCancel = { padding: "12px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };
const cardItem = { background: "#fff", padding: "15px", borderRadius: 15, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.03)" };
const btnAcao = { border: "none", background: "none", fontWeight: "bold", color: "#403d7c", cursor: "pointer" };