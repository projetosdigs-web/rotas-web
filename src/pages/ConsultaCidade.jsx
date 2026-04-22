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
    <div style={{ minHeight: "100vh", background: "#f8f7fc", fontFamily: "Arial, sans-serif", position: "relative" }}>
      
      {/* BOTÃO DE ACESSO ADMIN (O "DIRECIONAMENTO" QUE FALTAVA) */}
      <div style={{ position: "absolute", top: isMobile ? 10 : 20, right: isMobile ? 10 : 20, zIndex: 10 }}>
        <a href="/login" style={{ 
          textDecoration: "none", 
          color: "#fff", 
          background: "rgba(255,255,255,0.15)", 
          padding: "8px 16px", 
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "bold",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px"
        }}>
          🔐 Área Restrita
        </a>
      </div>

      {/* HEADER */}
      <div style={{ background: "#403d7c", padding: "60px 20px 80px", textAlign: "center", color: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 42, letterSpacing: "-1px" }}>
          Ferperez <span style={{ color: "#ed823c" }}>RotaCerta</span>
        </h1>
        <p style={{ opacity: 0.8, marginTop: 10, fontSize: isMobile ? 14 : 18 }}>
          Encontre o dia de entrega na sua região
        </p>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div style={{ maxWidth: 600, margin: "-40px auto 0", padding: "0 20px" }}>
        
        {/* FORMULÁRIO DE BUSCA */}
        <form onSubmit={handleSearch} style={{ 
          background: "#fff", 
          padding: isMobile ? "15px" : "20px", 
          borderRadius: 24, 
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)", 
          display: "flex", 
          gap: 10 
        }}>
          <div style={{ flex: 1 }}>
            <input 
              list="lista-ibge-consulta"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite a cidade ou bairro..."
              style={{ 
                width: "100%", 
                border: "2px solid #f1f5f9", 
                padding: "16px", 
                borderRadius: 16, 
                fontSize: 16,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#403d7c"}
              onBlur={(e) => e.target.style.borderColor = "#f1f5f9"}
            />
            <datalist id="lista-ibge-consulta">
              {cidadesIBGE.map((c, i) => <option key={i} value={c} />)}
            </datalist>
          </div>
          <button type="submit" style={{ 
            background: "#403d7c", 
            color: "#fff", 
            border: "none", 
            padding: "0 25px", 
            borderRadius: 16, 
            fontWeight: "bold", 
            cursor: "pointer",
            fontSize: 16,
            boxShadow: "0 10px 20px rgba(64,61,124,0.2)"
          }}>
            {loading ? "..." : "Buscar"}
          </button>
        </form>

        {/* LISTAGEM DE RESULTADOS */}
        <div style={{ marginTop: 40, paddingBottom: 60 }}>
          {resultados.length > 0 ? (
            <div style={{ display: "grid", gap: 15 }}>
              <p style={{ color: "#64748b", fontSize: 14, fontWeight: "bold", marginLeft: 10 }}>
                {resultados.length} resultado(s) encontrado(s):
              </p>
              {resultados.map((r, i) => (
                <div key={i} style={{ 
                  background: "#fff", 
                  padding: 24, 
                  borderRadius: 22, 
                  boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                  border: "1px solid #f1f5f9"
                }}>
                  <div style={{ color: "#ed823c", fontWeight: "bold", fontSize: 12, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                    {r.route_name}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: "bold", color: "#403d7c" }}>{query}</div>
                  <div style={{ color: "#64748b", marginBottom: 20 }}>{r.neighborhood_name || "Atendimento Geral na Cidade"}</div>
                  
                  <div style={{ 
                    marginTop: 18, 
                    paddingTop: 18, 
                    borderTop: "2px dashed #f1f5f9", 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ background: "#efeafd", color: "#403d7c", padding: "8px 16px", borderRadius: 12, fontSize: 14, fontWeight: "bold" }}>
                      🗓️ {getWeekdayName(r.weekday)}
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13, fontWeight: "500" }}>
                      🚛 {r.vehicle_name || "Veículo Ferperez"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query && !loading ? (
            <div style={{ textAlign: "center", color: "#64748b", background: "#fff", padding: 40, borderRadius: 24, border: "1px dashed #cbd5e1" }}>
              <span style={{ fontSize: 40 }}>📍</span>
              <p style={{ marginTop: 15, fontSize: 16 }}>Nenhuma rota encontrada para <strong>"{query}"</strong>.</p>
              <p style={{ fontSize: 13, opacity: 0.7 }}>Tente pesquisar apenas o nome da cidade principal.</p>
            </div>
          ) : (
            /* ESTADO INICIAL VAZIO */
            <div style={{ textAlign: "center", marginTop: 40 }}>
               <img 
                src="https://cdn-icons-png.flaticon.com/512/854/854878.png" 
                alt="mapa" 
                style={{ width: 80, opacity: 0.1, filter: "grayscale(1)" }} 
               />
               <p style={{ color: "#a0aec0", fontSize: 14, marginTop: 10 }}>Aguardando sua pesquisa...</p>
            </div>
          )}
        </div>
      </div>

      {/* RODAPÉ SIMPLES */}
      <footer style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: 12 }}>
        © 2026 Ferperez RotaCerta • Desenvolvido para agilizar sua logística
      </footer>
    </div>
  );
}