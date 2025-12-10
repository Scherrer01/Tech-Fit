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
    if (tipoSelecionado !== "TODOS") params.append("tipo", tipoSelecionado);
    
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
      .then((data) => {
        console.log("Dados recebidos da API:", data);
        
        let colaboradoresData = [];
        
        if (Array.isArray(data)) {
          colaboradoresData = data;
        } else if (data && typeof data === 'object' && data.success !== undefined) {
          // Se a API retornar {success: true, data: [...]}
          if (data.data && Array.isArray(data.data)) {
            colaboradoresData = data.data;
          } else if (Array.isArray(data)) {
            colaboradoresData = data;
          }
        } else if (data && typeof data === 'object') {
          // Um único objeto
          colaboradoresData = [data];
        }
        
        console.log("Colaboradores processados:", colaboradoresData);
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
    
    // Tornar a função disponível globalmente para refresh
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
        body: JSON.stringify({ idColaborador: id }),
      })
        .then((response) => {
          console.log("Resposta DELETE:", response);
          if (response.ok) {
            return response.json();
          }
          throw new Error('Erro na resposta da API');
        })
        .then((data) => {
          console.log("Dados DELETE:", data);
          if (data.success) {
            // Atualizar a lista localmente
            const novosColaboradores = colaboradores.filter((colaborador) => 
              colaborador.ID_COLABORADOR !== id
            );
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
          alert("Erro ao conectar com o servidor");
        });
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    try {
      // Remover 'T' se for formato ISO
      const dateStr = dateString.includes('T') ? dateString.split('T')[0] : dateString;
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  // Formatar CPF
  const formatCPF = (cpf) => {
    if (!cpf) return "Não informado";
    // Remover caracteres não numéricos
    const cleaned = cpf.toString().replace(/\D/g, '');
    
    // Aplicar máscara
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
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $3-$4');
    }
    
    return telefone;
  };

  // Badge para status
  const StatusBadge = ({ status }) => {
    let bgColor, text, label;
    
    switch(status?.toUpperCase()) {
      case 'ATIVO':
        bgColor = 'bg-green-100';
        text = 'text-green-800';
        label = 'Ativo';
        break;
      case 'FERIAS':
        bgColor = 'bg-yellow-100';
        text = 'text-yellow-800';
        label = 'Férias';
        break;
      case 'AFASTADO':
        bgColor = 'bg-orange-100';
        text = 'text-orange-800';
        label = 'Afastado';
        break;
      case 'INATIVO':
        bgColor = 'bg-red-100';
        text = 'text-red-800';
        label = 'Inativo';
        break;
      default:
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
        label = status || 'Não definido';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${text}`}>
        {label}
      </span>
    );
  };

  // Badge para tipo
  const TipoBadge = ({ tipo }) => {
    let bgColor, text, label;
    
    switch(tipo?.toUpperCase()) {
      case 'INSTRUTOR':
        bgColor = 'bg-blue-100';
        text = 'text-blue-800';
        label = 'Instrutor';
        break;
      case 'RECEPCIONISTA':
        bgColor = 'bg-green-100';
        text = 'text-green-800';
        label = 'Recepcionista';
        break;
      case 'ADMINISTRADOR':
        bgColor = 'bg-purple-100';
        text = 'text-purple-800';
        label = 'Administrador';
        break;
      case 'GERENTE':
        bgColor = 'bg-red-100';
        text = 'text-red-800';
        label = 'Gerente';
        break;
      case 'PERSONAL':
        bgColor = 'bg-indigo-100';
        text = 'text-indigo-800';
        label = 'Personal Trainer';
        break;
      case 'LIMPEZA':
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
        label = 'Serviços Gerais';
        break;
      default:
        bgColor = 'bg-gray-100';
        text = 'text-gray-800';
        label = tipo || 'Não definido';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${text}`}>
        {label}
      </span>
    );
  };

  // Se houver erro de CORS, mostrar mensagem
  if (loading && colaboradores.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando colaboradores...</p>
          <p className="text-sm text-gray-500 mt-2">
            Se estiver demorando muito, verifique se a API está rodando em http://localhost:8000
          </p>
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
              <th className="px-4 py-3 border-2">Cargo/Tipo</th>
              <th className="px-4 py-3 border-2">Email</th>
              <th className="px-4 py-3 border-2">Telefone</th>
              <th className="px-4 py-3 border-2">Status</th>
              <th className="px-4 py-3 border-2">Data Admissão</th>
              <th className="px-4 py-3 border-2">Ações</th>
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
                <tr key={colaborador.ID_COLABORADOR || colaborador.id || Math.random()} 
                    className="bg-white hover:bg-gray-50 transition-colors">
                  
                  <td className="px-4 py-3 border-2 text-center font-mono">
                    {colaborador.ID_COLABORADOR || colaborador.id || '-'}
                  </td>
                  
                  <td className="px-4 py-3 border-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-lg">
                          {colaborador.NOME?.charAt(0) || colaborador.nome?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {colaborador.NOME || colaborador.nome} {colaborador.SOBRENOME || colaborador.sobrenome}
                        </div>
                        <div className="text-xs text-gray-500">
                          CPF: {formatCPF(colaborador.CPF || colaborador.cpf)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {colaborador.ENDERECO || colaborador.endereco || 'Endereço não informado'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 border-2 text-center">
                    <TipoBadge tipo={colaborador.TIPO_COLABORADOR || colaborador.tipo_colaborador || colaborador.cargo} />
                    {colaborador.SALARIO && (
                      <div className="text-xs text-gray-600 mt-1">
                        R$ {parseFloat(colaborador.SALARIO || colaborador.salario || 0).toFixed(2)}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 border-2">
                    <div className="text-center">
                      <div className="font-medium">{colaborador.EMAIL || colaborador.email || '-'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {colaborador.SEXO || colaborador.sexo || 'Sexo não informado'}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 border-2 text-center">
                    {formatTelefone(colaborador.TELEFONE || colaborador.telefone)}
                    {colaborador.NASCIMENTO && (
                      <div className="text-xs text-gray-600 mt-1">
                        Nasc: {formatDate(colaborador.NASCIMENTO || colaborador.nascimento)}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 border-2 text-center">
                    <StatusBadge status={colaborador.STATUS_COLABORADOR || colaborador.status_colaborador || colaborador.status} />
                  </td>
                  
                  <td className="px-4 py-3 border-2 text-center">
                    {formatDate(colaborador.DATA_ADMISSAO || colaborador.data_admissao)}
                  </td>

                  <td className="px-4 py-3 border-2">
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="update" 
                        onClick={() => {
                          if (onEditClick) {
                            onEditClick(colaborador.ID_COLABORADOR || colaborador.id);
                          } else {
                            openPopUp("edit", colaborador.ID_COLABORADOR || colaborador.id);
                          }
                        }}
                        className="px-3 py-2 text-sm w-full"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </Button>

                      <Button 
                        variant="delete" 
                        onClick={() => handleDelete(colaborador.ID_COLABORADOR || colaborador.id)}
                        className="px-3 py-2 text-sm w-full"
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
                <td colSpan="8" className="px-4 py-12 text-center border-2">
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