import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../style/Login.css'
import Inputs from '../components/Inputs'

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const navigate = useNavigate();

  const onLoginClick = async (e) => {
    e.preventDefault();
    setMensagem(""); // limpa mensagens anteriores
    if (usuario.trim() === '' || senha.trim() === '') {
      setMensagem("Insira todos os campos!");
      return;
    }else{

    try {
      const res = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, senha })
      });

      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.status);
      }

      const data = await res.json();
      console.log(data);

      if (data.status === 'sucesso') {
        setMensagem(`Bem-vindo, ${usuario}! Redirecionando...`);
          const query = new URLSearchParams();
          query.set("title", usuario);
          navigate(`/index?${query.toString()}`);
        
      } else {
        setMensagem("Usuário ou senha inválidos. Tente novamente.");
      }

    } catch (erro) {
      console.error("Erro ao conectar ao servidor:", erro);
      setMensagem("Erro ao conectar ao servidor. Verifique se o backend está rodando.");
    }
  }
      }

  return (
    <main className='loginPai'> 

    <form className="container" onSubmit={onLoginClick}>
      <img className="logo" src="/justgorila.png" alt="Logo-TechFit" />
      <h1 className="title">Tech Fit</h1>

      <label className='label' htmlFor="usuario">Username:</label>
      <Inputs
        type="text"
        placeholder="Digite seu usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
        />

      <label className='label' htmlFor="senha">Senha:</label>
      <Inputs
        type="password"
        placeholder="Digite sua senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
        />

      <p id="mensagem-login" className={mensagem.includes('Bem-vindo') ? 'mensagem-sucesso' : 'mensagem-erro'}>
        {mensagem}
      </p>

      <button className="btn-login" type='submit'>Entrar</button>
    </form>
        </main>
  );
}

export default Login;
