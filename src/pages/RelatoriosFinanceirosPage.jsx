import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Filter, Calendar, Search, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import DespesaService from '../service/DespesaService.js';
import OficinaService from '../service/OficinaService.js';
import MultaService from '../service/MultaService.js';

const RelatoriosFinanceirosPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('GERAL');
  const [data, setData] = useState({
    despesas: [],
    oficina: [],
    multas: [],
    loading: true
  });
  
  const [filters, setFilters] = useState({
    dataInicio: '',
    dataFim: '',
    empresa: '',
    placa: '',
    motorista: '',
    status: ''
  });

  const despesaService = new DespesaService();
  const oficinaService = new OficinaService();
  const multaService = new MultaService();

  const fetchAllData = async () => {
    try {
      const [despesas, oficina, multas] = await Promise.all([
        despesaService.get(),
        oficinaService.get(),
        multaService.get()
      ]);

      setData({
        despesas,
        oficina,
        multas,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setData(prev => ({ ...prev, loading: false }));
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dataInicio: '',
      dataFim: '',
      empresa: '',
      placa: '',
      motorista: '',
      status: ''
    });
  };

  const getFilteredData = () => {
    const { dataInicio, dataFim, empresa, placa, motorista, status } = filters;

    const filterByDate = (item, dateField) => {
      if (!dataInicio && !dataFim) return true;
      const itemDate = new Date(item[dateField]);
      const inicio = dataInicio ? new Date(dataInicio) : new Date('1900-01-01');
      const fim = dataFim ? new Date(dataFim) : new Date('2100-12-31');
      return itemDate >= inicio && itemDate <= fim;
    };

    const filteredDespesas = data.despesas.filter(item => {
      return filterByDate(item, 'dataVencimento') &&
             (!empresa || item.empresa.toLowerCase().includes(empresa.toLowerCase())) &&
             (!status || item.status === status);
    });

    const filteredOficina = data.oficina.filter(item => {
      return filterByDate(item, 'data') &&
             (!placa || item.placa.toLowerCase().includes(placa.toLowerCase()));
    });

    const filteredMultas = data.multas.filter(item => {
      return filterByDate(item, 'vencimento') &&
             (!placa || item.placa.toLowerCase().includes(placa.toLowerCase())) &&
             (!motorista || item.motorista.toLowerCase().includes(motorista.toLowerCase()));
    });

    return {
      despesas: filteredDespesas,
      oficina: filteredOficina,
      multas: filteredMultas
    };
  };

  const getResumoGeral = () => {
    const filtered = getFilteredData();
    
    const totalDespesas = filtered.despesas.reduce((total, item) => total + (item.valor || 0), 0);
    const totalOficina = filtered.oficina.reduce((total, item) => total + item.valor, 0);
    const totalMultas = filtered.multas.reduce((total, item) => total + item.valor, 0);
    
    const despesasPagas = filtered.despesas.filter(d => d.status === 'QUITADO');
    const despesasAPagar = filtered.despesas.filter(d => d.status !== 'QUITADO');
    const despesasVencidas = filtered.despesas.filter(d => {
      const hoje = new Date();
      const vencimento = new Date(d.dataVencimento);
      return d.status !== 'QUITADO' && vencimento < hoje;
    });

    return {
      totais: {
        despesas: totalDespesas,
        oficina: totalOficina,
        multas: totalMultas,
        geral: totalDespesas + totalOficina + totalMultas
      },
      quantidades: {
        despesas: filtered.despesas.length,
        oficina: filtered.oficina.length,
        multas: filtered.multas.length
      },
      despesasStatus: {
        pagas: {
          quantidade: despesasPagas.length,
          valor: despesasPagas.reduce((total, d) => total + (d.valor || 0), 0)
        },
        aPagar: {
          quantidade: despesasAPagar.length,
          valor: despesasAPagar.reduce((total, d) => total + (d.valor || 0), 0)
        },
        vencidas: {
          quantidade: despesasVencidas.length,
          valor: despesasVencidas.reduce((total, d) => total + (d.valor || 0), 0)
        }
      }
    };
  };

  const exportToCSV = (tabData, filename) => {
    let csvContent = '';
    
    if (activeTab === 'DESPESAS') {
      csvContent = 'Data Vencimento,Empresa,Descrição,Valor,Status,Nota Fiscal,Boleto,Data Pagamento,Meio Pagamento\n';
      tabData.forEach(item => {
        csvContent += `${formatDate(item.dataVencimento)},${item.empresa},"${item.descricao}",${item.valor || 0},${item.status},${item.notaFiscal || ''},${item.numeroboleto || ''},${formatDate(item.dataPagamento)},${item.meioPagamento || ''}\n`;
      });
    } else if (activeTab === 'OFICINA') {
      csvContent = 'Data,OS Número,Placa,Valor\n';
      tabData.forEach(item => {
        csvContent += `${formatDate(item.data)},${item.osNumero},${item.placa},${item.valor}\n`;
      });
    } else if (activeTab === 'MULTAS') {
      csvContent = 'Vencimento,Placa,Nº Auto Infração,Órgão Autuador,Data Infração,Valor,Motorista\n';
      tabData.forEach(item => {
        csvContent += `${formatDate(item.vencimento)},${item.placa},${item.numeroAutoInfracao},${item.orgaoAutuador},${formatDate(item.dataInfracao)},${item.valor},${item.motorista}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (data.loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();
  const resumo = getResumoGeral();

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
            <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Início
              </label>
              <input
                type="date"
                name="dataInicio"
                value={filters.dataInicio}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                name="dataFim"
                value={filters.dataFim}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <input
                type="text"
                name="empresa"
                value={filters.empresa}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Filtrar por empresa..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa
              </label>
              <input
                type="text"
                name="placa"
                value={filters.placa}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Filtrar por placa..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motorista
              </label>
              <input
                type="text"
                name="motorista"
                value={filters.motorista}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Filtrar por motorista..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status (Despesas)
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Todos</option>
                <option value="A_VENCER">A Vencer</option>
                <option value="QUITADO">Quitado</option>
                <option value="VENCIDO">Vencido</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-3"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['GERAL', 'DESPESAS', 'OFICINA', 'MULTAS'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'GERAL' ? 'Resumo Geral' : 
                   tab === 'DESPESAS' ? 'Despesas Menferlog' :
                   tab === 'OFICINA' ? 'Oficina Stardiesel' : 'Multas'}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'GERAL' && (
          <div className="space-y-8">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Despesas</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(resumo.totais.despesas)}</p>
                    <p className="text-xs text-gray-500">{resumo.quantidades.despesas} registros</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Oficina</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(resumo.totais.oficina)}</p>
                    <p className="text-xs text-gray-500">{resumo.quantidades.oficina} serviços</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Multas</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(resumo.totais.multas)}</p>
                    <p className="text-xs text-gray-500">{resumo.quantidades.multas} multas</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Geral</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totais.geral)}</p>
                    <p className="text-xs text-gray-500">Todos os gastos</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Detalhamento das Despesas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalhamento das Despesas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800">Contas Pagas</h4>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(resumo.despesasStatus.pagas.valor)}</p>
                  <p className="text-sm text-green-600">{resumo.despesasStatus.pagas.quantidade} conta(s)</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800">Contas a Pagar</h4>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(resumo.despesasStatus.aPagar.valor)}</p>
                  <p className="text-sm text-yellow-600">{resumo.despesasStatus.aPagar.quantidade} conta(s)</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800">Contas Vencidas</h4>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(resumo.despesasStatus.vencidas.valor)}</p>
                  <p className="text-sm text-red-600">{resumo.despesasStatus.vencidas.quantidade} conta(s)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DESPESAS' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Relatório de Despesas ({filteredData.despesas.length})
              </h3>
              <button
                onClick={() => exportToCSV(filteredData.despesas, 'relatorio-despesas.csv')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
            
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.despesas.map((despesa, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(despesa.dataVencimento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {despesa.empresa}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {despesa.descricao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {despesa.valor ? formatCurrency(despesa.valor) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          despesa.status === 'QUITADO' ? 'bg-green-100 text-green-800' :
                          despesa.status === 'VENCIDO' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {despesa.status === 'QUITADO' ? 'Quitado' :
                           despesa.status === 'VENCIDO' ? 'Vencido' : 'A Vencer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {despesa.notaFiscal && <div>NF: {despesa.notaFiscal}</div>}
                          {despesa.numeroboleto && <div>Boleto: {despesa.numeroboleto}</div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'OFICINA' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Relatório de Oficina ({filteredData.oficina.length})
              </h3>
              <button
                onClick={() => exportToCSV(filteredData.oficina, 'relatorio-oficina.csv')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      O.S. Nº
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.oficina.map((servico, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(servico.data)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {servico.osNumero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {servico.placa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(servico.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'MULTAS' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Relatório de Multas ({filteredData.multas.length})
              </h3>
              <button
                onClick={() => exportToCSV(filteredData.multas, 'relatorio-multas.csv')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.multas.map((multa, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(multa.vencimento)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(multa.valor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {multa.motorista}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RelatoriosFinanceirosPage;