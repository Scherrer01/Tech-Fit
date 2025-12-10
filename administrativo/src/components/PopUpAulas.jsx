// components/PopUpAulas.jsx
import { useState, useEffect } from 'react';
import { FiX, FiSave, FiClock, FiCalendar, FiUsers, FiDollarSign, FiPercent } from 'react-icons/fi';
import { MdFitnessCenter, MdLocationOn, MdPerson, MdDescription } from 'react-icons/md';

const API_URL = "http://localhost:8000/aulas_API.php";

const PopUpAulas = ({ 
  isOpen, 
  onClose, 
  mode, 
  aulaId, 
  onSuccess,
  modalidades = [],
  instrutores = [],
  unidades = [],
  diasSemana = []
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome_aula: '',
    id_modalidade: '',
    id_instrutor: '',
    id_unidade: '',
    dia_semana: 'SEG',
    horario_inicio: '08:00',
    duracao_minutos: 60,
    vagas: 20
  });

  // Buscar dados da aula se estiver editando/visualizando
  useEffect(() => {
    if (isOpen && aulaId && (mode === 'edit' || mode === 'view')) {
      fetchAulaData();
    } else if (mode === 'create') {
      // Resetar form para criação
      setFormData({
        nome_aula: '',
        id_modalidade: '',
        id_instrutor: '',
        id_unidade: '',
        dia_semana: 'SEG',
        horario_inicio: '08:00',
        duracao_minutos: 60,
        vagas: 20
      });
    }
  }, [isOpen, aulaId, mode]);

  const fetchAulaData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?id_aula=${aulaId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData({
          nome_aula: result.data.nome_aula || '',
          id_modalidade: result.data.id_modalidade || '',
          id_instrutor: result.data.id_instrutor || '',
          id_unidade: result.data.id_unidade || '',
          dia_semana: result.data.dia_semana || 'SEG',
          horario_inicio: result.data.horario_inicio?.substring(0, 5) || '08:00',
          duracao_minutos: result.data.duracao_minutos || 60,
          vagas: result.data.vagas || 20
        });
      } else {
        setError('Erro ao carregar dados da aula');
      }
    } catch (err) {
      setError('Falha ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const aulaData = {
        ...formData,
        // Garantir que horário esteja no formato HH:MM:SS
        horario_inicio: formData.horario_inicio.length === 5 ? 
          `${formData.horario_inicio}:00` : formData.horario_inicio
      };

      let url = API_URL;
      let method = 'POST';
      
      if (mode === 'edit' && aulaId) {
        method = 'PUT';
        aulaData.id_aula = aulaId;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aulaData)
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message || 'Erro ao salvar aula');
      }
    } catch (err) {
      setError('Erro na conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseInt(value) || 0
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
        {/* Cabeçalho */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'create' ? 'Nova Aula' : 
               mode === 'edit' ? 'Editar Aula' : 'Detalhes da Aula'}
            </h2>
            <p className="text-sm text-gray-300">
              {mode === 'create' ? 'Preencha os dados para criar uma nova aula' : 
               mode === 'edit' ? 'Modifique os dados da aula' : 'Visualize os detalhes da aula'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <FiX size={24} className="text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome da Aula */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <MdFitnessCenter className="text-red-600" />
                  <span className="text-gray-800">Nome da Aula *</span>
                </div>
              </label>
              <input
                type="text"
                name="nome_aula"
                value={formData.nome_aula}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
                placeholder="Ex: Yoga Avançado"
              />
            </div>

            {/* Modalidade */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <MdFitnessCenter className="text-red-600" />
                  <span className="text-gray-800">Modalidade *</span>
                </div>
              </label>
              <select
                name="id_modalidade"
                value={formData.id_modalidade}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
              >
                <option value="" className="text-gray-500">Selecione uma modalidade</option>
                {modalidades.map((modalidade) => (
                  <option key={modalidade.id} value={modalidade.id} className="text-gray-800">
                    {modalidade.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Instrutor */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <MdPerson className="text-red-600" />
                  <span className="text-gray-800">Instrutor</span>
                </div>
              </label>
              <select
                name="id_instrutor"
                value={formData.id_instrutor}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
              >
                <option value="" className="text-gray-500">Selecione um instrutor (opcional)</option>
                {instrutores.map((instrutor) => (
                  <option key={instrutor.id} value={instrutor.id} className="text-gray-800">
                    {instrutor.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Unidade */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <MdLocationOn className="text-red-600" />
                  <span className="text-gray-800">Unidade</span>
                </div>
              </label>
              <select
                name="id_unidade"
                value={formData.id_unidade}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
              >
                <option value="" className="text-gray-500">Selecione uma unidade (opcional)</option>
                {unidades.map((unidade) => (
                  <option key={unidade.id} value={unidade.id} className="text-gray-800">
                    {unidade.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Dia da Semana */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-red-600" />
                  <span className="text-gray-800">Dia da Semana *</span>
                </div>
              </label>
              <select
                name="dia_semana"
                value={formData.dia_semana}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
              >
                {diasSemana.map((dia) => (
                  <option key={dia.sigla} value={dia.sigla} className="text-gray-800">
                    {dia.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Horário de Início */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <FiClock className="text-red-600" />
                  <span className="text-gray-800">Horário de Início *</span>
                </div>
              </label>
              <input
                type="time"
                name="horario_inicio"
                value={formData.horario_inicio}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
              />
            </div>

            {/* Duração */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <span className="text-gray-800">Duração (minutos) *</span>
              </label>
              <input
                type="number"
                name="duracao_minutos"
                value={formData.duracao_minutos}
                onChange={handleNumberChange}
                disabled={mode === 'view'}
                min="1"
                max="480"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
              />
            </div>

            {/* Vagas */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-red-600" />
                  <span className="text-gray-800">Vagas *</span>
                </div>
              </label>
              <input
                type="number"
                name="vagas"
                value={formData.vagas}
                onChange={handleNumberChange}
                disabled={mode === 'view'}
                min="1"
                max="500"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
              />
            </div>
          </div>

          {/* Rodapé com botões */}
          <div className="mt-8 pt-6 border-t border-gray-300 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-400 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <FiSave />
                    {mode === 'create' ? 'Criar Aula' : 'Salvar Alterações'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUpAulas;