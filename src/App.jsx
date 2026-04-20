import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RotasDia from "./pages/RotasDia";
import ConsultaCidade from "./pages/ConsultaCidade";

import CadastroRotas from "./pages/CadastroRotas";
import CadastroCidades from "./pages/CadastroCidades";
import CadastroBairros from "./pages/CadastroBairros";
import CadastroVeiculos from "./pages/CadastroVeiculos";
import VinculoRotas from "./pages/VinculoRotas";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 PÚBLICO */}
        <Route path="/" element={<ConsultaCidade />} />
        <Route path="/consulta" element={<ConsultaCidade />} />
        <Route path="/rotas-dia" element={<RotasDia />} />

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 ADMIN PROTEGIDO */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/rotas"
          element={
            <PrivateRoute>
              <CadastroRotas />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/cidades"
          element={
            <PrivateRoute>
              <CadastroCidades />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/bairros"
          element={
            <PrivateRoute>
              <CadastroBairros />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/veiculos"
          element={
            <PrivateRoute>
              <CadastroVeiculos />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/vinculos"
          element={
            <PrivateRoute>
              <VinculoRotas />
            </PrivateRoute>
          }
        />

        {/* 🛡️ ROTA DE SEGURANÇA (Caso o link da Vercel se perca ou a URL não exista) */}
        <Route path="*" element={<ConsultaCidade />} />

      </Routes>
    </BrowserRouter>
  );
}