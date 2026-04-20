import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroBairros() {
  const [cidades, setCidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [cityId, setCityId] = useState("");
  const [nomeBairro, setNomeBairro] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const [resC, resB] = await Promise.all([api.get("/cities/"), api.get("/neighborhoods/")]);
    setCidades(resC.data || []);
    setBairros(resB.data || []);
  }

  async function salvar() {
    if (!cityId || !nomeBairro) return;
    try {
      const payload = { name: nomeBairro, city_id: Number(cityId) };
      if (editandoId) {
        await api.patch(`/neighborhoods/${editandoId}/`, payload);
      } else {
        await api.post("/neighborhoods/", payload);
      }
      setNomeBairro(""); setEditandoId(null); carregarDados();
    } catch { alert("Erro ao salvar"); }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto", fontFamily: "Arial" }}>
      <h2 style={{ color: "#403d7c" }}>Bairros</h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        <select value={cityId} onChange={e => setCityId(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">Selecione a Cidade</option>
          {cidades.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        
        <input 
          list="bairros-existentes"
          value={nomeBairro} 
          onChange={e => setNomeBairro(e.target.value)} 
          placeholder="Digite ou selecione o bairro..." 
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <datalist id="bairros-existentes">
          {/* Sugere bairros que já existem para a cidade selecionada */}
          {bairros.filter(b => b.city_id === Number(cityId)).map(b => <option key={b.id} value={b.name} />)}
        </datalist>

        <button onClick={salvar} style={{ padding: 12, background: "#403d7c", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          {editandoId ? "Atualizar" : "Cadastrar Bairro"}
        </button>
      </div>
      {/* Listagem... (mantém a lógica de listagem anterior) */}
    </div>
  );
}