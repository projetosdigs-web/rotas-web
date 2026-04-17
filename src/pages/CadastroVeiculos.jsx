import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroVeiculos() {
  const [nome, setNome] = useState("");
  const [placa, setPlaca] = useState("");
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarVeiculos() {
    try {
      setLoading(true);
      const res = await api.get("/vehicles/");
      setVeiculos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar veículos:", err);
      alert("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }

  async function criarVeiculo() {
    if (!nome.trim()) {
      alert("Digite o nome do veículo");
      return;
    }

    try {
      setSalvando(true);

      await api.post("/vehicles/", {
        name: nome.trim(),
        plate: placa.trim(),
      });

      setNome("");
      setPlaca("");
      await carregarVeiculos();
    } catch (err) {
      console.error("Erro ao criar veículo:", err);
      alert("Erro ao criar veículo");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarVeiculo(id) {
    const confirmar = window.confirm("Deseja excluir esse veículo?");
    if (!confirmar) return;

    try {
      await api.delete(`/vehicles/${id}`);
      await carregarVeiculos();
    } catch (err) {
      console.error("Erro ao excluir veículo:", err);
      alert("Erro ao excluir veículo");
    }
  }

  useEffect(() => {
    carregarVeiculos();
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
            Cadastro de Veículos
          </h1>

          <p
            style={{
              marginTop: 12,
              color: "#475569",
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: 820,
            }}
          >
            Cadastre os veículos utilizados nas rotas e mantenha a identificação
            da frota organizada no sistema.
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
              placeholder="Digite o nome do veículo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                flex: 1,
                minWidth: 260,
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

            <input
              type="text"
              placeholder="Digite a placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              style={{
                minWidth: 220,
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
              onClick={criarVeiculo}
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
                minWidth: 150,
                boxShadow: "0 10px 24px rgba(37,99,235,0.28)",
              }}
            >
              {salvando ? "Criando..." : "Criar veículo"}
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
                Veículos cadastrados
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#64748b",
                  fontSize: 15,
                }}
              >
                Total de veículos: <strong>{veiculos.length}</strong>
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
              Carregando veículos...
            </div>
          ) : veiculos.length === 0 ? (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 20,
                border: "1px solid #e2e8f0",
                color: "#334155",
              }}
            >
              Nenhum veículo cadastrado.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {veiculos.map((veiculo, index) => (
                <div
                  key={veiculo.id}
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
                      background: "#0f766e",
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
                      Veículo #{index + 1}
                    </div>

                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#0f172a",
                        lineHeight: 1.2,
                        marginBottom: 6,
                      }}
                    >
                      {veiculo.name}
                    </div>

                    <div
                      style={{
                        fontSize: 15,
                        color: "#475569",
                      }}
                    >
                      Placa: <strong>{veiculo.plate || "-"}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => deletarVeiculo(veiculo.id)}
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