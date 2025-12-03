import { useEffect, useState } from "react";
import Button from "../components/Button";
import PopUpAlunos from "../components/popUpAlunos";
import Inputs from "../components/Inputs";
// import SearchIcon from '@mui/icons-material/Search';

function Table() {
  const [alunos, setAlunos] = useState([]);
  const [PopUPOpen, setPopUp] = useState(false);
  const [PopUpMode, setPopUpMode] = useState("create");
  const [selectedAluno, setSelectedAluno] = useState(null);

  const openPopUp = (mode, alunoID) => {
    setPopUpMode(mode);
    setSelectedAluno(alunoID);
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
    setSelectedAluno(null);
  };

  useEffect(() => {
    fetch("http://localhost:8000/alunosAPI.php")
      .then((res) => res.json())
      .then((data) => setAlunos(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      fetch("http://localhost:8000/alunosAPI.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idAlunos: id }),
      })
        .then(() => {
          setAlunos(alunos.filter((aluno) => aluno.ID_ALUNO !== id));
        })
        .catch((err) => console.error(err));
    }
  };
  const handleSearch = (query) => {
  if (query.trim() === "") {
    // se o campo estiver vazio, recarrega todos
    fetch("http://localhost:8000/alunosAPI.php")
      .then((res) => res.json())
      .then((data) => setAlunos(data))
      .catch((err) => console.error(err));
    return;
  }

  fetch("http://localhost:8000/alunosAPI.php?search=" + query)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setAlunos(data); // se voltar lista
      } else {
        setAlunos([data]); // se API retornar um único aluno
      }
    })
    .catch((err) => console.error(err));
};


  return (
    <>
      {/* WRAPPER COM SCROLL */}
      <div className="w-full max-h-[700px] overflow-auto border border-gray-300 rounded-lg">
        <div className="flex justify-end">

        <input className="
    w-full max-w-60
    px-3 py-2
    rounded-xl
    border border-gray-300
    shadow-sm
    mb-1 mr-4
    focus:outline-none 
    focus:ring-2 
    focus:ring-red-500 
    focus:border-red-500
    placeholder-gray-400
    bg-white
    text-black
  "onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar" />
        </div>


        <table className="table-auto w-full border-collapse min-w-max">
          <thead className="bg-red-950 text-white sticky top-0">
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
                <td className="px-4 py-2 border-2">{aluno.ID_ALUNO}</td>
                <td className="px-4 py-2 border-2 text-center">{aluno.NOME}</td>
                <td className="px-4 py-2 border-2 text-center">{aluno.EMAIL}</td>
                <td className="px-4 py-2 border-2 text-center">{aluno.TELEFONE}</td>
                <td className="px-4 py-2 border-2 text-center">{aluno.SEXO}</td>
                <td className="px-4 py-2 border-2 text-center">{aluno.STATUS_ALUNO}</td>

                <td className="px-4 py-2 border-2 text-center space-x-2">
                  <Button variant="update" onClick={() => openPopUp("edit", aluno.ID_ALUNO)}>
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

      </div>

      {/* Pop-up */}
      {PopUPOpen && (
        <PopUpAlunos
          isOpen={PopUPOpen}
          onClose={closePopUp}
          mode={PopUpMode}
          alunoId={selectedAluno} // corrigido: era aluno
        />
      )}
    </>
  );
}

export default Table;
