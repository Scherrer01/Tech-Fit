import { useState, } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import Inputs from './components/Inputs'

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
function App() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('')
  const [mensagem,setMensagem]= useState('')

 const navigate = useNavigate()
  function onLoginClick(event) {
    event.preventDefault()
    const encontrado = usuarios.find((u)=>u.usuario === usuario && u.senha === senha)
    
    if( encontrado ){
    setMensagem (`Bem vindo, ${encontrado.usuario},redirecionando ...`)
      if(encontrado.status === false){
        setMensagem ('Usuário desativado!')

      }else{
        const query = new URLSearchParams();
        query.set("title", encontrado.nome); 
        
        setTimeout(()=>{
          navigate(`/index?${query.toString()}`);
          
        },3000)
      }
    }else if(usuario === '' || senha  === ''){
      setMensagem('Insira todos os campos!')
    }else{

      setMensagem("Usuario ou senha não encontrado! Tente novamente.")
    }

  } 

  return (
    <form className="container" method='get' id="fomulario">
      <img  className="logo"src="/justgorila.png" alt="Logo-TechFit" />
      
      <h1 className="title">Tech Fit</h1>

      <label className='label' id="usuarios">Username:</label>
      <Inputs type="text" placeholder="Digite seu usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} requested/>
    

      <label className='label' type="password">Senha:</label>
      <Inputs  type="password" placeholder='Digite sua senha' value={senha} onChange={(e) => setSenha(e.target.value)} requested/>
   
      
      <p id="mensagem-login" className={mensagem.includes('Bem vindo')? 'mensagem-sucesso':'mensagem-erro'} >{mensagem}</p>
      <button onClick={onLoginClick} className="btn-login" type='submit'>Entrar</button>

    </form>

  
  )
}


export default App
