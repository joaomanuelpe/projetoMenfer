import React, { useState } from 'react';
import { FileText, TruckIcon, ArrowLeft, Plus, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { columnDefinitions } from '../utils/DefinicaoColuna';
import Table from './Table';
import { initialData } from '../utils/DataInicial';

function TablePage() {
  const [data, setData] = useState(initialData);
  const navigate = useNavigate();
  
  const handleDataChange = (newData) => {
    setData(newData);
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleSave = () => {
    // Implement save functionality here
    console.log('Saving data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-lg">
          <div className="p-4 md:p-6 border-b border-orange-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center">
                <TruckIcon className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Sistema de Gestão Logística</h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">Clique em qualquer célula para editar seu conteúdo</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSave} 
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
              >
                <Database className="h-4 w-4 mr-2" />
                <span>Salvar</span>
              </button>
              <button 
                onClick={handleAddRow}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Nova Linha</span>
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table 
            columns={columnDefinitions} 
            data={data}
            onDataChange={handleDataChange}
          />
        </div>
        
        <div className="bg-orange-50 border-t border-orange-200">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <p className="text-sm text-orange-700">
              Clique em uma célula para editar, clique fora para salvar
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Quitado</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Vencido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TablePage;