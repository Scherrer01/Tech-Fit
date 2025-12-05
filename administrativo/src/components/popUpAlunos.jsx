import Inputs from "./Inputs";
import { useState, useEffect } from "react";

function PopUpAlunos({ isOpen, onClose, mode = "create", alunoId }) {
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    nascimento: "",
    telefone: "",
    cpf: "",
    sexo: "",
    email: "",
    senha: "",
    plano: "",
    status: "ATIVO",
  });

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Buscar aluno no modo edição
  useEffect(() => {
    if (isOpen && mode === "edit" && alunoId) {
      const fetchAluno = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:8000/alunosAPI.php?idAlunos=${alunoId}`,
            {
              method: "GET"
            }
          );

          const result = await response.json();
          console.log("Dados recebidos da API:", result);

          setFormData({
            nome: result.NOME || "",
            endereco: result.ENDERECO || "",
            nascimento: result.NASCIMENTO || "",
            telefone: result.TELEFONE || "",
            cpf: result.CPF || "",
            sexo: result.SEXO || "",
            email: result.EMAIL || "",
            senha: "",
            plano: result.ID_PLANO || "",
            status: result.STATUS_ALUNO || "ATIVO",
          });
          
        } catch (error) {
          console.error("Erro ao buscar aluno:", error);
          setMensagem("Erro ao carregar dados do aluno.");
        } finally {
          setLoading(false);
        }
      };

      fetchAluno();
    } else if (isOpen && mode === "create") {
      setFormData({
        nome: "",
        endereco: "",
        nascimento: "",
        telefone: "",
        cpf: "",
        sexo: "",
        email: "",
        senha: "",
        plano: "",
        status: "ATIVO",
      });
      setMensagem("");
      setSuccess(false);
    }
  }, [isOpen, mode, alunoId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    setSuccess(false);

    if (!formData.plano || formData.plano === "") {
      setMensagem("Por favor, selecione um plano.");
      setLoading(false);
      return;
    }

    const planoId = parseInt(formData.plano);
    if (isNaN(planoId) || planoId < 1 || planoId > 3) {
      setMensagem("Por favor, selecione um plano válido.");
      setLoading(false);
      return;
    }

    try {
      const url = "http://localhost:8000/alunosAPI.php";
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        nome: formData.nome.trim(),
        endereco: formData.endereco.trim(),
        nascimento: formData.nascimento,
        telefone: formData.telefone.trim(),
        CPF: formData.cpf.trim(),
        sexo: formData.sexo,
        email: formData.email.trim(),
        senha_hash: formData.senha.trim(),
        statusAluno: formData.status.trim(),
        Id_plano: planoId,
      };

      // Adicionar idAlunos apenas no modo edição
      if (mode === "edit") {
        payload.idAlunos = parseInt(alunoId);
      }

      console.log("Enviando dados para API:", payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Resposta completa do servidor:", result);

      if (response.ok) {
        setMensagem(mode === "create" ? "Aluno cadastrado com sucesso!" : "Aluno atualizado com sucesso!");
        setSuccess(true);
        
        setTimeout(() => {
          onClose();
          window.location.reload(); // Recarrega a página para atualizar os dados
        }, 1500);
        
      } else {
        setMensagem(result.message || `Erro ${response.status}: ${response.statusText}`);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setMensagem("Erro de conexão com o servidor.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-red-900/20 to-gray-900 p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {mode === "create" ? "➕ Novo Aluno" : "✏️ Editar Aluno"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {mode === "create" 
                  ? "Preencha os dados para cadastrar um novo aluno" 
                  : "Atualize as informações do aluno"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mensagem de Status */}
        {mensagem && (
          <div className={`mx-6 mt-4 p-4 rounded-lg border ${
            success 
              ? 'bg-green-900/20 border-green-800 text-green-300' 
              : 'bg-red-900/20 border-red-800 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {success ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{mensagem}</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mx-6 mt-4">
            <div className="flex items-center justify-center gap-3 text-blue-400">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          </div>
        )}

        {/* Formulário */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid de Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Nome */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  placeholder="Digite o nome completo" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  Email <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="exemplo@email.com" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  CPF <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="cpf" 
                  value={formData.cpf} 
                  onChange={handleChange} 
                  placeholder="000.000.000-00" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="telefone" 
                  value={formData.telefone} 
                  onChange={handleChange} 
                  placeholder="(11) 99999-9999" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Nascimento */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  Data de Nascimento <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="date" 
                  name="nascimento" 
                  value={formData.nascimento} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <select 
                  name="sexo" 
                  value={formData.sexo} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                  disabled={loading}
                >
                  <option value="" className="bg-gray-900">Selecione o sexo</option>
                  <option value="MASCULINO" className="bg-gray-900">Masculino</option>
                  <option value="FEMININO" className="bg-gray-900">Feminino</option>
                  <option value="OUTRO" className="bg-gray-900">Outro</option>
                </select>
              </div>

              {/* Endereço */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-red-400">
                  Endereço <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="endereco" 
                  value={formData.endereco} 
                  onChange={handleChange} 
                  placeholder="Rua, número, bairro, cidade - Estado" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  Senha {mode === "edit" && <span className="text-gray-500">(Opcional)</span>}
                  {mode === "create" && <span className="text-red-500">*</span>}
                </label>
                <Inputs 
                  type="password" 
                  name="senha" 
                  value={formData.senha} 
                  onChange={handleChange} 
                  placeholder={mode === "edit" ? "Deixe em branco para manter" : "Digite a senha"}
                  required={mode === "create"} 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-red-400">
                  Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                  disabled={loading}
                >
                  <option value="" className="bg-gray-900">Selecione o status</option>
                  <option value="ATIVO" className="bg-gray-900">Ativo</option>
                  <option value="SUSPENSO" className="bg-gray-900">Suspenso</option>
                  <option value="INATIVO" className="bg-gray-900">Inativo</option>
                </select>
              </div>

              {/* Plano */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-red-400">
                  Plano <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.plano === "1" 
                      ? 'border-red-500 bg-red-900/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`} onClick={() => !loading && setFormData({...formData, plano: "1"})}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">Básico</span>
                      <span className="text-red-400 font-bold">R$ 89,00</span>
                    </div>
                    <p className="text-sm text-gray-400">Musculação + 1 aula/semana</p>
                  </div>
                  
                  <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.plano === "2" 
                      ? 'border-red-500 bg-red-900/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`} onClick={() => !loading && setFormData({...formData, plano: "2"})}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">Premium</span>
                      <span className="text-red-400 font-bold">R$ 129,00</span>
                    </div>
                    <p className="text-sm text-gray-400">Aulas ilimitadas + Cardio</p>
                  </div>
                  
                  <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.plano === "3" 
                      ? 'border-red-500 bg-red-900/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`} onClick={() => !loading && setFormData({...formData, plano: "3"})}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">Elite</span>
                      <span className="text-red-400 font-bold">R$ 180,00</span>
                    </div>
                    <p className="text-sm text-gray-400">Personal + Avaliação física</p>
                  </div>
                </div>
                
                <input 
                  type="hidden" 
                  name="plano" 
                  value={formData.plano} 
                  required 
                />
                
                {!formData.plano && (
                  <p className="text-red-500 text-sm mt-2">
                    ⚠️ Selecione um plano para continuar
                  </p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  loading || !formData.plano
                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white'
                }`}
                disabled={loading || !formData.plano}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === "create" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Cadastrar Aluno
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Salvar Alterações
                      </>
                    )}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PopUpAlunos;