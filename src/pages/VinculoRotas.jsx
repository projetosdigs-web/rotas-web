import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  
  // Lista de cidades vindas do IBGE
  const [cidadesSP, setCidadesSP] = useState([]);
  
  // Estados do formulário
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [cityInput, setCityInput] = useState(""); // Texto da busca
  const [neighborhood, setNeighborhood] = useState("");
  const [weekday, setWeekday] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function resize() { setIsMobile(window.innerWidth <= 768); }
    window.addEventListener("resize", resize);
    resize();
    carregarDadosIniciais();
    carregarCidadesIBGE();
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 1. Busca todas as cidades de SP no IBGE
  async function carregarCidadesIBGE() {
    try {
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      const nomesCidades = res.data.map(c => c.nome).sort();
      setCidadesSP(nomesCidades);
    } catch (err) {
      console.error("Erro ao buscar IBGE", err);
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
      alert("Erro ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }

  // 2. Lógica de Auto-Cadastro de Cidade
  async function obterOuCriarCidade(nomeCidade) {
    const resCidades = await api.get("/cities/");
    const cidadeExistente = resCidades.data.find(
      c => c.name.toLowerCase() === nomeCidade.toLowerCase()
    );

    if (cidadeExistente) return cidadeExistente.id;

    // Se não existe, cadastra automaticamente
    const novaCidade = await api.post("/cities/", { name: nomeCidade });
    return novaCidade.data.id;
  }

  async function salvarVinculo() {
    if (!routeId || !vehicleId || !cityInput || !weekday) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setSalvando(true);

      // Passo A: Garante que a cidade existe no seu banco
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
      alert("Erro ao salvar o vínculo de rota");
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
    if (!window.confirm("Excluir este atendimento?")) return;
    try {
      await api.delete(`/route-neighborhoods/${id}/`);
      carregarDadosIniciais();
    } catch { alert("Erro ao excluir"); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8f7fc 0%, #fff8f2 100%)", padding: isMobile ? "18px 12px" : "28px 18px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* FORMULÁRIO INTELIGENTE */}
        <div style={{ background: "#fff", padding: isMobile ? 20 : 35, borderRadius: 28, boxShadow: "0 18px 45px rgba(15,23,42,0.08)", border: "1px solid #ece8f7", marginBottom: 30 }}>
          <div style={{ display: "inline-flex", padding: "8px 14px", borderRadius: 999, background: editandoId ? "#fff3ea" : "#efeafd", color: editandoId ? "#ed823c" : "#403d7c", fontSize: 13, fontWeight: "bold", marginBottom: 18 }}>
            Ferperez • Automação IBGE São Paulo
          </div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 36, color: "#0f172a" }}>
            {editandoId ? "Editar Atendimento" : "Vincular Nova Rota"}
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 15, marginTop: 25 }}>
            
            <div style={fieldGroup}>
              <label style={labelStyle}>Rota</label>
              <select value={routeId} onChange={e => setRouteId(e.target.value)} style={inputStyle}>
                <option value="">Selecione a Rota</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Cidade (Busca Automática SP)</label>
              <input 
                list="cidades-sp"
                placeholder="Digite a cidade..."
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                style={inputStyle}
              />
              <datalist id="cidades-sp">
                {cidadesSP.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Dia de Atendimento</label>
              <select value={weekday} onChange={e => setWeekday(e.target.value)} style={inputStyle}>
                <option value="">Selecione o Dia</option>
                <option value="0">Segunda-feira</option>
                <option value="1">Terça-feira</option>
                <option value="2">Quarta-feira</option>
                <option value="3">Quinta-feira</option>
                <option value="4">Sexta-feira</option>
                <option value="5">Todos os dias</option>
              </select>
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Veículo Responsável</label>
              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} style={inputStyle}>
                <option value="">Selecione o Veículo</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>)}
              </select>
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Bairro (Opcional)</label>
              <input placeholder="Ex: Vila Rami" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button onClick={salvarVinculo} disabled={salvando} style={{ ...btnPrincipal, background: editandoId ? "#e0a839" : "#403d7c", flex: 1 }}>
                {salvando ? "Processando..." : editandoId ? "Atualizar" : "Confirmar Vínculo"}
              </button>
              {editandoId && <button onClick={limparFormulario} style={btnCancel}>Cancelar</button>}
            </div>
          </div>
        </div>

        {/* LISTAGEM DE ATENDIMENTOS */}
        <div style={{ background: "#fff", padding: 25, borderRadius: 24, border: "1px solid #ece8f7", boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
          <h2 style={{ marginTop: 0, color: "#0f172a" }}>Malha Logística Atual</h2>
          {loading ? <p>Carregando malha...</p> : (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 15 }}>
              {vinculos.map(item => (
                <div key={item.id} style={itemCard}>
                  <div style={{ borderLeft: `5px solid #403d7c`, paddingLeft: 12 }}>
                    <div style={{ fontSize: 12, color: "#ed823c", fontWeight: "bold", textTransform: "uppercase" }}>{item.route_name}</div>
                    <div style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>{item.city_name}</div>
                    <div style={{ fontSize: 14, color: "#64748b" }}>{item.neighborhood_name || "Centro / Geral"}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <button onClick={() => prepararEdicao(item)} style={btnAcao}>Editar</button>
                    <button onClick={() => excluir(item.id)} style={{ ...btnAcao, background: "#fff0f0", color: "#e11d48" }}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const fieldGroup = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 13, fontWeight: "bold", color: "#64748b", marginLeft: 4 };
const inputStyle = { padding: "14px", borderRadius: 12, border: "1px solid #ddd6f5", fontSize: 15, outline: "none", background: "#fcfcff" };
const btnPrincipal = { padding: "15px", borderRadius: 12, border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: 15 };
const btnCancel = { padding: "15px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", fontWeight: "bold" };
const itemCard = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#faf9fd", borderRadius: 20, border: "1px solid #ece8f7" };
const btnAcao = { padding: "8px 12px", borderRadius: 10, border: "none", background: "#efeafd", color: "#403d7c", fontWeight: "bold", cursor: "pointer", fontSize: 12 };