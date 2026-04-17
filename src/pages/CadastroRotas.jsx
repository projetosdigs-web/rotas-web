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
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eff6ff 0%, #f8fafc 45%, #ffffff 100%)",
        padding: "28px 18px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 30,
            boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
            border: "1px solid #e2e8f0",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 18,
            }}
          >
            Cadastro administrativo
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 40,
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Cadastro de Rotas
          </h1>

          <p
            style={{
              marginTop: 12,
              color: "#475569",
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            Cadastre e gerencie as rotas que serão usadas no atendimento comercial
            e operacional do sistema.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <input
              type="text"
              placeholder="Digite o nome da rota"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                flex: 1,
                minWidth: 280,
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                background: "#fff",
                color: "#0f172a",
                outline: "none",
                boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
              }}
            />

            <button
              onClick={criarRota}
              disabled={salvando}
              style={{
                padding: "16px 22px",
                borderRadius: 16,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: 130,
                boxShadow: "0 10px 24px rgba(37,99,235,0.28)",
              }}
            >
              {salvando ? "Criando..." : "Criar rota"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <a href="/dashboard" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "13px 18px",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#334155",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Voltar ao Painel
              </button>
            </a>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 22,
            padding: 24,
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 26,
                  color: "#0f172a",
                }}
              >
                Rotas cadastradas
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#64748b",
                  fontSize: 15,
                }}
              >
                Total de rotas: <strong>{rotas.length}</strong>
              </p>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 20,
                border: "1px solid #e2e8f0",
                color: "#334155",
              }}
            >
              Carregando rotas...
            </div>
          ) : rotas.length === 0 ? (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 20,
                border: "1px solid #e2e8f0",
                color: "#334155",
              }}
            >
              Nenhuma rota cadastrada.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              {rotas.map((r, index) => (
                <div
                  key={r.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 18,
                    padding: 18,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 6,
                      height: "100%",
                      background: "#2563eb",
                    }}
                  />

                  <div style={{ paddingLeft: 10 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 6,
                      }}
                    >
                      Rota #{index + 1}
                    </div>

                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#0f172a",
                        lineHeight: 1.2,
                      }}
                    >
                      {r.name}
                    </div>
                  </div>

                  <button
                    onClick={() => deletarRota(r.id)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "none",
                      background: "#dc2626",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 8px 18px rgba(220,38,38,0.18)",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}