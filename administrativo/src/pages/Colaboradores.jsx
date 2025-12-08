import Button from "../components/Button";
import Aside from "../components/Aside";
import PopUpColaboradores from "../components/popUpColaboradores"; 
import TableColaboradores from "../components/TableColaboradores";
import { useState } from "react";

function Colaboradores() {
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalColaboradores, setTotalColaboradores] = useState(0);
  const [colaboradoresAtivos, setColaboradoresAtivos] = useState(0);
  const [colaboradoresInativos, setColaboradoresInativos] = useState(0);
  const [tipoSelecionado, setTipoSelecionado] = useState("TODOS");

  const openPopUp = (mode) => {
    setPopUpMode(mode);
    setPopUp(true);
  };

  // Função callback que será passada para o componente Table
  const handleTableDataLoaded = (colaboradoresData) => {
    if (colaboradoresData && Array.isArray(colaboradoresData)) {
      const total = colaboradoresData.length;
      const ativos = colaboradoresData.filter(colaborador => 
        colaborador.STATUS_COLABORADOR === 'ATIVO'
      ).length;
      const inativos = colaboradoresData.filter(colaborador => 
        colaborador.STATUS_COLABORADOR === 'INATIVO'
      ).length;

      setTotalColaboradores(total);
      setColaboradoresAtivos(ativos);
      setColaboradoresInativos(inativos);
    }
  };

  return (
    <main style={{ marginLeft: "18vw", padding: "2rem", position: "relative", zIndex: 5 }}>
      <Aside />
      
      {/* Header Estético */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-red-950">Gerenciamento de Colaboradores</h1>
            <p className="text-gray-600 text-sm mt-1">Gerencie instrutores, recepcionistas e administradores</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select 
              value={tipoSelecionado}
              onChange={(e) => setTipoSelecionado(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="TODOS">Todos os Tipos</option>
              <option value="INSTRUTOR">Instrutores</option>
              <option value="RECEPCIONISTA">Recepcionistas</option>
              <option value="ADMINISTRADOR">Administradores</option>
              <option value="GERENTE">Gerentes</option>
            </select>
            
            <Button 
              variant="create" 
              onClick={() => openPopUp("create")}
              className="whitespace-nowrap"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Colaborador
            </Button>
          </div>
        </div>
        
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Total de Colaboradores</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{totalColaboradores}</p>
              </div>
              <div className="bg-purple-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Ativos</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{colaboradoresAtivos}</p>
              </div>
              <div className="bg-green-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Inativos</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{colaboradoresInativos}</p>
              </div>
              <div className="bg-orange-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Instrutores</p>
                <p className="text-xl font-bold text-gray-800 mt-1">-</p>
                <p className="text-xs text-blue-600 mt-1">em desenvolvimento</p>
              </div>
              <div className="bg-blue-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Acesso Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Permissões de Acesso</h3>
                <p className="text-sm text-gray-600">Gerencie níveis de acesso</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Horários de Trabalho</h3>
                <p className="text-sm text-gray-600">Configure escalas</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Relatórios</h3>
                <p className="text-sm text-gray-600">Visualize métricas da equipe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela de Colaboradores */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <TableColaboradores 
          onDataLoaded={handleTableDataLoaded}
          searchTerm={searchTerm}
          tipoSelecionado={tipoSelecionado}
        />
      </div>
      
      <PopUpColaboradores 
        isOpen={PopUPOpen} 
        onClose={() => setPopUp(false)} 
        mode={PopUpMode} 
      />
    </main>
  );
}

export default Colaboradores;