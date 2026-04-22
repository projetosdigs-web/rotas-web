import { useEffect, useState } from "react";
import { api } from "../services/api";
import axios from "axios";

export default function VinculoRotas() {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  const [cidadesSP, setCidadesSP] = useState([]); 
  
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [cityInput, setCityInput] = useState(""); 
  const [neighborhood, setNeighborhood] = useState("");
  const [weekday, setWeekday] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    carregarDadosIniciais();
    carregarCidadesIBGE();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function carregarCidadesIBGE() {
    try {
      const res = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios");
      setCidadesSP(res.data.map(c => c.nome).sort());
    } catch (err) { console.error("Erro IBGE", err); }
  }

  async function carregarDadosIniciais() {
    try {
      setLoading(true);
      // CORREÇÃO: Alterado de /route-neighborhoods/ para /route-city-day/
      const [r, v, vi] = await Promise.all([
        api.get("/routes/"),
        api.get("/vehicles/"),
        api.get("/route-city-day/"), 
      ]);
      setRoutes(r.data || []);
      setVehicles(v.data || []);
      setVinculos(vi.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  }

  async function obterOuCriarCidade(nomeCidade) {
    const resCidades = await api.get("/cities/");
    const cidadeExistente = resCidades.data.find(
      c => c.name.trim().toLowerCase() === nomeCidade.trim().toLowerCase()
    );
    if (cidadeExistente) return cidadeExistente.id;
    const novaCidade = await api.post("/cities/", { name: nomeCidade.trim() });
    return novaCidade.data.id;
  }

  async function salvarVinculo() {
    if (!routeId || !vehicleId || !cityInput || !weekday) {
      alert("Por favor, preencha Rota, Veículo, Cidade e Dia.");
      return;
    }

    try {
      setSalvando(true);
      const cityId = await obterOuCriarCidade(cityInput);

      const payload = {
        route_id: Number(routeId),
        vehicle_id: Number(vehicleId),
        city_id: cityId,
        // Bairro é opcional, se estiver vazio enviamos null
        neighborhood_id: null, 
        weekday: Number(weekday),
      };

      // CORREÇÃO: Rota correta /route-city-day/
      if (editandoId) {
        await api.patch(`/route-city-day/${editandoId}/`, payload);
      } else {
        await api.post("/route-city-day/", payload);
      }

      limparFormulario();
      carregarDadosIniciais();
      alert("Vínculo salvo com sucesso!");
    } catch (err) {
      alert("Erro ao salvar vínculo.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir?")) return;
    try {
      await api.delete(`/route-city-day/${id}/`);
      carregarDadosIniciais();
    } catch { alert("Erro ao excluir"); }
  }

  // ... (Mantenha o restante do seu código de interface/JSX igual ao que você enviou)
  // Certifique-se apenas de que o mapeamento da lista use os nomes de campos que vêm do back
  // ex: v.route?.name em vez de v.route_name se o objeto for aninhado.