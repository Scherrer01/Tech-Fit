import { useEffect, useState } from "react";
import { FiX, FiClock, FiCalendar, FiUsers } from "react-icons/fi";
import { MdFitnessCenter, MdLocationOn, MdPerson } from "react-icons/md";

function PopUpAulas({ isOpen, onClose, mode, aulaId, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_aula: '',
    id_modalidade: '',
    id_instrutor: '',
    id_unidade: '',
    dia_semana: 'SEG',
    horario_inicio: '08:00',
    duracao_minutos: 60,
    vagas: 30,
    status_aula: 'ATIVA'
  });

  const [loading, setLoading] = useState(false);

  const modalidades = [
    { id: 1, nome: 'Musculação' },
    { id: 2, nome: 'CrossFit' },
    { id: 3, nome: 'Funcional' },
    { id: 4, nome: 'Spinning' },
    { id: 5, nome: 'Yoga' },
    { id: 6, nome: 'Pilates' }
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

  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      // Buscar dados da aula
      // Simulação - em produção faça fetch da API
      setFormData({
        nome_aula: 'Musculação Iniciante',
        id_modalidade: '1',
        id_instrutor: '1',
        id_unidade: '1',
        dia_semana: 'SEG',
        horario_inicio: '08:00',
        duracao_minutos: 60,
        vagas: 20,
        status_aula: 'ATIVA'
      });
    }
  }, [mode, aulaId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Em produção, faça a chamada à API
      // const url = mode === 'create' 
      //   ? 'http://localhost:8000/aulas_api.php'
      //   : 'http://localhost:8000/aulas_api.php';
      
      // const method = mode === 'create' ? 'POST' : 'PUT';
      
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(mode === 'create' ? formData : { ...formData, id: aulaId })
      // });
      
      // if (response.ok) {
      //   onSuccess();
      // }

      // Simulação
      setTimeout(() => {
        onSuccess();
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Nova Aula' : 
               mode === 'edit' ? 'Editar Aula' : 
               'Detalhes da Aula'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiX className="text-gray-500 text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome da Aula */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Aula *
              </label>
              <input
                type="text"
                name="nome_aula"
                value={formData.nome_aula}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                placeholder="Ex: Yoga Iniciante"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Modalidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade *
              </label>
              <select
                name="id_modalidade"
                value={formData.id_modalidade}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Selecione...</option>
                {modalidades.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>

            {/* Instrutor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrutor
              </label>
              <select
                name="id_instrutor"
                value={formData.id_instrutor}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecione...</option>
                {instrutores.map(i => (
                  <option key={i.id} value={i.id}>{i.nome}</option>
                ))}
              </select>
            </div>

            {/* Dia da Semana */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dia da Semana
              </label>
              <select
                name="dia_semana"
                value={formData.dia_semana}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="SEG">Segunda-feira</option>
                <option value="TER">Terça-feira</option>
                <option value="QUA">Quarta-feira</option>
                <option value="QUI">Quinta-feira</option>
                <option value="SEX">Sexta-feira</option>
                <option value="SAB">Sábado</option>
                <option value="DOM">Domingo</option>
              </select>
            </div>

            {/* Horário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário
              </label>
              <select
                name="horario_inicio"
                value={formData.horario_inicio}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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

            {/* Duração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração (minutos)
              </label>
              <input
                type="number"
                name="duracao_minutos"
                value={formData.duracao_minutos}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                min="15"
                max="180"
                step="15"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Vagas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vagas Disponíveis
              </label>
              <input
                type="number"
                name="vagas"
                value={formData.vagas}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status_aula"
                    value="ATIVA"
                    checked={formData.status_aula === 'ATIVA'}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="mr-2 disabled:cursor-not-allowed"
                  />
                  <span>Ativa</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status_aula"
                    value="INATIVA"
                    checked={formData.status_aula === 'INATIVA'}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className="mr-2 disabled:cursor-not-allowed"
                  />
                  <span>Inativa</span>
                </label>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
            >
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </button>
            
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : mode === 'create' ? 'Criar Aula' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PopUpAulas;