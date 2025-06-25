import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Receipt, AlertTriangle, ArrowLeft, Calculator, FileSpreadsheet } from 'lucide-react';

const FinanceiroPage = () => {
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
            <h1 className="text-2xl font-bold">Controle Financeiro</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Despesas Menferlog */}
          <div 
            className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden"
            onClick={() => navigate('/despesas')}
          >
            <div className="bg-orange-500 h-2"></div>
            <div className="p-8">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Despesas Menferlog</h2>
              <p className="text-center text-gray-600">
                Controle de contas a pagar e pagas
              </p>
            </div>
          </div>

          {/* Oficina Stardiesel */}
          <div 
            className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden"
            onClick={() => navigate('/oficina')}
          >
            <div className="bg-blue-600 h-2"></div>
            <div className="p-8">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Oficina Stardiesel</h2>
              <p className="text-center text-gray-600">
                Controle de despesas por veículo
              </p>
            </div>
          </div>

          {/* Multas */}
          <div 
            className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden"
            onClick={() => navigate('/multas')}
          >
            <div className="bg-red-500 h-2"></div>
            <div className="p-8">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Multas</h2>
              <p className="text-center text-gray-600">
                Registro e controle de multas
              </p>
            </div>
          </div>

          {/* Relatórios Financeiros */}
          <div 
            className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden"
            onClick={() => navigate('/relatorios-financeiros')}
          >
            <div className="bg-green-500 h-2"></div>
            <div className="p-8">
              <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Relatórios</h2>
              <p className="text-center text-gray-600">
                Relatórios e análises financeiras
              </p>
            </div>
          </div>

          {/* Dashboard Financeiro */}
          <div 
            className="transform hover:scale-105 transition-transform cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden"
            onClick={() => navigate('/dashboard-financeiro')}
          >
            <div className="bg-purple-500 h-2"></div>
            <div className="p-8">
              <Calculator className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h2 className="text-center font-bold text-2xl text-gray-800 mb-2">Dashboard</h2>
              <p className="text-center text-gray-600">
                Visão geral das finanças
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceiroPage;