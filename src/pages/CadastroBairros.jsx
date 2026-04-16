import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroBairros() {
  const [nome, setNome] = useState("");
  const [cityId, setCityId] = useState("");
  const [bairros, setBairros] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarBairros() {
    try {
      setLoading(true);
      const res = await api.get("/neighborhoods/");
      setBairros(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar bairros:", err);
      alert("Erro ao carregar bairros");
    } finally {
      setLoading(false);
    }
  }

  async function carregarCidades() {
    try {
      const res = await api.get("/cities/");
      setCidades(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar cidades:", err);
      alert("Erro ao carregar cidades");
    }
  }

  async function criarBairro() {
    if (!nome.trim()) {
      alert("Digite o nome do bairro");
      return;
    }

    if (!cityId) {
      alert("Selecione uma cidade");
      return;
    }

    try {
      setSalvando(true);

      await api.post("/neighborhoods/", {
        name: nome.trim(),
        city_id: Number(cityId),
      });

      setNome("");
      setCityId("");
      await carregarBairros();
    } catch (err) {
      console.error("Erro ao criar bairro:", err);
      alert("Erro ao criar bairro");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarBairro(id) {
    const confirmar = window.confirm("Deseja excluir esse bairro?");
    if (!confirmar) return;

    try {
      await api.delete(`/neighborhoods/${id}`);
      await carregarBairros();
    } catch (err) {
      console.error("Erro ao excluir bairro:", err);
      alert("Erro ao excluir bairro");
    }
  }

  function getNomeCidade(cityId) {
    const cidade = cidades.find((c) => c.id === cityId);
    return cidade ? cidade.name : "-";
  }

  useEffect(() => {
    carregarCidades();
    carregarBairros();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Cadastro de Bairros</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Nome do bairro"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />

        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          style={{
            minWidth: 220,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        >
          <option value="">Selecione a cidade</option>
          {cidades.map((cidade) => (
            <option key={cidade.id} value={cidade.id}>
              {cidade.name}
            </option>
          ))}
        </select>

        <button
          onClick={criarBairro}
          disabled={salvando}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {salvando ? "Criando..." : "Criar"}
        </button>
      </div>

      <h3>Bairros cadastrados</h3>

      {loading ? (
        <p>Carregando bairros...</p>
      ) : bairros.length === 0 ? (
        <p>Nenhum bairro cadastrado.</p>
      ) : (
        <div style={{ marginTop: 10 }}>
          {bairros.map((bairro) => (
            <div
              key={bairro.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <div>
                <strong>{bairro.name}</strong>
                <div style={{ fontSize: 14, color: "#555" }}>
                  Cidade: {bairro.city_name || getNomeCidade(bairro.city_id)}
                </div>
              </div>

              <button
                onClick={() => deletarBairro(bairro.id)}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}