import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validações aqui...
    login(username);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80')]">
      <section className="grid place-items-center min-h-screen">
        <div className="bg-[#EDDCD9] p-8 rounded-2xl shadow-xl w-96 border-2 border-[#264143]">
          <h2 className="text-2xl font-extrabold text-center text-[#264143] mt-5">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-[#264143]"
              >
                Usuário
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border-2 border-[#264143] rounded-lg shadow-md focus:ring-2 focus:ring-[#E99F4C] focus:border-[#E99F4C] outline-none text-[#264143] bg-transparent"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#264143]"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border-2 border-[#264143] rounded-lg shadow-md focus:ring-2 focus:ring-[#E99F4C] focus:border-[#E99F4C] outline-none text-[#264143] bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#DE5499] text-white font-bold rounded-lg shadow-md hover:bg-[#C8478A] transition duration-200"
            >
              Entrar
            </button>
          </form>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#264143] hover:text-[#E99F4C] transition-colors"
            >
              <svg
                viewBox="0 0 32 32"
                width="36px"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <title>GitHub</title>
                <path d="M16,3a13,13,0,0,0-3.46,25.53,1,1,0,1,0,.53-1.92,11,11,0,1,1,7-.4,15.85,15.85,0,0,0-.3-3.92A6.27,6.27,0,0,0,24.68,16a6.42,6.42,0,0,0-1.05-3.87,7.09,7.09,0,0,0-.4-3.36,1,1,0,0,0-1.1-.67,8,8,0,0,0-3.37,1.28A11.35,11.35,0,0,0,16,9a13.09,13.09,0,0,0-3,.43A5.74,5.74,0,0,0,9.62,8.25a1,1,0,0,0-1,.66,7.06,7.06,0,0,0-.37,3.19A7.15,7.15,0,0,0,7.2,16a6.66,6.66,0,0,0,5,6.28,7.43,7.43,0,0,0-.15.79c-1,.06-1.58-.55-2.32-1.48a3.45,3.45,0,0,0-1.94-1.53,1,1,0,0,0-1.15.76A1,1,0,0,0,7.35,22c.16,0,.55.52.77.81a4.74,4.74,0,0,0,3.75,2.25,4.83,4.83,0,0,0,1.3-.18h0a1,1,0,0,0,.29-.14l0,0a.72.72,0,0,0,.18-.21.34.34,0,0,0,.08-.09.85.85,0,0,0,.06-.17,1.52,1.52,0,0,0,.06-.2v0a4.11,4.11,0,0,1,.46-1.91,1,1,0,0,0-.76-1.65A4.6,4.6,0,0,1,9.2,16a4.84,4.84,0,0,1,.87-3,1,1,0,0,0,.24-.83,5,5,0,0,1,0-1.85,3.59,3.59,0,0,1,1.74.92,1,1,0,0,0,1,.23A12.49,12.49,0,0,1,16,11a9.91,9.91,0,0,1,2.65.43,1,1,0,0,0,1-.18,5,5,0,0,1,2-1,4.11,4.11,0,0,1,0,1.91,1.05,1.05,0,0,0,.32,1A4,4,0,0,1,22.68,16a4.29,4.29,0,0,1-4.41,4.46,1,1,0,0,0-.94.65,1,1,0,0,0,.28,1.11c.59.51.5,4,.47,5.36a1,1,0,0,0,.38.81,1,1,0,0,0,.62.21,1.07,1.07,0,0,0,.25,0A13,13,0,0,0,16,3Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#264143] hover:text-[#E99F4C] transition-colors"
            >
              <svg
                height="40px"
                version="1.1"
                viewBox="0 0 40 40"
                width="32px"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <title>LinkedIn</title>
                <path d="M14,28 C14,29.1045695 13.1045695,30 12,30 C10.8954305,30 10,29.1045695 10,28 L10,16.4891356 C10,15.3845661 10.8954305,14.4891356 12,14.4891356 C13.1045695,14.4891356 14,15.3845661 14,16.4891356 L14,28 Z" />
                <path d="M21,28 C21,29.1045695 20.1045695,30 19,30 C17.8954305,30 17,29.1045695 17,28 L17,16.4891356 C17,15.3845661 17.8954305,14.4891356 19,14.4891356 C20.1045695,14.4891356 21,15.3845661 21,16.4891356 L21,28 Z" />
                <circle cx="12" cy="11" r="2" />
                <path d="M24.392628,18.4915544 C24.1505103,18.4915544 23.7118155,18.6536995 23.1102274,19.045093 C22.357207,19.5350083 21.4632459,20.3140369 20.4479882,21.3796124 C19.6860493,22.1793142 18.4200894,22.209927 17.6203876,21.4479882 C16.8206858,20.6860493 16.790073,19.4200894 17.5520118,18.6203876 C20.1299742,15.9146574 22.3173432,14.4915544 24.392628,14.4915544 C27.556334,14.4915544 29.0594087,15.5772972 29.6596542,17.900904 C29.9193279,18.9061252 29.9769624,22.037343 29.8997361,28.0257896 C29.8854928,29.1302673 28.9785904,30.0140769 27.8741127,29.9998337 C26.769635,29.9855905 25.8858254,29.078688 25.9000686,27.9742104 C25.9688416,22.6412745 25.908689,19.3732475 25.7867891,18.9013617 C25.7230943,18.6547932 25.7132912,18.6207315 25.7462432,18.6409324 C25.635839,18.577169 25.2216678,18.4915544 24.392628,18.4915544 Z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
