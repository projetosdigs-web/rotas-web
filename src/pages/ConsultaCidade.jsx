import { useState, useEffect } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function ConsultaCidade() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cidadesIBGE, setCidadesIBGE] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    carregarCidadesIBGE();
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getWeekdayName = (day) => {
    const dias = {
      0: "Segunda-feira", 1: "Terça-feira", 2: "Quarta-feira",
      3: "Quinta-feira", 4: "Sexta-feira", 5: "Sábado",
      6: "Domingo", 7: "Todos os dias"
    };
    return dias[day] || "Não definido";
  };

  async function carregarCidadesIBGE() {
    try {
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      setCidadesIBGE(res.data.map(c => c.nome).sort());
    } catch (err) { console.error("Erro IBGE", err); }
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Chamada usando a instância 'api' configurada com HTTPS
      const res = await api.get(`/lookup-city/?query=${encodeURIComponent(query)}`);
      setResultados(res.data.routes || []);
    } catch (err) {
      console.error("Erro na busca:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#403d7c", padding: "50px 20px", textAlign: "center", color: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 36 }}>Ferperez RotaCerta</h1>
        <p style={{ opacity: 0.9, marginTop: 10 }}>Consulte o cronograma de entregas</p>
      </div>

      <div style={{ maxWidth: 600, margin: "-35px auto 0", padding: "0 20px" }}>
        <form onSubmit={handleSearch} style={{ background: "#fff", padding: 20, borderRadius: 24, boxShadow: "0 15px 35px rgba(0,0,0,0.1)", display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <input 
              list="lista-ibge-consulta"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Jundiaí ou Bairro..."
              style={{ width: "100%", border: "1px solid #ddd6f5", padding: "16px", borderRadius: 14, fontSize: 16 }}
            />
            <datalist id="lista-ibge-consulta">
              {cidadesIBGE.map((c, i) => <option key={i} value={c} />)}
            </datalist>
          </div>
          <button type="submit" style={{ background: "#ed823c", color: "#fff", border: "none", padding: "0 25px", borderRadius: 14, fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "..." : "Buscar"}
          </button>
        </form>

        <div style={{ marginTop: 35, paddingBottom: 60 }}>
          {resultados.length > 0 ? (
            resultados.map((r, i) => (
              <div key={i} style={{ background: "#fff", padding: 22, borderRadius: 20, marginBottom: 15, boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ color: "#ed823c", fontWeight: "bold", fontSize: 12, textTransform: "uppercase" }}>{r.route_name}</div>
                <div style={{ fontSize: 20, fontWeight: "bold", color: "#403d7c" }}>{query}</div>
                <div style={{ color: "#64748b" }}>{r.neighborhood_name || "Atendimento Geral"}</div>
                
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                  <div style={{ background: "#efeafd", color: "#403d7c", padding: "6px 12px", borderRadius: 10, fontSize: 13, fontWeight: "bold" }}>
                    🗓️ {getWeekdayName(r.weekday)}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>
                    🚛 {r.vehicle_name} {r.vehicle_plate ? `(${r.vehicle_plate})` : ""}
                  </div>
                </div>
              </div>
            ))
          ) : query && !loading ? (
            <div style={{ textAlign: "center", color: "#64748b", background: "#fff", padding: 30, borderRadius: 20 }}>
              <p>Nenhuma rota encontrada para <strong>"{query}"</strong>.</p>
              <small>Certifique-se de que a cidade está vinculada no painel admin.</small>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}