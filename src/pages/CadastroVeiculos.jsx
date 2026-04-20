import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroVeiculos() {
  const [vehicles, setVehicles] = useState([]);
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function resize() { setIsMobile(window.innerWidth <= 768); }
    resize();
    window.addEventListener("resize", resize);
    carregarVeiculos();
    return () => window.removeEventListener("resize", resize);
  }, []);

  async function carregarVeiculos() {
    try {
      setLoading(true);
      const res = await api.get("/vehicles/");
      setVehicles(res.data || []);
    } catch (err) {
      alert("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }

  async function salvarVeiculo() {
    if (!name.trim() || !plate.trim()) {
      alert("Preencha nome e placa");
      return;
    }

    try {
      setSalvando(true);
      const payload = { name: name.trim(), plate: plate.trim().toUpperCase() };
      if (editandoId) {
        await api.patch(`/vehicles/${editandoId}/`, payload);
      } else {
        await api.post("/vehicles/", payload);
      }
      limparFormulario();
      carregarVeiculos();
    } catch (err) {
      alert("Erro ao salvar veículo");
    } finally {
      setSalvando(false);
    }
  }

  function prepararEdicao(item) {
    setEditandoId(item.id);
    setName(item.name);
    setPlate(item.plate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function limparFormulario() {
    setEditandoId(null);
    setName("");
    setPlate("");
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este veículo?")) return;
    try {
      await api.delete(`/vehicles/${id}/`);
      carregarVeiculos();
    } catch {
      alert("Erro ao excluir");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8f7fc 0%, #fff8f2 100%)", padding: isMobile ? "18px 12px" : "28px 18px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        <div style={{ background: "#fff", padding: isMobile ? 20 : 30, borderRadius: 28, boxShadow: "0 18px 45px rgba(15,23,42,0.08)", border: "1px solid #ece8f7", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", padding: "8px 14px", borderRadius: 999, background: editandoId ? "#fff3ea" : "#efeafd", color: editandoId ? "#ed823c" : "#403d7c", fontSize: 13, fontWeight: "bold", marginBottom: 18 }}>
            Ferperez • Frota
          </div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 38, color: "#0f172a" }}>{editandoId ? "Editar Veículo" : "Novo Veículo"}</h1>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <input placeholder="Nome/Modelo" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                <input placeholder="Placa" value={plate} onChange={(e) => setPlate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={salvarVeiculo} disabled={salvando} style={{ ...btnPrincipal, background: editandoId ? "#e0a839" : "#403d7c", flex: 1 }}>
                {salvando ? "Salvando..." : editandoId ? "Atualizar Veículo" : "Cadastrar Veículo"}
              </button>
              {editandoId && <button onClick={limparFormulario} style={{ ...btnCancel, padding: "16px 24px" }}>Cancelar</button>}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", padding: 24, borderRadius: 24, border: "1px solid #ece8f7", boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
          <h2 style={{ marginTop: 0, color: "#0f172a" }}>Frota Cadastrada</h2>
          {loading ? <p>Carregando...</p> : (
            <div style={{ display: "grid", gap: 10 }}>
              {vehicles.map(item => (
                <div key={item.id} style={itemCard}>
                  <div>
                    <strong style={{ fontSize: 18, color: "#403d7c" }}>{item.name}</strong>
                    <div style={{ fontSize: 14, color: "#ed823c", fontWeight: "bold" }}>{item.plate}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
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

const inputStyle = { padding: "16px", borderRadius: 14, border: "1px solid #ddd6f5", fontSize: 16, outline: "none" };
const btnPrincipal = { padding: "16px", borderRadius: 14, border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" };
const btnCancel = { borderRadius: 14, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", fontWeight: "bold" };
const itemCard = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#faf9fd", borderRadius: 18, border: "1px solid #ece8f7" };
const btnAcao = { padding: "10px 16px", borderRadius: 12, border: "none", background: "#efeafd", color: "#403d7c", fontWeight: "bold", cursor: "pointer", fontSize: 13 };