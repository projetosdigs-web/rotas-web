import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function StatusSistema() {
  const [statusBackend, setStatusBackend] = useState({ loading: true, ok: false, ms: 0 });
  const [statusIBGE, setStatusIBGE] = useState({ loading: true, ok: false, ms: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    testarConexoes();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function testarConexoes() {
    // 1. Testar Backend Railway
    const inicioBack = performance.now();
    try {
      setStatusBackend({ loading: true, ok: false, ms: 0 });
      // Tentamos buscar as rotas (endpoint público ou simples)
      await api.get("/routes/");
      const fimBack = performance.now();
      setStatusBackend({ loading: false, ok: true, ms: Math.round(fimBack - inicioBack) });
    } catch (err) {
      setStatusBackend({ loading: false, ok: false, ms: 0 });
    }

    // 2. Testar API IBGE
    const inicioIBGE = performance.now();
    try {
      setStatusIBGE({ loading: true, ok: false, ms: 0 });
      await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      const fimIBGE = performance.now();
      setStatusIBGE({ loading: false, ok: true, ms: Math.round(fimIBGE - inicioIBGE) });
    } catch (err) {
      setStatusIBGE({ loading: false, ok: false, ms: 0 });
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f7fc",
      padding: isMobile ? "20px 15px" : "40px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        <header style={{ marginBottom: 30 }}>
          <h1 style={{ color: "#403d7c", margin: 0 }}>Diagnóstico Ferperez</h1>
          <p style={{ color: "#64748b" }}>Verifique a saúde das conexões do sistema RotaCerta</p>
        </header>

        <div style={{ display: "grid", gap: 20 }}>
          
          {/* Card Backend Railway */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a" }}>API Principal (Railway)</h3>
                <p style={{ margin: "5px 0 0", fontSize: 14, color: "#64748b" }}>Responsável pelos cadastros e vínculos</p>
              </div>
              <StatusBadge status={statusBackend} />
            </div>
            {!statusBackend.loading && statusBackend.ok && (
              <div style={msStyle}>Resposta em {statusBackend.ms}ms</div>
            )}
          </div>

          {/* Card IBGE */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a" }}>API IBGE (Governo)</h3>
                <p style={{ margin: "5px 0 0", fontSize: 14, color: "#64748b" }}>Fornece a lista de cidades de São Paulo</p>
              </div>
              <StatusBadge status={statusIBGE} />
            </div>
            {!statusIBGE.loading && statusIBGE.ok && (
              <div style={msStyle}>Resposta em {statusIBGE.ms}ms</div>
            )}
          </div>

          <button 
            onClick={testarConexoes}
            style={{
              padding: "16px",
              borderRadius: 14,
              border: "none",
              background: "#403d7c",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: 10
            }}
          >
            Refazer Testes
          </button>

          <a href="/dashboard" style={{ textAlign: "center", color: "#403d7c", textDecoration: "none", fontWeight: "bold" }}>
            Voltar ao Painel
          </a>

        </div>
      </div>
    </div>
  );
}

// Sub-componente para a bolinha de status
function StatusBadge({ status }) {
  if (status.loading) return <span style={{ color: "#e0a839", fontWeight: "bold" }}>🟡 Testando...</span>;
  return status.ok 
    ? <span style={{ color: "#10b981", fontWeight: "bold" }}>🟢 Online</span> 
    : <span style={{ color: "#ef4444", fontWeight: "bold" }}>🔴 Offline</span>;
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  border: "1px solid #ece8f7"
};

const msStyle = {
  marginTop: 15,
  fontSize: 12,
  color: "#94a3b8",
  fontWeight: "bold"
};