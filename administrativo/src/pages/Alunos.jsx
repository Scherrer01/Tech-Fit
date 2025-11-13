import Button from "../components/Button";
import Aside from "../components/Aside";
import Inputs from "../components/Inputs";

function Alunos() {
  return (
        <main style={{ marginLeft: "18vw", padding: "2rem", position: 'relative', zIndex: 5 }}>
      <Aside />
      <div className="flex gap-3 mb-4">
        <Button type="button">Cadastrar Alunos</Button>
        <Button type="button">Editar Alunos</Button>
        <Button type="button">Deletar Alunos</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID:</th>
            <th>Nome:</th>
            <th>Endereço:</th>
            <th>Telefone:</th>
            <th>CPF:</th>
            <th>Status Aluno:</th>
            <th>Pesquisar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Henrique Delgado</td>
            <td>Rua J, 156</td>
            <td>(19) 98788-0809</td>
            <td>476.908.109-90</td>
            <td>ATIVO</td>
            <td>
              <Inputs placeholder="Pesquisar" className="px-2 py-1" />
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

export default Alunos;
