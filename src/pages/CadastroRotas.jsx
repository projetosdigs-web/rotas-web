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
  const [isMobile, setIsMobile] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    function resize() {
      setIsMobile(window.innerWidth <= 768);
    }

    resize();
    window.addEventListener("resize", resize);
    carregarTudo();

    return () => window.removeEventListener("resize", resize);
  }, []);

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
    } catch {
      alert("Erro ao carregar dados dos vínculos");
    } finally {
      setLoading(false);
    }
  }

  function iniciarEdicao(item) {
    setEditandoId(item.id);
    setRouteId(String(item.route_id || ""));
    setCityId(String(item.city_id || ""));
    setNeighborhoodId(String(item.neighborhood_id || ""));
    setVehicleId(String(item.vehicle_id || ""));
    setWeekday(String(item.weekday ?? ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setRouteId("");
    setCityId("");
    setNeighborhoodId("");
    setVehicleId("");
    setWeekday("");
  }

  async function salvarVinculo() {
    if (!routeId || !cityId || !neighborhoodId || !vehicleId || weekday === "") {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        route_id: Number(routeId),
        city_id: Number(cityId),
        neighborhood_id: Number(neighborhoodId),
        vehicle_id: Number(vehicleId),
        weekday,
      };

      if (editandoId) {
        await api.put(`/route-city-day/${editandoId}`, payload);
      } else {
        await api.post("/route-city-day/", payload);
      }

      cancelarEdicao();
      carregarTudo();
    } catch {
      alert(editandoId ? "Erro ao editar vínculo" : "Erro ao criar vínculo");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    const ok = window.confirm("Deseja excluir esse vínculo?");
    if (!ok) return;

    try {
      await api.delete(`/route-city-day/${id}`);
      if (editandoId === id) cancelarEdicao();
      carregarTudo();
    } catch {
      alert("Erro ao excluir vínculo");
    }
  }

  const bairrosFiltrados = neighborhoods.filter(
    (n) => !cityId || n.city_id === Number(cityId)
  );

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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
            Ferperez • Configuração
          </div>

          <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 38, color: "#0f172a" }}>
            {editandoId ? "Editar Vínculo" : "Vínculo de Rotas"}
          </h1>

          <p style={{ marginTop: 10, color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
            {editandoId
              ? "Altere o vínculo e salve as mudanças."
              : "Relacione rota, cidade, bairro, dia e veículo para montar a lógica operacional."}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 22,
            }}
          >
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              style={selectStyle}
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
              style={selectStyle}
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
              style={selectStyle}
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
              style={selectStyle}
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
              style={selectStyle}
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
              onClick={salvarVinculo}
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
              {salvando ? "Salvando..." : editandoId ? "Salvar edição" : "Criar vínculo"}
            </button>

            {editandoId && (
              <button
                onClick={cancelarEdicao}
                style={{
                  padding: "16px 22px",
                  borderRadius: 16,
                  border: "1px solid #ece8f7",
                  background: "#fff",
                  color: "#403d7c",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            )}
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
          <h2 style={{ marginTop: 0, color: "#0f172a", fontSize: 24 }}>
            Vínculos cadastrados
          </h2>

          {loading ? (
            <p style={{ color: "#64748b" }}>Carregando...</p>
          ) : vinculos.length === 0 ? (
            <p style={{ color: "#64748b" }}>Nenhum vínculo cadastrado.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {vinculos.map((item, i) => (
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
                    <div style={{ fontSize: 13, color: "#64748b", fontWeight: "bold", marginBottom: 4 }}>
                      Vínculo #{i + 1}
                    </div>

                    <div style={{ fontSize: 22, fontWeight: "bold", color: "#0f172a", marginBottom: 8 }}>
                      {item.route_name || "-"}
                    </div>

                    <div style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>
                      <div>Cidade: <strong>{item.city_name || "-"}</strong></div>
                      <div>Bairro: <strong>{item.neighborhood_name || "-"}</strong></div>
                      <div>Dia: <strong>{traduzirDia(item.weekday)}</strong></div>
                      <div>Veículo: <strong>{item.vehicle_name || "-"}</strong></div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: 10,
                    }}
                  >
                    <button
                      onClick={() => iniciarEdicao(item)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 14,
                        border: "none",
                        background: "#403d7c",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        minWidth: isMobile ? "100%" : 120,
                      }}
                    >
                      Editar
                    </button>

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

const selectStyle = {
  padding: "16px 18px",
  borderRadius: 16,
  border: "1px solid #ddd6f5",
  fontSize: 16,
  background: "#fff",
  outline: "none",
};