import { useState } from "react";
import { api } from "../services/api";

function traduzirDia(valor) {
  const dias = {
    0: "Segunda-feira",
    1: "Terça-feira",
    2: "Quarta-feira",
    3: "Quinta-feira",
    4: "Sexta-feira",
    5: "Todos os dias",
    segunda: "Segunda-feira",
    terca: "Terça-feira",
    terça: "Terça-feira",
    quarta: "Quarta-feira",
    quinta: "Quinta-feira",
    sexta: "Sexta-feira",
    sabado: "Sábado",
    sábado: "Sábado",
  };

  return dias[valor] ?? valor ?? "-";
}

function corDia(valor) {
  const cores = {
    0: "#2563eb",
    1: "#16a34a",
    2: "#7c3aed",
    3: "#ea580c",
    4: "#dc2626",
    5: "#0f766e",
    segunda: "#2563eb",
    terca: "#16a34a",
    terça: "#16a34a",
    quarta: "#7c3aed",
    quinta: "#ea580c",
    sexta: "#dc2626",
    sabado: "#0f766e",
    sábado: "#0f766e",
  };

  return cores[valor] || "#334155";
}

export default function RotasDia() {
  const [weekday, setWeekday] = useState("");
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);

  async function buscarRotas() {
    if (weekday === "") {
      alert("Selecione um dia");
      return;
    }

    try {
      setLoading(true);
      setBuscou(true);

      const res = await api.get(`/lookup-day/?weekday=${weekday}`);
      setRotas(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar rotas do dia:", err);
      setRotas([]);
      alert("Erro ao buscar rotas do dia");
    } finally {
      setLoading(false);
    }
  }

  function limpar() {
    setWeekday("");
    setRotas([]);
    setBuscou(false);
  }

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
            Visualização diária
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 38,
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Rotas do Dia
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
            Consulte todas as rotas programadas para um dia específico e veja
            cidade, bairro e veículo responsável.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 24,
            }}
          >
            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              style={{
                flex: 1,
                minWidth: 260,
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                background: "#fff",
                color: "#0f172a",
              }}
            >
              <option value="">Selecione o dia</option>
              <option value="0">Segunda-feira</option>
              <option value="1">Terça-feira</option>
              <option value="2">Quarta-feira</option>
              <option value="3">Quinta-feira</option>
              <option value="4">Sexta-feira</option>
              <option value="5">Todos os dias</option>
            </select>

            <button
              onClick={buscarRotas}
              disabled={loading}
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
              {loading ? "Buscando..." : "Buscar"}
            </button>

            <button
              onClick={limpar}
              style={{
                padding: "16px 22px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#0f172a",
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: 120,
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
            <a href="/consulta" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "13px 18px",
                  borderRadius: 14,
                  border: "1px solid #dbeafe",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Voltar para Consulta
              </button>
            </a>

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
                Painel Administrativo
              </button>
            </a>
          </div>
        </div>

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
              Carregando rotas...
            </p>
          </div>
        )}

        {!loading && buscou && rotas.length === 0 && (
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
              Nenhuma rota encontrada para o dia selecionado.
            </p>
          </div>
        )}

        {!loading && rotas.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {rotas.map((item, index) => (
              <div
                key={item.id || `${item.route_name}-${item.city_name}-${index}`}
                style={{
                  background: "#ffffff",
                  borderRadius: 22,
                  padding: 22,
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
                      Rota
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
                      Cidade
                    </div>
                    <div style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
                      {item.city_name || "-"}
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
                      Bairro
                    </div>
                    <div style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
                      {item.neighborhood_name || "-"}
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
                        {item.vehicle_plate || item.plate || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}