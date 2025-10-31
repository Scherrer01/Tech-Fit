import { useState, } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import Inputs from './components/Inputs'

function App() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('')
  const [mensagem,setMensagem]= useState('')

 const navigate = useNavigate()
  function onLoginClick() {
    const encontrado = usuarios.find((u)=>u.usuario === usuario && u.senha === senha)
    
    if( encontrado ){
    setMensagem (`Bem vindo, ${encontrado.usuario}`)
    const query = new URLSearchParams();
    query.set("title", encontrado.nome); 

    setTimeout(()=>{
      navigate(`/index?${query.toString()}`);

    },3000)
    }else{
      setMensagem("Usuario ou senha não encontrado! Tente novamente.")
    }

  } 


  let usuarios = [{
    id: 1,
    nome: "Henrique Delgado",
    usuario: "Henrique_delgado",
    senha: "1234",
    status: true
  },{
    id: 2,
    nome:"Diogo Scherrer",
    usuario: "Diogo_scherrer",
    senha: "diogo123",
    status: true
  },{
    id: 3,
    nome:"Gabriel Marques",
    usuario:"Gabriel_marques",
    senha: "G1234",
    status: false
  }]



  return (
    <div className="container">
      <img  className="logo"src="/justgorila.png" alt="Logo-TechFit" />
      
      <h1 className="title">Tech Fit</h1>

      <label className='label' id="usuarios">Username</label>
      <Inputs type="text" placeholder="Digite seu usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)}/>
    

      <label className='label' type="password">Senha</label>
      <Inputs  type="password" placeholder='Digite sua senha' value={senha} onChange={(e) => setSenha(e.target.value)}/>
   
      
      <p id="mensagem-login" className={mensagem.includes('Bem vindo')? 'mensagem-sucesso':'mensagem-erro'} >{mensagem}</p>
      <button onClick={onLoginClick} className="btn-login" >Entrar</button>

    </div>

  
  )
}


export default App
