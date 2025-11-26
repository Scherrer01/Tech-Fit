import { useEffect, useState } from "react";
import Button from "../components/Button";
import PopUpAlunos from "../components/PopUpAlunos"; // certifique-se de importar

function Table() {
  const [alunos, setAlunos] = useState([]);
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");
  const [selectedAluno, setSelectedAluno] = useState(null);

  const openPopUp = (mode, aluno = null) => {
    setPopUpMode(mode);
    setSelectedAluno(aluno);
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
    setSelectedAluno(null);
  };

  useEffect(() => {
    fetch("http://localhost:8000/alunosAPI.php", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setAlunos(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      fetch(`http://localhost:8000/alunosAPI.php?id=${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setAlunos(alunos.filter((aluno) => aluno.ID_ALUNO !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-red-950 text-white">
          <tr>
            <th className="px-4 py-2 border-2">ID</th>
            <th className="px-4 py-2 border-2">Nome</th>
            <th className="px-4 py-2 border-2">Email</th>
            <th className="px-4 py-2 border-2">Telefone</th>
            <th className="px-4 py-2 border-2">Sexo</th>
            <th className="px-4 py-2 border-2">Status</th>
            <th className="px-4 py-2 border-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.ID_ALUNO} className="bg-red-950 text-white">
              <td className="px-4 py-2 w-6 border-2">{aluno.ID_ALUNO}</td>
              <td className="px-4 py-2 text-center border-2">{aluno.NOME}</td>
              <td className="px-4 py-2 text-center border-2">{aluno.EMAIL}</td>
              <td className="px-4 py-2 text-center border-2">{aluno.TELEFONE}</td>
              <td className="px-4 py-2 text-center border-2">{aluno.SEXO}</td>
              <td className="px-4 py-2 text-center border-2">{aluno.STATUS_ALUNO}</td>
              <td className="px-4 py-2 text-center border-2 space-x-2">
                <Button variant="update" onClick={() => openPopUp("update", aluno)}>
                  Editar
                </Button>
                <Button variant="delete" onClick={() => handleDelete(aluno.ID_ALUNO)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PopUpAlunos renderizado corretamente */}
      {PopUPOpen && (
        <PopUpAlunos
          isOpen={PopUPOpen}
          onClose={closePopUp}
          mode={PopUpMode}
          aluno={selectedAluno} // passa o aluno selecionado
        />
      )}
    </>
  );
}

export default Table;
