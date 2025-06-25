import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CadastroPage from "./pages/CadastrosPage";
import EmpresaPage from "./pages/EmpresaPage";
import FrotaPage from "./pages/FrotaPage";
import MotoristaPage from "./pages/MotoristaPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter } from 'react-router-dom';
import TelaSelecao from "./pages/GerarPdfPage";
import TablePage from "./pages/TablePage";
import FinanceiroPage from "./pages/FinanceiroPage";
import DespesasPage from "./pages/DespesasPage";
import OficinaPage from "./pages/OficinaPage";
import MultasPage from "./pages/MultasPage";

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/cadastros" element={<CadastroPage />} />
        <Route path="/empresa" element={<EmpresaPage />} />
        <Route path="/frota" element={<FrotaPage />} />
        <Route path="/motorista" element={<MotoristaPage />} />
        <Route path="/abastecimento" element={<TablePage />} />
        <Route path="/docs" element={<TelaSelecao />} />
        <Route path="/financeiro" element={<FinanceiroPage />} />
        <Route path="/despesas" element={<DespesasPage />} />
        <Route path="/oficina" element={<OficinaPage />} />
        <Route path="/multas" element={<MultasPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;