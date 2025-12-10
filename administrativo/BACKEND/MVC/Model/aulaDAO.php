<?php

require_once 'aula.php';
require_once 'Connection.php';

class AulaDAO {
    private $conn;
    
    public function __construct() {
        // aqui chamamos o método getInstance() da classe Connection
        // esse método retorna um objeto PDO já configurado para se conectar ao banco
        $this->conn = Connection::getInstance();
    
    }
    
    // 1. Criar nova aula
    public function criar(Aulas $aula) {
        $sql = "INSERT INTO AULAS (NOME_AULA, ID_MODALIDADE, ID_INSTRUTOR, ID_UNIDADE, DIA_SEMANA, 
                HORARIO_INICIO, DURACAO_MINUTOS, VAGAS, CRIADO_EM) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try {
            $stmt = $this->conn->prepare($sql);
            
            $stmt->execute([
                $aula->getNomeAula(),
                $aula->getIdModalidade(),
                $aula->getIdInstrutor(),
                $aula->getIdUnidade(),
                $aula->getDiaSemana(),
                $aula->getHorarioInicio(),
                $aula->getDuracaoMinutos(),
                $aula->getVagas(),
                $aula->getCriadoEm()
            ]);
            
            $aula->setIdAula($this->conn->lastInsertId());
            return $aula;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao criar aula: " . $e->getMessage());
        }
    }
    
    // 2. Buscar aula por ID
    public function buscarPorId($id_aula) {
        $sql = "SELECT * FROM AULAS WHERE ID_AULA = ?";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$id_aula]);
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($resultado) {
                return $this->mapearParaObjeto($resultado);
            }
            return null;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar aula: " . $e->getMessage());
        }
    }
    
    // 3. Listar todas as aulas
    public function listarTodos($filtros = []) {
        $sql = "SELECT * FROM AULAS WHERE 1=1";
        $params = [];
        
        // Aplicar filtros dinâmicos
        if (!empty($filtros['id_modalidade'])) {
            $sql .= " AND ID_MODALIDADE = ?";
            $params[] = $filtros['id_modalidade'];
        }
        
        if (!empty($filtros['id_instrutor'])) {
            $sql .= " AND ID_INSTRUTOR = ?";
            $params[] = $filtros['id_instrutor'];
        }
        
        if (!empty($filtros['id_unidade'])) {
            $sql .= " AND ID_UNIDADE = ?";
            $params[] = $filtros['id_unidade'];
        }
        
        if (!empty($filtros['dia_semana'])) {
            $sql .= " AND DIA_SEMANA = ?";
            $params[] = strtoupper($filtros['dia_semana']);
        }
        
        $sql .= " ORDER BY DIA_SEMANA, HORARIO_INICIO";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $aulas = [];
            foreach ($resultados as $row) {
                $aulas[] = $this->mapearParaObjeto($row);
            }
            return $aulas;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao listar aulas: " . $e->getMessage());
        }
    }
    
    // 4. Atualizar aula
    public function atualizar(Aulas $aula) {
        $sql = "UPDATE AULAS SET 
                NOME_AULA = ?, 
                ID_MODALIDADE = ?, 
                ID_INSTRUTOR = ?, 
                ID_UNIDADE = ?, 
                DIA_SEMANA = ?, 
                HORARIO_INICIO = ?, 
                DURACAO_MINUTOS = ?, 
                VAGAS = ? 
                WHERE ID_AULA = ?";
        
        try {
            $stmt = $this->conn->prepare($sql);
            
            return $stmt->execute([
                $aula->getNomeAula(),
                $aula->getIdModalidade(),
                $aula->getIdInstrutor(),
                $aula->getIdUnidade(),
                $aula->getDiaSemana(),
                $aula->getHorarioInicio(),
                $aula->getDuracaoMinutos(),
                $aula->getVagas(),
                $aula->getIdAula()
            ]);
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao atualizar aula: " . $e->getMessage());
        }
    }
    
    // 5. Excluir aula
    public function excluir($id_aula) {
        $sql = "DELETE FROM AULAS WHERE ID_AULA = ?";
        
        try {
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$id_aula]);
            
        } catch (PDOException $e) {
            // Verificar se é erro de chave estrangeira
            if ($e->getCode() == '23000') {
                throw new Exception("Não é possível excluir esta aula pois existem registros relacionados.");
            }
            throw new Exception("Erro ao excluir aula: " . $e->getMessage());
        }
    }
    
    // 6. Buscar aulas por modalidade
    public function buscarPorModalidade($id_modalidade) {
        $sql = "SELECT * FROM AULAS WHERE ID_MODALIDADE = ? ORDER BY DIA_SEMANA, HORARIO_INICIO";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$id_modalidade]);
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $aulas = [];
            foreach ($resultados as $row) {
                $aulas[] = $this->mapearParaObjeto($row);
            }
            return $aulas;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar aulas por modalidade: " . $e->getMessage());
        }
    }
    
    // 7. Buscar aulas por unidade
    public function buscarPorUnidade($id_unidade) {
        $sql = "SELECT * FROM AULAS WHERE ID_UNIDADE = ? ORDER BY DIA_SEMANA, HORARIO_INICIO";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$id_unidade]);
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $aulas = [];
            foreach ($resultados as $row) {
                $aulas[] = $this->mapearParaObjeto($row);
            }
            return $aulas;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar aulas por unidade: " . $e->getMessage());
        }
    }
    
    // 8. Buscar aulas por instrutor
    public function buscarPorInstrutor($id_instrutor) {
        $sql = "SELECT * FROM AULAS WHERE ID_INSTRUTOR = ? ORDER BY DIA_SEMANA, HORARIO_INICIO";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$id_instrutor]);
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $aulas = [];
            foreach ($resultados as $row) {
                $aulas[] = $this->mapearParaObjeto($row);
            }
            return $aulas;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar aulas por instrutor: " . $e->getMessage());
        }
    }
    
    // 9. Verificar conflitos de horário
    public function verificarConflitoHorario($id_unidade, $dia_semana, $horario_inicio, $duracao, $id_aula_excluir = null) {
        $sql = "SELECT * FROM AULAS 
                WHERE ID_UNIDADE = ? 
                AND DIA_SEMANA = ? 
                AND ID_AULA != ? 
                AND (
                    (HORARIO_INICIO <= ? AND ADDTIME(HORARIO_INICIO, SEC_TO_TIME(DURACAO_MINUTOS * 60)) > ?) OR
                    (HORARIO_INICIO < ADDTIME(?, SEC_TO_TIME(? * 60)) AND ADDTIME(HORARIO_INICIO, SEC_TO_TIME(DURACAO_MINUTOS * 60)) >= ADDTIME(?, SEC_TO_TIME(? * 60))) OR
                    (HORARIO_INICIO >= ? AND ADDTIME(HORARIO_INICIO, SEC_TO_TIME(DURACAO_MINUTOS * 60)) <= ADDTIME(?, SEC_TO_TIME(? * 60)))
                )";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $id_aula_excluir = $id_aula_excluir ?? 0;
            
            $stmt->execute([
                $id_unidade,
                $dia_semana,
                $id_aula_excluir,
                $horario_inicio,
                $horario_inicio,
                $horario_inicio,
                $duracao,
                $horario_inicio,
                $duracao,
                $horario_inicio,
                $horario_inicio,
                $duracao
            ]);
            
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return count($resultados) > 0;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao verificar conflitos de horário: " . $e->getMessage());
        }
    }
    
    // 10. Contar total de vagas por modalidade
    public function contarVagasPorModalidade($id_modalidade) {
        $sql = "SELECT COUNT(*) as total_aulas, SUM(VAGAS) as total_vagas 
                FROM AULAS 
                WHERE ID_MODALIDADE = ?";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$id_modalidade]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao contar vagas: " . $e->getMessage());
        }
    }
    
    // 11. Buscar aulas com informações relacionadas (JOIN)
    public function buscarComRelacionamentos($id_aula = null) {
        $sql = "SELECT 
                    a.*,
                    m.NOME_MODALIDADE,
                    f.NOME as NOME_INSTRUTOR,
                    u.NOME_UNIDADE,
                    u.ENDERECO
                FROM AULAS a
                LEFT JOIN MODALIDADES m ON a.ID_MODALIDADE = m.ID_MODALIDADE
                LEFT JOIN FUNCIONARIOS f ON a.ID_INSTRUTOR = f.ID_FUNCIONARIO
                LEFT JOIN UNIDADES u ON a.ID_UNIDADE = u.ID_UNIDADE";
        
        $params = [];
        if ($id_aula) {
            $sql .= " WHERE a.ID_AULA = ?";
            $params[] = $id_aula;
        }
        
        $sql .= " ORDER BY a.DIA_SEMANA, a.HORARIO_INICIO";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            
            if ($id_aula) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar aulas com relacionamentos: " . $e->getMessage());
        }
    }
    
    // 12. Método para mapear array para objeto
    private function mapearParaObjeto($row) {
        $aula = new Aulas(
            $row['NOME_AULA'],
            $row['ID_MODALIDADE'],
            $row['ID_INSTRUTOR'],
            $row['ID_UNIDADE'],
            $row['DIA_SEMANA'],
            $row['HORARIO_INICIO'],
            $row['DURACAO_MINUTOS'],
            $row['VAGAS'],
            $row['CRIADO_EM']
        );
        
        $aula->setIdAula($row['ID_AULA']);
        return $aula;
    }
    
    // 13. Buscar agenda semanal
    public function buscarAgendaSemanal($id_unidade = null, $data_referencia = null) {
        $data_referencia = $data_referencia ? new DateTime($data_referencia) : new DateTime();
        $dia_semana_atual = $data_referencia->format('N'); // 1=Segunda, 7=Domingo
        
        // Mapear número para código de dia da semana
        $mapa_dias = [
            1 => 'SEG', 2 => 'TER', 3 => 'QUA', 
            4 => 'QUI', 5 => 'SEX', 6 => 'SAB', 7 => 'DOM'
        ];
        
        $dia_semana_sql = $mapa_dias[$dia_semana_atual];
        
        $sql = "SELECT * FROM AULAS 
                WHERE DIA_SEMANA = ?";
        
        $params = [$dia_semana_sql];
        
        if ($id_unidade) {
            $sql .= " AND ID_UNIDADE = ?";
            $params[] = $id_unidade;
        }
        
        $sql .= " ORDER BY HORARIO_INICIO";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $aulas = [];
            foreach ($resultados as $row) {
                $aulas[] = $this->mapearParaObjeto($row);
            }
            return $aulas;
            
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar agenda semanal: " . $e->getMessage());
        }
    }
}
?>