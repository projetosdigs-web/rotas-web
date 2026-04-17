import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroRotas() {
  const [nome, setNome] = useState("");
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function resize() {
      setIsMobile(window.innerWidth <= 768);
    }

    resize();
    window.addEventListener("resize", resize);
    carregarRotas();

    return () => window.removeEventListener("resize", resize);
  }, []);

  async function carregarRotas() {
    try {
      setLoading(true);
      const res = await api.get("/routes/");
      setRotas(res.data || []);
    } catch (err) {
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
      carregarRotas();
    } catch (err) {
      alert("Erro ao criar rota");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    const ok = window.confirm("Deseja excluir essa rota?");
    if (!ok) return;

    try {
      await api.delete(`/routes/${id}`);
      carregarRotas();
    } catch {
      alert("Erro ao excluir");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8f7fc 0%, #fff8f2 45%, #ffffff 100%)",
        padding: isMobile ? "18px 12px 36px" : "28px 18px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            padding: isMobile ? 20 : 30,
            boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
            border: "1px solid #ece8f7",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              background: "#efeafd",
              color: "#403d7c",
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 18,
            }}
          >
            Ferperez • Cadastro
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? 28 : 38,
              color: "#0f172a",
            }}
          >
            Cadastro de Rotas
          </h1>

          <p
            style={{
              marginTop: 10,
              color: "#64748b",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Cadastre e organize as rotas utilizadas pela operação comercial.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 12,
              marginTop: 22,
            }}
          >
            <input
              placeholder="Nome da rota"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && criarRota()}
              style={{
                flex: 1,
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #ddd6f5",
                fontSize: 16,
                outline: "none",
              }}
            />

            <button
              onClick={criarRota}
              disabled={salvando}
              style={{
                padding: "16px 22px",
                borderRadius: 16,
                border: "none",
                background: "#403d7c",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: isMobile ? "100%" : 150,
              }}
            >
              {salvando ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: isMobile ? 18 : 24,
            border: "1px solid #ece8f7",
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#0f172a",
              fontSize: 24,
            }}
          >
            Rotas cadastradas
          </h2>

          {loading ? (
            <p style={{ color: "#64748b" }}>Carregando...</p>
          ) : rotas.length === 0 ? (
            <p style={{ color: "#64748b" }}>Nenhuma rota cadastrada.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {rotas.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    background: "#faf9fd",
                    border: "1px solid #ece8f7",
                    borderRadius: 18,
                    padding: 18,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "center",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                    >
                      Rota #{i + 1}
                    </div>

                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#0f172a",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>

                  <button
                    onClick={() => excluir(item.id)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 14,
                      border: "none",
                      background: "#ed823c",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                      minWidth: isMobile ? "100%" : 120,
                    }}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}

          <a href="/dashboard" style={{ textDecoration: "none" }}>
            <button
              style={{
                marginTop: 18,
                width: isMobile ? "100%" : "auto",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid #ece8f7",
                background: "#fff",
                color: "#403d7c",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Voltar ao painel
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}