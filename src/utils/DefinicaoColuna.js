export const getColumnDefinitions = (empresasOptions = [], motoristasOptions = []) => [
  {
    id: 'empresa',
    label: 'EMPRESA',
    type: 'select',
    options: empresasOptions,
    minWidth: '200px'
  },
  {
    id: 'data',
    label: 'DATA',
    type: 'date'
  },
  {
    id: 'cte',
    label: 'CTE',
    type: 'text'
  },
  {
    id: 'peso',
    label: 'PESO',
    type: 'text'
  },
  {
    id: 'numeroContainer',
    label: 'N° DE CONTAINER',
    type: 'text'
  },
  {
    id: 'tamanhoContainer',
    label: 'TAMANHO CONTAINER',
    type: 'select',
    options: ['20', '40']
  },
  {
    id: 'tipoContainer',
    label: 'TIPO DE CONTAINER',
    type: 'select',
    options: ['REEFER', 'HC', 'DRY']
  },
  {
    id: 'placaCavalo',
    label: 'PLACA CAVALO',
    type: 'text'
  },
  {
    id: 'placaReboque',
    label: 'PLACA REBOQUE',
    type: 'text'
  },
  {
    id: 'motorista',
    label: 'MOTORISTA',
    type: 'select',
    options: motoristasOptions,
    minWidth: '180px'
  },
  {
    id: 'origem',
    label: 'ORIGEM',
    type: 'text'
  },
  {
    id: 'destino',
    label: 'DESTINO',
    type: 'text'
  },
  {
    id: 'entrega',
    label: 'ENTREGA',
    type: 'date'
  },
  {
    id: 'horaChegada',
    label: 'HORA DE CHEGADA',
    type: 'time'
  },
  {
    id: 'horaSaida',
    label: 'HORA DE SAÍDA',
    type: 'time'
  },
  {
    id: 'tipoOperacao',
    label: 'TIPO DE OPERAÇÃO',
    type: 'select',
    options: ['IMPORTAÇÃO', 'EXPORTAÇÃO']
  },
  {
    id: 'valePedagio',
    label: 'VALE PEDÁGIO',
    type: 'conditionalValue',
    options: ['SIM', 'NÃO'],
    valueLabel: 'Valor'
  },
  {
    id: 'adiantamento',
    label: 'ADIANTAMENTO',
    type: 'text'
  },
  {
    id: 'saldo',
    label: 'SALDO',
    type: 'text'
  },
  {
    id: 'antecipacaoTerminal',
    label: 'ANTECIPAÇÃO TERMINAL',
    type: 'conditionalValue',
    options: ['SIM', 'NÃO'],
    valueLabel: 'Valor'
  },
  {
    id: 'estadia',
    label: 'ESTADIA',
    type: 'conditionalValue',
    options: ['SIM', 'NÃO'],
    valueLabel: 'Valor'
  },
  {
    id: 'fatura',
    label: 'FATURA N°',
    type: 'text'
  },
  {
    id: 'pagamento',
    label: 'PAGAMENTO EM',
    type: 'date'
  },
  {
    id: 'status',
    label: 'STATUS',
    type: 'select',
    options: ['A VENCER', 'QUITADO', 'VENCIDO']
  }
];

export const columnDefinitions = getColumnDefinitions([], []);