import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleLogin() {
    if (!username || !password) {
      alert("Preencha usuário e senha");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #2563eb 35%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1080,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
          gap: 22,
          alignItems: "stretch",
        }}
      >
        {/* LADO ESQUERDO */}
        <div
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            borderRadius: 28,
            padding: isMobile ? 22 : 34,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                fontSize: 13,
                fontWeight: "bold",
                marginBottom: 18,
              }}
            >
              Sistema Premium
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? 34 : 48,
                lineHeight: 1.05,
              }}
            >
              Rota Certa
            </h1>

            <p
              style={{
                marginTop: 18,
                fontSize: isMobile ? 15 : 18,
                lineHeight: 1.7,
                opacity: 0.95,
                maxWidth: 520,
              }}
            >
              Plataforma inteligente para vendedores, roteirização comercial e
              gestão operacional.
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
              { t: "Consulta", v: "Rápida" },
              { t: "Rotas", v: "Inteligentes" },
              { t: "Uso", v: "Mobile" },
              { t: "Painel", v: "Admin" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.8,
                    marginBottom: 6,
                  }}
                >
                  {item.t}
                </div>

                <div
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {item.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LADO DIREITO LOGIN */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: isMobile ? 22 : 34,
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#2563eb",
              fontWeight: "bold",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Área Restrita
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: isMobile ? 28 : 34,
              color: "#0f172a",
            }}
          >
            Entrar no Sistema
          </h2>

          <p
            style={{
              marginTop: 12,
              color: "#64748b",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Informe suas credenciais para acessar o painel administrativo.
          </p>

          <div style={{ marginTop: 26 }}>
            <input
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                fontSize: 16,
                marginBottom: 14,
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            <div style={{ position: "relative" }}>
              <input
                placeholder="Senha"
                type={mostrarSenha ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  paddingRight: 95,
                  borderRadius: 16,
                  border: "1px solid #cbd5e1",
                  fontSize: 16,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />

              <button
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 8,
                  border: "none",
                  background: "#f1f5f9",
                  padding: "10px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#334155",
                }}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 18,
                padding: "16px 18px",
                borderRadius: 16,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 14px 28px rgba(37,99,235,0.28)",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <a href="/consulta" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "15px 18px",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#334155",
                  fontSize: 15,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Voltar para Consulta
              </button>
            </a>
          </div>

          <div
            style={{
              marginTop: 22,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            © 2026 Rotas Mobile
          </div>
        </div>
      </div>
    </div>
  );
}