<?php

require_once __DIR__ . '/../Model/alunos.php';
require_once __DIR__ . '/../Model/alunosDAO.php';

class ControllerALunos{
    private $dao;

    public function __construct(){
        $this->dao = new AlunoDAO();
    }

    // Read - ler todos os alunos
    public function ler (){
        return $this->dao->lerAlunosAll();
    }
public function criar($nome, $endereco, $nascimento, $telefone, $CPF, $sexo, $email, $senha_hash, $statusAluno, $Id_plano, $criado_em){
    // CORREÇÃO: A ordem deve corresponder ao construtor da classe Alunos
    // Construtor: __construct($id_aluno, $nome, $endereco, $nascimento, $telefone, $CPF, $sexo, $email, $senha_hash, $status_aluno, $criado_em, $id_plano)
    
    $aluno = new Alunos(
        null,           // id_aluno
        $nome,          // nome
        $endereco,      // endereco
        $nascimento,    // nascimento
        $telefone,      // telefone
        $CPF,           // CPF
        $sexo,          // sexo
        $email,         // email
        $senha_hash,    // senha_hash
        $statusAluno,   // status_aluno
        $criado_em,     // criado_em  AGORA CORRETO!
        $Id_plano       // id_plano  AGORA CORRETO!
    );
    $this->dao->criarAlunos($aluno);
}

    public function editar ($idAlunos, $novoNome,$novoEndereco,$novoEmail,$novoNascimento, $novoTelefone, $novoCPF,$novoSexo,$novoSenhaAluno,$NovoStatus){
        $this->dao->atualizarAlunos($idAlunos, $novoNome,$novoEndereco,$novoEmail,$novoNascimento, $novoTelefone, $novoCPF,$novoSexo,$novoSenhaAluno,$NovoStatus);
    }

    public function excluir($id_aluno){
        $this->dao->deletarALunos($id_aluno);
    }
    public function buscarAlunos($nome){
        return $this->dao->buscarAlunos($nome);
    }
        public function buscarAlunosPorID($id){
        return $this->dao->buscarAlunosPorID($id);
    }
    
}
?>