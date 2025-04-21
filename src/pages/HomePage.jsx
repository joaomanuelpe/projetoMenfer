import React, { useEffect, useState } from "react";
import { Bell, UserPlus, Users, BadgeDollarSign, Fuel, ScrollText, FilePlus} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [verse, setVerse] = useState("");
  const [notifications, setNotifications] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const response = await fetch(
          "https://www.abibliadigital.com.br/api/verses/nvi/random", {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJXZWQgTWFyIDE5IDIwMjUgMTc6MzA6NDAgR01UKzAwMDAuYXJjZXN0aTE1QGdtYWlsLmNvbSIsImlhdCI6MTc0MjQwNTQ0MH0.4ebn3oh81wI0DEJud_Czm0KagyOYTd2TOHV_ArSxfX4'
          },
        }
        );
        const data = await response.json();
        setVerse(
          `${data.book.name} ${data.chapter}:${data.number} - ${data.text}`
        );
      } catch (error) {
        console.error("Erro ao buscar versículo:", error);
        setVerse("Não foi possível carregar o versículo do dia.");
      }
    };

    fetchVerse();
    setNotifications(3);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Menferlog</h1>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-xl gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="40"
                height="40"
                style={{ enableBackground: "new 0 0 512 512" }} // Correção do estilo
              >
                <g id="_x31_64_x2CAdd_x2CContact_x2CUser_x2CTwitter">
                  <g>
                    <path
                      d="M475.02,383.299v13.199H301v-13.199c0-39.58-17.42-75.08-45-99.27c23.23-20.381,53.68-32.741,87.01-32.741C415.92,251.289,475.02,310.389,475.02,383.299z"
                      fill="#40B3E2"
                    />
                  </g>
                  <g>
                    <path
                      d="M256,284.029c27.58,24.189,45,59.689,45,99.27v13.199h-90H36.98v-13.199c0-36.461,14.78-69.461,38.66-93.35c23.89-23.891,56.9-38.661,93.35-38.661C202.32,251.289,232.77,263.648,256,284.029z"
                      fill="#86DCFD"
                    />
                  </g>
                  <g>
                    <circle cx="343.01" cy="181.979" r="68.48" fill="#EABD8C" />
                  </g>
                  <g>
                    <circle cx="168.99" cy="181.979" r="68.48" fill="#FFD8A8" />
                  </g>
                </g>
              </svg>
              {user ? user.username : "Usuário Default"}
            </span>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center text-gray-700 italic text-xl">
            {verse || "Carregando versículo..."}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden"
            onClick={() => navigate("/cadastros")}
          >
            <div className="bg-orange-500 h-2"></div>
            <div className="p-6">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Cadastro
              </p>
            </div>
          </div>

          <div className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-orange-500 h-2"></div>
            <div className="p-6">
              <BadgeDollarSign className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Controle financeiro
              </p>
            </div>
          </div>

          <div className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <Bell className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Notificações
                <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                  {notifications}
                </span>
              </p>
            </div>
          </div>


          <div className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <Fuel className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Abastecimento
              </p>
            </div>
          </div>
          <div className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <ScrollText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Relatórios
              </p>
            </div>
          </div>
          <div className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Usuários
              </p>
            </div>
          </div>
          <div onClick={() => navigate("/docs")} className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <FilePlus className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Gerar documentos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
