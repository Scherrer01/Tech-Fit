<?php
require_once 'funcionarios.php';
require_once 'Connection.php';

class FuncionarioDAO {
    private $conn;

    public function __construct() {
        $this->conn = Connection::getInstance();
        
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS FUNCIONARIOS (
                ID_FUNCIONARIO INT AUTO_INCREMENT PRIMARY KEY,
                NOME_FUNCIONARIO VARCHAR(150) NOT NULL,
                LOGIN_REDE VARCHAR(255) NOT NULL,
                NASCIMENTO_FUNCIONARIO DATE NOT NULL,
                CPF_FUNCIONARIO VARCHAR(14) NOT NULL UNIQUE,
                TELEFONE_FUNCIONARIO VARCHAR(20),
                DATA_ADMISSAO DATE NOT NULL,
                SALARIO DECIMAL(10,2) NOT NULL CHECK (SALARIO >= 0),
                CARGO VARCHAR(80) NOT NULL,
                ENDERECO_FUNCIONARIO VARCHAR(500),
                EMAIL_FUNCIONARIO VARCHAR(100) NOT NULL UNIQUE,
                SENHA_FUNCIONARIO VARCHAR(255),
                TURNO ENUM('MANHA','TARDE','NOITE','ROTATIVO') DEFAULT 'ROTATIVO',
                ID_MODALIDADE INT DEFAULT NULL,
                CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                ATUALIZADO_EM TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_funcionarios_modalidade (ID_MODALIDADE)
            );
        ");
    }

    // 1. Criar funcionário
    public function criar(Funcionarios $funcionario) {
        $sql = "INSERT INTO FUNCIONARIOS 
            (NOME_FUNCIONARIO, LOGIN_REDE, NASCIMENTO_FUNCIONARIO, CPF_FUNCIONARIO, 
             TELEFONE_FUNCIONARIO, DATA_ADMISSAO, SALARIO, CARGO, ENDERECO_FUNCIONARIO, 
             EMAIL_FUNCIONARIO, SENHA_FUNCIONARIO, TURNO, ID_MODALIDADE)
            VALUES 
            (:NOME_FUNCIONARIO, :LOGIN_REDE, :NASCIMENTO_FUNCIONARIO, :CPF_FUNCIONARIO, 
             :TELEFONE_FUNCIONARIO, :DATA_ADMISSAO, :SALARIO, :CARGO, :ENDERECO_FUNCIONARIO, 
             :EMAIL_FUNCIONARIO, :SENHA_FUNCIONARIO, :TURNO, :ID_MODALIDADE)";

        $stmt = $this->conn->prepare($sql); 
        
        try {
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
                ':ID_MODALIDADE'           => $funcionario->getIdModalidade()
            ]);
            
            // Retorna o ID do funcionário criado
            return $this->conn->lastInsertId();
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao criar funcionário: " . $e->getMessage());
        }
    }

    // 2. Listar todos os funcionários
    public function listarTodos($filtros = []) {
        $sql = "SELECT * FROM FUNCIONARIOS WHERE 1=1";
        $params = [];
        
        // Aplicar filtros
        if (isset($filtros['nome']) && !empty($filtros['nome'])) {
            $sql .= " AND NOME_FUNCIONARIO LIKE :nome";
            $params[':nome'] = "%" . $filtros['nome'] . "%";
        }
        
        if (isset($filtros['cargo']) && !empty($filtros['cargo'])) {
            $sql .= " AND CARGO LIKE :cargo";
            $params[':cargo'] = "%" . $filtros['cargo'] . "%";
        }
        
        if (isset($filtros['turno']) && !empty($filtros['turno'])) {
            $sql .= " AND TURNO = :turno";
            $params[':turno'] = $filtros['turno'];
        }
        
        if (isset($filtros['id_modalidade']) && !empty($filtros['id_modalidade'])) {
            $sql .= " AND ID_MODALIDADE = :id_modalidade";
            $params[':id_modalidade'] = $filtros['id_modalidade'];
        }
        
        $sql .= " ORDER BY ID_FUNCIONARIO DESC";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        
        return $result;
    }

    // 3. Buscar funcionário por ID
    public function buscarPorId($id_funcionario) {
        if (empty($id_funcionario) || !is_numeric($id_funcionario)) {
            return null;
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE ID_FUNCIONARIO = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':id' => $id_funcionario]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 4. Buscar funcionário por CPF
    public function buscarPorCPF($cpf) {
        if (empty($cpf)) {
            return null;
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE CPF_FUNCIONARIO = :cpf";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':cpf' => $cpf]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 5. Buscar funcionário por Email
    public function buscarPorEmail($email) {
        if (empty($email)) {
            return null;
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE EMAIL_FUNCIONARIO = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':email' => $email]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 6. Buscar funcionário por Login
    public function buscarPorLogin($login) {
        if (empty($login)) {
            return null;
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE LOGIN_REDE = :login";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':login' => $login]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 7. Atualizar funcionário
    public function atualizar(Funcionarios $funcionario) {
        $sql = "UPDATE FUNCIONARIOS SET 
                NOME_FUNCIONARIO = :nome_funcionario,
                LOGIN_REDE = :login_rede,
                NASCIMENTO_FUNCIONARIO = :nascimento_funcionario,
                CPF_FUNCIONARIO = :cpf_funcionario,
                TELEFONE_FUNCIONARIO = :telefone_funcionario,
                DATA_ADMISSAO = :data_admissao,
                SALARIO = :salario,
                CARGO = :cargo,
                ENDERECO_FUNCIONARIO = :endereco_funcionario,
                EMAIL_FUNCIONARIO = :email_funcionario,
                SENHA_FUNCIONARIO = :senha_funcionario,
                TURNO = :turno,
                ID_MODALIDADE = :id_modalidade
            WHERE ID_FUNCIONARIO = :id_funcionario";

        $stmt = $this->conn->prepare($sql);
        
        try {
            return $stmt->execute([
                ':nome_funcionario'      => $funcionario->getNomeFuncionario(),
                ':login_rede'            => $funcionario->getLoginRede(),
                ':nascimento_funcionario'=> $funcionario->getNascimentoFuncionario(),
                ':cpf_funcionario'       => $funcionario->getCpfFuncionario(),
                ':telefone_funcionario'  => $funcionario->getTelefoneFuncionario(),
                ':data_admissao'         => $funcionario->getDataAdmissao(),
                ':salario'               => $funcionario->getSalario(),
                ':cargo'                 => $funcionario->getCargo(),
                ':endereco_funcionario'  => $funcionario->getEnderecoFuncionario(),
                ':email_funcionario'     => $funcionario->getEmailFuncionario(),
                ':senha_funcionario'     => $funcionario->getSenhaFuncionario(),
                ':turno'                 => $funcionario->getTurno(),
                ':id_modalidade'         => $funcionario->getIdModalidade(),
                ':id_funcionario'        => $funcionario->getIdFuncionario() // PRECISA ADICIONAR ESTE MÉTODO NA CLASSE
            ]);
        } catch (PDOException $e) {
            throw new Exception("Erro ao atualizar funcionário: " . $e->getMessage());
        }
    }

    // 8. Atualizar funcionário (método alternativo para usar sem objeto completo)
    public function atualizarFuncionario($id_funcionario, $dados) {
        $sql = "UPDATE FUNCIONARIOS SET ";
        $params = [];
        $updates = [];
        
        $campos = [
            'nome_funcionario' => 'NOME_FUNCIONARIO',
            'login_rede' => 'LOGIN_REDE',
            'nascimento_funcionario' => 'NASCIMENTO_FUNCIONARIO',
            'cpf_funcionario' => 'CPF_FUNCIONARIO',
            'telefone_funcionario' => 'TELEFONE_FUNCIONARIO',
            'data_admissao' => 'DATA_ADMISSAO',
            'salario' => 'SALARIO',
            'cargo' => 'CARGO',
            'endereco_funcionario' => 'ENDERECO_FUNCIONARIO',
            'email_funcionario' => 'EMAIL_FUNCIONARIO',
            'senha_funcionario' => 'SENHA_FUNCIONARIO',
            'turno' => 'TURNO',
            'id_modalidade' => 'ID_MODALIDADE'
        ];
        
        foreach ($campos as $key => $coluna) {
            if (isset($dados[$key])) {
                $updates[] = "$coluna = :$key";
                $params[":$key"] = $dados[$key];
            }
        }
        
        if (empty($updates)) {
            return false;
        }
        
        $sql .= implode(', ', $updates) . " WHERE ID_FUNCIONARIO = :id_funcionario";
        $params[':id_funcionario'] = $id_funcionario;
        
        $stmt = $this->conn->prepare($sql);
        
        try {
            return $stmt->execute($params);
        } catch (PDOException $e) {
            throw new Exception("Erro ao atualizar funcionário: " . $e->getMessage());
        }
    }

    // 9. Excluir funcionário
    public function excluir($id_funcionario) {
        if (empty($id_funcionario) || !is_numeric($id_funcionario)) {
            return false;
        }
        
        $sql = "DELETE FROM FUNCIONARIOS WHERE ID_FUNCIONARIO = :id";
        $stmt = $this->conn->prepare($sql);
        
        try {
            return $stmt->execute([':id' => $id_funcionario]);
        } catch (PDOException $e) {
            throw new Exception("Erro ao excluir funcionário: " . $e->getMessage());
        }
    }

    // 10. Buscar funcionários por nome
    public function buscarPorNome($nome, $limit = null, $offset = null) {
        if (empty($nome)) {
            return [];
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE NOME_FUNCIONARIO LIKE :nome ORDER BY NOME_FUNCIONARIO";
        
        if ($limit !== null) {
            $sql .= " LIMIT :limit";
            if ($offset !== null) {
                $sql .= " OFFSET :offset";
            }
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nome', "%$nome%", PDO::PARAM_STR);
        
        if ($limit !== null) {
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            if ($offset !== null) {
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            }
        }
        
        $stmt->execute();
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        
        return $result;
    }

    // 11. Buscar funcionários por cargo
    public function buscarPorCargo($cargo) {
        if (empty($cargo)) {
            return [];
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE CARGO LIKE :cargo ORDER BY NOME_FUNCIONARIO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':cargo' => "%$cargo%"]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        
        return $result;
    }

    // 12. Buscar funcionários por turno
    public function buscarPorTurno($turno) {
        $turnos_validos = ['MANHA', 'TARDE', 'NOITE', 'ROTATIVO'];
        
        if (empty($turno) || !in_array(strtoupper($turno), $turnos_validos)) {
            return [];
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE TURNO = :turno ORDER BY NOME_FUNCIONARIO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':turno' => strtoupper($turno)]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        
        return $result;
    }

    // 13. Buscar funcionários por modalidade
    public function buscarPorModalidade($id_modalidade) {
        if (empty($id_modalidade) || !is_numeric($id_modalidade)) {
            return [];
        }
        
        $sql = "SELECT * FROM FUNCIONARIOS WHERE ID_MODALIDADE = :id_modalidade ORDER BY NOME_FUNCIONARIO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':id_modalidade' => $id_modalidade]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        
        return $result;
    }

    // 14. Contar total de funcionários
    public function contarTotal($filtros = []) {
        $sql = "SELECT COUNT(*) as total FROM FUNCIONARIOS WHERE 1=1";
        $params = [];
        
        if (isset($filtros['cargo']) && !empty($filtros['cargo'])) {
            $sql .= " AND CARGO LIKE :cargo";
            $params[':cargo'] = "%" . $filtros['cargo'] . "%";
        }
        
        if (isset($filtros['turno']) && !empty($filtros['turno'])) {
            $sql .= " AND TURNO = :turno";
            $params[':turno'] = $filtros['turno'];
        }
        
        if (isset($filtros['id_modalidade']) && !empty($filtros['id_modalidade'])) {
            $sql .= " AND ID_MODALIDADE = :id_modalidade";
            $params[':id_modalidade'] = $filtros['id_modalidade'];
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }

    // 15. Verificar se CPF já existe
    public function cpfExiste($cpf, $excluir_id = null) {
        if (empty($cpf)) {
            return false;
        }
        
        $sql = "SELECT COUNT(*) as total FROM FUNCIONARIOS WHERE CPF_FUNCIONARIO = :cpf";
        
        if ($excluir_id !== null) {
            $sql .= " AND ID_FUNCIONARIO != :excluir_id";
        }
        
        $stmt = $this->conn->prepare($sql);
        
        if ($excluir_id !== null) {
            $stmt->execute([
                ':cpf' => $cpf,
                ':excluir_id' => $excluir_id
            ]);
        } else {
            $stmt->execute([':cpf' => $cpf]);
        }
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'] > 0;
    }

    // 16. Verificar se Email já existe
    public function emailExiste($email, $excluir_id = null) {
        if (empty($email)) {
            return false;
        }
        
        $sql = "SELECT COUNT(*) as total FROM FUNCIONARIOS WHERE EMAIL_FUNCIONARIO = :email";
        
        if ($excluir_id !== null) {
            $sql .= " AND ID_FUNCIONARIO != :excluir_id";
        }
        
        $stmt = $this->conn->prepare($sql);
        
        if ($excluir_id !== null) {
            $stmt->execute([
                ':email' => $email,
                ':excluir_id' => $excluir_id
            ]);
        } else {
            $stmt->execute([':email' => $email]);
        }
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'] > 0;
    }

    // 17. Verificar se Login já existe
    public function loginExiste($login, $excluir_id = null) {
        if (empty($login)) {
            return false;
        }
        
        $sql = "SELECT COUNT(*) as total FROM FUNCIONARIOS WHERE LOGIN_REDE = :login";
        
        if ($excluir_id !== null) {
            $sql .= " AND ID_FUNCIONARIO != :excluir_id";
        }
        
        $stmt = $this->conn->prepare($sql);
        
        if ($excluir_id !== null) {
            $stmt->execute([
                ':login' => $login,
                ':excluir_id' => $excluir_id
            ]);
        } else {
            $stmt->execute([':login' => $login]);
        }
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'] > 0;
    }

    // 18. Autenticar funcionário
    public function autenticar($login, $senha) {
        if (empty($login) || empty($senha)) {
            return null;
        }
        
        $funcionario = $this->buscarPorLogin($login);
        
        if (!$funcionario) {
            return null;
        }
        
        // Verificar senha (pode ser texto plano ou hash)
        $senhaArmazenada = $funcionario['SENHA_FUNCIONARIO'];
        
        // Se a senha estiver em hash
        if (password_verify($senha, $senhaArmazenada)) {
            return $funcionario;
        }
        
        // Se a senha estiver em texto plano (para compatibilidade)
        if ($senha === $senhaArmazenada) {
            return $funcionario;
        }
        
        return null;
    }

    // 19. Buscar estatísticas
    public function buscarEstatisticas() {
        $result = [];
        
        // Total por turno
        $sql_turno = "SELECT TURNO, COUNT(*) as total FROM FUNCIONARIOS GROUP BY TURNO";
        $stmt_turno = $this->conn->query($sql_turno);
        $result['por_turno'] = $stmt_turno->fetchAll(PDO::FETCH_ASSOC);
        
        // Total por cargo (top 10)
        $sql_cargo = "SELECT CARGO, COUNT(*) as total FROM FUNCIONARIOS 
                     GROUP BY CARGO ORDER BY total DESC LIMIT 10";
        $stmt_cargo = $this->conn->query($sql_cargo);
        $result['por_cargo'] = $stmt_cargo->fetchAll(PDO::FETCH_ASSOC);
        
        // Total por modalidade
        $sql_modalidade = "SELECT ID_MODALIDADE, COUNT(*) as total FROM FUNCIONARIOS 
                          WHERE ID_MODALIDADE IS NOT NULL GROUP BY ID_MODALIDADE";
        $stmt_modalidade = $this->conn->query($sql_modalidade);
        $result['por_modalidade'] = $stmt_modalidade->fetchAll(PDO::FETCH_ASSOC);
        
        // Total geral
        $sql_total = "SELECT COUNT(*) as total FROM FUNCIONARIOS";
        $stmt_total = $this->conn->query($sql_total);
        $result['total_geral'] = $stmt_total->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total salarial
        $sql_salario = "SELECT SUM(SALARIO) as total_salarial, AVG(SALARIO) as media_salarial FROM FUNCIONARIOS";
        $stmt_salario = $this->conn->query($sql_salario);
        $salario_data = $stmt_salario->fetch(PDO::FETCH_ASSOC);
        $result['total_salarial'] = $salario_data['total_salarial'] ?? 0;
        $result['media_salarial'] = $salario_data['media_salarial'] ?? 0;
        
        // Últimos funcionários cadastrados
        $sql_recentes = "SELECT ID_FUNCIONARIO, NOME_FUNCIONARIO, CARGO, EMAIL_FUNCIONARIO, CRIADO_EM 
                         FROM FUNCIONARIOS ORDER BY CRIADO_EM DESC LIMIT 10";
        $stmt_recentes = $this->conn->query($sql_recentes);
        $result['recentes'] = $stmt_recentes->fetchAll(PDO::FETCH_ASSOC);
        
        return $result;
    }

    // 20. Buscar com relacionamentos
    public function buscarComRelacionamentos($id_funcionario = null) {
        $sql = "SELECT 
                    f.*,
                    m.NOME_MODALIDADE,
                    m.DESCRICAO as DESCRICAO_MODALIDADE
                FROM FUNCIONARIOS f
                LEFT JOIN MODALIDADES m ON f.ID_MODALIDADE = m.ID_MODALIDADE";
        
        if ($id_funcionario !== null) {
            $sql .= " WHERE f.ID_FUNCIONARIO = :id_funcionario";
        }
        
        $sql .= " ORDER BY f.ID_FUNCIONARIO DESC";
        
        $stmt = $this->conn->prepare($sql);
        
        if ($id_funcionario !== null) {
            $stmt->execute([':id_funcionario' => $id_funcionario]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt->execute();
            
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[] = $row;
            }
            return $result;
        }
    }
}
?>