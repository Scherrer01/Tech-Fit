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
  });

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  // Buscar aluno no modo edição
  useEffect(() => {
    if (isOpen && mode === "edit" && alunoId) {
      const fetchAluno = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/alunosAPI.php?id=${alunoId}`);
          const result = await response.json();
          console.log("Dados recebidos da API:", result);
          
          setFormData({
            nome: result.nome || "",
            endereco: result.endereco || "",
            nascimento: result.nascimento || "",
            telefone: result.telefone || "",
            cpf: result.cpf || result.CPF || "",
            sexo: result.sexo || "",
            email: result.email || "",
            senha: "", // Sempre vazio por segurança
            plano: result.Id_plano?.toString() || result.ID_PLANO?.toString() || result.plano?.toString() || "",
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
      });
      setMensagem("");
    }
  }, [isOpen, mode, alunoId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      // 🔥 CORREÇÃO CRÍTICA: Mudar de ID_PLANO para Id_plano
      const payload = {
        nome: formData.nome.trim(),
        endereco: formData.endereco.trim(),
        nascimento: formData.nascimento,
        telefone: formData.telefone.trim(),
        CPF: formData.cpf.trim(),
        sexo: formData.sexo,
        email: formData.email.trim(),
        senha_hash: formData.senha.trim(),
        statusAluno: "ativo",
        Id_plano: planoId, // 🔥 MUDOU AQUI - agora corresponde à API
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
        
        setTimeout(() => {
          setMensagem("");
          onClose();
        }, 2000);
        
      } else {
        setMensagem(result.message || `Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setMensagem("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg w-full max-w-4xl shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-red-800 text-center">
          {mode === "create" ? "Criar Aluno" : "Editar Aluno"}
        </h2>

        {mensagem && (
          <p className={`text-center mb-4 ${
            mensagem.includes("sucesso") ? "text-green-500" : "text-red-500"
          }`}>
            {mensagem}
          </p>
        )}

        {loading && (
          <p className="text-center text-blue-500 mb-4">Carregando...</p>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={handleSubmit}>

          {/* Nome */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">Nome Completo</label>
            <Inputs 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              placeholder="Digite o nome" 
              required 
              disabled={loading}
            />
          </div>

          {/* Endereço */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">Endereço</label>
            <Inputs 
              type="text" 
              name="endereco" 
              value={formData.endereco} 
              onChange={handleChange} 
              placeholder="Digite o endereço" 
              required 
              disabled={loading}
            />
          </div>

          {/* Nascimento */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">Nascimento</label>
            <Inputs 
              type="date" 
              name="nascimento" 
              value={formData.nascimento} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          {/* Telefone */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">Telefone</label>
            <Inputs 
              type="text" 
              name="telefone" 
              value={formData.telefone} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          {/* CPF */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">CPF</label>
            <Inputs 
              type="text" 
              name="cpf" 
              value={formData.cpf} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          {/* Sexo */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">Sexo</label>
            <select 
              name="sexo" 
              value={formData.sexo} 
              onChange={handleChange} 
              className="p-2 border rounded bg-black text-white" 
              required
              disabled={loading}
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">Email</label>
            <Inputs 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col">
            <label className="text-red-400 mb-1">
              Senha {mode === "edit" && <span className="text-gray-400">(deixe em branco para manter atual)</span>}
            </label>
            <Inputs 
              type="password" 
              name="senha" 
              value={formData.senha} 
              onChange={handleChange} 
              required={mode === "create"} 
              placeholder={mode === "edit" ? "Nova senha (opcional)" : "Digite a senha"}
              disabled={loading}
            />
          </div>

          {/* Plano */}
          <div className="flex flex-col lg:col-span-3">
            <label className="text-red-400 mb-1">Plano</label>
            <select 
              name="plano" 
              value={formData.plano} 
              onChange={handleChange} 
              className="p-2 border rounded bg-black text-white" 
              required
              disabled={loading}
            >
              <option value="">Selecione um plano...</option>
              <option value="1">Plano Básico</option>
              <option value="2">Plano Premium</option>
              <option value="3">Plano Avançado</option>
            </select>
            {!formData.plano && (
              <p className="text-red-500 text-sm mt-1">Seleção de plano é obrigatória</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-4 lg:col-span-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-600 rounded text-white"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-red-800 text-white rounded disabled:bg-gray-600"
              disabled={loading || !formData.plano}
            >
              {loading ? "Salvando..." : (mode === "create" ? "Criar" : "Salvar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PopUpAlunos;