function PopUpAlunos({ isOpen, onClose, mode = "create" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {mode === "create" ? "Criar Aluno" : "Editar Aluno"}
        </h2>
        <form>
          <input
            type="text"
            placeholder="Nome"
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="CPF"
            className="w-full mb-2 p-2 border rounded"
          />
          {/* Adicione mais campos conforme necessário */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded"
            >
              {mode === "create" ? "Criar" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PopUpAlunos;
