<?php
require_once 'aulas.php';         // importa a classe Aulas
require_once 'Connection.php';    // importa a classe Connection

class AulaDAO {
    private $conn; // atributo que vai guardar a conexão com o banco de dados

    public function __construct() {
        // aqui chamamos o método getInstance() da classe Connection
        $this->conn = Connection::getInstance(); 

        // cria a tabela AULAS caso ela ainda não exista no banco
        $this->conn->exec("
            DROP TABLE IF EXISTS AULAS;
            CREATE TABLE AULAS (
                ID_AULA INT AUTO_INCREMENT PRIMARY KEY,
                NOME_AULA VARCHAR(150),
                ID_MODALIDADE INT NOT NULL,
                ID_INSTRUTOR INT DEFAULT NULL,
                ID_UNIDADE INT DEFAULT NULL,
                DIA_SEMANA ENUM('DOM','SEG','TER','QUA','QUI','SEX','SAB') NOT NULL,
                HORARIO_INICIO TIME NOT NULL,
                DURACAO_MINUTOS SMALLINT UNSIGNED NOT NULL DEFAULT 60,
                VAGAS SMALLINT UNSIGNED NOT NULL DEFAULT 30,
                CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_aulas_modalidade (ID_MODALIDADE),
                INDEX idx_aulas_instrutor (ID_INSTRUTOR),
                INDEX idx_aulas_unidade (ID_UNIDADE),
                CONSTRAINT fk_aulas_modalidade FOREIGN KEY (ID_MODALIDADE) REFERENCES MODALIDADES(ID_MODALIDADE)
                    ON UPDATE CASCADE ON DELETE RESTRICT,
                CONSTRAINT fk_aulas_instrutor FOREIGN KEY (ID_INSTRUTOR) REFERENCES FUNCIONARIOS(ID_FUNCIONARIO)
                    ON UPDATE CASCADE ON DELETE SET NULL,
                CONSTRAINT fk_aulas_unidade FOREIGN KEY (ID_UNIDADE) REFERENCES UNIDADES(ID_UNIDADE)
            );
        ");
    }

    // método para inserir uma nova aula no banco
    public function criarAula(Aulas $aula) {
        $sql = "INSERT INTO AULAS 
                (NOME_AULA, ID_MODALIDADE, ID_INSTRUTOR, ID_UNIDADE, DIA_SEMANA, 
                 HORARIO_INICIO, DURACAO_MINUTOS, VAGAS, CRIADO_EM)
                VALUES 
                (:NOME_AULA, :ID_MODALIDADE, :ID_INSTRUTOR, :ID_UNIDADE, :DIA_SEMANA, 
                 :HORARIO_INICIO, :DURACAO_MINUTOS, :VAGAS, :CRIADO_EM)";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            ':NOME_AULA'         => $aula->getNomeAula(),
            ':ID_MODALIDADE'     => $aula->getIdModalidade(),
            ':ID_INSTRUTOR'      => $aula->getIdInstrutor(),
            ':ID_UNIDADE'        => $aula->getIdUnidade(),
            ':DIA_SEMANA'        => $aula->getDiaSemana(),
            ':HORARIO_INICIO'    => $aula->getHorarioInicio(),
            ':DURACAO_MINUTOS'   => $aula->getDuracaoMinutos(),
            ':VAGAS'             => $aula->getVagas(),
            ':CRIADO_EM'         => $aula->getCriadoEm()
        ]);

        return $this->conn->lastInsertId(); // Retorna o ID da aula criada
    }

    // método que lê todas as aulas da tabela
    public function lerAulasAll() {
        $stmt = $this->conn->query("SELECT * FROM AULAS ORDER BY DIA_SEMANA, HORARIO_INICIO");
        $result = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = [
                'ID_AULA'           => $row['ID_AULA'],
                'NOME_AULA'         => $row['NOME_AULA'],
                'ID_MODALIDADE'     => $row['ID_MODALIDADE'],
                'ID_INSTRUTOR'      => $row['ID_INSTRUTOR'],
                'ID_UNIDADE'        => $row['ID_UNIDADE'],
                'DIA_SEMANA'        => $row['DIA_SEMANA'],
                'HORARIO_INICIO'    => $row['HORARIO_INICIO'],
                'DURACAO_MINUTOS'   => $row['DURACAO_MINUTOS'],
                'VAGAS'             => $row['VAGAS'],
                'CRIADO_EM'         => $row['CRIADO_EM']
            ];
        }

        return $result;
    }

    // Atualizar aula
    public function atualizarAula($idAula, $novoNomeAula, $novoIdModalidade, $novoIdInstrutor, 
                                  $novoIdUnidade, $novoDiaSemana, $novoHorarioInicio, 
                                  $novoDuracaoMinutos, $novoVagas) {

        $sql = "UPDATE AULAS 
                SET NOME_AULA = :novoNomeAula, 
                    ID_MODALIDADE = :novoIdModalidade, 
                    ID_INSTRUTOR = :novoIdInstrutor, 
                    ID_UNIDADE = :novoIdUnidade, 
                    DIA_SEMANA = :novoDiaSemana, 
                    HORARIO_INICIO = :novoHorarioInicio, 
                    DURACAO_MINUTOS = :novoDuracaoMinutos, 
                    VAGAS = :novoVagas 
                WHERE ID_AULA = :idAula";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            ':novoNomeAula'       => $novoNomeAula,
            ':novoIdModalidade'   => $novoIdModalidade,
            ':novoIdInstrutor'    => $novoIdInstrutor,
            ':novoIdUnidade'      => $novoIdUnidade,
            ':novoDiaSemana'      => $novoDiaSemana,
            ':novoHorarioInicio'  => $novoHorarioInicio,
            ':novoDuracaoMinutos' => $novoDuracaoMinutos,
            ':novoVagas'          => $novoVagas,
            ':idAula'             => $idAula
        ]);

        return $stmt->rowCount(); // Retorna o número de linhas afetadas
    }

    // Deletar aula
    public function deletarAula($id_aula) {
        $stmt = $this->conn->prepare('DELETE FROM AULAS WHERE ID_AULA = ?');
        $stmt->execute([$id_aula]);
        return $stmt->rowCount();
    }

    // Buscar aulas pelo nome 
    public function buscarAulas($nome) {
        $stmt = $this->conn->prepare("
            SELECT * FROM AULAS WHERE NOME_AULA LIKE :nome
            ORDER BY DIA_SEMANA, HORARIO_INICIO
        ");
        
        $stmt->execute([':nome' => "%$nome%"]);

        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    }

    // Buscar aula por ID
    public function buscarAulaPorID($id) {
        $sql = "SELECT * FROM AULAS WHERE ID_AULA = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Buscar aulas por modalidade
    public function buscarAulasPorModalidade($id_modalidade) {
        $sql = "SELECT * FROM AULAS WHERE ID_MODALIDADE = ? ORDER BY DIA_SEMANA, HORARIO_INICIO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id_modalidade]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    }

    // Buscar aulas por instrutor
    public function buscarAulasPorInstrutor($id_instrutor) {
        $sql = "SELECT * FROM AULAS WHERE ID_INSTRUTOR = ? ORDER BY DIA_SEMANA, HORARIO_INICIO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id_instrutor]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    }

    // Buscar aulas por unidade
    public function buscarAulasPorUnidade($id_unidade) {
        $sql = "SELECT * FROM AULAS WHERE ID_UNIDADE = ? ORDER BY DIA_SEMANA, HORARIO_INICIO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id_unidade]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    }

    // Buscar aulas por dia da semana
    public function buscarAulasPorDia($dia_semana) {
        $sql = "SELECT * FROM AULAS WHERE DIA_SEMANA = ? ORDER BY HORARIO_INICIO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([strtoupper($dia_semana)]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    }

    // Buscar aulas com vagas disponíveis
    public function buscarAulasComVagas() {
        $sql = "SELECT a.*, 
                       (SELECT COUNT(*) FROM MATRICULAS_AULAS WHERE ID_AULA = a.ID_AULA) as vagas_ocupadas
                FROM AULAS a
                HAVING vagas_ocupadas < VAGAS
                ORDER BY DIA_SEMANA, HORARIO_INICIO";
        
        $stmt = $this->conn->query($sql);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    }

    // Verificar conflito de horário para um instrutor
    public function verificarConflitoHorarioInstrutor($id_instrutor, $dia_semana, $horario_inicio, $duracao_minutos, $id_aula_excluir = null) {
        $sql = "SELECT * FROM AULAS 
                WHERE ID_INSTRUTOR = :id_instrutor 
                AND DIA_SEMANA = :dia_semana 
                AND ID_AULA != COALESCE(:id_aula_excluir, -1)
                AND (
                    (HORARIO_INICIO <= :horario_inicio AND 
                    ADDTIME(HORARIO_INICIO, SEC_TO_TIME(DURACAO_MINUTOS * 60)) > :horario_inicio)
                    OR
                    (:horario_inicio <= HORARIO_INICIO AND 
                    ADDTIME(:horario_inicio, SEC_TO_TIME(:duracao_minutos * 60)) > HORARIO_INICIO)
                )";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->execute([
            ':id_instrutor'      => $id_instrutor,
            ':dia_semana'        => $dia_semana,
            ':id_aula_excluir'   => $id_aula_excluir,
            ':horario_inicio'    => $horario_inicio,
            ':duracao_minutos'   => $duracao_minutos
        ]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
    }

    // Contar número de aulas por modalidade
    public function contarAulasPorModalidade() {
        $sql = "SELECT m.NOME_MODALIDADE, COUNT(a.ID_AULA) as total_aulas
                FROM MODALIDADES m
                LEFT JOIN AULAS a ON m.ID_MODALIDADE = a.ID_MODALIDADE
                GROUP BY m.ID_MODALIDADE
                ORDER BY total_aulas DESC";
        
        $stmt = $this->conn->query($sql);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    }
}
?>