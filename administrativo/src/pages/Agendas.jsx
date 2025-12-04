import Aside from "../components/Aside"
import React, { useState, useEffect } from 'react';

function Agendas (){
const [agendas, setAgendas] = useState([
    {
      id: 1,
      aluno: 'Carlos Silva',
      instrutor: 'Ana Souza',
      tipo: 'Musculação',
      horario: '08:00',
      data: '2023-10-15',
      duracao: '60 min',
      status: 'Confirmado'
    },
    {
      id: 2,
      aluno: 'Maria Oliveira',
      instrutor: 'João Santos',
      tipo: 'CrossFit',
      horario: '10:30',
      data: '2023-10-15',
      duracao: '45 min',
      status: 'Pendente'
    },
    {
      id: 3,
      aluno: 'Roberto Lima',
      instrutor: 'Paula Costa',
      tipo: 'Funcional',
      horario: '14:00',
      data: '2023-10-16',
      duracao: '50 min',
      status: 'Cancelado'
    },
    {
      id: 4,
      aluno: 'Fernanda Rocha',
      instrutor: 'Ricardo Alves',
      tipo: 'Spinning',
      horario: '18:00',
      data: '2023-10-16',
      duracao: '60 min',
      status: 'Confirmado'
    },
  ]);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    id: null,
    aluno: '',
    instrutor: '',
    tipo: 'Musculação',
    horario: '08:00',
    data: '',
    duracao: '60 min',
    status: 'Pendente'
  });

  // Estado para controle de modal e modo de edição
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Efeito para definir a data mínima como hoje
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, data: today }));
  }, []);

  // Manipuladores de eventos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Adicionar nova agenda
  const handleAddAgenda = () => {
    if (!formData.aluno || !formData.instrutor || !formData.data) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const newAgenda = {
      ...formData,
      id: editing ? formData.id : agendas.length > 0 ? Math.max(...agendas.map(a => a.id)) + 1 : 1
    };

    if (editing) {
      // Atualizar agenda existente
      setAgendas(agendas.map(agenda => agenda.id === formData.id ? newAgenda : agenda));
      setEditing(false);
    } else {
      // Adicionar nova agenda
      setAgendas([...agendas, newAgenda]);
    }

    // Limpar formulário e fechar modal
    resetForm();
    setShowModal(false);
  };

  // Editar agenda
  const handleEditAgenda = (agenda) => {
    setFormData(agenda);
    setEditing(true);
    setShowModal(true);
  };

  // Excluir agenda
  const handleDeleteAgenda = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta agenda?')) {
      setAgendas(agendas.filter(agenda => agenda.id !== id));
    }
  };

  // Cancelar edição/adicionar
  const handleCancel = () => {
    resetForm();
    setShowModal(false);
    setEditing(false);
  };

  // Resetar formulário
  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      id: null,
      aluno: '',
      instrutor: '',
      tipo: 'Musculação',
      horario: '08:00',
      data: today,
      duracao: '60 min',
      status: 'Pendente'
    });
  };

  // Filtrar agendas
  const filteredAgendas = agendas.filter(agenda => {
    const matchesSearch = 
      agenda.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.instrutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agenda.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'Todos' || agenda.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Contadores para estatísticas
  const totalAgendas = agendas.length;
  const confirmados = agendas.filter(a => a.status === 'Confirmado').length;
  const pendentes = agendas.filter(a => a.status === 'Pendente').length;
  const cancelados = agendas.filter(a => a.status === 'Cancelado').length;

  // Formatar data para exibição
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen w-10/12 ml-auto bg-gradient-to-br from-gray-900 to-black text-white max-h-[700px] overflow-auto border border-none rounded-lg">
        <Aside></Aside>
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-black to-gray-900 border-b-4 border-red-600 py-6 px-4 shadow-2xl">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-black text-red-600 tracking-wider mb-2">TECH FIT</h1>
            <p className="text-gray-400 tracking-widest text-sm uppercase">ACADEMIA</p>
            <h2 className="text-2xl font-light mt-4 text-white">Sistema de Agendamentos</h2>
          </div>
        </div>  
      </header>

      <main className="container mt-4 mx-auto px-4 py-8 ">
        {/* Painel de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-l-4 w-36 border-red-600 shadow-lg hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-gray-400 text-sm font-medium mb-2 ">Total de Agendas</h3>
            <p className="text-3xl font-bold text-white">{totalAgendas}</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-l-4 w-36 border-green-500 shadow-lg hover:shadow-green-900/30 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Confirmados</h3>
            <p className="text-3xl font-bold text-green-500">{confirmados}</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-l-4 w-36 border-yellow-500 shadow-lg hover:shadow-yellow-900/30 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Pendentes</h3>
            <p className="text-3xl font-bold text-yellow-500">{pendentes}</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-l-4 w-36 border-red-500 shadow-lg hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Cancelados</h3>
            <p className="text-3xl font-bold text-red-500">{cancelados}</p>
          </div>
        </div>

        {/* Painel de controle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-auto md:flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por aluno, instrutor ou tipo de treino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
              <div className="absolute left-4 top-3.5 text-gray-500">
                🔍
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="Todos">Todos os status</option>
              <option value="Confirmado">Confirmados</option>
              <option value="Pendente">Pendentes</option>
              <option value="Cancelado">Cancelados</option>
            </select>
            
            <button 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-red-900/50 transition-all duration-300 flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <span>+</span>
              <span>Nova Agenda</span>
            </button>
          </div>
        </div>

        {/* Tabela de agendas */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl mb-8 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-900 to-black">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Aluno</th>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Instrutor</th>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Tipo</th>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Data</th>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Horário</th>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Duração</th>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Status</th>
                  <th className="py-4 px-6 text-left text-gray-300 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAgendas.length > 0 ? (
                  filteredAgendas.map(agenda => (
                    <tr key={agenda.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6 font-medium">{agenda.aluno}</td>
                      <td className="py-4 px-6">{agenda.instrutor}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          agenda.tipo === 'Musculação' ? 'bg-red-900/40 text-red-300' :
                          agenda.tipo === 'CrossFit' ? 'bg-yellow-900/40 text-yellow-300' :
                          agenda.tipo === 'Funcional' ? 'bg-blue-900/40 text-blue-300' :
                          agenda.tipo === 'Spinning' ? 'bg-purple-900/40 text-purple-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {agenda.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-6">{formatDate(agenda.data)}</td>
                      <td className="py-4 px-6 font-medium">{agenda.horario}</td>
                      <td className="py-4 px-6">{agenda.duracao}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          agenda.status === 'Confirmado' ? 'bg-green-900/40 text-green-400 border border-green-800' :
                          agenda.status === 'Pendente' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-800' :
                          'bg-red-900/40 text-red-400 border border-red-800'
                        }`}>
                          {agenda.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-all duration-300"
                            onClick={() => handleEditAgenda(agenda)}
                          >
                            Editar
                          </button>
                          <button 
                            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-all duration-300"
                            onClick={() => handleDeleteAgenda(agenda.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl mb-4">📅</div>
                        <p className="text-xl mb-2">Nenhuma agenda encontrada</p>
                        <p className="text-gray-400">
                          {searchTerm || filterStatus !== 'Todos' 
                            ? "Tente alterar os filtros de busca" 
                            : "Clique em 'Nova Agenda' para adicionar uma"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-white">Resumo do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-400 text-sm font-medium mb-2">Próximas Agendas</h4>
              <ul className="space-y-2">
                {agendas
                  .filter(a => a.status === 'Confirmado' || a.status === 'Pendente')
                  .sort((a, b) => new Date(a.data) - new Date(b.data))
                  .slice(0, 3)
                  .map(agenda => (
                    <li key={agenda.id} className="flex justify-between items-center">
                      <span className="text-white">{agenda.aluno}</span>
                      <span className="text-gray-400 text-sm">{formatDate(agenda.data)} - {agenda.horario}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-400 text-sm font-medium mb-2">Instrutores mais ocupados</h4>
              <ul className="space-y-2">
                {Array.from(new Set(agendas.map(a => a.instrutor)))
                  .map(instrutor => ({
                    nome: instrutor,
                    count: agendas.filter(a => a.instrutor === instrutor).length
                  }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 3)
                  .map((instrutor, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-white">{instrutor.nome}</span>
                      <span className="text-red-500 font-semibold">{instrutor.count} aulas</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-400 text-sm font-medium mb-2">Tipos mais populares</h4>
              <ul className="space-y-2">
                {Array.from(new Set(agendas.map(a => a.tipo)))
                  .map(tipo => ({
                    nome: tipo,
                    count: agendas.filter(a => a.tipo === tipo).length
                  }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 3)
                  .map((tipo, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-white">{tipo.nome}</span>
                      <span className="text-gray-400">{tipo.count}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modal para adicionar/editar agenda */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-2xl">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                {editing ? 'Editar Agenda' : 'Nova Agenda'}
              </h2>
              <p className="text-gray-400 mt-1">
                {editing ? 'Atualize os dados da agenda selecionada' : 'Preencha os dados para criar uma nova agenda'}
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Aluno *
                  </label>
                  <input
                    type="text"
                    name="aluno"
                    value={formData.aluno}
                    onChange={handleInputChange}
                    placeholder="Nome completo do aluno"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Instrutor *
                  </label>
                  <input
                    type="text"
                    name="instrutor"
                    value={formData.instrutor}
                    onChange={handleInputChange}
                    placeholder="Nome do instrutor responsável"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Tipo de Treino
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="Musculação">Musculação</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Funcional">Funcional</option>
                    <option value="Spinning">Spinning</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Pilates">Pilates</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Duração
                  </label>
                  <select
                    name="duracao"
                    value={formData.duracao}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="30 min">30 minutos</option>
                    <option value="45 min">45 minutos</option>
                    <option value="60 min">60 minutos</option>
                    <option value="90 min">90 minutos</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Horário
                  </label>
                  <select
                    name="horario"
                    value={formData.horario}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Pendente"
                      checked={formData.status === 'Pendente'}
                      onChange={handleInputChange}
                      className="mr-2 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-gray-300">Pendente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Confirmado"
                      checked={formData.status === 'Confirmado'}
                      onChange={handleInputChange}
                      className="mr-2 text-green-600 focus:ring-green-600"
                    />
                    <span className="text-gray-300">Confirmado</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Cancelado"
                      checked={formData.status === 'Cancelado'}
                      onChange={handleInputChange}
                      className="mr-2 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-gray-300">Cancelado</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button 
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-red-900/50"
                  onClick={handleAddAgenda}
                >
                  {editing ? 'Atualizar Agenda' : 'Salvar Agenda'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="bg-gradient-to-r from-black to-gray-900 border-t border-gray-800 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-gray-400 text-center md:text-left">
                Tech Fit Academy © 2023 - Sistema de Agendamentos
              </p>
              <p className="text-gray-500 text-sm mt-1 text-center md:text-left">
                Total de {agendas.length} agendas cadastradas
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-sm">Confirmado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-sm">Pendente</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-sm">Cancelado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

}

export default Agendas