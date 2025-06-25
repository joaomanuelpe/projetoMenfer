import React, { useState, useEffect } from 'react';
import { FileText, TruckIcon, ArrowLeft, Plus, Database, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getColumnDefinitions } from '../utils/DefinicaoColuna';
import Table from './Table';
import { initialData } from '../utils/DataInicial';
import EmpresaService from '../service/EmpresaService.js';
import MotoristaService from '../service/MotoristaService.js';
import ViagemService from '../service/ViagemService.js';

function TablePage() {
  const [data, setData] = useState(initialData);
  const [originalData, setOriginalData] = useState(initialData);
  const [empresas, setEmpresas] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [columnDefinitions, setColumnDefinitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const navigate = useNavigate();
  
  const empresaService = new EmpresaService();
  const motoristaService = new MotoristaService();
  const viagemService = new ViagemService();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load empresas and motoristas in parallel
        const [empresasData, motoristasData] = await Promise.all([
          empresaService.get(),
          motoristaService.get()
        ]);
        
        // Process empresas
        const empresasOptions = empresasData.map(empresa => empresa.razaoSocial);
        setEmpresas(empresasOptions);
        
        // Process motoristas - using the name field from the JSON structure
        const motoristasOptions = motoristasData.map(motorista => motorista.name);
        setMotoristas(motoristasOptions);
        
        // Update column definitions with both options
        setColumnDefinitions(getColumnDefinitions(empresasOptions, motoristasOptions));
        
        // Load existing viagens
        const viagensData = await viagemService.get();
        if (viagensData && viagensData.length > 0) {
          const formattedData = viagensData.map(viagem => convertBackendToFrontend(viagem));
          setData(formattedData);
          setOriginalData(JSON.parse(JSON.stringify(formattedData)));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Fallback to empty options if API fails
        setColumnDefinitions(getColumnDefinitions([], []));
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [data, originalData]);

  // Warn before leaving page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
        return 'Você tem alterações não salvas. Deseja realmente sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Convert backend data to frontend format
  const convertBackendToFrontend = (viagem) => {
    // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Helper function to format time from HH:MM:SS to HH:MM
    const formatTime = (timeString) => {
      if (!timeString) return '';
      // If it's already in HH:MM format, return as is
      if (timeString.length === 5) return timeString;
      // If it's in HH:MM:SS format, remove seconds
      return timeString.substring(0, 5);
    };

    return {
      empresa: viagem.empresa || '',
      data: formatDate(viagem.data),
      cte: viagem.cte || '',
      peso: viagem.peso || '',
      numeroContainer: viagem.numContainer || '',
      tamanhoContainer: viagem.tamContainer || '',
      tipoContainer: viagem.tipoContainer || '',
      placaCavalo: viagem.placaCavalo || '',
      placaReboque: viagem.placaReboque || '',
      motorista: viagem.motorista || '',
      origem: viagem.origem || '',
      destino: viagem.destino || '',
      entrega: formatDate(viagem.entrega),
      horaChegada: formatTime(viagem.horaDeChegada),
      horaSaida: formatTime(viagem.horaDeSaida),
      tipoOperacao: viagem.tipoDeOperacao || '',
      valePedagio: viagem.valePedagio && viagem.valorPedagio ? `SIM:${viagem.valorPedagio}` : viagem.valePedagio ? 'SIM' : 'NÃO',
      adiantamento: viagem.adiantamento || '',
      saldo: viagem.saldo || '',
      antecipacaoTerminal: viagem.antecipacaoTerm && viagem.valorTerminal ? `SIM:${viagem.valorTerminal}` : viagem.antecipacaoTerm ? 'SIM' : 'NÃO',
      estadia: viagem.estadia && viagem.valorEstadia ? `SIM:${viagem.valorEstadia}` : viagem.estadia ? 'SIM' : 'NÃO',
      fatura: viagem.numeroFatur || '',
      pagamento: formatDate(viagem.diaPgto),
      status: viagem.status || ''
    };
  };

  // Convert frontend data to backend format
  const convertFrontendToBackend = (row) => {
    // Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD
    const formatDateForBackend = (dateString) => {
      if (!dateString) return null;
      
      // If it's already in YYYY-MM-DD format, return as is
      if (dateString.includes('-') && dateString.length === 10) return dateString;
      
      // Convert from DD/MM/YYYY to YYYY-MM-DD
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      return dateString;
    };

    const parseConditionalValue = (value) => {
      if (!value) return { flag: false, valor: null };
      if (value.includes(':')) {
        const [flag, valor] = value.split(':');
        return { flag: flag === 'SIM', valor: parseFloat(valor) || 0 };
      }
      return { flag: value === 'SIM', valor: null };
    };

    const valePedagio = parseConditionalValue(row.valePedagio);
    const antecipacao = parseConditionalValue(row.antecipacaoTerminal);
    const estadia = parseConditionalValue(row.estadia);

    return {
      empresa: row.empresa || '',
      data: formatDateForBackend(row.data),
      cte: row.cte || '',
      peso: parseFloat(row.peso) || 0,
      numContainer: row.numeroContainer || '',
      tamContainer: parseFloat(row.tamanhoContainer) || 0,
      tipoContainer: row.tipoContainer || '',
      placaCavalo: row.placaCavalo || '',
      placaReboque: row.placaReboque || '',
      motorista: row.motorista || '',
      origem: row.origem || '',
      destino: row.destino || '',
      entrega: formatDateForBackend(row.entrega),
      horaDeChegada: row.horaChegada || null,
      horaDeSaida: row.horaSaida || null,
      tipoDeOperacao: row.tipoOperacao || '',
      valePedagio: valePedagio.flag,
      valorPedagio: valePedagio.valor,
      adiantamento: parseFloat(row.adiantamento) || 0,
      saldo: parseFloat(row.saldo) || 0,
      antecipacaoTerm: antecipacao.flag,
      valorTerminal: antecipacao.valor,
      estadia: estadia.flag,
      valorEstadia: estadia.valor,
      numeroFatur: parseFloat(row.fatura) || 0,
      diaPgto: formatDateForBackend(row.pagamento),
      status: row.status || ''
    };
  };
  
  const handleDataChange = (newData) => {
    setData(newData);
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Filter out empty rows and convert to backend format
      const validData = data
        .filter(row => Object.values(row).some(value => value && value.trim !== '' ? value.trim() : value))
        .map(row => convertFrontendToBackend(row));

      if (validData.length === 0) {
        alert('Não há dados válidos para salvar.');
        return;
      }

      // Save data array to backend
      await viagemService.insert(validData);
      
      // Update original data to match current data
      setOriginalData(JSON.parse(JSON.stringify(data)));
      
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleNavigateBack = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      navigate('/home');
    }
  };

  const handleConfirmLeave = () => {
    setShowUnsavedWarning(false);
    navigate('/home');
  };

  const handleCancelLeave = () => {
    setShowUnsavedWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="text-gray-600">Carregando dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Alterações não salvas</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Você tem alterações não salvas na tabela. Deseja realmente sair sem salvar?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar e Sair'}
              </button>
              <button
                onClick={handleConfirmLeave}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Sair sem Salvar
              </button>
              <button
                onClick={handleCancelLeave}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-lg">
          <div className="p-4 md:p-6 border-b border-orange-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleNavigateBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center">
                <TruckIcon className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Sistema de Gestão Logística</h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    Clique em qualquer célula para editar seu conteúdo
                    {hasUnsavedChanges && (
                      <span className="ml-2 text-yellow-600 font-medium">• Alterações não salvas</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  hasUnsavedChanges && !saving
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Database className="h-4 w-4 mr-2" />
                <span>{saving ? 'Salvando...' : 'Salvar'}</span>
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
              {hasUnsavedChanges && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Não salvo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TablePage;