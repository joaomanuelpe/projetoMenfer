import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LockKeyhole, User } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const username2 = "Carol";
  const senha = "123";
  const navigate = useNavigate();
  const { login } = useAuth();
  const notify = () => {
    toast.dismiss();
    toast.error("Usuário ou senha inválidos", {duration: 2000, repeat: false});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username !== username2 || password !== senha) {
      notify();
      return;
    }
    login(username);
    navigate("/home");
  };

  return (
    <div>
      <Toaster ></Toaster>
      <div className="min-h-screen bg-gradient-to-br from-[#D4EBF8] via-[#1F509A]/40 to-[#E38E49]/40 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#D4EBF8]/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0A3981] to-[#1F509A] bg-clip-text text-transparent">
                Bem-vindo
              </h1>
              <p className="text-[#0A3981]/80 mt-2">Acesse sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-[#0A3981] flex items-center gap-2"
                >
                  <User size={18} className="text-[#1F509A]" />
                  Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#1F509A]/30 focus:ring-2 focus:ring-[#1F509A] focus:border-[#1F509A] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Digite seu usuário"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#0A3981] flex items-center gap-2"
                >
                  <LockKeyhole size={18} className="text-[#1F509A]" />
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#1F509A]/30 focus:ring-2 focus:ring-[#1F509A] focus:border-[#1F509A] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Digite sua senha"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#1F509A]/30 text-[#1F509A] focus:ring-[#1F509A]"
                  />
                  <span className="text-[#0A3981]/80">Lembrar de mim</span>
                </label>
                <a
                  href="#"
                  className="text-[#E38E49] hover:text-[#E38E49]/80 font-medium"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1F509A] to-[#0A3981] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Entrar
              </button>
            </form>

            <div className="text-center text-sm text-[#0A3981]/80">
              <p>
                Não tem uma conta? {" "}
                <a
                  href="#"
                  className="text-[#E38E49] hover:text-[#E38E49]/80 font-medium"
                >
                  Cadastre-se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
