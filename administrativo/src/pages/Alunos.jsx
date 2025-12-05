import Button from "../components/Button";
import Aside from "../components/Aside";
import PopUpAlunos from "../components/popUpAlunos"; 
import Table from "../components/Table";
import { useState } from "react";

function Alunos() {
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [alunosAtivos, setAlunosAtivos] = useState(0);
  const [alunosInativos, setAlunosInativos] = useState(0);

  const openPopUp = (mode) => {
    setPopUpMode(mode);
    setPopUp(true);
  };

  // Função callback que será passada para o componente Table
  const handleTableDataLoaded = (alunosData) => {
    if (alunosData && Array.isArray(alunosData)) {
      const total = alunosData.length;
      const ativos = alunosData.filter(aluno => aluno.STATUS_ALUNO === 'ATIVO').length;
      const inativos = alunosData.filter(aluno => 
        aluno.STATUS_ALUNO === 'INATIVO' || aluno.STATUS_ALUNO === 'SUSPENSO'
      ).length;

      setTotalAlunos(total);
      setAlunosAtivos(ativos);
      setAlunosInativos(inativos);
    }
  };
  return (
    <main style={{ marginLeft: "18vw", padding: "2rem", position: "relative", zIndex: 5 }}>
      <Aside />
      
      {/* Header Estético */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-red-950">Gerenciamento de Alunos</h1>
            <p className="text-gray-600 text-sm mt-1">Cadastre, edite e visualize os alunos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            
            <Button 
              variant="create" 
              onClick={() => openPopUp("create")}
              className="whitespace-nowrap text-green-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Aluno
            </Button>
          </div>
        </div>
        
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total de Alunos</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{totalAlunos}</p>
              </div>
              <div className="bg-blue-500 p-2 rounded-lg">
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
                <p className="text-xl font-bold text-gray-800 mt-1">{alunosAtivos}</p>
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
                <p className="text-xl font-bold text-gray-800 mt-1">{alunosInativos}</p>
              </div>
              <div className="bg-orange-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela */}
      <div>
        <Table onDataLoaded={handleTableDataLoaded}/>
      </div>
      
      <PopUpAlunos isOpen={PopUPOpen} onClose={() => setPopUp(false)} mode={PopUpMode} />
    </main>
  );
}

export default Alunos;