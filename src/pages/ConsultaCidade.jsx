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

  // Mapeamento dos dias para exibição amigável
  const getWeekdayName = (day) => {
    const dias = {
      0: "Segunda-feira",
      1: "Terça-feira",
      2: "Quarta-feira",
      3: "Quinta-feira",
      4: "Sexta-feira",
      5: "Sábado",
      6: "Domingo",
      7: "Todos os dias"
    };
    return dias[day] || "Não definido";
  };

  async function carregarCidadesIBGE() {
    try {
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      const nomes = res.data.map(c => c.nome).sort();
      setCidadesIBGE(nomes);
    } catch (err) {
      console.error("Erro ao carregar cidades do IBGE", err);
    }
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // CORREÇÃO 1: Rota alterada para /lookup-city/
      // CORREÇÃO 2: Parâmetro alterado de 'q' para 'query'
      const res = await api.get(`/lookup-city?query=${query}`);
      
      // CORREÇÃO 3: O backend retorna um objeto { routes: [...] }
      setResultados(res.data.routes || []);
    } catch (err) {
      console.error("Erro na busca:", err);
      setResultados([]); // Limpa se der 404
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7fc", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#403d7c", padding: "50px 20px", textAlign: "center", color: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 36 }}>Ferperez RotaCerta</h1>
        <p style={{ opacity: 0.9, marginTop: 10, fontSize: 16 }}>Consulte cidades e bairros atendidos</p>
      </div>

      <div style={{ maxWidth: 600, margin: "-35px auto 0", padding: "0 20px" }}>
        {/* Input com Inteligência IBGE */}
        <form onSubmit={handleSearch} style={{ background: "#fff", padding: 20, borderRadius: 24, boxShadow: "0 15px 35px rgba(0,0,0,0.1)", display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <input 
              list="lista-ibge-consulta"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite a cidade (ex: Jundiaí)..."
              style={{ width: "100%", border: "1px solid #ddd6f5", padding: "16px", borderRadius: 14, fontSize: 16, outline: "none", boxSizing: "border-box" }}
            />
            <datalist id="lista-ibge-consulta">
              {cidadesIBGE.map((c, i) => <option key={i} value={c} />)}
            </datalist>
          </div>
          <button type="submit" style={{ background: "#ed823c", color: "#fff", border: "none", padding: "0 25px", borderRadius: 14, fontWeight: "bold", cursor: "pointer", fontSize: 16 }}>
            {loading ? "..." : "Buscar"}
          </button>
        </form>

        {/* Lista de Resultados */}
        <div style={{ marginTop: 35, paddingBottom: 60 }}>
          {resultados.length > 0 ? (
            resultados.map((r, index) => (
              <div key={index} style={{ background: "#fff", padding: 22, borderRadius: 20, marginBottom: 15, border: "1px solid #ece8f7", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ color: "#ed823c", fontWeight: "bold", fontSize: 14, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{r.route_name}</div>
                <div style={{ fontSize: 20, fontWeight: "bold", color: "#403d7c" }}>{query}</div>
                <div style={{ color: "#64748b", fontSize: 16, marginTop: 2 }}>{r.neighborhood_name || "Atendimento Geral"}</div>
                
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ background: "#efeafd", color: "#403d7c", padding: "6px 14px", borderRadius: 10, fontSize: 14, fontWeight: "bold" }}>
                    🗓️ {getWeekdayName(r.weekday)}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 14, fontWeight: "500" }}>
                    🚛 {r.vehicle_name || "Frota Geral"} {r.vehicle_plate ? `(${r.vehicle_plate})` : ""}
                  </div>
                </div>
              </div>
            ))
          ) : query && !loading ? (
            <div style={{ textAlign: "center", color: "#64748b", marginTop: 50, background: "#fff", padding: 30, borderRadius: 20 }}>
              <span style={{ fontSize: 40 }}>📍</span>
              <p style={{ marginTop: 10 }}>Nenhuma rota encontrada para <strong>"{query}"</strong>.</p>
              <small>Verifique se a cidade está vinculada a uma rota no painel admin.</small>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#a0aec0", marginTop: 40, fontSize: 14 }}>
               Digite o nome da cidade acima para ver o cronograma.
            </div>
          )}
        </div>
      </div>

      {/* Acesso Admin */}
      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <a href="/login" style={{ color: "#403d7c", textDecoration: "none", fontSize: 13, fontWeight: "bold", opacity: 0.6 }}>
          Painel Administrativo Ferperez
        </a>
      </div>
    </div>
  );
}