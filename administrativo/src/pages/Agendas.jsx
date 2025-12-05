import { useEffect, useState } from "react";
import Button from "../components/Button";
import PopUpAulas from "../components/popUpAulas"; // Você precisará criar este componente
import Inputs from "../components/Inputs";
import { 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiClock,
  FiCalendar,
  FiUsers,
  FiActivity
} from "react-icons/fi";
import { MdFitnessCenter, MdLocationOn, MdPerson } from "react-icons/md";

function TableAulas({ onDataLoaded }) {
  const [aulas, setAulas] = useState([]);
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");
  const [selectedAula, setSelectedAula] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterModalidade, setFilterModalidade] = useState("TODAS");
  const [filterStatus, setFilterStatus] = useState("TODAS");

  // Dados simulados para demonstração
  const modalidades = [
    { id: 1, nome: 'Musculação', cor: 'bg-red-500' },
    { id: 2, nome: 'CrossFit', cor: 'bg-orange-500' },
    { id: 3, nome: 'Funcional', cor: 'bg-blue-500' },
    { id: 4, nome: 'Spinning', cor: 'bg-purple-500' },
    { id: 5, nome: 'Yoga', cor: 'bg-green-500' },
    { id: 6, nome: 'Pilates', cor: 'bg-pink-500' }
  ];

  const instrutores = [
    { id: 1, nome: 'Ana Souza' },
    { id: 2, nome: 'João Santos' },
    { id: 3, nome: 'Paula Costa' },
    { id: 4, nome: 'Ricardo Alves' }
  ];

  const unidades = [
    { id: 1, nome: 'Centro' },
    { id: 2, nome: 'Zona Sul' },
    { id: 3, nome: 'Zona Norte' }
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

  // Função para buscar aulas (reutilizável)
  const fetchAulas = (query = "") => {
    setLoading(true);
    
    // Simulação de API - Em produção, substitua pelo seu endpoint real
    setTimeout(() => {
      let dadosSimulados = [
        {
          ID_AULA: 1,
          NOME_AULA: 'Musculação Iniciante',
          ID_MODALIDADE: 1,
          ID_INSTRUTOR: 1,
          ID_UNIDADE: 1,
          DIA_SEMANA: 'SEG',
          HORARIO_INICIO: '08:00:00',
          DURACAO_MINUTOS: 60,
          VAGAS: 20,
          STATUS_AULA: 'ATIVA',
          CRIADO_EM: '2023-10-15 10:00:00'
        },
        {
          ID_AULA: 2,
          NOME_AULA: 'CrossFit Avançado',
          ID_MODALIDADE: 2,
          ID_INSTRUTOR: 2,
          ID_UNIDADE: 2,
          DIA_SEMANA: 'TER',
          HORARIO_INICIO: '10:00:00',
          DURACAO_MINUTOS: 45,
          VAGAS: 15,
          STATUS_AULA: 'ATIVA',
          CRIADO_EM: '2023-10-15 10:00:00'
        },
        {
          ID_AULA: 3,
          NOME_AULA: 'Yoga Zen',
          ID_MODALIDADE: 5,
          ID_INSTRUTOR: 3,
          ID_UNIDADE: 3,
          DIA_SEMANA: 'QUA',
          HORARIO_INICIO: '14:00:00',
          DURACAO_MINUTOS: 60,
          VAGAS: 25,
          STATUS_AULA: 'ATIVA',
          CRIADO_EM: '2023-10-15 10:00:00'
        },
        {
          ID_AULA: 4,
          NOME_AULA: 'Spinning Energy',
          ID_MODALIDADE: 4,
          ID_INSTRUTOR: 4,
          ID_UNIDADE: 1,
          DIA_SEMANA: 'QUI',
          HORARIO_INICIO: '18:00:00',
          DURACAO_MINUTOS: 50,
          VAGAS: 30,
          STATUS_AULA: 'ATIVA',
          CRIADO_EM: '2023-10-15 10:00:00'
        }
      ];

      // Filtra por query de busca
      if (query.trim() !== "") {
        dadosSimulados = dadosSimulados.filter(aula =>
          aula.NOME_AULA.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Aplica filtros adicionais
      if (filterModalidade !== "TODAS") {
        dadosSimulados = dadosSimulados.filter(aula => 
          aula.ID_MODALIDADE == filterModalidade
        );
      }

      if (filterStatus !== "TODAS") {
        dadosSimulados = dadosSimulados.filter(aula => 
          aula.STATUS_AULA === filterStatus
        );
      }

      setAulas(dadosSimulados);
      
      // Chama o callback para enviar dados para o componente pai
      if (onDataLoaded) {
        onDataLoaded(dadosSimulados);
      }
      
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchAulas();
  }, [filterModalidade, filterStatus]); // Recarrega quando filtros mudam

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      // Em produção, faça a chamada à API
      // fetch("http://localhost:8000/aulas_api.php", {
      //   method: "DELETE",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ id: id }),
      // })
      //   .then(() => {
      //     const novasAulas = aulas.filter((aula) => aula.ID_AULA !== id);
      //     setAulas(novasAulas);
          
      //     // Atualiza o pai com os novos dados
      //     if (onDataLoaded) {
      //       onDataLoaded(novasAulas);
      //     }
      //   })
      //   .catch((err) => console.error(err));

      // Simulação
      const novasAulas = aulas.filter((aula) => aula.ID_AULA !== id);
      setAulas(novasAulas);
      
      if (onDataLoaded) {
        onDataLoaded(novasAulas);
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchAulas(query);
  };

  // Funções auxiliares
  const getModalidadeNome = (id) => {
    const modalidade = modalidades.find(m => m.id == id);
    return modalidade ? modalidade.nome : 'Modalidade';
  };

  const getModalidadeCor = (id) => {
    const modalidade = modalidades.find(m => m.id == id);
    return modalidade ? modalidade.cor : 'bg-gray-500';
  };

  const getInstrutorNome = (id) => {
    const instrutor = instrutores.find(i => i.id == id);
    return instrutor ? instrutor.nome : 'Instrutor';
  };

  const getUnidadeNome = (id) => {
    const unidade = unidades.find(u => u.id == id);
    return unidade ? unidade.nome : 'Unidade';
  };

  const getDiaNome = (sigla) => {
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
    return timeString.substring(0, 5);
  };

  // Opcional: Atualizar estatísticas quando aulas mudar
  useEffect(() => {
    if (onDataLoaded) {
      onDataLoaded(aulas);
    }
  }, [aulas, onDataLoaded]);

  return (
    <div className="w-full">
      {/* Barra de Controles */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar aula..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select 
            value={filterModalidade}
            onChange={(e) => setFilterModalidade(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="TODAS">Todas Modalidades</option>
            {modalidades.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="TODAS">Todos Status</option>
            <option value="ATIVA">Ativa</option>
            <option value="INATIVA">Inativa</option>
          </select>

          <button
            onClick={() => openPopUp("create", null)}
            className="px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <span className="text-lg">+</span>
            Nova Aula
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm">Aula</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm">Modalidade</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm">Instrutor</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm">Horário</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm">Vagas</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm">Status</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                      <p className="mt-3 text-gray-600 text-sm">Carregando aulas...</p>
                    </div>
                  </td>
                </tr>
              ) : aulas.length > 0 ? (
                aulas.map((aula) => (
                  <tr 
                    key={aula.ID_AULA} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{aula.NOME_AULA}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MdLocationOn className="text-gray-400" size={12} />
                          <span className="text-xs text-gray-600">{getUnidadeNome(aula.ID_UNIDADE)}</span>
                          <FiCalendar className="text-gray-400 ml-1" size={12} />
                          <span className="text-xs text-gray-600">{getDiaNome(aula.DIA_SEMANA)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getModalidadeCor(aula.ID_MODALIDADE)}`}
                      >
                        {getModalidadeNome(aula.ID_MODALIDADE)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdPerson className="text-blue-600 text-xs" />
                        </div>
                        <span className="text-sm">{getInstrutorNome(aula.ID_INSTRUTOR)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-gray-400 text-sm" />
                        <span className="font-medium text-sm">{formatTime(aula.HORARIO_INICIO)}</span>
                        <span className="text-gray-500 text-xs">({aula.DURACAO_MINUTOS}min)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (aula.VAGAS / 30) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 font-semibold text-sm">{aula.VAGAS}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        aula.STATUS_AULA === 'ATIVA' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {aula.STATUS_AULA === 'ATIVA' ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openPopUp("edit", aula.ID_AULA)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Editar"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(aula.ID_AULA)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Excluir"
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <button
                          onClick={() => openPopUp("view", aula.ID_AULA)}
                          className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
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
                      <div className="text-4xl mb-3 text-gray-300">🎯</div>
                      <p className="text-lg font-semibold text-gray-700 mb-1">Nenhuma aula encontrada</p>
                      <p className="text-gray-500 text-sm">
                        {searchQuery || filterModalidade !== "TODAS" || filterStatus !== "TODAS" 
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
            fetchAulas(searchQuery);
            closePopUp();
          }}
        />
      )}
    </div>
  );
}

export default TableAulas;