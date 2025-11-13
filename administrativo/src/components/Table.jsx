import Inputs from "../components/Inputs";

function Table (){
    return(
<table className="table-auto w-auto border-collapse border border-gray-300">
  <thead className="bg-red-950 text-white">
    <tr>
      <th className="px-4 py-2 border-2">ID</th>
      <th className="px-4 py-2 border-2">Nome</th>
      <th className="px-4 py-2 border-2">Email</th>
      <th className="px-4 py-2 border-2">Status</th>
      <th className="px-4 py-2 border-2">Ações</th>
    </tr>  
  </thead>
  <tbody>
    <tr className="bg-red-950">
      <td className="px-4 py-2">01</td>
      <td className="px-4 py-2">Henrique Delgado</td>
      <td className="px-4 py-2">Henrique@gmail.com</td>
      <td className="px-4 py-2">ATIVO</td>
      <td className="px-4 py-2">...</td>
    </tr>
  </tbody>
</table>

    )
}

export default Table