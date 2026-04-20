import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroBairros() {
  const [nome, setNome] = useState("");
  const [cityId, setCityId] = useState("");
  const [bairros, setBairros] = useState([]);
  const [cidades, setCidades] = useState([]);
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
    carregarCidades();
    carregarBairros();

    return () => window.removeEventListener("resize", resize);
  }, []);

  async function carregarBairros() {
    try {
      setLoading(true);
      const res = await api.get("/neighborhoods/");
      setBairros(res.data || []);
    } catch {
      alert("Erro ao carregar bairros");
    } finally {
      setLoading(false);
    }
  }

  async function carregarCidades() {
    try {
      const res = await api.get("/cities/");
      setCidades(res.data || []);
    } catch {
      alert("Erro ao carregar cidades");
    }
  }

  function iniciarEdicao(item) {
    setEditandoId(item.id);
    setNome(item.name || "");
    setCityId(String(item.city_id || ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome("");
    setCityId("");
  }

  async function salvarBairro() {
    if (!nome.trim()) {
      alert("Digite o nome do bairro");
      return;
    }

    if (!cityId) {
      alert("Selecione uma cidade");
      return;
    }

    try {
      setSalvando(true);

      if (editandoId) {
        await api.put(`/neighborhoods/${editandoId}`, {
          name: nome.trim(),
          city_id: Number(cityId),
        });
      } else {
        await api.post("/neighborhoods/", {
          name: nome.trim(),
          city_id: Number(cityId),
        });
      }

      cancelarEdicao();
      carregarBairros();
    } catch {
      alert(editandoId ? "Erro ao editar bairro" : "Erro ao criar bairro");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    const ok = window.confirm("Deseja excluir esse bairro?");
    if (!ok) return;

    try {
      await api.delete(`/neighborhoods/${id}`);
      if (editandoId === id) cancelarEdicao();
      carregarBairros();
    } catch {
      alert("Erro ao excluir");
    }
  }

  function getNomeCidade(id) {
    const cidade = cidades.find((c) => c.id === id);
    return cidade ? cidade.name : "-";
  }

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
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
            Ferperez • Cadastro
          </div>

          <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 38, color: "#0f172a" }}>
            {editandoId ? "Editar Bairro" : "Cadastro de Bairros"}
          </h1>

          <p style={{ marginTop: 10, color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
            {editandoId
              ? "Altere o bairro e sua cidade relacionada."
              : "Cadastre bairros e relacione cada um à sua cidade."}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 12,
              marginTop: 22,
            }}
          >
            <input
              placeholder="Nome do bairro"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                flex: 1,
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #ddd6f5",
                fontSize: 16,
                outline: "none",
              }}
            />

            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              style={{
                minWidth: isMobile ? "100%" : 220,
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid #ddd6f5",
                fontSize: 16,
                outline: "none",
                background: "#fff",
              }}
            >
              <option value="">Selecione a cidade</option>
              {cidades.map((cidade) => (
                <option key={cidade.id} value={cidade.id}>
                  {cidade.name}
                </option>
              ))}
            </select>

            <button
              onClick={salvarBairro}
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
              {salvando ? "Salvando..." : editandoId ? "Salvar edição" : "Cadastrar"}
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
                  minWidth: isMobile ? "100%" : 150,
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
            Bairros cadastrados
          </h2>

          {loading ? (
            <p style={{ color: "#64748b" }}>Carregando...</p>
          ) : bairros.length === 0 ? (
            <p style={{ color: "#64748b" }}>Nenhum bairro cadastrado.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {bairros.map((item, i) => (
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
                      Bairro #{i + 1}
                    </div>

                    <div style={{ fontSize: 22, fontWeight: "bold", color: "#0f172a", marginBottom: 6 }}>
                      {item.name}
                    </div>

                    <div style={{ fontSize: 15, color: "#64748b" }}>
                      Cidade: <strong>{item.city_name || getNomeCidade(item.city_id)}</strong>
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