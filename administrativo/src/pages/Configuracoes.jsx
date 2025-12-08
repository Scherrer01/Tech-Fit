import { useState, useEffect } from "react";
import Button from "../components/Button";
import Aside from "../components/Aside";
import Inputs from "../components/Inputs";
import { useAuth } from "../contexts/AuthContext"; // Se você tiver

function ConfiguracoesPerfil() {
  const [dadosUsuario, setDadosUsuario] = useState({
    NOME: "",
    EMAIL: "",
    TELEFONE: "",
    CPF: "",
    NASCIMENTO: "",
    ENDERECO: "",
    CIDADE: "",
    ESTADO: "",
    CEP: "",
    FOTO_PERFIL: "",
    BIO: ""
  });

  const [fotoPreview, setFotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [uploadProgress, setUploadProgress] = useState(0);

  // Carregar dados do usuário da API
  const carregarDadosUsuario = async () => {
    setLoading(true);
    try {
      // Se você tem um ID de usuário no contexto
      // const { user } = useAuth();
      // const userId = user?.ID_USUARIO;
      
      // Para teste, use um ID fixo ou pegue do localStorage
      const usuarioLocal = localStorage.getItem('usuario');
      let userId = 1; // ID padrão para teste
      
      if (usuarioLocal) {
        const usuarioData = JSON.parse(usuarioLocal);
        userId = usuarioData.ID_USUARIO || 1;
      }

      // Buscar dados do usuário
      const response = await fetch(`http://localhost:8000/usuarioAPI.php?id=${userId}`);
      const data = await response.json();

      if (data.success) {
        const usuario = data.usuario;
        setDadosUsuario({
          NOME: usuario.NOME || "",
          EMAIL: usuario.EMAIL || "",
          TELEFONE: usuario.TELEFONE || "",
          CPF: usuario.CPF || "",
          NASCIMENTO: usuario.NASCIMENTO ? usuario.NASCIMENTO.split('T')[0] : "",
          ENDERECO: usuario.ENDERECO || "",
          CIDADE: usuario.CIDADE || "",
          ESTADO: usuario.ESTADO || "",
          CEP: usuario.CEP || "",
          FOTO_PERFIL: usuario.FOTO_PERFIL || "",
          BIO: usuario.BIO || ""
        });

        if (usuario.FOTO_PERFIL) {
          setFotoPreview(`http://localhost:8000/uploads/${usuario.FOTO_PERFIL}`);
        }
      } else {
        setMensagem({ tipo: "erro", texto: data.message || "Erro ao carregar dados" });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setMensagem({ tipo: "erro", texto: "Erro de conexão com o servidor" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  // Manipular upload de foto
  const handleUploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!tiposPermitidos.includes(file.type)) {
      setMensagem({ tipo: "erro", texto: "Apenas imagens JPG, PNG ou GIF são permitidas." });
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMensagem({ tipo: "erro", texto: "A imagem deve ter no máximo 5MB." });
      return;
    }

    setSalvando(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('foto', file);
      formData.append('idUsuario', 1); // Substitua pelo ID real do usuário

      const response = await fetch('http://localhost:8000/uploadFotoAPI.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setFotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Atualizar estado com nome do arquivo
        setDadosUsuario(prev => ({
          ...prev,
          FOTO_PERFIL: data.filename
        }));

        setMensagem({ tipo: "sucesso", texto: "Foto atualizada com sucesso!" });
      } else {
        setMensagem({ tipo: "erro", texto: data.message || "Erro ao fazer upload" });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      setMensagem({ tipo: "erro", texto: "Erro ao fazer upload da foto." });
    } finally {
      setSalvando(false);
      setUploadProgress(0);
    }
  };

  // Remover foto
  const handleRemoverFoto = async () => {
    if (!window.confirm("Tem certeza que deseja remover sua foto de perfil?")) {
      return;
    }

    setSalvando(true);
    try {
      const response = await fetch('http://localhost:8000/removerFotoAPI.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: 1 }) // Substitua pelo ID real
      });

      const data = await response.json();

      if (data.success) {
        setFotoPreview("");
        setDadosUsuario(prev => ({
          ...prev,
          FOTO_PERFIL: ""
        }));
        setMensagem({ tipo: "sucesso", texto: "Foto removida com sucesso!" });
      } else {
        setMensagem({ tipo: "erro", texto: data.message || "Erro ao remover foto" });
      }
    } catch (error) {
      console.error("Erro ao remover foto:", error);
      setMensagem({ tipo: "erro", texto: "Erro de conexão" });
    } finally {
      setSalvando(false);
    }
  };

  // Atualizar dados do perfil
  const handleAtualizarPerfil = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      // Pegar ID do usuário (substitua pela forma correta)
      const usuarioLocal = localStorage.getItem('usuario');
      const usuarioData = usuarioLocal ? JSON.parse(usuarioLocal) : {};
      const userId = usuarioData.ID_USUARIO || 1;

      const dadosAtualizados = {
        id: userId,
        nome: dadosUsuario.NOME,
        email: dadosUsuario.EMAIL,
        telefone: dadosUsuario.TELEFONE,
        cpf: dadosUsuario.CPF,
        nascimento: dadosUsuario.NASCIMENTO,
        endereco: dadosUsuario.ENDERECO,
        cidade: dadosUsuario.CIDADE,
        estado: dadosUsuario.ESTADO,
        cep: dadosUsuario.CEP,
        bio: dadosUsuario.BIO
      };

      const response = await fetch('http://localhost:8000/atualizarUsuarioAPI.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });

      const data = await response.json();

      if (data.success) {
        setMensagem({ tipo: "sucesso", texto: "Perfil atualizado com sucesso!" });
        
        // Atualizar localStorage se necessário
        if (usuarioLocal) {
          const usuarioAtualizado = { ...JSON.parse(usuarioLocal), ...dadosAtualizados };
          localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
        }
      } else {
        setMensagem({ tipo: "erro", texto: data.message || "Erro ao atualizar perfil" });
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setMensagem({ tipo: "erro", texto: "Erro de conexão com o servidor" });
    } finally {
      setSalvando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <main style={{ marginLeft: "18vw", padding: "2rem", position: "relative", zIndex: 5 }}>
        <Aside />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ marginLeft: "18vw", padding: "2rem", position: "relative", zIndex: 5 }}>
      <Aside />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Configurações do Perfil</h1>
              <p className="text-gray-600 text-sm mt-1">Atualize suas informações pessoais e foto de perfil</p>
            </div>
          </div>
        </div>

        {/* Mensagem de Status */}
        {mensagem.texto && (
          <div className={`mb-6 p-4 rounded-lg border ${
            mensagem.tipo === "sucesso" 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {mensagem.tipo === "sucesso" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{mensagem.texto}</span>
            </div>
          </div>
        )}

        {/* Formulário do Perfil */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Coluna da Foto */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Foto de Perfil */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 mx-auto">
                        {fotoPreview ? (
                          <img 
                            src={fotoPreview} 
                            alt="Foto de perfil" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                            <span className="text-5xl text-white font-bold">
                              {dadosUsuario.NOME ? dadosUsuario.NOME.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                        )}
                        
                        {/* Progresso do Upload */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <div className="text-white font-bold text-lg">{uploadProgress}%</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Botões da Foto */}
                    <div className="mt-6 space-y-3">
                      <div>
                        <input
                          type="file"
                          id="fotoUpload"
                          accept="image/*"
                          onChange={handleUploadFoto}
                          className="hidden"
                          disabled={salvando}
                        />
                        <label htmlFor="fotoUpload">
                          <Button
                            variant="outline"
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                            disabled={salvando}
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {salvando ? "Enviando..." : "Alterar Foto"}
                          </Button>
                        </label>
                      </div>
                      
                      {fotoPreview && (
                        <Button
                          variant="outline"
                          onClick={handleRemoverFoto}
                          className="w-full border-red-600 text-red-600 hover:bg-red-50"
                          disabled={salvando}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remover Foto
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-3">
                      PNG, JPG ou GIF. Máximo 5MB.
                    </p>
                  </div>
                  
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografia
                    </label>
                    <textarea
                      name="BIO"
                      value={dadosUsuario.BIO}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Conte um pouco sobre você..."
                      disabled={salvando}
                    />
                  </div>
                </div>
              </div>
              
              {/* Coluna de Dados Pessoais */}
              <div className="lg:col-span-2">
                <form onSubmit={handleAtualizarPerfil}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Nome */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <Inputs
                        type="text"
                        name="NOME"
                        value={dadosUsuario.NOME}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        required
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <Inputs
                        type="email"
                        name="EMAIL"
                        value={dadosUsuario.EMAIL}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* Telefone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <Inputs
                        type="text"
                        name="TELEFONE"
                        value={dadosUsuario.TELEFONE}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                        mask="(99) 99999-9999"
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* CPF */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        CPF
                      </label>
                      <Inputs
                        type="text"
                        name="CPF"
                        value={dadosUsuario.CPF}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        mask="999.999.999-99"
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* Data Nascimento */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Data de Nascimento
                      </label>
                      <Inputs
                        type="date"
                        name="NASCIMENTO"
                        value={dadosUsuario.NASCIMENTO}
                        onChange={handleChange}
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* CEP */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        CEP
                      </label>
                      <Inputs
                        type="text"
                        name="CEP"
                        value={dadosUsuario.CEP}
                        onChange={handleChange}
                        placeholder="00000-000"
                        mask="99999-999"
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* Endereço */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Endereço
                      </label>
                      <Inputs
                        type="text"
                        name="ENDERECO"
                        value={dadosUsuario.ENDERECO}
                        onChange={handleChange}
                        placeholder="Rua, número, complemento"
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* Cidade */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Cidade
                      </label>
                      <Inputs
                        type="text"
                        name="CIDADE"
                        value={dadosUsuario.CIDADE}
                        onChange={handleChange}
                        placeholder="Cidade"
                        disabled={salvando}
                      />
                    </div>
                    
                    {/* Estado */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <select
                        name="ESTADO"
                        value={dadosUsuario.ESTADO}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={salvando}
                      >
                        <option value="">Selecione</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Botões */}
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMensagem({ tipo: "", texto: "" })}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={salvando}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={salvando}
                    >
                      {salvando ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Salvando...
                        </span>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ConfiguracoesPerfil;