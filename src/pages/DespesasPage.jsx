import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, X, Calendar, DollarSign, FileText, CreditCard } from 'lucide-react';
import DespesaService from '../service/DespesaService.js';

const initialFormState = {
  dataVencimento: '',
  empresa: '',
  descricao: '',
  valor: '',
  notaFiscal: '',
  numeroboleto: '',
  dataPagamento: '',
  status: 'A_VENCER',
  meioPagamento: '',
  recorrente: false,
  quantidadeParcelas: 1,
  observacoes: ''
};

const DespesasPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('A_PAGAR');
  const [despesas, setDespesas] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showParcelamento, setShowParcelamento] = useState(false);
  const service = new DespesaService();

  const statusConfig = {
    'A_VENCER': { label: 'A Vencer', color: 'bg-gray-100 text-gray-800', bgColor: 'bg-white' },
    'QUITADO': { label: 'Quitado', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    'VENCIDO': { label: 'Vencido', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' }
  };

  const meiosPagamento = [
    'ITAU',
    'BRADESCO', 
    'PIX',
    'PAGAMENTO_TITULO'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const despesaData = {
        ...formData,
        valor: formData.valor ? parseFloat(formData.valor.replace(',', '.')) : 0
      };

      if (isEditing) {
        const res = await service.update(despesaData);
        if (res.status === 200) {
          alert('Despesa atualizada com sucesso!');
          resetForm();
          fetchDespesas();
        } else {
          alert(`Erro ao atualizar despesa: ${res.message}`);
        }
      } else {
        // Se é recorrente, criar múltiplas parcelas
        if (formData.recorrente && formData.quantidadeParcelas > 1) {
          await criarDespesasRecorrentes(despesaData);
        } else {
          const res = await service.insert(despesaData);
          if (res.status === 200) {
            alert('Despesa cadastrada com sucesso!');
            resetForm();
            fetchDespesas();
          } else {
            alert(`Erro ao cadastrar despesa: ${res.message}`);
          }
        }
      }
    } catch (error) {
      alert(`Erro ao processar despesa: ${error.message}`);
    }
  };

  const criarDespesasRecorrentes = async (despesaBase) => {
    try {
      const dataBase = new Date(despesaBase.dataVencimento);
      const valorParcela = despesaBase.valor / despesaBase.quantidadeParcelas;
      
      for (let i = 0; i < despesaBase.quantidadeParcelas; i++) {
        const dataVencimento = new Date(dataBase);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);
        
        const despesaParcela = {
          ...despesaBase,
          dataVencimento: dataVencimento.toISOString().split('T')[0],
          valor: valorParcela,
          descricao: `${despesaBase.descricao} - Parcela ${i + 1}/${despesaBase.quantidadeParcelas}`,
          numeroboleto: `${despesaBase.numeroboleto}-${String(i + 1).padStart(2, '0')}`
        };
        
        await service.insert(despesaParcela);
      }
      
      alert(`${despesaBase.quantidadeParcelas} parcelas criadas com sucesso!`);
      resetForm();
      fetchDespesas();
    } catch (error) {
      alert(`Erro ao criar despesas recorrentes: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setShowParcelamento(false);
  };

  const handleEdit = (despesa) => {
    setFormData({
      ...despesa,
      valor: despesa.valor.toString().replace('.', ',')
    });
    setIsEditing(true);
    setEditingId(despesa.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        const res = await service.delete(id);
        if (res.status === 200) {
          alert('Despesa excluída com sucesso!');
          fetchDespesas();
        } else {
          alert(`Erro ao excluir despesa: ${res.message}`);
        }
      } catch (error) {
        alert(`Erro ao excluir despesa: ${error.message}`);
      }
    }
  };

  const handlePagar = async (despesa) => {
    const dataPagamento = prompt('Data do pagamento (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    const meioPagamento = prompt('Meio de pagamento:', 'PIX');
    
    if (dataPagamento && meioPagamento) {
      try {
        const despesaAtualizada = {
          ...despesa,
          dataPagamento,
          meioPagamento,
          status: 'QUITADO'
        };
        
        const res = await service.update(despesaAtualizada);
        if (res.status === 200) {
          alert('Despesa quitada com sucesso!');
          fetchDespesas();
        } else {
          alert(`Erro ao quitar despesa: ${res.message}`);
        }
      } catch (error) {
        alert(`Erro ao quitar despesa: ${error.message}`);
      }
    }
  };

  const fetchDespesas = async () => {
    try {
      const data = await service.get();
      setDespesas(data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  };

  const getFilteredDespesas = () => {
    const hoje = new Date().toISOString().split('T')[0];
    
    return despesas.map(despesa => {
      let status = despesa.status;
      
      // Atualizar status automaticamente se vencido
      if (status === 'A_VENCER' && despesa.dataVencimento < hoje) {
        status = 'VENCIDO';
      }
      
      return { ...despesa, status };
    }).filter(despesa => {
      if (activeTab === 'A_PAGAR') {
        return despesa.status === 'A_VENCER' || despesa.status === 'VENCIDO';
      } else {
        return despesa.status === 'QUITADO';
      }
    });
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

  useEffect(() => {
    fetchDespesas();
  }, []);

  const filteredDespesas = getFilteredDespesas();

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
            <h1 className="text-2xl font-bold">Despesas Menferlog</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Despesa
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('A_PAGAR')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'A_PAGAR'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contas a Pagar ({filteredDespesas.length})
              </button>
              <button
                onClick={() => setActiveTab('PAGAS')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'PAGAS'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contas Pagas
              </button>
            </nav>
          </div>
        </div>

        {/* Formulário Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
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
                      Data de Vencimento *
                    </label>
                    <input
                      type="date"
                      name="dataVencimento"
                      value={formData.dataVencimento}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <input
                      type="text"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Descrição da despesa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor
                    </label>
                    <input
                      type="text"
                      name="valor"
                      value={formData.valor}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="0,00 (deixe vazio se não souber)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nota Fiscal Nº
                    </label>
                    <input
                      type="text"
                      name="notaFiscal"
                      value={formData.notaFiscal}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Número da nota fiscal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Boleto Nº
                    </label>
                    <input
                      type="text"
                      name="numeroboleto"
                      value={formData.numeroboleto}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="01/01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meio de Pagamento
                    </label>
                    <select
                      name="meioPagamento"
                      value={formData.meioPagamento}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="">Selecione...</option>
                      {meiosPagamento.map(meio => (
                        <option key={meio} value={meio}>{meio}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="recorrente"
                          checked={formData.recorrente}
                          onChange={handleInputChange}
                          className="rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Despesa recorrente</span>
                      </label>
                      
                      {formData.recorrente && (
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-700">Parcelas:</label>
                          <input
                            type="number"
                            name="quantidadeParcelas"
                            value={formData.quantidadeParcelas}
                            onChange={handleInputChange}
                            min="1"
                            max="12"
                            className="w-20 rounded-md border border-gray-300 px-2 py-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Observações adicionais"
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

        {/* Lista de Despesas */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NF/Boleto
                  </th>
                  {activeTab === 'PAGAS' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pagamento
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDespesas.map((despesa, index) => (
                  <tr 
                    key={despesa.id || index} 
                    className={`${statusConfig[despesa.status]?.bgColor || 'bg-white'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(despesa.dataVencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {despesa.empresa}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {despesa.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {despesa.valor ? formatCurrency(despesa.valor) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[despesa.status]?.color}`}>
                        {statusConfig[despesa.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {despesa.notaFiscal && <div>NF: {despesa.notaFiscal}</div>}
                        {despesa.numeroboleto && <div>Boleto: {despesa.numeroboleto}</div>}
                      </div>
                    </td>
                    {activeTab === 'PAGAS' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {despesa.dataPagamento && <div>{formatDate(despesa.dataPagamento)}</div>}
                          {despesa.meioPagamento && <div className="text-xs text-gray-500">{despesa.meioPagamento}</div>}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(despesa)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(despesa.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {activeTab === 'A_PAGAR' && despesa.status !== 'QUITADO' && (
                          <button
                            onClick={() => handlePagar(despesa)}
                            className="text-green-600 hover:text-green-800"
                            title="Marcar como pago"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDespesas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma despesa encontrada.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DespesasPage;