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
    // read - ler apenas algumas informações  basicas
    public function lerBasico(){
        return $this->dao->lerAlunosBasico();
    }
    public function criar($nome, $endereco,$nascimento, $telefone, $CPF, $sexo, $email ,$senha_hash,$statusAluno, $Id_plano, $criado_em){
        $aluno = new Alunos(null,$nome, $endereco, $nascimento, $telefone,$CPF, $sexo, $email, $senha_hash, $statusAluno, $Id_plano, null);
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
}
?>