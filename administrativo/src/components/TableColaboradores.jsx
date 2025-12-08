import { useEffect, useState } from "react";
import Button from "../components/Button";
import PopUpColaboradores from "../components/popUpColaboradores";

function TableColaboradores({ onDataLoaded, searchTerm, tipoSelecionado }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");
  const [selectedColaborador, setSelectedColaborador] = useState(null);

  const openPopUp = (mode, colaboradorID) => {
    setPopUpMode(mode);
    setSelectedColaborador(colaboradorID);
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
    setSelectedColaborador(null);
  };

  // Função para buscar colaboradores
  const fetchColaboradores = () => {
    setLoading(true);
    
    // Construir URL com filtros
    let url = "http://localhost:8000/colaboradoresAPI.php";
    const params = new URLSearchParams();
    
    if (searchTerm) params.append("search", searchTerm);
    if (tipoSelecionado !== "TODOS") params.append("tipo", tipoSelecionado);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let colaboradoresData = [];
        
        if (Array.isArray(data)) {
          colaboradoresData = data;
        } else if (data && typeof data === 'object') {
          colaboradoresData = [data];
        }
        
        setColaboradores(colaboradoresData);
        
        if (onDataLoaded) {
          onDataLoaded(colaboradoresData);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar colaboradores:", err);
        if (onDataLoaded) {
          onDataLoaded([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchColaboradores();
  }, [searchTerm, tipoSelecionado, onDataLoaded]);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este colaborador?")) {
      fetch("http://localhost:8000/colaboradoresAPI.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idColaborador: id }),
      })
        .then((response) => {
          if (response.ok) {
            const novosColaboradores = colaboradores.filter((colaborador) => 
              colaborador.ID_COLABORADOR !== id
            );
            setColaboradores(novosColaboradores);
            
            if (onDataLoaded) {
              onDataLoaded(novosColaboradores);
            }
          } else {
            alert("Erro ao excluir colaborador");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Badge para status
  const StatusBadge = ({ status }) => {
    const isAtivo = status === 'ATIVO';
    return (
      <span className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${isAtivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      `}>
        {isAtivo ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  // Badge para tipo
  const TipoBadge = ({ tipo }) => {
    let bgColor, text;
    
    switch(tipo) {
      case 'INSTRUTOR':
        bgColor = 'bg-blue-100';
        text = 'text-blue-800';
        break;
      case 'RECEPCIONISTA':
        bgColor = 'bg-green-100';
        text = 'text-green-800';
        break;
      case 'ADMINISTRADOR':
        bgColor = 'bg-purple-100';
        text = 'text-purple-800';
        break;
      case 'GERENTE':
        bgColor = 'bg-red-100';
        text = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${text}`}>
        {tipo || 'Não definido'}
      </span>
    );
  };

  return (
    <>
      {/* WRAPPER COM SCROLL - Mantendo o estilo da sua tabela */}
      <div className="w-full max-h-[700px] overflow-auto border border-gray-300 rounded-lg">
        <div className="flex justify-end p-2">
          {/* Espaço para botões ou filtros adicionais se necessário */}
        </div>

        <table className="table-auto w-full border-collapse min-w-max">
          <thead className="bg-red-950 text-white sticky top-0">
            <tr>
              <th className="px-4 py-2 border-2">ID</th>
              <th className="px-4 py-2 border-2">Nome</th>
              <th className="px-4 py-2 border-2">Cargo/Tipo</th>
              <th className="px-4 py-2 border-2">Email</th>
              <th className="px-4 py-2 border-2">Telefone</th>
              <th className="px-4 py-2 border-2">Status</th>
              <th className="px-4 py-2 border-2">Data Admissão</th>
              <th className="px-4 py-2 border-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center border-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Carregando colaboradores...</p>
                  </div>
                </td>
              </tr>
            ) : colaboradores.length > 0 ? (
              colaboradores.map((colaborador) => (
                <tr key={colaborador.ID_COLABORADOR} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-2 border-2 text-center">{colaborador.ID_COLABORADOR}</td>
                  
                  <td className="px-4 py-2 border-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600 font-semibold text-sm">
                          {colaborador.NOME?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{colaborador.NOME} {colaborador.SOBRENOME}</div>
                        <div className="text-xs text-gray-500">CPF: {colaborador.CPF || 'Não informado'}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-2 border-2 text-center">
                    <TipoBadge tipo={colaborador.TIPO_COLABORADOR} />
                  </td>
                  
                  <td className="px-4 py-2 border-2 text-center">{colaborador.EMAIL}</td>
                  
                  <td className="px-4 py-2 border-2 text-center">{colaborador.TELEFONE || '-'}</td>
                  
                  <td className="px-4 py-2 border-2 text-center">
                    <StatusBadge status={colaborador.STATUS_COLABORADOR} />
                  </td>
                  
                  <td className="px-4 py-2 border-2 text-center">
                    {formatDate(colaborador.DATA_ADMISSAO)}
                  </td>

                  <td className="px-4 py-2 border-2 text-center space-x-2">
                    <Button 
                      variant="update" 
                      onClick={() => openPopUp("edit", colaborador.ID_COLABORADOR)}
                      className="px-3 py-1 text-sm"
                    >
                      Editar
                    </Button>

                    <Button 
                      variant="delete" 
                      onClick={() => handleDelete(colaborador.ID_COLABORADOR)}
                      className="px-3 py-1 text-sm"
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center border-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3 text-gray-300">👥</div>
                    <p className="text-lg font-semibold text-gray-700 mb-1">Nenhum colaborador encontrado</p>
                    <p className="text-gray-500 text-sm">
                      {searchTerm || tipoSelecionado !== "TODOS" 
                        ? "Tente alterar os filtros de busca" 
                        : "Clique em 'Novo Colaborador' para adicionar"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Pop-up */}
      {PopUPOpen && (
        <PopUpColaboradores
          isOpen={PopUPOpen}
          onClose={closePopUp}
          mode={PopUpMode}
          colaboradorId={selectedColaborador}
          onSuccess={fetchColaboradores}
        />
      )}
    </>
  );
}

export default TableColaboradores;