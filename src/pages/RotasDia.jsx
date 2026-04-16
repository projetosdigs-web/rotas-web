import { useState } from "react";
import { api } from "../services/api";

export default function RotasDia() {
  const [weekday, setWeekday] = useState("");
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscarRotas() {
    if (!weekday) {
      alert("Selecione um dia");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/lookup-day/?weekday=${weekday}`);
      setRotas(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar rotas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Rotas do Dia</h1>

      <select value={weekday} onChange={(e) => setWeekday(e.target.value)}>
        <option value="">Selecione o dia</option>
        <option value="segunda">Segunda</option>
        <option value="terca">Terça</option>
        <option value="quarta">Quarta</option>
        <option value="quinta">Quinta</option>
        <option value="sexta">Sexta</option>
        <option value="sabado">Sábado</option>
      </select>

      <button onClick={buscarRotas} style={{ marginLeft: 10 }}>
        Buscar
      </button>

      {loading && <p>Carregando...</p>}

      {!loading && rotas.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {rotas.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <strong>Rota:</strong> {item.route_name || "-"} <br />
              <strong>Cidade:</strong> {item.city_name || "-"} <br />
              <strong>Bairro:</strong> {item.neighborhood_name || "-"} <br />
              <strong>Dia:</strong> {item.weekday || "-"} <br />
            </div>
          ))}
        </div>
      )}

      {!loading && rotas.length === 0 && <p style={{ marginTop: 20 }}>Nenhuma rota carregada.</p>}
    </div>
  );
}