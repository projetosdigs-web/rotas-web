import { useEffect, useState } from "react";
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

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vinculos, setVinculos] = useState([]);

  const [routeId, setRouteId] = useState("");
  const [cityId, setCityId] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [weekday, setWeekday] = useState("");

  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarTudo() {
    try {
      setLoading(true);

      const [r, c, n, v, vc] = await Promise.all([
        api.get("/routes/"),
        api.get("/cities/"),
        api.get("/neighborhoods/"),
        api.get("/vehicles/"),
        api.get("/route-city-day/"),
      ]);

      setRoutes(r.data || []);
      setCities(c.data || []);
      setNeighborhoods(n.data || []);
      setVehicles(v.data || []);
      setVinculos(vc.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      alert("Erro ao carregar dados dos vínculos");
    } finally {
      setLoading(false);
    }
  }

  async function criarVinculo() {
    if (!routeId || !cityId || !neighborhoodId || !vehicleId || !weekday) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setSalvando(true);

      await api.post("/route-city-day/", {
        route_id: Number(routeId),
        city_id: Number(cityId),
        neighborhood_id: Number(neighborhoodId),
        vehicle_id: Number(vehicleId),
        weekday,
      });

      setRouteId("");
      setCityId("");
      setNeighborhoodId("");
      setVehicleId("");
      setWeekday("");

      await carregarTudo();
    } catch (err) {
      console.error("Erro ao criar vínculo:", err);
      alert("Erro ao criar vínculo");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarVinculo(id) {
    const confirmar = window.confirm("Deseja excluir esse vínculo?");
    if (!confirmar) return;

    try {
      await api.delete(`/route-city-day/${id}`);
      await carregarTudo();
    } catch (err) {
      console.error("Erro ao excluir vínculo:", err);
      alert("Erro ao excluir vínculo");
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  const bairrosFiltrados = neighborhoods.filter(
    (n) => !cityId || n.city_id === Number(cityId)
  );

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
            Configuração operacional
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 40,
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Vínculo de Rotas
          </h1>

          <p
            style={{
              marginTop: 12,
              color: "#475569",
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: 860,
            }}
          >
            Relacione rota, cidade, bairro, dia de atendimento e veículo para
            montar a lógica operacional do sistema.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 24,
            }}
          >
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                background: "#fff",
                color: "#0f172a",
              }}
            >
              <option value="">Selecione a rota</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              value={cityId}
              onChange={(e) => {
                setCityId(e.target.value);
                setNeighborhoodId("");
              }}
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                background: "#fff",
                color: "#0f172a",
              }}
            >
              <option value="">Selecione a cidade</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                background: "#fff",
                color: "#0f172a",
              }}
            >
              <option value="">Selecione o bairro</option>
              {bairrosFiltrados.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>

            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              style={{
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                background: "#fff",
                color: "#0f172a",
              }}
            >
              <option value="">Selecione o veículo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              style={{
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
              onClick={criarVinculo}
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
                minWidth: 160,
                boxShadow: "0 10px 24px rgba(37,99,235,0.28)",
              }}
            >
              {salvando ? "Criando..." : "Criar vínculo"}
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
                Vínculos cadastrados
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#64748b",
                  fontSize: 15,
                }}
              >
                Total de vínculos: <strong>{vinculos.length}</strong>
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
              Carregando vínculos...
            </div>
          ) : vinculos.length === 0 ? (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 20,
                border: "1px solid #e2e8f0",
                color: "#334155",
              }}
            >
              Nenhum vínculo cadastrado.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {vinculos.map((vinculo, index) => (
                <div
                  key={vinculo.id}
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
                      background: "#0f172a",
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
                      Vínculo #{index + 1}
                    </div>

                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#0f172a",
                        lineHeight: 1.2,
                        marginBottom: 8,
                      }}
                    >
                      {vinculo.route_name || "-"}
                    </div>

                    <div
                      style={{
                        fontSize: 15,
                        color: "#475569",
                        lineHeight: 1.7,
                      }}
                    >
                      <div>
                        Cidade: <strong>{vinculo.city_name || "-"}</strong>
                      </div>
                      <div>
                        Bairro: <strong>{vinculo.neighborhood_name || "-"}</strong>
                      </div>
                      <div>
                        Dia: <strong>{traduzirDia(vinculo.weekday)}</strong>
                      </div>
                      <div>
                        Veículo: <strong>{vinculo.vehicle_name || "-"}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deletarVinculo(vinculo.id)}
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