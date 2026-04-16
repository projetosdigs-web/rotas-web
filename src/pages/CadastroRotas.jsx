import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroRotas() {
  const [nome, setNome] = useState("");
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarRotas() {
    try {
      setLoading(true);
      const res = await api.get("/routes/");
      setRotas(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar rotas:", err);
      alert("Erro ao carregar rotas");
    } finally {
      setLoading(false);
    }
  }

  async function criarRota() {
    if (!nome.trim()) {
      alert("Digite o nome da rota");
      return;
    }

    try {
      setSalvando(true);

      await api.post("/routes/", {
        name: nome.trim(),
      });

      setNome("");
      await carregarRotas();
    } catch (err) {
      console.error("Erro ao criar rota:", err);
      alert("Erro ao criar rota");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarRota(id) {
    const confirmar = window.confirm("Deseja excluir essa rota?");
    if (!confirmar) return;

    try {
      await api.delete(`/routes/${id}`);
      await carregarRotas();
    } catch (err) {
      console.error("Erro ao excluir rota:", err);
      alert("Erro ao excluir rota");
    }
  }

  useEffect(() => {
    carregarRotas();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>Cadastro de Rotas</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nome da rota"
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
          onClick={criarRota}
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

      <h3>Rotas cadastradas</h3>

      {loading ? (
        <p>Carregando rotas...</p>
      ) : rotas.length === 0 ? (
        <p>Nenhuma rota cadastrada.</p>
      ) : (
        <div style={{ marginTop: 10 }}>
          {rotas.map((r) => (
            <div
              key={r.id}
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
              <span>{r.name}</span>

              <button
                onClick={() => deletarRota(r.id)}
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