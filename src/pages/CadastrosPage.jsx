import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, CarFront, ArrowLeft } from 'lucide-react';

const RegistrationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/home')}
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Cadastros</h1>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden" onClick={() => navigate('/motorista')}>
            <div className="bg-orange-500 h-2"></div>
            <div className="p-8">
              <Users className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Cadastro de Motoristas</h2>
              <p className="text-center text-gray-600">
                Registre novos motoristas
              </p>
            </div>
          </div>
          <div className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden" onClick={() => navigate('/empresa')}>
            <div className="bg-blue-600 h-2"></div>
            <div className="p-8">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Cadastro de Empresas</h2>
              <p className="text-center text-gray-600">
                Crie e gerencie empresas
              </p>
            </div>
          </div>
          <div className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden" onClick={() => navigate('/frota')}>
            <div className="bg-orange-500 h-2"></div>
            <div className="p-8">
              <CarFront className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Cadastro de Frota</h2>
              <p className="text-center text-gray-600">
                Adicione novos veículos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationsPage;