import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CadastroPage from "./pages/CadastrosPage";
import EmpresaPage from "./pages/EmpresaPage";
import FrotaPage from "./pages/FrotaPage";
import MotoristaPage from "./pages/MotoristaPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cadastros" element={<CadastroPage />} />
      <Route path="/empresa" element={<EmpresaPage />}></Route>
      <Route path="/frota" element={<FrotaPage />}></Route>
      <Route path="/motorista" element={<MotoristaPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
    </Routes>
  );
}

export default App;
