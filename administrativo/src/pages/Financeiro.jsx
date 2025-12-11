import Button from "../components/Button";
import Aside from "../components/Aside";
import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';

function RelatoriosFinanceiros() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("MENSAL");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipoRelatorio, setTipoRelatorio] = useState("TODOS");
  const [loading, setLoading] = useState(false);
  const [relatorioData, setRelatorioData] = useState(null);
  const [indicadores, setIndicadores] = useState({
    receitaTotal: 0,
    despesasTotais: 0,
    lucroLiquido: 0,
    margemLucro: 0,
    alunosAtivos: 0,
    inadimplencia: 0
  });

  // Configurar datas padrão
  useEffect(() => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    setDataInicio(primeiroDiaMes.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
  }, []);

  // Tipos de relatórios disponíveis
  const tiposRelatorio = [
    { id: "TODOS", nome: "Relatório Completo", desc: "Todas as informações financeiras" },
    { id: "RECEITAS", nome: "Receitas", desc: "Entradas e recebimentos" },
    { id: "DESPESAS", nome: "Despesas", desc: "Gastos e custos" },
    { id: "PLANOS", nome: "Planos", desc: "Vendas e renovação de planos" },
    { id: "INADIMPLENCIA", nome: "Inadimplência", desc: "Pagamentos em atraso" },
    { id: "FLUXO_CAIXA", nome: "Fluxo de Caixa", desc: "Entradas e saídas diárias" }
  ];

  // Períodos pré-definidos
  const periodos = [
    { id: "DIARIO", nome: "Diário" },
    { id: "SEMANAL", nome: "Semanal" },
    { id: "MENSAL", nome: "Mensal" },
    { id: "TRIMESTRAL", nome: "Trimestral" },
    { id: "SEMESTRAL", nome: "Semestral" },
    { id: "ANUAL", nome: "Anual" },
    { id: "PERSONALIZADO", nome: "Personalizado" }
  ];

  const buscarRelatorio = async () => {
    setLoading(true);
    try {
      // Simulação de dados - substituir por API real
      setTimeout(() => {
        const mockData = {
          resumo: {
            receitaTotal: 125430.50,
            despesasTotais: 82450.30,
            lucroLiquido: 42980.20,
            margemLucro: 34.2,
            alunosAtivos: 156,
            inadimplencia: 12.5,
            ticketMedio: 804.04
          },
          receitas: [
            { categoria: "Mensalidades", valor: 85600.00, percentual: 68.2 },
            { categoria: "Planos", valor: 25430.50, percentual: 20.3 },
            { categoria: "Produtos", valor: 8900.00, percentual: 7.1 },
            { categoria: "Serviços Extras", valor: 5500.00, percentual: 4.4 }
          ],
          despesas: [
            { categoria: "Folha de Pagamento", valor: 45000.00, percentual: 54.5 },
            { categoria: "Aluguel", valor: 12000.00, percentual: 14.5 },
            { categoria: "Energia/Água", valor: 5500.00, percentual: 6.7 },
            { categoria: "Manutenção", valor: 4800.00, percentual: 5.8 },
            { categoria: "Marketing", valor: 3500.00, percentual: 4.2 },
            { categoria: "Outros", valor: 11650.30, percentual: 14.1 }
          ],
          planoMaisVendido: "Premium",
          planoVendas: 45,
          inadimplentes: [
            { aluno: "João Silva", valor: 450.00, diasAtraso: 15 },
            { aluno: "Maria Santos", valor: 890.00, diasAtraso: 30 },
            { aluno: "Carlos Oliveira", valor: 670.00, diasAtraso: 45 }
          ],
          evolucaoMensal: [
            { mes: "Jan", receita: 120000, despesa: 80000 },
            { mes: "Fev", receita: 125000, despesa: 82000 },
            { mes: "Mar", receita: 130000, despesa: 85000 },
            { mes: "Abr", receita: 125430, despesa: 82450 }
          ]
        };

        setRelatorioData(mockData);
        setIndicadores(mockData.resumo);
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      setLoading(false);
    }
  };

  const exportarExcel = () => {
    if (!relatorioData) return;

    const wsData = [
      ["RELATÓRIO FINANCEIRO"],
      [`Período: ${dataInicio} até ${dataFim}`],
      [""],
      ["RESUMO FINANCEIRO"],
      ["Receita Total:", `R$ ${relatorioData.resumo.receitaTotal.toFixed(2)}`],
      ["Despesas Totais:", `R$ ${relatorioData.resumo.despesasTotais.toFixed(2)}`],
      ["Lucro Líquido:", `R$ ${relatorioData.resumo.lucroLiquido.toFixed(2)}`],
      ["Margem de Lucro:", `${relatorioData.resumo.margemLucro}%`],
      [""],
      ["RECEITAS POR CATEGORIA"],
      ...relatorioData.receitas.map(r => [r.categoria, `R$ ${r.valor.toFixed(2)}`, `${r.percentual}%`]),
      [""],
      ["DESPESAS POR CATEGORIA"],
      ...relatorioData.despesas.map(d => [d.categoria, `R$ ${d.valor.toFixed(2)}`, `${d.percentual}%`])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório Financeiro");
    
    const fileName = `relatorio_financeiro_${dataInicio}_${dataFim}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const exportarPDF = () => {
    window.print();
  };

  const limparFiltros = () => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    setPeriodoSelecionado("MENSAL");
    setDataInicio(primeiroDiaMes.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
    setTipoRelatorio("TODOS");
    setRelatorioData(null);
  };

  // Formatar valor monetário
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Cor baseada no valor
  const getValorCor = (valor) => {
    return valor >= 0 ? 'text-red-600' : 'text-gray-800';
  };

  return (
    <main className="max-h-[1000px] overflow-auto border border-gray-300 rounded-lg"style={{ marginLeft: "18vw", padding: "2rem", position: "relative", zIndex: 5, }}>
      <Aside />
      
      {/* Header Estético */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios Financeiros</h1>
            <p className="text-gray-600 text-sm mt-1">Análise e acompanhamento financeiro da academia</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              variant="delete" 
              onClick={buscarRelatorio}
              disabled={loading}
              className="
    px-4 py-2 
    bg-green-600 
    text-white 
    font-semibold 
    rounded-md 
    shadow-md 
    hover:bg-green-700 
    focus:outline-none 
    focus:ring-2 
    focus:ring-grenn-400 
    focus:ring-offset-1 
    transition 
    duration-200 
    ease-in-out
    disabled:opacity-50 
    disabled:cursor-not-allowed
  "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Gerando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Gerar Relatório
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="bg-white border border-gray-300 rounded-xl p-6 mb-6 shadow-sm text-red-950">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tipo de Relatório */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Tipo de Relatório
              </label>
              <select 
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-50"
              >
                {tiposRelatorio.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Período
              </label>
              <select 
                value={periodoSelecionado}
                onChange={(e) => setPeriodoSelecionado(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-50"
              >
                {periodos.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Início */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Data Início
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-50"
                disabled={periodoSelecionado !== "PERSONALIZADO"}
              />
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Data Fim
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-50"
                disabled={periodoSelecionado !== "PERSONALIZADO"}
              />
            </div>

          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-300">
            <Button 
              variant="outline" 
              onClick={limparFiltros}
              className="border-gray-400 text-gray-800 hover:bg-gray-100"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Indicadores Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 font-medium">Receita Total</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatarMoeda(indicadores.receitaTotal)}
                </p>
              </div>
              <div className="bg-red-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 font-medium">Despesas Totais</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatarMoeda(indicadores.despesasTotais)}
                </p>
              </div>
              <div className="bg-black p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 font-medium">Lucro Líquido</p>
                <p className={`text-xl font-bold mt-1 ${getValorCor(indicadores.lucroLiquido)}`}>
                  {formatarMoeda(indicadores.lucroLiquido)}
                </p>
              </div>
              <div className="bg-red-700 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 font-medium">Margem de Lucro</p>
                <p className={`text-xl font-bold mt-1 ${indicadores.margemLucro >= 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  {indicadores.margemLucro.toFixed(1)}%
                </p>
              </div>
              <div className="bg-black p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resultados do Relatório */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            <p className="mt-4 text-lg font-semibold text-gray-800">Gerando relatório financeiro...</p>
            <p className="text-gray-600 text-sm mt-1">Isso pode levar alguns segundos</p>
          </div>
        </div>
      ) : relatorioData ? (
        <div className="space-y-6">
          {/* Botões de Exportação */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={exportarExcel}
              className="
    flex items-center gap-2
    px-4 py-2
    border border-green-600
    text-green-600
    font-semibold
    rounded-md
    shadow-sm
    hover:bg-green-50
    hover:text-green-700
    focus:outline-none
    focus:ring-2
    focus:ring-green-400
    focus:ring-offset-1
    transition
    duration-200
    ease-in-out
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Excel
            </Button>
            
            <Button 
              variant="primary" 
              onClick={exportarPDF}
                className="
    flex items-center gap-2
    px-4 py-2
    bg-red-600
    text-white
    font-semibold
    rounded-md
    shadow-md
    hover:bg-red-700
    focus:outline-none
    focus:ring-2
    focus:ring-red-400
    focus:ring-offset-1
    transition
    duration-200
    ease-in-out
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Exportar PDF
            </Button>
          </div>

          {/* Cards de Análise */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Receitas por Categoria */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receitas por Categoria</h3>
              <div className="space-y-4">
                {relatorioData.receitas.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{item.categoria}</span>
                      <span className="text-sm font-bold text-red-600">{formatarMoeda(item.valor)}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${item.percentual}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{item.percentual}% do total</span>
                      <span>{formatarMoeda(item.valor)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Despesas por Categoria */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
              <div className="space-y-4">
                {relatorioData.despesas.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{item.categoria}</span>
                      <span className="text-sm font-bold text-gray-900">{formatarMoeda(item.valor)}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full" 
                        style={{ width: `${item.percentual}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{item.percentual}% do total</span>
                      <span>{formatarMoeda(item.valor)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plano Mais Vendido */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plano Mais Popular</h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-6xl mb-4 text-red-600">🏆</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{relatorioData.planoMaisVendido}</div>
                <div className="text-sm text-gray-600 mb-4">{relatorioData.planoVendas} vendas no período</div>
                <div className="bg-red-50 rounded-lg p-4 w-full border border-red-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{relatorioData.planoVendas}</div>
                    <div className="text-sm text-red-800">contratos ativos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Inadimplentes */}
          {relatorioData.inadimplentes.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
              <div className="p-6 border-b border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900">Inadimplência</h3>
                <p className="text-sm text-gray-600 mt-1">Alunos com pagamentos em atraso</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Aluno</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Valor Devido</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Dias em Atraso</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {relatorioData.inadimplentes.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-900">{item.aluno}</td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-red-600">{formatarMoeda(item.valor)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.diasAtraso <= 15 ? 'bg-red-100 text-red-800' :
                            item.diasAtraso <= 30 ? 'bg-red-200 text-red-900' :
                            'bg-gray-800 text-white'
                          }`}>
                            {item.diasAtraso} dias
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            Em atraso
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-12">
          <div className="text-center">
            <div className="text-6xl mb-4 text-gray-400">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum relatório gerado</h3>
            <p className="text-gray-600 mb-6">
              Configure os filtros e clique em "Gerar Relatório" para visualizar as informações financeiras
            </p>
            <Button 
              variant="primary" 
              onClick={buscarRelatorio}
              className="bg-red-600 hover:bg-red-700"
            >
              Gerar Primeiro Relatório
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

export default RelatoriosFinanceiros;