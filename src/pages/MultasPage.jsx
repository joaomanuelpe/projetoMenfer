import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, X, AlertTriangle, Calendar, Car } from 'lucide-react';
import MultaService from '../service/MultaService.js';

const initialFormState = {
  vencimento: '',
  placa: '',
  numeroAutoInfracao: '',
  orgaoAutuador: '',
  dataInfracao: '',
  valor: '',
  motorista: ''
};

const MultasPage = () => {
  const navigate = useNavigate();
  const [multas, setMultas] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterMotorista, setFilterMotorista] = useState('');
  const service = new MultaService();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const multaData = {
        ...formData,
        valor: parseFloat(formData.valor.replace(',', '.')) || 0
      };

      if (isEditing) {
        const res = await service.update(multaData);
        if (res.status === 200) {
          alert('Multa atualizada com sucesso!');
          resetForm();
          fetchMultas();
        } else {
          alert(`Erro ao atualizar multa: ${res.message}`);
        }
      } else {
        const res = await service.insert(multaData);
        if (res.status === 200) {
          alert('Multa registrada com sucesso!');
          resetForm();
          fetchMultas();
        } else {
          alert(`Erro ao registrar multa: ${res.message}`);
        }
      }
    } catch (error) {
      alert(`Erro ao processar multa: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (multa) => {
    setFormData({
      ...multa,
      valor: multa.valor.toString().replace('.', ',')
    });
    setIsEditing(true);
    setEditingId(multa.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta multa?')) {
      try {
        const res = await service.delete(id);
        if (res.status === 200) {
          alert('Multa excluída com sucesso!');
          fetchMultas();
        } else {
          alert(`Erro ao excluir multa: ${res.message}`);
        }
      } catch (error) {
        alert(`Erro ao excluir multa: ${error.message}`);
      }
    }
  };

  const fetchMultas = async () => {
    try {
      const data = await service.get();
      setMultas(data);
    } catch (error) {
      console.error('Erro ao buscar multas:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getFilteredMultas = () => {
    return multas.filter(multa => {
      const matchPlaca = !filterPlaca || multa.placa.toLowerCase().includes(filterPlaca.toLowerCase());
      const matchMotorista = !filterMotorista || multa.motorista.toLowerCase().includes(filterMotorista.toLowerCase());
      return matchPlaca && matchMotorista;
    });
  };

  const getTotalMultas = () => {
    return getFilteredMultas().reduce((total, multa) => total + multa.valor, 0);
  };

  const getMultasPorPlaca = () => {
    const contagem = {};
    getFilteredMultas().forEach(multa => {
      contagem[multa.placa] = (contagem[multa.placa] || 0) + 1;
    });
    return contagem;
  };

  const getMultasPorMotorista = () => {
    const contagem = {};
    getFilteredMultas().forEach(multa => {
      contagem[multa.motorista] = (contagem[multa.motorista] || 0) + 1;
    });
    return contagem;
  };

  const isMultaVencida = (vencimento) => {
    const hoje = new Date();
    const dataVencimento = new Date(vencimento);
    return dataVencimento < hoje;
  };

  useEffect(() => {
    fetchMultas();
  }, []);

  const filteredMultas = getFilteredMultas();
  const multasPorPlaca = getMultasPorPlaca();
  const multasPorMotorista = getMultasPorMotorista();

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/financeiro')}
              className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Controle de Multas</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Multa
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total em Multas</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalMultas())}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantidade</h3>
            <p className="text-2xl font-bold text-orange-600">{filteredMultas.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Veículos</h3>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(multasPorPlaca).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Motoristas</h3>
            <p className="text-2xl font-bold text-green-600">{Object.keys(multasPorMotorista).length}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Placa
              </label>
              <input
                type="text"
                value={filterPlaca}
                onChange={(e) => setFilterPlaca(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Digite a placa..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Motorista
              </label>
              <input
                type="text"
                value={filterMotorista}
                onChange={(e) => setFilterMotorista(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Digite o nome do motorista..."
              />
            </div>
          </div>
        </div>

        {/* Formulário Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Editar Multa' : 'Nova Multa'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vencimento *
                    </label>
                    <input
                      type="date"
                      name="vencimento"
                      value={formData.vencimento}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa *
                    </label>
                    <input
                      type="text"
                      name="placa"
                      value={formData.placa}
                      onChange={handleInputChange}
                      required
                      maxLength="8"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="ABC-1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº Auto de Infração *
                    </label>
                    <input
                      type="text"
                      name="numeroAutoInfracao"
                      value={formData.numeroAutoInfracao}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Número da autuação"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Órgão Autuador *
                    </label>
                    <input
                      type="text"
                      name="orgaoAutuador"
                      value={formData.orgaoAutuador}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="PRF, DETRAN, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data da Infração *
                    </label>
                    <input
                      type="date"
                      name="dataInfracao"
                      value={formData.dataInfracao}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor *
                    </label>
                    <input
                      type="text"
                      name="valor"
                      value={formData.valor}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="0,00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motorista *
                    </label>
                    <input
                      type="text"
                      name="motorista"
                      value={formData.motorista}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Nome do motorista responsável"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    {isEditing ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Multas */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Multas Registradas ({filteredMultas.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nº Auto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Órgão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Infração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motorista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMultas.map((multa, index) => (
                  <tr 
                    key={multa.id || index} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                      isMultaVencida(multa.vencimento) ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {formatDate(multa.vencimento)}
                        {isMultaVencida(multa.vencimento) && (
                          <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {multa.placa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {multa.numeroAutoInfracao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {multa.orgaoAutuador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(multa.dataInfracao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(multa.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {multa.motorista}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(multa)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(multa.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMultas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma multa encontrada.
              </div>
            )}
          </div>
        </div>

        {/* Resumos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Resumo por Placa */}
          {Object.keys(multasPorPlaca).length > 0 && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Multas por Veículo
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-2">
                  {Object.entries(multasPorPlaca)
                    .sort(([,a], [,b]) => b - a)
                    .map(([placa, quantidade]) => (
                      <div key={placa} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium">{placa}</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                          {quantidade} multa{quantidade > 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Resumo por Motorista */}
          {Object.keys(multasPorMotorista).length > 0 && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Multas por Motorista</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-2">
                  {Object.entries(multasPorMotorista)
                    .sort(([,a], [,b]) => b - a)
                    .map(([motorista, quantidade]) => (
                      <div key={motorista} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium">{motorista}</span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                          {quantidade} multa{quantidade > 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MultasPage;