import { useState } from "react";
import { api } from "../services/api";
import MapaRotas from "../components/MapaRotas";

function traduzirDia(weekday) {
  const dias = {
    0: "Segunda-feira",
    1: "Terça-feira",
    2: "Quarta-feira",
    3: "Quinta-feira",
    4: "Sexta-feira",
    5: "Todos os dias",
  };

  return dias[weekday] ?? weekday ?? "-";
}

function corDia(weekday) {
  const cores = {
    0: "#2563eb",
    1: "#16a34a",
    2: "#7c3aed",
    3: "#ea580c",
    4: "#dc2626",
    5: "#0f766e",
  };

  return cores[weekday] || "#334155";
}

export default function ConsultaCidade() {
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const [infoBusca, setInfoBusca] = useState(null);

  async function buscar() {
    if (!busca.trim()) {
      alert("Digite uma cidade ou bairro");
      return;
    }

    try {
      setLoading(true);
      setBuscou(true);

      const res = await api.get(
        `/lookup-city/?query=${encodeURIComponent(busca.trim())}`
      );

      setInfoBusca({
        city: res.data?.city || "",
        city_type: res.data?.city_type || "",
      });

      setResultado(res.data?.routes || []);
    } catch (err) {
      console.error("Erro na busca:", err);
      setResultado([]);
      setInfoBusca(null);

      if (err.response?.status === 404) {
        alert("Nada encontrado para essa busca");
      } else {
        alert("Erro ao consultar atendimento");
      }
    } finally {
      setLoading(false);
    }
  }

  function limparBusca() {
    setBusca("");
    setResultado([]);
    setBuscou(false);
    setInfoBusca(null);
  }

  function copiar(item) {
    const texto = `Rota: ${item.route_name}
Local: ${item.neighborhood_name || infoBusca?.city}
Dia: ${traduzirDia(item.weekday)}
Veículo: ${item.vehicle_name || "-"} ${item.vehicle_plate || ""}`.trim();

    navigator.clipboard.writeText(texto);
    alert("Informação copiada com sucesso.");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
        padding: "32px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 28,
            boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
            marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                background: "#dbeafe",
                color: "#1d4ed8",
                fontSize: 13,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Consulta para vendedores
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 36,
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              Consulta de Atendimento
            </h1>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "#475569",
                fontSize: 16,
              }}
            >
              Digite a cidade ou o bairro para localizar a rota, o dia e o veículo responsável.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Ex.: Jundiaí ou Vila Rami"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") buscar();
              }}
              style={{
                flex: 1,
                minWidth: 280,
                padding: "16px 18px",
                borderRadius: 14,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                outline: "none",
                background: "#fff",
                color: "#0f172a",
              }}
            />

            <button
              onClick={buscar}
              disabled={loading}
              style={{
                padding: "16px 20px",
                borderRadius: 14,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: 15,
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: 120,
                boxShadow: "0 8px 18px rgba(37, 99, 235, 0.25)",
              }}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>

            <button
              onClick={limparBusca}
              style={{
                padding: "16px 20px",
                borderRadius: 14,
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#0f172a",
                fontSize: 15,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Limpar
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
            <a href="/rotas-dia" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #dbeafe",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Ver Rotas do Dia
              </button>
            </a>

            <a href="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#334155",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Acesso Administrativo
              </button>
            </a>
          </div>
        </div>

        {!loading && infoBusca && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 18,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
              border: "1px solid #e2e8f0",
              marginBottom: 20,
            }}
          >
            <span style={{ color: "#64748b", fontWeight: "bold" }}>
              Resultado encontrado em:
            </span>{" "}
            <span style={{ color: "#0f172a", fontWeight: "bold" }}>
              {infoBusca.city_type} - {infoBusca.city}
            </span>
          </div>
        )}

        {loading && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 24,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
              border: "1px solid #e2e8f0",
            }}
          >
            <p style={{ margin: 0, color: "#334155", fontSize: 16 }}>
              Carregando resultados...
            </p>
          </div>
        )}

        {!loading && buscou && resultado.length === 0 && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 24,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
              border: "1px solid #e2e8f0",
            }}
          >
            <p style={{ margin: 0, color: "#334155", fontSize: 16 }}>
              Nenhum atendimento encontrado para essa busca.
            </p>
          </div>
        )}
        
        <MapaRotas dados={resultado} />
        {!loading && resultado.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {resultado.map((item, index) => (
              <div
                key={`${item.route_name}-${item.neighborhood_name}-${index}`}
                style={{
                  background: "#ffffff",
                  borderRadius: 22,
                  padding: 22,
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  border: "1px solid #e2e8f0",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: corDia(item.weekday),
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginTop: 8,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        color: "#64748b",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Rota de atendimento
                    </div>

                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "#0f172a",
                        lineHeight: 1,
                      }}
                    >
                      {item.route_name || "-"}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "#f1f5f9",
                      color: corDia(item.weekday),
                      fontWeight: "bold",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {traduzirDia(item.weekday)}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: 14,
                      padding: 14,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                      Local
                    </div>
                    <div style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
                      {item.neighborhood_name || infoBusca?.city || "-"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 14,
                        padding: 14,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                        Veículo
                      </div>
                      <div style={{ fontSize: 16, fontWeight: "bold", color: "#0f172a" }}>
                        {item.vehicle_name || "-"}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 14,
                        padding: 14,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                        Placa
                      </div>
                      <div style={{ fontSize: 16, fontWeight: "bold", color: "#0f172a" }}>
                        {item.vehicle_plate || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <button
                    onClick={() => copiar(item)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "none",
                      background: "#0f172a",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    Copiar informações
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}