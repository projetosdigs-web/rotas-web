import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CadastroVeiculos() {
  const [nome, setNome] = useState("");
  const [placa, setPlaca] = useState("");
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function carregarVeiculos() {
    try {
      setLoading(true);
      const res = await api.get("/vehicles/");
      setVeiculos(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }

  async function criarVeiculo() {
    if (!nome.trim()) {
      alert("Digite o nome do veículo");
      return;
    }

    try {
      setSalvando(true);

      await api.post("/vehicles/", {
        name: nome.trim(),
        plate: placa,
      });

      setNome("");
      setPlaca("");
      await carregarVeiculos();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar veículo");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarVeiculo(id) {
    const confirmar = window.confirm("Deseja excluir esse veículo?");
    if (!confirmar) return;

    try {
      await api.delete(`/vehicles/${id}`);
      await carregarVeiculos();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir veículo");
    }
  }

  useEffect(() => {
    carregarVeiculos();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>Cadastro de Veículos</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Nome do veículo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />

        <input
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          style={{
            width: 120,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />

        <button onClick={criarVeiculo} disabled={salvando}>
          {salvando ? "Criando..." : "Criar"}
        </button>
      </div>

      <h3>Veículos cadastrados</h3>

      {loading ? (
        <p>Carregando...</p>
      ) : veiculos.length === 0 ? (
        <p>Nenhum veículo cadastrado</p>
      ) : (
        <div>
          {veiculos.map((v) => (
            <div
              key={v.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <div>
                <strong>{v.name}</strong>
                <div style={{ fontSize: 14 }}>{v.plate}</div>
              </div>

              <button onClick={() => deletarVeiculo(v.id)}>
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}