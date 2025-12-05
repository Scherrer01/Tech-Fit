<?php
require_once 'funcionarios.php';  // importa a classe Funcionarios (modelo que representa um funcionário)
require_once 'Connection.php';     // importa a classe Connection (responsável pela conexão com o banco de dados)

class FuncionarioDAO{

    private $conn; // atributo que vai guardar a conexão com o banco de dados

    public function __construct() {
        // aqui chamamos o método getInstance() da classe Connection
        // esse método retorna um objeto PDO já configurado para se conectar ao banco
        $this->conn = Connection::getInstance(); 

        // cria a tabela FUNCIONARIOS caso ela ainda não exista no banco
        // usamos SQL dentro do exec() para definir a estrutura da tabela
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS FUNCIONARIOS (
                ID_FUNCIONARIO INT AUTO_INCREMENT PRIMARY KEY,   -- chave primária, aumenta automaticamente
                NOME_FUNCIONARIO VARCHAR(150) NOT NULL,          -- nome do funcionário, obrigatório
                LOGIN_REDE VARCHAR(50) NOT NULL UNIQUE,          -- login de rede, único e obrigatório
                NASCIMENTO_FUNCIONARIO DATE NOT NULL,            -- data de nascimento, obrigatório
                CPF_FUNCIONARIO VARCHAR(14) NOT NULL UNIQUE,     -- CPF único e obrigatório
                TELEFONE_FUNCIONARIO VARCHAR(20),                -- telefone, opcional
                DATA_ADMISSAO DATE NOT NULL,                     -- data de admissão, obrigatório
                SALARIO DECIMAL(10,2) NOT NULL,                  -- salário com 2 casas decimais
                CARGO VARCHAR(100) NOT NULL,                     -- cargo do funcionário
                ENDERECO_FUNCIONARIO VARCHAR(500),               -- endereço, pode ser nulo
                EMAIL_FUNCIONARIO VARCHAR(255) NOT NULL UNIQUE,  -- email único e obrigatório
                SENHA_FUNCIONARIO VARCHAR(255) NOT NULL,         -- senha armazenada (pode ser hash)
                TURNO ENUM('MATUTINO','VESPERTINO','NOTURNO','INTEGRAL') DEFAULT 'MATUTINO',
                ID_MODALIDADE INT,                               -- modalidade (chave estrangeira)
                STATUS_FUNCIONARIO ENUM('ATIVO','INATIVO','FERIAS','AFASTADO') NOT NULL DEFAULT 'ATIVO',
                CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- data de criação automática
                ATUALIZADO_EM TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- data de atualização
                INDEX idx_funcionarios_modalidade (ID_MODALIDADE), -- índice para buscas por modalidade
                CONSTRAINT fk_funcionarios_modalidades FOREIGN KEY (ID_MODALIDADE) REFERENCES MODALIDADES(ID_MODALIDADE)
            );
        ");
    }

    // método para inserir um novo funcionário no banco
    public function criarFuncionario(Funcionarios $funcionario){
        // usamos parâmetros nomeados para evitar SQL Injection
        $sql = "INSERT INTO FUNCIONARIOS 
            (NOME_FUNCIONARIO, LOGIN_REDE, NASCIMENTO_FUNCIONARIO, CPF_FUNCIONARIO, 
             TELEFONE_FUNCIONARIO, DATA_ADMISSAO, SALARIO, CARGO, ENDERECO_FUNCIONARIO, 
             EMAIL_FUNCIONARIO, SENHA_FUNCIONARIO, TURNO, ID_MODALIDADE, STATUS_FUNCIONARIO, CRIADO_EM)
            VALUES 
            (:NOME_FUNCIONARIO, :LOGIN_REDE, :NASCIMENTO_FUNCIONARIO, :CPF_FUNCIONARIO, 
             :TELEFONE_FUNCIONARIO, :DATA_ADMISSAO, :SALARIO, :CARGO, :ENDERECO_FUNCIONARIO, 
             :EMAIL_FUNCIONARIO, :SENHA_FUNCIONARIO, :TURNO, :ID_MODALIDADE, :STATUS_FUNCIONARIO, :CRIADO_EM)";

        // prepara o comando SQL para execução segura
        $stmt = $this->conn->prepare($sql); 

        // executa o comando substituindo os parâmetros pelos valores vindos do objeto Funcionarios
        $stmt->execute([
            ':NOME_FUNCIONARIO'        => $funcionario->getNomeFuncionario(),
            ':LOGIN_REDE'              => $funcionario->getLoginRede(),
            ':NASCIMENTO_FUNCIONARIO'  => $funcionario->getNascimentoFuncionario(),
            ':CPF_FUNCIONARIO'         => $funcionario->getCpfFuncionario(),
            ':TELEFONE_FUNCIONARIO'    => $funcionario->getTelefoneFuncionario(),
            ':DATA_ADMISSAO'           => $funcionario->getDataAdmissao(),
            ':SALARIO'                 => $funcionario->getSalario(),
            ':CARGO'                   => $funcionario->getCargo(),
            ':ENDERECO_FUNCIONARIO'    => $funcionario->getEnderecoFuncionario(),
            ':EMAIL_FUNCIONARIO'       => $funcionario->getEmailFuncionario(),
            ':SENHA_FUNCIONARIO'       => $funcionario->getSenhaFuncionario(),
            ':TURNO'                   => $funcionario->getTurno(),
            ':ID_MODALIDADE'           => $funcionario->getIdModalidade(),

        ]);
    }

    // método que lê todos os funcionários da tabela
    public function lerFuncionariosAll() {
        // consulta todos os registros da tabela FUNCIONARIOS
        $stmt = $this->conn->query("SELECT * FROM FUNCIONARIOS ORDER BY ID_FUNCIONARIO");
        $result = []; // cria um array vazio para armazenar os dados

        // percorre cada linha retornada pelo banco
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) { 
            // adiciona o array associativo ao resultado
            $result[] = [
                'ID_FUNCIONARIO'        => $row['ID_FUNCIONARIO'],
                'NOME_FUNCIONARIO'      => $row['NOME_FUNCIONARIO'],
                'LOGIN_REDE'            => $row['LOGIN_REDE'],
                'NASCIMENTO_FUNCIONARIO'=> $row['NASCIMENTO_FUNCIONARIO'],
                'CPF_FUNCIONARIO'       => $row['CPF_FUNCIONARIO'],
                'TELEFONE_FUNCIONARIO'  => $row['TELEFONE_FUNCIONARIO'],
                'DATA_ADMISSAO'         => $row['DATA_ADMISSAO'],
                'SALARIO'               => $row['SALARIO'],
                'CARGO'                 => $row['CARGO'],
                'ENDERECO_FUNCIONARIO'  => $row['ENDERECO_FUNCIONARIO'],
                'EMAIL_FUNCIONARIO'     => $row['EMAIL_FUNCIONARIO'],
                'SENHA_FUNCIONARIO'     => $row['SENHA_FUNCIONARIO'],
                'TURNO'                 => $row['TURNO'],
                'ID_MODALIDADE'         => $row['ID_MODALIDADE'],
                'STATUS_FUNCIONARIO'    => $row['STATUS_FUNCIONARIO'],
                'CRIADO_EM'             => $row['CRIADO_EM'],
                'ATUALIZADO_EM'         => $row['ATUALIZADO_EM']
            ];
        }
        // retorna o array com todos os funcionários
        return $result; 
    }

    // Atualizar funcionário
    public function atualizarFuncionario($idFuncionario, $novoNome, $novoLoginRede, $novoNascimento, 
                                        $novoCpf, $novoTelefone, $novaDataAdmissao, $novoSalario, 
                                        $novoCargo, $novoEndereco, $novoEmail, $novaSenha, 
                                        $novoTurno, $novaIdModalidade, $novoStatus){

        // cria a query para fazer o update no banco de dados
        $stmt = $this->conn->prepare("UPDATE FUNCIONARIOS 
            SET NOME_FUNCIONARIO = :novoNome, 
                LOGIN_REDE = :novoLoginRede, 
                NASCIMENTO_FUNCIONARIO = :novoNascimento, 
                CPF_FUNCIONARIO = :novoCpf, 
                TELEFONE_FUNCIONARIO = :novoTelefone, 
                DATA_ADMISSAO = :novaDataAdmissao, 
                SALARIO = :novoSalario, 
                CARGO = :novoCargo, 
                ENDERECO_FUNCIONARIO = :novoEndereco, 
                EMAIL_FUNCIONARIO = :novoEmail, 
                SENHA_FUNCIONARIO = :novaSenha, 
                TURNO = :novoTurno, 
                ID_MODALIDADE = :novaIdModalidade, 
                STATUS_FUNCIONARIO = :novoStatus 
            WHERE ID_FUNCIONARIO = :idFuncionario");

        // passa quais serão os parâmetros para o update no sql
        $stmt->execute([
            ':novoNome'             => $novoNome,
            ':novoLoginRede'        => $novoLoginRede,
            ':novoNascimento'       => $novoNascimento,
            ':novoCpf'              => $novoCpf,
            ':novoTelefone'         => $novoTelefone,
            ':novaDataAdmissao'     => $novaDataAdmissao,
            ':novoSalario'          => $novoSalario,
            ':novoCargo'            => $novoCargo,
            ':novoEndereco'         => $novoEndereco,
            ':novoEmail'            => $novoEmail,
            ':novaSenha'            => $novaSenha,
            ':novoTurno'            => $novoTurno,
            ':novaIdModalidade'     => $novaIdModalidade,
            ':novoStatus'           => $novoStatus,
            ':idFuncionario'        => $idFuncionario,
        ]);
    }

    // Deletar funcionário
    public function deletarFuncionario($id_funcionario){
        $stmt = $this->conn->prepare('DELETE FROM FUNCIONARIOS WHERE ID_FUNCIONARIO = ?');
        $stmt->execute([$id_funcionario]);
    }

    // Buscar funcionários pelo nome 
    public function buscarFuncionarios($nome){
        $stmt = $this->conn->prepare("
            SELECT * FROM FUNCIONARIOS WHERE NOME_FUNCIONARIO LIKE :nome
        ");
        
        $stmt->execute([':nome' => "%$nome%"]);

        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $result[] = $row; // devolve tudo
        }

        return $result;
    }

    // Buscar funcionário por ID
    public function buscarFuncionarioPorID($id) {
        $sql = "SELECT * FROM FUNCIONARIOS WHERE ID_FUNCIONARIO = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Buscar funcionário por login/rede (para autenticação)
    public function buscarFuncionarioPorLogin($login) {
        $sql = "SELECT * FROM FUNCIONARIOS WHERE LOGIN_REDE = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$login]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Buscar funcionário por CPF
    public function buscarFuncionarioPorCPF($cpf) {
        $sql = "SELECT * FROM FUNCIONARIOS WHERE CPF_FUNCIONARIO = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$cpf]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Buscar funcionários por cargo
    public function buscarFuncionariosPorCargo($cargo) {
        $stmt = $this->conn->prepare("
            SELECT * FROM FUNCIONARIOS WHERE CARGO LIKE :cargo
        ");
        
        $stmt->execute([':cargo' => "%$cargo%"]);

        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $result[] = $row;
        }

        return $result;
    }

    // Buscar funcionários por status
    public function buscarFuncionariosPorStatus($status) {
        $sql = "SELECT * FROM FUNCIONARIOS WHERE STATUS_FUNCIONARIO = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$status]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $result[] = $row;
        }

        return $result;
    }
}
?>