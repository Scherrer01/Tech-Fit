import Inputs from "./Inputs";
import { useState, useEffect } from "react";

function PopUpColaboradores({ isOpen, onClose, mode = "create", colaboradorId, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    nascimento: "",
    telefone: "",
    email: "",
    endereco: "",
    sexo: "",
    tipo: "INSTRUTOR",
    salario: "",
    data_admissao: new Date().toISOString().split('T')[0],
    status: "ATIVO",
    senha: "",
    confirmaSenha: ""
  });

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  // Buscar colaborador no modo edição
  useEffect(() => {
    if (isOpen && mode === "edit" && colaboradorId) {
      const fetchColaborador = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:8000/colaboradoresAPI.php?idColaborador=${colaboradorId}`,
            {
              method: "GET"
            }
          );

          const result = await response.json();
          console.log("Dados recebidos da API:", result);

          setFormData({
            nome: result.NOME || "",
            sobrenome: result.SOBRENOME || "",
            cpf: result.CPF || "",
            nascimento: result.NASCIMENTO ? result.NASCIMENTO.split('T')[0] : "",
            telefone: result.TELEFONE || "",
            email: result.EMAIL || "",
            endereco: result.ENDERECO || "",
            sexo: result.SEXO || "",
            tipo: result.TIPO_COLABORADOR || "INSTRUTOR",
            salario: result.SALARIO || "",
            data_admissao: result.DATA_ADMISSAO ? result.DATA_ADMISSAO.split('T')[0] : new Date().toISOString().split('T')[0],
            status: result.STATUS_COLABORADOR || "ATIVO",
            senha: "",
            confirmaSenha: ""
          });
          
        } catch (error) {
          console.error("Erro ao buscar colaborador:", error);
          setMensagem("Erro ao carregar dados do colaborador.");
        } finally {
          setLoading(false);
        }
      };

      fetchColaborador();
    } else if (isOpen && mode === "create") {
      setFormData({
        nome: "",
        sobrenome: "",
        cpf: "",
        nascimento: "",
        telefone: "",
        email: "",
        endereco: "",
        sexo: "",
        tipo: "INSTRUTOR",
        salario: "",
        data_admissao: new Date().toISOString().split('T')[0],
        status: "ATIVO",
        senha: "",
        confirmaSenha: ""
      });
      setMensagem("");
      setSuccess(false);
      setErroSenha("");
    }
  }, [isOpen, mode, colaboradorId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validação de senha em tempo real
    if (name === 'confirmaSenha' || name === 'senha') {
      if (formData.senha && formData.confirmaSenha && formData.senha !== formData.confirmaSenha) {
        setErroSenha("As senhas não coincidem");
      } else {
        setErroSenha("");
      }
    }
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    // Validação simples de CPF
    let soma = 0;
    let resto;
    
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    setSuccess(false);

    // Validações
    if (mode === "create" && (!formData.senha || !formData.confirmaSenha)) {
      setMensagem("Por favor, preencha a senha e confirmação.");
      setLoading(false);
      return;
    }

    if (mode === "create" && formData.senha !== formData.confirmaSenha) {
      setMensagem("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (!validarCPF(formData.cpf)) {
      setMensagem("CPF inválido.");
      setLoading(false);
      return;
    }

    try {
      const url = "http://localhost:8000/colaboradoresAPI.php";
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        nome: formData.nome.trim(),
        sobrenome: formData.sobrenome.trim(),
        cpf: formData.cpf.replace(/[^\d]/g, '').trim(),
        nascimento: formData.nascimento,
        telefone: formData.telefone.trim(),
        email: formData.email.trim(),
        endereco: formData.endereco.trim(),
        sexo: formData.sexo,
        tipo_colaborador: formData.tipo,
        salario: parseFloat(formData.salario) || 0,
        data_admissao: formData.data_admissao,
        status_colaborador: formData.status.trim(),
      };

      // Adicionar senha apenas se foi preenchida
      if (formData.senha) {
        payload.senha_hash = formData.senha.trim();
      }

      // Adicionar idColaborador apenas no modo edição
      if (mode === "edit") {
        payload.idColaborador = parseInt(colaboradorId);
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
        setMensagem(mode === "create" ? "Colaborador cadastrado com sucesso!" : "Colaborador atualizado com sucesso!");
        setSuccess(true);
        
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess(); // Atualiza a tabela
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

  const tiposColaborador = [
    { value: "INSTRUTOR", label: "Instrutor", desc: "Responsável por aulas e treinos" },
    { value: "RECEPCIONISTA", label: "Recepcionista", desc: "Atendimento ao cliente" },
    { value: "ADMINISTRADOR", label: "Administrador", desc: "Gestão administrativa" },
    { value: "GERENTE", label: "Gerente", desc: "Supervisão geral" },
    { value: "LIMPEZA", label: "Serviços Gerais", desc: "Limpeza e manutenção" },
    { value: "PERSONAL", label: "Personal Trainer", desc: "Acompanhamento individual" }
  ];

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'INSTRUTOR': return '🏋️';
      case 'RECEPCIONISTA': return '💁';
      case 'ADMINISTRADOR': return '💼';
      case 'GERENTE': return '👔';
      case 'PERSONAL': return '💪';
      default: return '👤';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-purple-900/20 to-gray-900 p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {mode === "create" ? "➕ Novo Colaborador" : "✏️ Editar Colaborador"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {mode === "create" 
                  ? "Preencha os dados para cadastrar um novo colaborador" 
                  : "Atualize as informações do colaborador"}
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
            <div className="flex items-center justify-center gap-3 text-purple-400">
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          </div>
        )}

        {/* Formulário */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid de Campos - 1ª Linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Nome */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Nome <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  placeholder="Digite o nome" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Sobrenome */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Sobrenome <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="sobrenome" 
                  value={formData.sobrenome} 
                  onChange={handleChange} 
                  placeholder="Digite o sobrenome" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
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
                  mask="999.999.999-99"
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Email <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="colaborador@academia.com" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
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
                  mask="(99) 99999-9999"
                  className="w-full"
                />
              </div>

              {/* Data Nascimento */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
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
            </div>

            {/* Grid de Campos - 2ª Linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Endereço */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-purple-400">
                  Endereço Completo <span className="text-red-500">*</span>
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

              {/* Sexo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <select 
                  name="sexo" 
                  value={formData.sexo} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                  disabled={loading}
                >
                  <option value="" className="bg-gray-900">Selecione o sexo</option>
                  <option value="MASCULINO" className="bg-gray-900">Masculino</option>
                  <option value="FEMININO" className="bg-gray-900">Feminino</option>
                  <option value="OUTRO" className="bg-gray-900">Outro</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                  disabled={loading}
                >
                  <option value="" className="bg-gray-900">Selecione o status</option>
                  <option value="ATIVO" className="bg-gray-900">Ativo</option>
                  <option value="FERIAS" className="bg-gray-900">Férias</option>
                  <option value="AFASTADO" className="bg-gray-900">Afastado</option>
                  <option value="INATIVO" className="bg-gray-900">Inativo</option>
                </select>
              </div>
            </div>

            {/* Tipo de Colaborador e Data Admissão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tipo de Colaborador */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Cargo/Função <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {tiposColaborador.map((tipo) => (
                    <div 
                      key={tipo.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center ${
                        formData.tipo === tipo.value 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => !loading && setFormData({...formData, tipo: tipo.value})}
                    >
                      <span className="text-2xl mb-1">{getTipoIcon(tipo.value)}</span>
                      <span className="font-semibold text-white text-sm">{tipo.label}</span>
                      <span className="text-xs text-gray-400 mt-1">{tipo.desc}</span>
                    </div>
                  ))}
                </div>
                <input 
                  type="hidden" 
                  name="tipo" 
                  value={formData.tipo} 
                  required 
                />
              </div>

              {/* Data Admissão e Salário */}
              <div className="space-y-6">
                {/* Data Admissão */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-400">
                    Data de Admissão <span className="text-red-500">*</span>
                  </label>
                  <Inputs 
                    type="date" 
                    name="data_admissao" 
                    value={formData.data_admissao} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                {/* Salário */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-400">
                    Salário (R$)
                  </label>
                  <Inputs 
                    type="number" 
                    name="salario" 
                    value={formData.salario} 
                    onChange={handleChange} 
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    disabled={loading}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Senhas - Apenas para criação ou se quiser alterar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-800 pt-6">
              
              {/* Senha */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  {mode === "create" ? "Senha " : "Nova Senha "}
                  {mode === "create" && <span className="text-red-500">*</span>}
                  {mode === "edit" && <span className="text-gray-500">(Opcional)</span>}
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
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              {/* Confirmação de Senha */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  {mode === "create" ? "Confirmar Senha " : "Confirmar Nova Senha "}
                  {mode === "create" && <span className="text-red-500">*</span>}
                </label>
                <Inputs 
                  type="password" 
                  name="confirmaSenha" 
                  value={formData.confirmaSenha} 
                  onChange={handleChange} 
                  placeholder={mode === "edit" ? "Deixe em branco para manter" : "Confirme a senha"}
                  required={mode === "create"} 
                  disabled={loading}
                  className="w-full"
                />
                {erroSenha && (
                  <p className="text-red-500 text-xs mt-1">{erroSenha}</p>
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
                  loading 
                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white'
                }`}
                disabled={loading}
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
                        Cadastrar Colaborador
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

export default PopUpColaboradores;