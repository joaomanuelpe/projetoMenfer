import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Calendar, PieChart, BarChart3, Target } from 'lucide-react';
import DespesaService from '../service/DespesaService.js';
import OficinaService from '../service/OficinaService.js';
import MultaService from '../service/MultaService.js';

const DashboardFinanceiroPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    despesas: [],
    oficina: [],
    multas: [],
    loading: true
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

      setDashboardData({
        despesas,
        oficina,
        multas,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getFinancialSummary = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // Despesas
    const despesasAPagar = dashboardData.despesas.filter(d => d.status !== 'QUITADO');
    const despesasPagas = dashboardData.despesas.filter(d => d.status === 'QUITADO');
    const despesasVencidas = dashboardData.despesas.filter(d => {
      const vencimento = new Date(d.dataVencimento);
      return d.status !== 'QUITADO' && vencimento < hoje;
    });
    const despesasMesAtual = dashboardData.despesas.filter(d => {
      const data = new Date(d.dataVencimento);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });

    // Oficina
    const oficinaTotal = dashboardData.oficina.reduce((total, item) => total + item.valor, 0);
    const oficinaMesAtual = dashboardData.oficina.filter(o => {
      const data = new Date(o.data);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });

    // Multas
    const multasTotal = dashboardData.multas.reduce((total, item) => total + item.valor, 0);
    const multasMesAtual = dashboardData.multas.filter(m => {
      const data = new Date(m.vencimento);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });

    return {
      despesas: {
        aPagar: despesasAPagar.reduce((total, d) => total + (d.valor || 0), 0),
        pagas: despesasPagas.reduce((total, d) => total + (d.valor || 0), 0),
        vencidas: despesasVencidas.reduce((total, d) => total + (d.valor || 0), 0),
        mesAtual: despesasMesAtual.reduce((total, d) => total + (d.valor || 0), 0),
        quantidade: {
          aPagar: despesasAPagar.length,
          vencidas: despesasVencidas.length,
          total: dashboardData.despesas.length
        }
      },
      oficina: {
        total: oficinaTotal,
        mesAtual: oficinaMesAtual.reduce((total, o) => total + o.valor, 0),
        quantidade: dashboardData.oficina.length
      },
      multas: {
        total: multasTotal,
        mesAtual: multasMesAtual.reduce((total, m) => total + m.valor, 0),
        quantidade: dashboardData.multas.length
      }
    };
  };

  const getTopVeiculos = () => {
    const veiculosOficina = {};
    dashboardData.oficina.forEach(item => {
      if (!veiculosOficina[item.placa]) {
        veiculosOficina[item.placa] = 0;
      }
      veiculosOficina[item.placa] += item.valor;
    });

    return Object.entries(veiculosOficina)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getProximosVencimentos = () => {
    const hoje = new Date();
    const proximosDias = new Date();
    proximosDias.setDate(hoje.getDate() + 7);

    return dashboardData.despesas
      .filter(d => {
        const vencimento = new Date(d.dataVencimento);
        return d.status !== 'QUITADO' && vencimento >= hoje && vencimento <= proximosDias;
      })
      .sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento))
      .slice(0, 5);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const summary = getFinancialSummary();
  const topVeiculos = getTopVeiculos();
  const proximosVencimentos = getProximosVencimentos();

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
            <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
          </div>
          <div className="text-sm">
            Atualizado em: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total a Pagar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.despesas.aPagar)}</p>
                <p className="text-xs text-gray-500">{summary.despesas.quantidade.aPagar} contas</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </div>

          {/* Total Pago */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.despesas.pagas)}</p>
                <p className="text-xs text-gray-500">Este mês</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          {/* Gastos Oficina */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Oficina Total</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.oficina.total)}</p>
                <p className="text-xs text-gray-500">{summary.oficina.quantidade} serviços</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          {/* Multas */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Multas Total</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(summary.multas.total)}</p>
                <p className="text-xs text-gray-500">{summary.multas.quantidade} multas</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Alertas */}
        {(summary.despesas.quantidade.vencidas > 0 || proximosVencimentos.length > 0) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Alertas Importantes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.despesas.quantidade.vencidas > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800">Contas Vencidas</h4>
                  <p className="text-red-600">
                    {summary.despesas.quantidade.vencidas} conta(s) vencida(s)
                  </p>
                  <p className="text-sm text-red-500">
                    Total: {formatCurrency(summary.despesas.vencidas)}
                  </p>
                </div>
              )}

              {proximosVencimentos.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800">Próximos Vencimentos</h4>
                  <p className="text-yellow-600">
                    {proximosVencimentos.length} conta(s) vencem em 7 dias
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gráficos e Dados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resumo Mensal */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumo do Mês Atual
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-gray-700">Despesas</span>
                <span className="font-bold text-red-600">{formatCurrency(summary.despesas.mesAtual)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Oficina</span>
                <span className="font-bold text-blue-600">{formatCurrency(summary.oficina.mesAtual)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-gray-700">Multas</span>
                <span className="font-bold text-orange-600">{formatCurrency(summary.multas.mesAtual)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <span className="font-bold text-gray-700">Total do Mês</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(summary.despesas.mesAtual + summary.oficina.mesAtual + summary.multas.mesAtual)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Veículos - Gastos Oficina */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Top 5 Veículos - Gastos Oficina
            </h3>
            
            <div className="space-y-3">
              {topVeiculos.length > 0 ? (
                topVeiculos.map(([placa, valor], index) => (
                  <div key={placa} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700">{placa}</span>
                    </div>
                    <span className="font-bold text-blue-600">{formatCurrency(valor)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum dado de oficina disponível</p>
              )}
            </div>
          </div>
        </div>

        {/* Próximos Vencimentos */}
        {proximosVencimentos.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Vencimentos (7 dias)
            </h3>
            
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proximosVencimentos.map((despesa, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(despesa.dataVencimento).toLocaleDateString('pt-BR')}
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

export default DashboardFinanceiroPage;