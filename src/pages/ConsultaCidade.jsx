import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        background:
          "linear-gradient(180deg, #eff6ff 0%, #f8fafc 45%, #ffffff 100%)",
        padding: isMobile ? "18px 12px 36px" : "28px 18px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.3fr 0.9fr",
            gap: isMobile ? 16 : 24,
            alignItems: "stretch",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              borderRadius: isMobile ? 20 : 28,
              padding: isMobile ? 20 : 32,
              boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 999,
                background: "#dbeafe",
                color: "#1d4ed8",
                fontSize: 13,
                fontWeight: "bold",
                marginBottom: 18,
              }}
            >
              Consulta premium para vendedores
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? 30 : 46,
                lineHeight: 1.05,
                color: "#0f172a",
                maxWidth: 700,
              }}
            >
              Descubra sua rota de atendimento em segundos
            </h1>

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                color: "#475569",
                fontSize: isMobile ? 15 : 18,
                lineHeight: 1.6,
                maxWidth: 760,
              }}
            >
              Consulte por cidade ou bairro e encontre rapidamente a rota, o dia
              de atendimento e o veículo responsável.
            </p>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 12,
                flexWrap: "wrap",
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
                  minWidth: isMobile ? "100%" : 280,
                  width: isMobile ? "100%" : "auto",
                  padding: "18px 18px",
                  borderRadius: 16,
                  border: "1px solid #cbd5e1",
                  fontSize: 16,
                  outline: "none",
                  background: "#fff",
                  color: "#0f172a",
                  boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={buscar}
                disabled={loading}
                style={{
                  padding: "18px 22px",
                  borderRadius: 16,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                  minWidth: isMobile ? "100%" : 130,
                  width: isMobile ? "100%" : "auto",
                  boxShadow: "0 10px 24px rgba(37,99,235,0.28)",
                }}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>

              <button
                onClick={limparBusca}
                style={{
                  padding: "18px 22px",
                  borderRadius: 16,
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                  minWidth: isMobile ? "100%" : 120,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Limpar
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              <a href="/rotas-dia" style={{ textDecoration: "none", width: isMobile ? "100%" : "auto" }}>
                <button
                  style={{
                    width: isMobile ? "100%" : "auto",
                    padding: "13px 18px",
                    borderRadius: 14,
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

              <a href="/login" style={{ textDecoration: "none", width: isMobile ? "100%" : "auto" }}>
                <button
                  style={{
                    width: isMobile ? "100%" : "auto",
                    padding: "13px 18px",
                    borderRadius: 14,
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

          <div
            style={{
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 45%, #0f172a 100%)",
              color: "#fff",
              borderRadius: isMobile ? 20 : 28,
              padding: isMobile ? 20 : 28,
              boxShadow: "0 18px 45px rgba(37,99,235,0.18)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: isMobile ? "auto" : 320,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  opacity: 0.85,
                  marginBottom: 12,
                }}
              >
                Rotas Mobile
              </div>

              <div
                style={{
                  fontSize: isMobile ? 24 : 30,
                  fontWeight: "bold",
                  lineHeight: 1.15,
                  marginBottom: 14,
                }}
              >
                Sistema inteligente de consulta comercial
              </div>

              <p
                style={{
                  margin: 0,
                  opacity: 0.9,
                  lineHeight: 1.7,
                  fontSize: isMobile ? 15 : 16,
                }}
              >
                Visualize rapidamente cobertura regional, dia de atendimento e
                veículo responsável por cada rota.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 24,
              }}
            >
              {[
                { label: "Busca", value: "Rápida" },
                { label: "Consulta", value: "Inteligente" },
                { label: "Mapa", value: "Integrado" },
                { label: "Uso", value: "Mobile" },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 18,
                    padding: isMobile ? 12 : 16,
                  }}
                >
                  <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: isMobile ? 17 : 20, fontWeight: "bold" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 26,
          }}
        >
          {[
            {
              title: "Consulta rápida",
              text: "Encontre a rota e o dia de atendimento com poucos cliques.",
            },
            {
              title: "Cobertura regional",
              text: "Veja bairros, cidades e pontos atendidos por cada rota.",
            },
            {
              title: "Uso comercial",
              text: "Ideal para vendedores e equipes externas em campo.",
            },
            {
              title: "Mapa integrado",
              text: "Visualize no mapa os locais encontrados na busca.",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: isMobile ? 18 : 22,
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: isMobile ? 18 : 20,
                  color: "#0f172a",
                  marginBottom: 10,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  color: "#475569",
                  lineHeight: 1.65,
                  fontSize: 15,
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {!loading && infoBusca && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 18,
              boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
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

        {!loading && resultado.length > 0 && <MapaRotas dados={resultado} />}

        {loading && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 24,
              boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
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
              boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
              border: "1px solid #e2e8f0",
            }}
          >
            <p style={{ margin: 0, color: "#334155", fontSize: 16 }}>
              Nenhum atendimento encontrado para essa busca.
            </p>
          </div>
        )}

        {!loading && resultado.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {resultado.map((item, index) => (
              <div
                key={`${item.route_name}-${item.neighborhood_name}-${index}`}
                style={{
                  background: "#ffffff",
                  borderRadius: 22,
                  padding: isMobile ? 18 : 22,
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
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
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "start",
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
                        fontSize: isMobile ? 24 : 28,
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
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
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