import React, { useEffect, useState } from "react";
import { Bell, UserPlus, Users, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [verse, setVerse] = useState("");
  const [notifications, setNotifications] = useState(0);
  const userName = "Nome do Usuário";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const response = await fetch(
          "https://www.abibliadigital.com.br/api/verses/nvi/random"
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
          <h1 className="text-2xl font-bold">Bem-vindo!</h1>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {userName}
            </span>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center text-gray-700 italic">
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
            <div className="bg-orange-500 h-2"></div>
            <div className="p-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Mensagens
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
          <div className="transform hover:scale-105 transition-transform bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <p className="text-center font-semibold text-gray-800 text-lg">
                Usuários
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
        </div>
      </main>
    </div>
  );
};

export default HomePage;
