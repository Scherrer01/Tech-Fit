<?php
require_once 'alunos.php';
require_once 'Connection.php';

class AlunoDAO{

    private $conn;

    public function __construct() {
        $this->conn = Connection::getInstance();

        // Cria a tabela se não existir
        $this->conn->exec("
    CREATE TABLE IF NOT EXISTS ALUNOS (
  ID_ALUNO INT AUTO_INCREMENT PRIMARY KEY,
  NOME VARCHAR(150) NOT NULL,
  ENDERECO VARCHAR(500),
  NASCIMENTO DATE NOT NULL,
  TELEFONE VARCHAR(20),
  CPF VARCHAR(14) NOT NULL UNIQUE,
  SEXO ENUM('MASCULINO','FEMININO','OUTRO','NAO_DECLARAR') DEFAULT 'NAO_DECLARAR',
  EMAIL VARCHAR(255) NOT NULL UNIQUE,
  SENHA_HASH VARCHAR(255) NOT NULL,
  STATUS_ALUNO ENUM('ATIVO','INATIVO','SUSPENSO') NOT NULL DEFAULT 'ATIVO',
  ID_PLANO INT NOT NULL,
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_alunos_plano (ID_PLANO), -- INDEX SERVE PARA BUSCAR MAIS RÁPDIO
  CONSTRAINT fk_alunos_planos FOREIGN KEY (ID_PLANO) REFERENCES PLANOS(ID_PLANO));
        ");
    }

    // CREATE 
public function criarAlunos(Alunos $alunos){
    $sql = "INSERT INTO ALUNOS 
        (NOME, ENDERECO, NASCIMENTO, TELEFONE, CPF, SEXO, EMAIL, SENHA_HASH, STATUS_ALUNO, ID_PLANO, CRIADO_EM)
        VALUES 
        (:NOME, :ENDERECO, :NASCIMENTO, :TELEFONE, :CPF, :SEXO, :EMAIL, :SENHA_HASH, :STATUS_ALUNO, :ID_PLANO, :CRIADO_EM)";

    $stmt = $this->conn->prepare($sql);

    $stmt->execute([
        ':NOME'        => $alunos->getNome(),
        ':ENDERECO'    => $alunos->getEndereco(),
        ':NASCIMENTO'  => $alunos->getNascimento(),
        ':TELEFONE'    => $alunos->getTelefone(),
        ':CPF'         => $alunos->getCPF(),
        ':SEXO'        => $alunos->getSexo(),
        ':EMAIL'       => $alunos->getEmail(),
        ':SENHA_HASH'  => $alunos->getSenhaHash(), 
        ':STATUS_ALUNO'=> $alunos->getStatus_aluno(),
        ':ID_PLANO'    => $alunos->getId_plano(),
        ':CRIADO_EM'   => $alunos->getCriado_em()
    ]);
}

}
?>