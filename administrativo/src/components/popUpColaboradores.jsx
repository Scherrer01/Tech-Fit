import Inputs from "./Inputs";
import { useState, useEffect } from "react";

function PopUpColaboradores({ isOpen, onClose, mode = "create", funcionarioId, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_funcionario: "",         // Mudou de "nome" para "nome_funcionario"
    login_rede: "",              // Campo novo que não existia
    cpf_funcionario: "",         // Mudou de "cpf" para "cpf_funcionario"
    nascimento_funcionario: "",  // Mudou de "data_nascimento" para "nascimento_funcionario"
    telefone_funcionario: "",    // Mudou de "telefone" para "telefone_funcionario"
    email_funcionario: "",       // Mudou de "email" para "email_funcionario"
    endereco_funcionario: "",    // Mudou de "endereco" para "endereco_funcionario"
    cargo: "INSTRUTOR",          // Mantém igual
    salario: "",
    data_admissao: new Date().toISOString().split('T')[0],
    turno: "MANHA",              // Correção: no banco é MANHA (sem acento)
    senha_funcionario: "",       // Mudou de "senha" para "senha_funcionario"
    confirmaSenha: ""
  });

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  // Buscar funcionário no modo edição
  // Buscar funcionário no modo edição
useEffect(() => {
  if (isOpen && mode === "edit" && funcionarioId) {
    const fetchFuncionario = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/ColaboradoresAPI.php?id_funcionario=${funcionarioId}`,
          {
            method: "GET",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        const result = await response.json();
        console.log("Dados recebidos da API:", result);

        // Verificar se a API retornou com sucesso
        if (result.success && result.data) {
          const funcionario = result.data;
          
          setFormData({
            nome_funcionario: funcionario.nome_funcionario || "",
            login_rede: funcionario.login_rede || "",
            cpf_funcionario: funcionario.cpf_funcionario || "",
            nascimento_funcionario: funcionario.nascimento_funcionario || "",
            telefone_funcionario: funcionario.telefone_funcionario || "",
            email_funcionario: funcionario.email_funcionario || "",
            endereco_funcionario: funcionario.endereco_funcionario || "",
            cargo: funcionario.cargo || "INSTRUTOR",
            salario: funcionario.salario || "",
            data_admissao: funcionario.data_admissao || new Date().toISOString().split('T')[0],
            turno: funcionario.turno || "MANHA",
            senha_funcionario: "",
            confirmaSenha: ""
          });
          
          console.log("FormData atualizado:", {
            nome_funcionario: funcionario.nome_funcionario,
            login_rede: funcionario.login_rede,
            cpf_funcionario: funcionario.cpf_funcionario,
            nascimento_funcionario: funcionario.nascimento_funcionario,
            telefone_funcionario: funcionario.telefone_funcionario
          });
        } else {
          console.error("API não retornou sucesso ou dados:", result);
          setMensagem("Erro ao carregar dados do funcionário.");
        }
        
      } catch (error) {
        console.error("Erro ao buscar funcionário:", error);
        setMensagem("Erro ao carregar dados do funcionário.");
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionario();
  } else if (isOpen && mode === "create") {
    // Reset para modo criação
    setFormData({
      nome_funcionario: "",
      login_rede: "",
      cpf_funcionario: "",
      nascimento_funcionario: "",
      telefone_funcionario: "",
      email_funcionario: "",
      endereco_funcionario: "",
      cargo: "INSTRUTOR",
      salario: "",
      data_admissao: new Date().toISOString().split('T')[0],
      turno: "MANHA",
      senha_funcionario: "",
      confirmaSenha: ""
    });
    setMensagem("");
    setSuccess(false);
    setErroSenha("");
  }
}, [isOpen, mode, funcionarioId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validação de senha em tempo real
    if (name === 'confirmaSenha' || name === 'senha_funcionario') {
      if (formData.senha_funcionario && formData.confirmaSenha && formData.senha_funcionario !== formData.confirmaSenha) {
        setErroSenha("As senhas não coincidem");
      } else {
        setErroSenha("");
      }
    }
  };

  // Gerar login automaticamente do nome
  const gerarLogin = (nome) => {
    if (!nome) return "";
    return nome.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '.') // Substitui espaços por pontos
      .replace(/[^a-z.]/g, ''); // Remove caracteres não alfabéticos
  };

  // Atualizar login quando o nome mudar
  const handleNomeChange = (e) => {
    const nome = e.target.value;
    setFormData(prev => ({
      ...prev,
      nome_funcionario: nome,
      login_rede: gerarLogin(nome)
    }));
  };

  const validarCPF = (cpf) => {
    if (!cpf) return false;
    
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    setSuccess(false);

    // Validações
    if (mode === "create" && (!formData.senha_funcionario || !formData.confirmaSenha)) {
      setMensagem("Por favor, preencha a senha e confirmação.");
      setLoading(false);
      return;
    }

    if (mode === "create" && formData.senha_funcionario !== formData.confirmaSenha) {
      setMensagem("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (formData.senha_funcionario && formData.senha_funcionario.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (!validarCPF(formData.cpf_funcionario)) {
      setMensagem("CPF inválido.");
      setLoading(false);
      return;
    }

    if (!formData.login_rede) {
      setMensagem("Login de rede é obrigatório.");
      setLoading(false);
      return;
    }

    try {
      const url = "http://localhost:8000/ColaboradoresAPI.php";
      const method = mode === "create" ? "POST" : "PUT";

      // Preparar payload com os nomes corretos dos campos
      const payload = {
        nome_funcionario: formData.nome_funcionario.trim(),
        login_rede: formData.login_rede.trim().toLowerCase(),
        cpf_funcionario: formData.cpf_funcionario.replace(/[^\d]/g, '').trim(),
        nascimento_funcionario: formData.nascimento_funcionario,
        telefone_funcionario: formData.telefone_funcionario.replace(/\D/g, '').trim(),
        email_funcionario: formData.email_funcionario.trim().toLowerCase(),
        endereco_funcionario: formData.endereco_funcionario.trim(),
        cargo: formData.cargo,
        salario: parseFloat(formData.salario) || 0,
        data_admissao: formData.data_admissao,
        turno: formData.turno.toUpperCase().replace('Ã', 'A'), // Remove acento se houver
      };

      // Adicionar senha apenas se foi preenchida
      if (formData.senha_funcionario) {
        payload.senha_funcionario = formData.senha_funcionario.trim();
      }

      // Adicionar id_funcionario apenas no modo edição
      if (mode === "edit" && funcionarioId) {
        payload.id_funcionario = parseInt(funcionarioId);
      }

      console.log("Enviando dados para API:", payload);
      console.log("Payload JSON:", JSON.stringify(payload));

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Resposta completa do servidor:", result);

      if (response.ok && result.success) {
        setMensagem(mode === "create" ? "Funcionário cadastrado com sucesso!" : "Funcionário atualizado com sucesso!");
        setSuccess(true);
        
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess(); // Atualiza a tabela
        }, 1500);
        
      } else {
        setMensagem(result.message || result.error || `Erro ${response.status}: ${response.statusText}`);
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

  const tiposCargo = [
    { value: "INSTRUTOR", label: "Instrutor", desc: "Responsável por aulas e treinos" },
    { value: "RECEPCIONISTA", label: "Recepcionista", desc: "Atendimento ao cliente" },
    { value: "ADMINISTRADOR", label: "Administrador", desc: "Gestão administrativa" },
    { value: "GERENTE", label: "Gerente", desc: "Supervisão geral" },
    { value: "LIMPEZA", label: "Serviços Gerais", desc: "Limpeza e manutenção" },
    { value: "PERSONAL", label: "Personal Trainer", desc: "Acompanhamento individual" }
  ];

  const turnos = [
    { value: "MANHA", label: "Manhã", desc: "06:00 - 12:00" },
    { value: "TARDE", label: "Tarde", desc: "12:00 - 18:00" },
    { value: "NOITE", label: "Noite", desc: "18:00 - 00:00" },
    { value: "ROTATIVO", label: "Rotativo", desc: "Varia conforme necessidade" }
  ];

  const getCargoIcon = (cargo) => {
    switch(cargo) {
      case 'INSTRUTOR': return '🏋️';
      case 'RECEPCIONISTA': return '💁';
      case 'ADMINISTRADOR': return '💼';
      case 'GERENTE': return '👔';
      case 'PERSONAL': return '💪';
      case 'LIMPEZA': return '🧹';
      default: return '👤';
    }
  };

  const getTurnoIcon = (turno) => {
    switch(turno) {
      case 'MANHA': return '🌅';
      case 'TARDE': return '🌞';
      case 'NOITE': return '🌙';
      case 'ROTATIVO': return '🔄';
      default: return '🕐';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start z-50 p-4 w-full max-h-full overflow-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-purple-900/20 to-gray-900 p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {mode === "create" ? "➕ Novo Funcionário" : "✏️ Editar Funcionário"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {mode === "create" 
                  ? "Preencha os dados para cadastrar um novo funcionário" 
                  : "Atualize as informações do funcionário"}
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
              
              {/* Nome Completo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="nome_funcionario" 
                  value={formData.nome_funcionario} 
                  onChange={handleNomeChange} 
                  placeholder="Digite o nome completo" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Login de Rede */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Login de Rede <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="login_rede" 
                  value={formData.login_rede} 
                  onChange={handleChange} 
                  placeholder="nome.sobrenome" 
                  required 
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Gerado automaticamente do nome</p>
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  CPF <span className="text-red-500">*</span>
                </label>
                <Inputs 
                  type="text" 
                  name="cpf_funcionario" 
                  value={formData.cpf_funcionario} 
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
                  name="email_funcionario" 
                  value={formData.email_funcionario} 
                  onChange={handleChange} 
                  placeholder="funcionario@academia.com" 
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
                  name="telefone_funcionario" 
                  value={formData.telefone_funcionario} 
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
                  name="nascimento_funcionario" 
                  value={formData.nascimento_funcionario} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  className="w-full"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-400">
                Endereço Completo <span className="text-red-500">*</span>
              </label>
              <Inputs 
                type="text" 
                name="endereco_funcionario" 
                value={formData.endereco_funcionario} 
                onChange={handleChange} 
                placeholder="Rua, número, bairro, cidade - Estado" 
                required 
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* Cargo, Turno, Data Admissão e Salário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cargo e Turno */}
              <div className="space-y-6">
                {/* Cargo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-400">
                    Cargo/Função <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tiposCargo.map((cargo) => (
                      <div 
                        key={cargo.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center ${
                          formData.cargo === cargo.value 
                            ? 'border-purple-500 bg-purple-900/20' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        onClick={() => !loading && setFormData({...formData, cargo: cargo.value})}
                      >
                        <span className="text-2xl mb-1">{getCargoIcon(cargo.value)}</span>
                        <span className="font-semibold text-white text-sm">{cargo.label}</span>
                        <span className="text-xs text-gray-400 mt-1">{cargo.desc}</span>
                      </div>
                    ))}
                  </div>
                  <input 
                    type="hidden" 
                    name="cargo" 
                    value={formData.cargo} 
                    required 
                  />
                </div>

                {/* Turno */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-400">
                    Turno <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {turnos.map((turno) => (
                      <div 
                        key={turno.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col items-center text-center ${
                          formData.turno === turno.value 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        onClick={() => !loading && setFormData({...formData, turno: turno.value})}
                      >
                        <span className="text-2xl mb-1">{getTurnoIcon(turno.value)}</span>
                        <span className="font-semibold text-white text-sm">{turno.label}</span>
                        <span className="text-xs text-gray-400 mt-1">{turno.desc}</span>
                      </div>
                    ))}
                  </div>
                  <input 
                    type="hidden" 
                    name="turno" 
                    value={formData.turno} 
                    required 
                  />
                </div>
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
                    Salário (R$) <span className="text-red-500">*</span>
                  </label>
                  <Inputs 
                    type="number" 
                    name="salario" 
                    value={formData.salario} 
                    onChange={handleChange} 
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    required
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
                  name="senha_funcionario" 
                  value={formData.senha_funcionario} 
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
                        Cadastrar Funcionário
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