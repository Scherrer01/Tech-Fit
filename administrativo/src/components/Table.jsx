
import { useEffect, useState } from "react";

function Table (){
   const [alunos, setAlunos]= useState([]);

  useEffect(()=>{
    fetch("http://localhost:8000/alunosAPI.php", {
      method: 'GET',})
      .then((res) => res.json())
      .then((data) => setAlunos(data))
      .catch(err => console.error(err))
  }, []);
  
    return(
<table className="table-auto w-full border-collapse border border-gray-300">
  <thead className="bg-red-950 text-white">
    <tr>
      <th className="px-4 py-2 border-2">ID</th>
      <th className="px-4 py-2 border-2">Nome</th>
      <th className="px-4 py-2 border-2">Email</th>
      <th className="px-4 py-2 border-2">Telefone</th>
      <th className="px-4 py-2 border-2">sexo</th>
      <th className="px-4 py-2 border-2">Status</th>
      
    </tr>  
  </thead>
  <tbody>
    {alunos.map((aluno)=>(

      <tr key={aluno.ID_ALUNO} className="bg-red-950">
      <td className="px-4 py-2 w-6 border-2">{aluno.ID_ALUNO}</td>
      <td className="px-4 py-2 text-center border-2" >{aluno.NOME}</td>
      <td className="px-4 py-2 text-center border-2">{aluno.EMAIL}</td>
      <td className="px-4 py-2 text-center border-2">{aluno.TELEFONE}</td>
      <td className="px-4 py-2 text-center border-2">{aluno.SEXO}</td>
      <td className="px-4 py-2 text-center border-2">{aluno.STATUS_ALUNO}</td>
    </tr>
    ))}
  </tbody>
</table>

    )
}

export default Table