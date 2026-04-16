import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroCidades() {
  const [nome, setNome] = useState("");
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarCidades() {
    try {
      setLoading(true);
      const res = await api.get("/cities/");
      setCidades(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar cidades:", err);
      alert("Erro ao carregar cidades");
    } finally {
      setLoading(false);
    }
  }

  async function criarCidade() {
    if (!nome.trim()) {
      alert("Digite o nome da cidade");
      return;
    }

    try {
      setSalvando(true);

      await api.post("/cities/", {
        name: nome.trim(),
      });

      setNome("");
      await carregarCidades();
    } catch (err) {
      console.error("Erro ao criar cidade:", err);
      alert("Erro ao criar cidade");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarCidade(id) {
    const confirmar = window.confirm("Deseja excluir essa cidade?");
    if (!confirmar) return;

    try {
      await api.delete(`/cities/${id}`);
      await carregarCidades();
    } catch (err) {
      console.error("Erro ao excluir cidade:", err);
      alert("Erro ao excluir cidade");
    }
  }

  useEffect(() => {
    carregarCidades();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>Cadastro de Cidades</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nome da cidade"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />

        <button
          onClick={criarCidade}
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

      <h3>Cidades cadastradas</h3>

      {loading ? (
        <p>Carregando cidades...</p>
      ) : cidades.length === 0 ? (
        <p>Nenhuma cidade cadastrada.</p>
      ) : (
        <div style={{ marginTop: 10 }}>
          {cidades.map((c) => (
            <div
              key={c.id}
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
              <span>{c.name}</span>

              <button
                onClick={() => deletarCidade(c.id)}
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