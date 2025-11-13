import Button from "../components/Button";
import Aside from "../components/Aside";

import TableWithoutBorder from "../components/Table";

function Alunos() {
  return (
        <main style={{ marginLeft: "18vw", padding: "2rem", position: 'relative', zIndex: 5 }}>
      <Aside />
      <div className="flex gap-3 mb-4">
        <Button variant="update">Editar Aluno</Button>
        <Button variant="create">Criar Aluno</Button>
        <Button variant="delete">Excluir Aluno</Button>
      </div>
      <div>
        <TableWithoutBorder></TableWithoutBorder>
      </div>
    </main>
  );
}

export default Alunos;
