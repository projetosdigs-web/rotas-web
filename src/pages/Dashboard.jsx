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
    {
      title: "Consulta principal",
      subtitle: "Acesso rápido",
      description: "Tela principal usada pelos vendedores para localizar atendimento.",
      path: "/consulta",
      color: "#2563eb",
    },
    {
      title: "Rotas do Dia",
      subtitle: "Operacional",
      description: "Visualize todas as rotas programadas para um dia específico.",
      path: "/rotas-dia",
      color: "#16a34a",
    },
    {
      title: "Rotas",
      subtitle: "Cadastro",
      description: "Gerencie as rotas cadastradas no sistema.",
      path: "/admin/rotas",
      color: "#7c3aed",
    },
    {
      title: "Cidades",
      subtitle: "Cadastro",
      description: "Mantenha a base de cidades organizada e atualizada.",
      path: "/admin/cidades",
      color: "#ea580c",
    },
    {
      title: "Bairros",
      subtitle: "Cadastro",
      description: "Cadastre e mantenha os bairros vinculados às cidades.",
      path: "/admin/bairros",
      color: "#dc2626",
    },
    {
      title: "Veículos",
      subtitle: "Cadastro",
      description: "Gerencie os veículos usados nas rotas de atendimento.",
      path: "/admin/veiculos",
      color: "#0f766e",
    },
    {
      title: "Vínculo de Rotas",
      subtitle: "Configuração",
      description: "Relacione rota, cidade, bairro, dia e veículo.",
      path: "/admin/vinculos",
      color: "#0f172a",
    },
  ];

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
            Área administrativa
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 40,
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Painel Administrativo
          </h1>

          <p
            style={{
              marginTop: 12,
              color: "#475569",
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: 800,
            }}
          >
            Gerencie cadastros, vínculos operacionais e acessos rápidos do sistema
            de rotas em um único painel.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <button
              onClick={() => ir("/consulta")}
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
              Ir para Consulta
            </button>

            <button
              onClick={() => ir("/rotas-dia")}
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
              Ver Rotas do Dia
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => ir(item.path)}
              style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 22,
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 16px 36px rgba(15,23,42,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(15,23,42,0.08)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: item.color,
                }}
              />

              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 8,
                  marginTop: 8,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {item.subtitle}
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#0f172a",
                  lineHeight: 1.1,
                  marginBottom: 12,
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
                {item.description}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 34, textAlign: "center" }}>
          <button
            onClick={logout}
            style={{
              padding: "15px 24px",
              borderRadius: 16,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 10px 22px rgba(220,38,38,0.22)",
            }}
          >
            Sair do sistema
          </button>
        </div>
      </div>
    </div>
  );
}