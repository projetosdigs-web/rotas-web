import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function CadastroCidades() {
  const [cidades, setCidades] = useState([]);
  const [cidadesIBGE, setCidadesIBGE] = useState([]);
  const [nome, setNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarCidades();
    carregarIBGE();
  }, []);

  async function carregarIBGE() {
    try {
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      setCidadesIBGE(res.data.map(c => c.nome).sort());
    } catch (err) { console.error(err); }
  }

  async function carregarCidades() {
    const res = await api.get("/cities/");
    setCidades(res.data || []);
  }

  async function salvar() {
    if (!nome) return;
    try {
      if (editandoId) {
        await api.patch(`/cities/${editandoId}/`, { name: nome });
      } else {
        await api.post("/cities/", { name: nome });
      }
      setNome(""); setEditandoId(null); carregarCidades();
    } catch { alert("Erro ao salvar"); }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto", fontFamily: "Arial" }}>
      <h2 style={{ color: "#403d7c" }}>Cidades (São Paulo)</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input 
          list="lista-ibge-cidades"
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          placeholder="Busque ou digite a cidade..." 
          style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <datalist id="lista-ibge-cidades">
          {cidadesIBGE.map(c => <option key={c} value={c} />)}
        </datalist>
        <button onClick={salvar} style={{ padding: 12, background: "#403d7c", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          {editandoId ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {cidades.map(c => (
          <div key={c.id} style={{ background: "#fff", padding: 15, borderRadius: 10, display: "flex", justifyContent: "space-between", border: "1px solid #eee" }}>
            <span>{c.name}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setNome(c.name); setEditandoId(c.id); }} style={{ color: "#403d7c", background: "none", border: "none", cursor: "pointer" }}>Editar</button>
              <button onClick={async () => { if(confirm("Excluir?")) { await api.delete(`/cities/${c.id}/`); carregarCidades(); } }} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}