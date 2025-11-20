<?php
require_once 'alunos.php';       // importa a classe Alunos (modelo que representa um aluno)
require_once 'Connection.php';   // importa a classe Connection (responsável pela conexão com o banco de dados)

class AlunoDAO{

    private $conn; // atributo que vai guardar a conexão com o banco de dados

    public function __construct() {
        // aqui chamamos o método getInstance() da classe Connection
        // esse método retorna um objeto PDO já configurado para se conectar ao banco
        $this->conn = Connection::getInstance(); 

        // cria a tabela ALUNOS caso ela ainda não exista no banco
        // usamos SQL dentro do exec() para definir a estrutura da tabela
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS ALUNOS (
                ID_ALUNO INT AUTO_INCREMENT PRIMARY KEY,   -- chave primária, aumenta automaticamente
                NOME VARCHAR(150) NOT NULL,                -- nome do aluno, obrigatório
                ENDERECO VARCHAR(500),                     -- endereço, pode ser nulo
                NASCIMENTO DATE NOT NULL,                  -- data de nascimento, obrigatório
                TELEFONE VARCHAR(20),                      -- telefone, opcional
                CPF VARCHAR(14) NOT NULL UNIQUE,           -- CPF único e obrigatório
                SEXO ENUM('MASCULINO','FEMININO','OUTRO','NAO_DECLARAR') DEFAULT 'NAO_DECLARAR',
                EMAIL VARCHAR(255) NOT NULL UNIQUE,        -- email único e obrigatório
                SENHA_HASH VARCHAR(255) NOT NULL,          -- senha armazenada como hash
                STATUS_ALUNO ENUM('ATIVO','INATIVO','SUSPENSO') NOT NULL DEFAULT 'ATIVO',
                ID_PLANO INT NOT NULL,                     -- plano do aluno (chave estrangeira)
                CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- data de criação automática
                INDEX idx_alunos_plano (ID_PLANO),         -- índice para buscas mais rápidas por plano
                CONSTRAINT fk_alunos_planos FOREIGN KEY (ID_PLANO) REFERENCES PLANOS(ID_PLANO)
            );
        ");
    }

    // método para inserir um novo aluno no banco
    public function criarAlunos(Alunos $alunos){
        // usamos parâmetros nomeados (:NOME, :CPF, etc.) para evitar SQL Injection
        $sql = "INSERT INTO ALUNOS 
            (NOME, ENDERECO, NASCIMENTO, TELEFONE, CPF, SEXO, EMAIL, SENHA_HASH, STATUS_ALUNO, ID_PLANO, CRIADO_EM)
            VALUES 
            (:NOME, :ENDERECO, :NASCIMENTO, :TELEFONE, :CPF, :SEXO, :EMAIL, :SENHA_HASH, :STATUS_ALUNO, :ID_PLANO, :CRIADO_EM)";

        // prepara o comando SQL para execução segura
        $stmt = $this->conn->prepare($sql); 

        // executa o comando substituindo os parâmetros pelos valores vindos do objeto Alunos
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

    // método que lê todos os alunos da tabela (SELECT *)
    public function lerAlunosAll() {
        // consulta todos os registros da tabela ALUNOS
        $stmt = $this->conn->query("SELECT * FROM ALUNOS ORDER BY id_aluno");
        $result = []; // cria um array vazio para armazenar os objetos Alunos

        // percorre cada linha retornada pelo banco
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) { 
            // cria um novo objeto Alunos com os dados da linha atual
            $result[] = new Alunos(
                $row['id_aluno'],
                $row['nome'],
                $row['endereco'],
                $row['nascimento'],
                $row['telefone'],
                $row['CPF'],
                $row['sexo'],
                $row['email'],
                $row['senha_hash'],
                $row['status_aluno'],
                $row['criado_em'],
                $row['id_plano'],
            );
        }
        // retorna o array com todos os objetos Alunos criados
        return $result; 
    }

    //Atualizar alunos
    public function atualizarAlunos($idAlunos, $novoNome,$novoEndereco,$novoEmail,$novoNascimento, $novoTelefone, $novoCPF,$novoSexo,$novoSenhaAluno,$NovoStatus){

        // cria a query para fazer o update no banco de dados
        $stmt = $this->conn->prepare("UPDATE alunos 
            SET nome = :novoNome, 
                endereco = :novoEndereco, 
                nascimento = :novoNascimento, 
                telefone = :novoTelefone, 
                CPF = :novoCPF, 
                email = :novoEmail, 
                sexo = :novoSexo, 
                senha_hash = :novoSenhaAluno, 
                status_aluno = :novoStatus 
            WHERE ID_ALUNO = :idAlunos");

        //passa quais serão os parametros para o update no sql
        $stmt->execute([
            ':novoNome' => $novoNome,
            ':novoEndereco'=> $novoEndereco,
            ':novoNascimento' => $novoNascimento,
            ':novoTelefone'=> $novoTelefone,
            ':novoCPF'=> $novoCPF,
            ':novoEmail'=>$novoEmail,
            ':novoSexo'=>$novoSexo,
            ':novoSenhaAluno'=>$novoSenhaAluno,
            ':novoStatus'=>$NovoStatus,
            ':idAlunos'=>$idAlunos,
        ]);
    }

    // Delete alunos
    public function deletarALunos($id_aluno){
        $stmt = $this->conn->prepare('DELETE FROM alunos WHERE ID_ALUNO =:id_aluno');
        $stmt ->execute([
            ':id_aluno' => $id_aluno,
        ]);
    }

    // Buscar alunos pelo nome 
    public function buscarAlunos ($nome){
        $stmt = $this->conn->prepare("SELECT id_aluno, nome, email, telefone, status_aluno FROM alunos WHERE NOME LIKE :nome"); // select para busca em alunos o nome inserido 
        $stmt ->execute([':nome'=>"%$nome%"]); // define que o parametro de busca nome é a variavel recebida pela função 
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $result[] = [
                'id_aluno' => $row['id_aluno'],
                'nome'     => $row['nome'],
                'email'    => $row['email'],
                'telefone' => $row['telefone'],
                'status'   => $row['status_aluno']
            ];  
        }
        return $result; // retorna os resultados da busca pelo nome 
    }
}
?>
