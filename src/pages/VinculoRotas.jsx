import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  const [cidadesSP, setCidadesSP] = useState([]); // Lista oficial do IBGE
  
  // Estados do formulário
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
    carregarCidadesIBGE();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function carregarCidadesIBGE() {
    try {
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      const nomesCidades = res.data.map(c => c.nome).sort();
      setCidadesSP(nomesCidades);
      console.log("IBGE: Cidades de SP carregadas!");
    } catch (err) {
      console.error("Erro ao buscar cidades no IBGE", err);
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
      console.error("Erro ao carregar dados do banco", err);
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

    // Se não existir, o sistema cadastra sozinho
    const novaCidade = await api.post("/cities/", { name: nomeCidade.trim() });
    return novaCidade.data.id;
  }

  async function salvarVinculo() {
    if (!routeId || !vehicleId || !cityInput || !weekday) {
      alert("Por favor, preencha Rota, Veículo, Cidade e Dia.");
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
      alert("Erro ao salvar vínculo de rota.");
    } finally {
      setSalvando(false);
    }
  }

  function prepararEdicao(item) {
    setEditandoId(item.id);
    setRouteId(item.route_id);
    setVehicleId(item.vehicle_id);
    setCityInput(item.city_name || ""); 
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
    if (!window.confirm("Deseja excluir este atendimento?")) return;
    try {
      await api.delete(`/route-neighborhoods/${id}/`);
      carregarDadosIniciais();
    } catch { alert("Erro ao excluir"); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", padding: isMobile ? "15px" : "30px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* FORMULÁRIO */}
        <div style={{ background: "#fff", padding: isMobile ? 20 : 30, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: 25 }}>
          <h1 style={{ color: "#403d7c", fontSize: 24, marginBottom: 25 }}>
            {editandoId ? "Editar Vínculo" : "Novo Atendimento Logístico"}
          </h1>
          
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Cidade (Busca Automática SP)</label>
              <input 
                list="lista-cidades-sp" 
                value={cityInput} 
                onChange={e => setCityInput(e.target.value)} 
                placeholder="Ex: Jundiaí" 
                style={inputStyle}
              />
              <datalist id="lista-cidades-sp">
                {cidadesSP.map((nome, idx) => <option key={idx} value={nome} />)}
              </datalist>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Bairro ou Região</label>
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
              <label style={labelStyle}>Dia da Semana</label>
              <select value={weekday} onChange={e => setWeekday(e.target.value)} style={inputStyle}>
                <option value="">Selecione...</option>
                <option value="0">Segunda-feira</option>
                <option value="1">Terça-feira</option>
                <option value="2">Quarta-feira</option>
                <option value="3">Quinta-feira</option>
                <option value="4">Sexta-feira</option>
                <option value="5">Todos os dias</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <button onClick={salvarVinculo} disabled={salvando} style={btnPrincipal}>
                {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Salvar Vínculo"}
              </button>
              {editandoId && <button onClick={limparFormulario} style={btnCancel}>Cancelar</button>}
            </div>
          </div>
        </div>

        {/* LISTA DE VÍNCULOS */}
        <div style={{ display: "grid", gap: 12 }}>
          {vinculos.map(v => (
            <div key={v.id} style={cardStyle}>
              <div style={{ borderLeft: "4px solid #403d7c", paddingLeft: 12 }}>
                <div style={{ fontSize: 13, color: "#ed823c", fontWeight: "bold" }}>{v.route_name}</div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>{v.city_name}</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>{v.neighborhood_name || "Geral"}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => prepararEdicao(v)} style={btnAcao}>Editar</button>
                <button onClick={() => excluir(v.id)} style={{ ...btnAcao, color: "#e11d48", background: "#fff1f2" }}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputGroup = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 13, fontWeight: "bold", color: "#64748b", marginLeft: 4 };
const inputStyle = { padding: "12px", borderRadius: 12, border: "1px solid #ddd", fontSize: 15, background: "#fcfcff" };
const btnPrincipal = { flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "#403d7c", color: "#fff", fontWeight: "bold", cursor: "pointer" };
const btnCancel = { padding: "14px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };
const cardStyle = { background: "#fff", padding: "15px", borderRadius: 18, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.03)", border: "1px solid #ece8f7" };
const btnAcao = { padding: "8px 14px", borderRadius: 10, border: "none", background: "#efeafd", color: "#403d7c", fontWeight: "bold", cursor: "pointer", fontSize: 13 };