import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function ir(path) {
    navigate(path);
  }

  const items = [
    { title: "Acesso rápido", name: "Consulta Principal", path: "/consulta" },
    { title: "Operacional", name: "Rotas do Dia", path: "/rotas-dia" },
    { title: "Cadastro", name: "Rotas", path: "/admin/rotas" },
    { title: "Cadastro", name: "Cidades", path: "/admin/cidades" },
    { title: "Cadastro", name: "Bairros", path: "/admin/bairros" },
    { title: "Cadastro", name: "Veículos", path: "/admin/veiculos" },
    { title: "Configuração", name: "Vínculo de Rotas", path: "/admin/vinculos" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 34, color: "#0f172a" }}>
            Painel Administrativo
          </h1>

          <p style={{ color: "#64748b", marginTop: 8, fontSize: 16 }}>
            Gerencie rotas, cidades, bairros e veículos
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => ir(item.path)}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "22px 20px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#0f172a",
                  lineHeight: 1.2,
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 50, textAlign: "center" }}>
          <button
            onClick={logout}
            style={{
              padding: "14px 22px",
              borderRadius: 14,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(220,38,38,0.30)",
            }}
          >
            Sair do sistema
          </button>
        </div>
      </div>
    </div>
  );
}