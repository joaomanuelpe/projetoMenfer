import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CadastroPage from "./pages/CadastrosPage";
import EmpresaPage from "./pages/EmpresaPage";
import FrotaPage from "./pages/FrotaPage";
import MotoristaPage from "./pages/MotoristaPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cadastros" element={<CadastroPage />} />
        <Route path="/empresa" element={<EmpresaPage />} />
        <Route path="/frota" element={<FrotaPage />} />
        <Route path="/motorista" element={<MotoristaPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
