import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios"; // Importante para o IBGE

export default function CadastroCidades() {
  const [cities, setCities] = useState([]);
  const [cidadesIBGE, setCidadesIBGE] = useState([]); // Novo estado para o IBGE
  const [name, setName] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function resize() { setIsMobile(window.innerWidth <= 768); }
    resize();
    window.addEventListener("resize", resize);
    carregarCidades();
    carregarCidadesIBGE(); // Carrega a lista de SP ao abrir
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Busca oficial de SP no IBGE
  async function carregarCidadesIBGE() {
    try {
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      const nomes = res.data.map(c => c.nome).sort();
      setCidadesIBGE(nomes);
    } catch (err) {
      console.error("Erro ao carregar IBGE", err);
    }
  }

  async function carregarCidades() {
    try {
      setLoading(true);
      const res = await api.get("/cities/");
      setCities(res.data || []);
    } catch (err) {
      alert("Erro ao carregar cidades");
    } finally {
      setLoading(false);
    }
  }

  async function salvarCidade() {
    if (!name.trim()) {
      alert("Digite o nome da cidade");
      return;
    }

    try {
      setSalvando(true);
      const payload = { name: name.trim() };

      if (editandoId) {
        await api.patch(`/cities/${editandoId}/`, payload);
      } else {
        await api.post("/cities/", payload);
      }

      limparFormulario();
      carregarCidades();
    } catch (err) {
      alert("Erro ao salvar cidade.");
    } finally {
      setSalvando(false);
    }
  }

  function prepararEdicao(item) {
    setEditandoId(item.id);
    setName(item.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function limparFormulario() {
    setEditandoId(null);
    setName("");
  }

  async function excluir(id) {
    if (!window.confirm("Deseja realmente excluir esta cidade?")) return;
    try {
      await api.delete(`/cities/${id}/`);
      carregarCidades();
    } catch {
      alert("Erro ao excluir cidade");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8f7fc 0%, #fff8f2 45%, #ffffff 100%)", padding: isMobile ? "18px 12px 36px" : "28px 18px 48px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 28, padding: isMobile ? 20 : 30, boxShadow: "0 18px 45px rgba(15,23,42,0.08)", border: "1px solid #ece8f7", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", padding: "8px 14px", borderRadius: 999, background: editandoId ? "#fff3ea" : "#efeafd", color: editandoId ? "#ed823c" : "#403d7c", fontSize: 13, fontWeight: "bold", marginBottom: 18 }}>
            Ferperez • {editandoId ? "Modo Edição" : "Gestão de Cidades"}
          </div>

          <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 38, color: "#0f172a" }}>
            {editandoId ? "Editar Cidade" : "Cadastrar Cidade"}
          </h1>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, marginTop: 22 }}>
            {/* INPUT COM DATALIST DO IBGE */}
            <input
              type="text"
              list="lista-ibge"
              placeholder="Nome da cidade (Ex: Jundiaí)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1, padding: "16px 18px", borderRadius: 16, border: "1px solid #ddd6f5", fontSize: 16, outline: "none", background: "#fff" }}
            />
            <datalist id="lista-ibge">
              {cidadesIBGE.map((c, i) => <option key={i} value={c} />)}
            </datalist>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={salvarCidade} disabled={salvando} style={{ padding: "16px 22px", borderRadius: 16, border: "none", background: editandoId ? "#e0a839" : "#403d7c", color: "#fff", fontWeight: "bold", cursor: "pointer", minWidth: 120 }}>
                {salvando ? "..." : editandoId ? "Atualizar" : "Cadastrar"}
              </button>
              {editandoId && <button onClick={limparFormulario} style={{ padding: "16px 22px", borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: "bold", cursor: "pointer" }}>Cancelar</button>}
            </div>
          </div>
        </div>

        {/* LISTAGEM */}
        <div style={{ background: "#fff", borderRadius: 24, padding: isMobile ? 18 : 24, border: "1px solid #ece8f7", boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
          <h2 style={{ marginTop: 0, color: "#0f172a", fontSize: 24 }}>Cidades Atendidas</h2>
          {loading ? <p style={{ color: "#64748b" }}>Carregando cidades...</p> : (
            <div style={{ display: "grid", gap: 10 }}>
              {cities.map((item) => (
                <div key={item.id} style={{ background: "#faf9fd", border: "1px solid #ece8f7", borderRadius: 18, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: "bold", color: "#403d7c" }}>{item.name}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => prepararEdicao(item)} style={{ padding: "8px 14px", borderRadius: 12, border: "none", background: "#efeafd", color: "#403d7c", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>Editar</button>
                    <button onClick={() => excluir(item.id)} style={{ padding: "8px 14px", borderRadius: 12, border: "none", background: "#fff0f0", color: "#e11d48", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <a href="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ marginTop: 24, padding: "14px 18px", borderRadius: 14, border: "1px solid #ece8f7", background: "#fff", color: "#403d7c", fontWeight: "bold", cursor: "pointer", width: isMobile ? "100%" : "auto" }}>
              Voltar ao painel
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}