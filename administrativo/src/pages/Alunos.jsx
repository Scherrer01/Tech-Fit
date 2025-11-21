import Button from "../components/Button";
import Aside from "../components/Aside";
import Inputs from "../components/Inputs";
import PopUpAlunos from "../components/popUpAlunos"; // nome em maiúsculo
import Table from "../components/Table";
import { useState } from "react";

function Alunos() {
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");

  const openPopUp = (mode) => {
    setPopUpMode(mode);
    setPopUp(true);
  };

  return (
    <main style={{ marginLeft: "18vw", padding: "2rem", position: "relative", zIndex: 5 }}>
      <Aside />
      <div className="flex gap-3 mb-4">
        <Button variant="update" onClick={() => openPopUp("update")}>
          Editar Aluno
        </Button>
        <Button variant="create" onClick={() => openPopUp("create")}>
          Criar Aluno
        </Button>
        <Button variant="delete">Excluir Aluno</Button>
        <Inputs className="max-w-40" placeholder="Buscar" />
      </div>
      <div>
        <Table />
      </div>
      <PopUpAlunos isOpen={PopUPOpen} onClose={() => setPopUp(false)} mode={PopUpMode} />
    </main>
  );
}

export default Alunos;
