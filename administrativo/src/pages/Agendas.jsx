import { useEffect, useState } from "react";
import Button from "../components/Button";
import PopUpAulas from "../components/PopUpAulas"
import Inputs from "../components/Inputs";
import Aside from "../components/Aside";
import { 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiClock,
  FiCalendar,
  FiUsers,
  FiActivity,
  FiRefreshCw,
  FiAlertCircle
} from "react-icons/fi";
import { MdFitnessCenter, MdLocationOn, MdPerson } from "react-icons/md";

// URL da sua API (ajuste conforme necessário)
const API_URL = "http://localhost:8000/aulas_API.php";

function TableAulas({ onDataLoaded }) {
  const [aulas, setAulas] = useState([]);
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");
  const [selectedAula, setSelectedAula] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterModalidade, setFilterModalidade] = useState("TODAS");
  const [filterUnidade, setFilterUnidade] = useState("TODAS");
  const [filterDiaSemana, setFilterDiaSemana] = useState("TODAS");
  
  // Para armazenar dados das opções
  const [modalidades, setModalidades] = useState([]);
  const [instrutores, setInstrutores] = useState([]);
  const [unidades, setUnidades] = useState([]);

  // Dados estáticos para dias da semana
  const diasSemana = [
    { sigla: 'DOM', nome: 'Domingo' },
    { sigla: 'SEG', nome: 'Segunda' },
    { sigla: 'TER', nome: 'Terça' },
    { sigla: 'QUA', nome: 'Quarta' },
    { sigla: 'QUI', nome: 'Quinta' },
    { sigla: 'SEX', nome: 'Sexta' },
    { sigla: 'SAB', nome: 'Sábado' }
  ];

  const openPopUp = (mode, aulaID) => {
    setPopUpMode(mode);
    setSelectedAula(aulaID);
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
    setSelectedAula(null);
  };

  // Função para buscar aulas da API
  const fetchAulas = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      // Adicionar filtros
      if (searchQuery.trim() !== "") {
        queryParams.append('search', searchQuery);
      }
      
      if (filterModalidade !== "TODAS" && filterModalidade !== "") {
        queryParams.append('id_modalidade', filterModalidade);
      }
      
      if (filterUnidade !== "TODAS" && filterUnidade !== "") {
        queryParams.append('id_unidade', filterUnidade);
      }
      
      if (filterDiaSemana !== "TODAS" && filterDiaSemana !== "") {
        queryParams.append('dia_semana', filterDiaSemana);
      }
      
      // Adicionar parâmetros extras
      Object.keys(params).forEach(key => {
        queryParams.append(key, params[key]);
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `${API_URL}?${queryString}` : API_URL;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAulas(result.data || []);
        
        // Chama o callback para enviar dados para o componente pai
        if (onDataLoaded) {
          onDataLoaded(result.data || []);
        }
      } else {
        setError(result.message || "Erro ao buscar aulas");
        setAulas([]);
        if (onDataLoaded) {
          onDataLoaded([]);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar aulas:", err);
      setError(`Falha na conexão: ${err.message}`);
      setAulas([]);
      if (onDataLoaded) {
        onDataLoaded([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Carregar opções (modalidades, instrutores, unidades)
  const carregarOpcoes = async () => {
    try {
      // Em um projeto real, você teria endpoints específicos para isso
      // Por enquanto, vamos usar dados estáticos ou buscar de outras APIs
      
      // Simulação de busca de modalidades (substitua pelo seu endpoint real)
      const modalidadesData = [
        { id: 1, nome: 'Musculação', cor: 'bg-red-600' },
        { id: 2, nome: 'CrossFit', cor: 'bg-red-700' },
        { id: 3, nome: 'Funcional', cor: 'bg-red-800' },
        { id: 4, nome: 'Spinning', cor: 'bg-red-900' },
        { id: 5, nome: 'Yoga', cor: 'bg-black' },
        { id: 6, nome: 'Pilates', cor: 'bg-gray-900' }
      ];
      setModalidades(modalidadesData);
      
      // Simulação de instrutores
      const instrutoresData = [
        { id: 1, nome: 'Ana Souza' },
        { id: 2, nome: 'João Santos' },
        { id: 3, nome: 'Paula Costa' },
        { id: 4, nome: 'Ricardo Alves' }
      ];
      setInstrutores(instrutoresData);
      
      // Simulação de unidades
      const unidadesData = [
        { id: 1, nome: 'Centro' },
        { id: 2, nome: 'Zona Sul' },
        { id: 3, nome: 'Zona Norte' }
      ];
      setUnidades(unidadesData);
      
    } catch (err) {
      console.error("Erro ao carregar opções:", err);
    }
  };

  useEffect(() => {
    fetchAulas();
    carregarOpcoes();
  }, [filterModalidade, filterUnidade, filterDiaSemana]); // Recarrega quando filtros mudam

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      try {
        const response = await fetch(API_URL, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ id_aula: id })
        });
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Atualiza a lista local
          const novasAulas = aulas.filter((aula) => aula.id_aula !== id);
          setAulas(novasAulas);
          
          // Atualiza o pai com os novos dados
          if (onDataLoaded) {
            onDataLoaded(novasAulas);
          }
          
          alert("Aula excluída com sucesso!");
        } else {
          alert(`Erro ao excluir: ${result.message}`);
        }
      } catch (err) {
        console.error("Erro ao excluir aula:", err);
        alert("Erro ao excluir aula. Verifique a conexão.");
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchAulas();
  };

  // Funções auxiliares
  const getModalidadeNome = (id) => {
    const modalidade = modalidades.find(m => m.id == id);
    return modalidade ? modalidade.nome : 'Modalidade';
  };

  const getModalidadeCor = (id) => {
    const modalidade = modalidades.find(m => m.id == id);
    return modalidade ? modalidade.cor : 'bg-gray-800';
  };

  const getInstrutorNome = (id) => {
    if (!id) return 'Sem instrutor';
    const instrutor = instrutores.find(i => i.id == id);
    return instrutor ? instrutor.nome : 'Instrutor';
  };

  const getUnidadeNome = (id) => {
    if (!id) return 'Sem unidade';
    const unidade = unidades.find(u => u.id == id);
    return unidade ? unidade.nome : 'Unidade';
  };

  const getDiaNome = (sigla) => {
    const dia = diasSemana.find(d => d.sigla === sigla);
    return dia ? dia.nome : sigla;
  };

  const getDiaAbreviado = (sigla) => {
    const dias = {
      'SEG': 'Seg',
      'TER': 'Ter',
      'QUA': 'Qua',
      'QUI': 'Qui',
      'SEX': 'Sex',
      'SAB': 'Sáb',
      'DOM': 'Dom'
    };
    return dias[sigla] || sigla;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Remove os segundos se existirem
    const time = timeString.split(':');
    return `${time[0]}:${time[1]}`;
  };

  const calcularHorarioTermino = (horarioInicio, duracaoMinutos) => {
    if (!horarioInicio || !duracaoMinutos) return '';
    
    const [hours, minutes] = horarioInicio.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duracaoMinutos;
    
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Função para recarregar dados
  const handleRefresh = () => {
    fetchAulas();
  };

  // Opcional: Atualizar estatísticas quando aulas mudar
  useEffect(() => {
    if (onDataLoaded) {
      onDataLoaded(aulas);
    }
  }, [aulas, onDataLoaded]);

  return (
    <main className="flex min-h-screen">
      <div className="w-1/5 flex-shrink-0">
        <Aside />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto p-6 bg-transparent">
        {/* Barra de Controles */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <FiSearch className="absolute left-4 top-3.5 text-gray-600" />
              <input
                type="text"
                placeholder="Buscar aula por nome..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchAulas()}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-800"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select 
              value={filterModalidade}
              onChange={(e) => setFilterModalidade(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-sm text-gray-800"
            >
              <option value="TODAS">Todas Modalidades</option>
              {modalidades.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>

            <select 
              value={filterUnidade}
              onChange={(e) => setFilterUnidade(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-sm text-gray-800"
            >
              <option value="TODAS">Todas Unidades</option>
              {unidades.map(u => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>

            <select 
              value={filterDiaSemana}
              onChange={(e) => setFilterDiaSemana(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-sm text-gray-800"
            >
              <option value="TODAS">Todos os Dias</option>
              {diasSemana.map(d => (
                <option key={d.sigla} value={d.sigla}>{d.nome}</option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              className="px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm border border-gray-300"
              title="Recarregar dados"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => openPopUp("create", null)}
              className="px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
            >
              <span className="text-lg">+</span>
              Nova Aula
            </button>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <FiAlertCircle className="text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Erro ao carregar dados</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-800 font-semibold text-sm">Aula</th>
                  <th className="py-4 px-6 text-left text-gray-800 font-semibold text-sm">Modalidade</th>
                  <th className="py-4 px-6 text-left text-gray-800 font-semibold text-sm">Instrutor</th>
                  <th className="py-4 px-6 text-left text-gray-800 font-semibold text-sm">Horário</th>
                  <th className="py-4 px-6 text-left text-gray-800 font-semibold text-sm">Vagas</th>
                  <th className="py-4 px-6 text-left text-gray-800 font-semibold text-sm">Status</th>
                  <th className="py-4 px-6 text-left text-gray-800 font-semibold text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                        <p className="mt-3 text-gray-700 text-sm">Carregando aulas...</p>
                      </div>
                    </td>
                  </tr>
                ) : aulas.length > 0 ? (
                  aulas.map((aula) => (
                    <tr 
                      key={aula.id_aula} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{aula.nome_aula}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MdLocationOn className="text-gray-600" size={12} />
                            <span className="text-xs text-gray-700">{getUnidadeNome(aula.id_unidade)}</span>
                            <FiCalendar className="text-gray-600 ml-1" size={12} />
                            <span className="text-xs text-gray-700">{getDiaAbreviado(aula.dia_semana)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getModalidadeCor(aula.id_modalidade)}`}
                        >
                          {getModalidadeNome(aula.id_modalidade)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <MdPerson className="text-red-600 text-xs" />
                          </div>
                          <span className="text-sm text-gray-800">{getInstrutorNome(aula.id_instrutor)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-600 text-sm" />
                            <span className="font-medium text-sm text-gray-800">{formatTime(aula.horario_inicio)}</span>
                            <span className="text-gray-600 text-xs">às {formatTime(calcularHorarioTermino(aula.horario_inicio, aula.duracao_minutos))}</span>
                          </div>
                          <span className="text-gray-600 text-xs mt-1">({aula.duracao_minutos} minutos)</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-300 rounded-full h-1.5">
                              <div 
                                className="bg-red-600 h-1.5 rounded-full"
                                style={{ width: `${Math.min(100, (aula.vagas / 30) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 font-semibold text-sm text-gray-800">{aula.vagas}</span>
                          </div>
                          <span className="text-xs text-gray-600 mt-1">vagas disponíveis</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          aula.status_aula === 'ATIVA' || !aula.status_aula
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}>
                          {!aula.status_aula || aula.status_aula === 'ATIVA' ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openPopUp("edit", aula.id_aula)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            title="Editar"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(aula.id_aula)}
                            className="p-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                            title="Excluir"
                          >
                            <FiTrash2 size={14} />
                          </button>
                          <button
                            onClick={() => openPopUp("view", aula.id_aula)}
                            className="p-1.5 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                            title="Ver detalhes"
                          >
                            <FiEye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-4xl mb-3 text-gray-400">🎯</div>
                        <p className="text-lg font-semibold text-gray-800 mb-1">
                          {error ? "Erro ao carregar aulas" : "Nenhuma aula encontrada"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {searchQuery || filterModalidade !== "TODAS" || filterDiaSemana !== "TODAS" 
                            ? "Tente alterar os filtros de busca" 
                            : "Clique em 'Nova Aula' para adicionar uma"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PopUp para criar/editar/ver aula */}
        {PopUPOpen && (
          <PopUpAulas
            isOpen={PopUPOpen}
            onClose={closePopUp}
            mode={PopUpMode}
            aulaId={selectedAula}
            onSuccess={() => {
              fetchAulas();
              closePopUp();
            }}
            modalidades={modalidades}
            instrutores={instrutores}
            unidades={unidades}
            diasSemana={diasSemana}
          />
        )}
      </div>
    </main>
  );
}

export default TableAulas;