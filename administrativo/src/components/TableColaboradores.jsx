import { useEffect, useState } from "react";
import Button from "../components/Button";
import PopUpColaboradores from "../components/popUpColaboradores";

function TableColaboradores({ onDataLoaded, searchTerm, tipoSelecionado, onEditClick }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popUpOpen, setPopUp] = useState(false);
  const [popUpMode, setPopUpMode] = useState("create");
  const [selectedColaboradorId, setSelectedColaboradorId] = useState(null);

  const openPopUp = (mode, colaboradorId) => {
    setPopUpMode(mode);
    setSelectedColaboradorId(colaboradorId);
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
    setSelectedColaboradorId(null);
  };

  // Função para buscar colaboradores
  const fetchColaboradores = () => {
    setLoading(true);
    
    // Construir URL com filtros
    let url = "http://localhost:8000/ColaboradoresAPI.php";
    const params = new URLSearchParams();
    
    if (searchTerm) params.append("search", searchTerm);
    if (tipoSelecionado !== "TODOS") params.append("cargo", tipoSelecionado);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Buscando colaboradores em:", url);

    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        console.log("Status da resposta:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((response) => {
        console.log("Dados recebidos da API:", response);
        
        let colaboradoresData = [];
        
        // Verificar a estrutura correta da API
        if (response && response.success && Array.isArray(response.data)) {
          colaboradoresData = response.data;
          console.log("Total de registros:", response.total);
        } else if (Array.isArray(response)) {
          colaboradoresData = response;
        } else {
          console.warn("Estrutura de dados inesperada:", response);
          colaboradoresData = [];
        }
        
        // DEBUG: Mostrar a estrutura dos dados
        if (colaboradoresData.length > 0) {
          console.log("Primeiro colaborador (estrutura):", colaboradoresData[0]);
          console.log("Campos disponíveis:", Object.keys(colaboradoresData[0]));
        }
        
        setColaboradores(colaboradoresData);
        
        if (onDataLoaded) {
          onDataLoaded(colaboradoresData);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar colaboradores:", err);
        setColaboradores([]);
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
    
    window.handleRefreshTable = fetchColaboradores;
    
    return () => {
      delete window.handleRefreshTable;
    };
  }, [searchTerm, tipoSelecionado]);

  const handleDelete = (id) => {
  if (window.confirm("Tem certeza que deseja excluir este colaborador?")) {
    fetch("http://localhost:8000/ColaboradoresAPI.php", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        id_funcionario: id  // ← Nome correto do campo que a API espera
      }),
    })
      .then((response) => {
        console.log("Status da resposta:", response.status);
        console.log("Resposta DELETE:", response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
      })
      .then((data) => {
        console.log("Dados DELETE:", data);
        
        if (data.success) {
          // Verifique qual é a propriedade correta do ID
          // Pode ser ID_FUNCIONARIO, ID_COLABORADOR, id, etc.
          const novosColaboradores = colaboradores.filter((colaborador) => {
            // Tente diferentes propriedades possíveis
            return (
              colaborador.ID_FUNCIONARIO !== id && // Se usar maiúsculas
              colaborador.id_funcionario !== id && // Se usar minúsculas
              colaborador.ID_COLABORADOR !== id && // Outra possibilidade
              colaborador.id !== id                // Última opção
            );
          });
          
          setColaboradores(novosColaboradores);
          
          if (onDataLoaded) {
            onDataLoaded(novosColaboradores);
          }
          
          alert(data.message || "Colaborador excluído com sucesso!");
        } else {
          alert(data.message || "Erro ao excluir colaborador");
        }
      })
      .catch((err) => {
        console.error("Erro ao excluir colaborador:", err);
        alert("Erro ao conectar com o servidor: " + err.message);
      });
  }
};

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  // Formatar CPF
  const formatCPF = (cpf) => {
    if (!cpf) return "Não informado";
    const cleaned = cpf.toString().replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return cpf;
  };

  // Formatar telefone
  const formatTelefone = (telefone) => {
    if (!telefone) return "-";
    const cleaned = telefone.toString().replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
  };

  // Formatar salário
  const formatSalario = (salario) => {
    if (!salario) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(salario));
  };

  // Badge para cargo
  const CargoBadge = ({ cargo }) => {
    let bgColor, text, label;
    
    switch(cargo?.toUpperCase()) {
      case 'INSTRUTOR':
      case 'PERSONAL TRAINER':
        bgColor = 'bg-blue-100';
        text = 'text-blue-800';
        break;
      case 'RECEPCIONISTA':
        bgColor = 'bg-green-100';
        text = 'text-green-800';
        break;
      case 'ADMINISTRADOR':
      case 'GERENTE':
        bgColor = 'bg-purple-100';
        text = 'text-purple-800';
        break;
      case 'LIMPEZA':
      case 'SERVICOS GERAIS':
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
        break;
      case 'AUXILIAR':
        bgColor = 'bg-yellow-100';
        text = 'text-yellow-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${text}`}>
        {cargo || 'Não definido'}
      </span>
    );
  };

  // Badge para turno
  const TurnoBadge = ({ turno }) => {
    let bgColor, text, label;
    
    switch(turno?.toUpperCase()) {
      case 'MANHA':
        bgColor = 'bg-yellow-100';
        text = 'text-yellow-800';
        label = 'Manhã';
        break;
      case 'TARDE':
        bgColor = 'bg-orange-100';
        text = 'text-orange-800';
        label = 'Tarde';
        break;
      case 'NOITE':
        bgColor = 'bg-indigo-100';
        text = 'text-indigo-800';
        label = 'Noite';
        break;
      case 'ROTATIVO':
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
        label = 'Rotativo';
        break;
      default:
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
        label = turno || 'Não definido';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${text}`}>
        {label}
      </span>
    );
  };

  if (loading && colaboradores.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando colaboradores...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* WRAPPER COM SCROLL */}
      <div className="w-full max-h-[700px] overflow-auto border border-gray-300 rounded-lg">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <div className="text-sm text-gray-600">
            Total de colaboradores: <span className="font-bold">{colaboradores.length}</span>
          </div>
          <button 
            onClick={fetchColaboradores}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
        </div>

        <table className="table-auto w-full border-collapse min-w-max">
          <thead className="bg-red-950 text-white sticky top-0">
            <tr>
              <th className="px-4 py-3 border-2">ID</th>
              <th className="px-4 py-3 border-2">Nome</th>
              <th className="px-4 py-3 border-2">Cargo</th>
              <th className="px-4 py-3 border-2">Email</th>
              <th className="px-4 py-3 border-2">Turno</th>
              <th className="px-4 py-3 border-2">Data Admissão</th>
              <th className="px-4 py-3 border-2">Salário</th>
              <th className="px-4 py-3 border-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center border-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Carregando colaboradores...</p>
                  </div>
                </td>
              </tr>
            ) : colaboradores.length > 0 ? (
              colaboradores.map((colaborador) => (
                <tr key={colaborador.id_funcionario} 
                    className="bg-white hover:bg-gray-50 transition-colors text-red-500">
                  
                  <td className="px-4 py-3 border-2 text-center font-mono text-sm">
                    {colaborador.id_funcionario}
                  </td>
                  
                  <td className="px-4 py-3 border-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-lg">
                          {colaborador.nome_funcionario?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {colaborador.nome_funcionario}
                        </div>
                        <div className="text-xs text-gray-500">
                          CPF: {formatCPF(colaborador.cpf_funcionario)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Login: {colaborador.login_rede}
                        </div>
                        {colaborador.endereco_funcionario && (
                          <div className="text-xs text-gray-500 mt-1">
                            {colaborador.endereco_funcionario}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 border-2 text-center">
                    <CargoBadge cargo={colaborador.cargo} />
                  </td>
                  
                  <td className="px-4 py-3 border-2">
                    <div className="text-center">
                      <div className="font-medium">{colaborador.email_funcionario || '-'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {colaborador.nascimento_funcionario && 
                         `Nasc: ${formatDate(colaborador.nascimento_funcionario)}`}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 border-2 text-center">
                    <TurnoBadge turno={colaborador.turno} />
                  </td>
                  
                  <td className="px-4 py-3 border-2 text-center">
                    {formatDate(colaborador.data_admissao)}
                  </td>

                  <td className="px-4 py-3 border-2 text-center">
                    <div className="font-medium">
                      {formatSalario(colaborador.salario)}
                    </div>
                  </td>

                  <td className="px-4 py-3 border-2">
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="update" 
                        onClick={() => {
                          if (onEditClick) {
                            onEditClick(colaborador.id_funcionario);
                          } else {
                            openPopUp("edit", colaborador.id_funcionario);
                          }
                        }}
          
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </Button>

                      <Button 
                        variant="delete" 
                        onClick={() => handleDelete(colaborador.id_funcionario)}
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center border-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl mb-4 text-gray-300">👥</div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">Nenhum colaborador encontrado</p>
                    <p className="text-gray-500 text-sm max-w-md mb-4">
                      {searchTerm || tipoSelecionado !== "TODOS" 
                        ? `Não encontramos resultados para "${searchTerm}"${tipoSelecionado !== "TODOS" ? ` no cargo "${tipoSelecionado}"` : ''}` 
                        : "Você ainda não tem colaboradores cadastrados"}
                    </p>
                    <Button 
                      variant="create" 
                      onClick={() => openPopUp("create", null)}
                      className="mt-2"
                    >
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Adicionar Primeiro Colaborador
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pop-up */}
      {popUpOpen && (
        <PopUpColaboradores
          isOpen={popUpOpen}
          onClose={closePopUp}
          mode={popUpMode}
          colaboradorId={selectedColaboradorId}
          onSuccess={fetchColaboradores}
        />
      )}
    </>
  );
}

export default TableColaboradores;