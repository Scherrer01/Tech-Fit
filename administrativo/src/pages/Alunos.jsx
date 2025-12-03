import Button from "../components/Button";
import Aside from "../components/Aside";
import Inputs from "../components/Inputs";
import PopUpAlunos from "../components/popUpAlunos"; 
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
        <Button variant="create" onClick={() => openPopUp("create")}>
          Criar Aluno
        </Button>
      </div>
      <div>
        <Table />
      </div>
      <PopUpAlunos isOpen={PopUPOpen} onClose={() => setPopUp(false)} mode={PopUpMode} />
    </main>
  );
}

export default Alunos;
