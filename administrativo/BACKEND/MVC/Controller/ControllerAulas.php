<?php

require_once '../Model/aulaDAO.php';
require_once '../Model/aula.php';

class ControllerAulas {
    private $aulaDAO;
    
    public function __construct() {
        $this->aulaDAO = new AulaDAO();
    }
    
    // 1. Criar aula
    public function criarAula($dados) {
        try {
            // Validação dos dados obrigatórios
            if (empty($dados['nome_aula']) || empty($dados['id_modalidade']) || 
                empty($dados['dia_semana']) || empty($dados['horario_inicio'])) {
                return ['success' => false, 'message' => 'Dados obrigatórios não fornecidos'];
            }
            
            // Verificar conflito de horário
            $conflito = $this->aulaDAO->verificarConflitoHorario(
                $dados['id_unidade'] ?? 0,
                $dados['dia_semana'],
                $dados['horario_inicio'],
                $dados['duracao_minutos'] ?? 60
            );
            
            if ($conflito) {
                return ['success' => false, 'message' => 'Conflito de horário nesta unidade'];
            }
            
            // Criar objeto Aula
            $aula = new Aulas(
                $dados['nome_aula'],
                $dados['id_modalidade'],
                $dados['id_instrutor'] ?? null,
                $dados['id_unidade'] ?? null,
                $dados['dia_semana'],
                $dados['horario_inicio'],
                $dados['duracao_minutos'] ?? 60,
                $dados['vagas'] ?? 30
            );
            
            // Salvar no banco
            $aulaCriada = $this->aulaDAO->criar($aula);
            
            return [
                'success' => true,
                'message' => 'Aula criada com sucesso',
                'data' => $this->formatarAula($aulaCriada)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao criar aula: ' . $e->getMessage()
            ];
        }
    }
    
    // 2. Listar aulas
    public function listarAulas($filtros = []) {
        try {
            $aulas = $this->aulaDAO->listarTodos($filtros);
            
            $aulasFormatadas = [];
            foreach ($aulas as $aula) {
                $aulasFormatadas[] = $this->formatarAula($aula);
            }
            
            return [
                'success' => true,
                'data' => $aulasFormatadas,
                'total' => count($aulasFormatadas)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao listar aulas: ' . $e->getMessage()
            ];
        }
    }
    
    // 3. Buscar aula por ID
    public function buscarAula($id_aula) {
        try {
            if (empty($id_aula) || !is_numeric($id_aula)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            $aula = $this->aulaDAO->buscarPorId($id_aula);
            
            if (!$aula) {
                return ['success' => false, 'message' => 'Aula não encontrada'];
            }
            
            return [
                'success' => true,
                'data' => $this->formatarAula($aula)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar aula: ' . $e->getMessage()
            ];
        }
    }
    
    // 4. Atualizar aula
    public function atualizarAula($id_aula, $dados) {
        try {
            if (empty($id_aula) || !is_numeric($id_aula)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            // Buscar aula existente
            $aulaExistente = $this->aulaDAO->buscarPorId($id_aula);
            
            if (!$aulaExistente) {
                return ['success' => false, 'message' => 'Aula não encontrada'];
            }
            
            // Atualizar campos se fornecidos
            if (!empty($dados['nome_aula'])) {
                $aulaExistente->setNomeAula($dados['nome_aula']);
            }
            
            if (!empty($dados['id_modalidade'])) {
                $aulaExistente->setIdModalidade($dados['id_modalidade']);
            }
            
            if (isset($dados['id_instrutor'])) {
                $aulaExistente->setIdInstrutor($dados['id_instrutor']);
            }
            
            if (isset($dados['id_unidade'])) {
                $aulaExistente->setIdUnidade($dados['id_unidade']);
            }
            
            if (!empty($dados['dia_semana'])) {
                $aulaExistente->setDiaSemana($dados['dia_semana']);
            }
            
            if (!empty($dados['horario_inicio'])) {
                $aulaExistente->setHorarioInicio($dados['horario_inicio']);
            }
            
            if (!empty($dados['duracao_minutos'])) {
                $aulaExistente->setDuracaoMinutos($dados['duracao_minutos']);
            }
            
            if (!empty($dados['vagas'])) {
                $aulaExistente->setVagas($dados['vagas']);
            }
            
            // Verificar conflito de horário sempre que houver alteração em campos relevantes
            $necessitaVerificarConflito = false;
            $camposHorario = ['id_unidade', 'dia_semana', 'horario_inicio', 'duracao_minutos'];
            
            foreach ($camposHorario as $campo) {
                if (isset($dados[$campo])) {
                    $necessitaVerificarConflito = true;
                    break;
                }
            }
            
            if ($necessitaVerificarConflito) {
                $conflito = $this->aulaDAO->verificarConflitoHorario(
                    $aulaExistente->getIdUnidade() ?? 0,
                    $aulaExistente->getDiaSemana(),
                    $aulaExistente->getHorarioInicio(),
                    $aulaExistente->getDuracaoMinutos(),
                    $id_aula
                );
                
                if ($conflito) {
                    return ['success' => false, 'message' => 'Conflito de horário nesta unidade'];
                }
            }
            
            // Atualizar no banco
            $resultado = $this->aulaDAO->atualizar($aulaExistente);
            
            if ($resultado) {
                return [
                    'success' => true,
                    'message' => 'Aula atualizada com sucesso',
                    'data' => $this->formatarAula($aulaExistente)
                ];
            } else {
                return ['success' => false, 'message' => 'Nenhuma alteração realizada'];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao atualizar aula: ' . $e->getMessage()
            ];
        }
    }
    
    // 5. Excluir aula
    public function excluirAula($id_aula) {
        try {
            if (empty($id_aula) || !is_numeric($id_aula)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            $resultado = $this->aulaDAO->excluir($id_aula);
            
            if ($resultado) {
                return [
                    'success' => true,
                    'message' => 'Aula excluída com sucesso'
                ];
            } else {
                return ['success' => false, 'message' => 'Aula não encontrada'];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao excluir aula: ' . $e->getMessage()
            ];
        }
    }
    
    // 6. Buscar aulas por modalidade
    public function listarPorModalidade($id_modalidade) {
        try {
            if (empty($id_modalidade) || !is_numeric($id_modalidade)) {
                return ['success' => false, 'message' => 'ID da modalidade inválido'];
            }
            
            $aulas = $this->aulaDAO->buscarPorModalidade($id_modalidade);
            
            $aulasFormatadas = [];
            foreach ($aulas as $aula) {
                $aulasFormatadas[] = $this->formatarAula($aula);
            }
            
            return [
                'success' => true,
                'data' => $aulasFormatadas,
                'total' => count($aulasFormatadas)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar aulas por modalidade: ' . $e->getMessage()
            ];
        }
    }
    
    // 7. Buscar aulas por unidade
    public function listarPorUnidade($id_unidade) {
        try {
            if (empty($id_unidade) || !is_numeric($id_unidade)) {
                return ['success' => false, 'message' => 'ID da unidade inválido'];
            }
            
            $aulas = $this->aulaDAO->buscarPorUnidade($id_unidade);
            
            $aulasFormatadas = [];
            foreach ($aulas as $aula) {
                $aulasFormatadas[] = $this->formatarAula($aula);
            }
            
            return [
                'success' => true,
                'data' => $aulasFormatadas,
                'total' => count($aulasFormatadas)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar aulas por unidade: ' . $e->getMessage()
            ];
        }
    }
    
    // 8. Buscar aulas por instrutor
    public function listarPorInstrutor($id_instrutor) {
        try {
            if (empty($id_instrutor) || !is_numeric($id_instrutor)) {
                return ['success' => false, 'message' => 'ID do instrutor inválido'];
            }
            
            $aulas = $this->aulaDAO->buscarPorInstrutor($id_instrutor);
            
            $aulasFormatadas = [];
            foreach ($aulas as $aula) {
                $aulasFormatadas[] = $this->formatarAula($aula);
            }
            
            return [
                'success' => true,
                'data' => $aulasFormatadas,
                'total' => count($aulasFormatadas)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar aulas por instrutor: ' . $e->getMessage()
            ];
        }
    }
    
    // 9. Buscar agenda semanal
    public function buscarAgendaSemanal($id_unidade = null, $data_referencia = null) {
        try {
            // Validar data_referencia
            if ($data_referencia) {
                $dataObj = DateTime::createFromFormat('Y-m-d', $data_referencia);
                if (!$dataObj) {
                    return ['success' => false, 'message' => 'Formato de data inválido. Use YYYY-MM-DD'];
                }
                $data_referencia = $dataObj->format('Y-m-d');
            }
            
            $aulas = $this->aulaDAO->buscarAgendaSemanal($id_unidade, $data_referencia);
            
            $aulasFormatadas = [];
            foreach ($aulas as $aula) {
                $aulasFormatadas[] = $this->formatarAula($aula);
            }
            
            // Obter nome do dia da semana
            $data_ref = $data_referencia ? new DateTime($data_referencia) : new DateTime();
            $dia_nome = $this->getNomeDiaSemana($data_ref->format('N'));
            
            return [
                'success' => true,
                'data' => $aulasFormatadas,
                'total' => count($aulasFormatadas),
                'dia_semana' => $dia_nome,
                'data_referencia' => $data_ref->format('Y-m-d')
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar agenda semanal: ' . $e->getMessage()
            ];
        }
    }
    
    // 10. Verificar conflitos de horário
    public function verificarConflito($dados) {
        try {
            if (empty($dados['id_unidade']) || empty($dados['dia_semana']) || 
                empty($dados['horario_inicio'])) {
                return ['success' => false, 'message' => 'Dados insuficientes para verificação'];
            }
            
            // Validação adicional
            if (!is_numeric($dados['id_unidade'])) {
                return ['success' => false, 'message' => 'ID da unidade inválido'];
            }
            
            $conflito = $this->aulaDAO->verificarConflitoHorario(
                $dados['id_unidade'],
                $dados['dia_semana'],
                $dados['horario_inicio'],
                $dados['duracao_minutos'] ?? 60,
                $dados['id_aula_excluir'] ?? null
            );
            
            return [
                'success' => true,
                'tem_conflito' => $conflito,
                'message' => $conflito ? 'Conflito de horário encontrado' : 'Horário disponível'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao verificar conflito: ' . $e->getMessage()
            ];
        }
    }
    
    // 11. Buscar aula com relacionamentos (SIMPLIFICADO)
    public function buscarAulaCompleta($id_aula) {
        try {
            if (empty($id_aula) || !is_numeric($id_aula)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            $aula = $this->aulaDAO->buscarPorId($id_aula);
            
            if (!$aula) {
                return ['success' => false, 'message' => 'Aula não encontrada'];
            }
            
            $dadosCompletos = $this->formatarAula($aula);
            
            return [
                'success' => true,
                'data' => $dadosCompletos
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar aula completa: ' . $e->getMessage()
            ];
        }
    }
    
    // 12. Listar todas as aulas (método simplificado)
    public function listarAulasCompletas($filtros = []) {
        try {
            // Usar o método listarAulas existente
            $resultado = $this->listarAulas($filtros);
            
            if (!$resultado['success']) {
                return $resultado;
            }
            
            return [
                'success' => true,
                'data' => $resultado['data'],
                'total' => $resultado['total']
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao listar aulas completas: ' . $e->getMessage()
            ];
        }
    }
    
    // 13. Métodos auxiliares
    
    private function formatarAula(Aulas $aula) {
        return [
            'id_aula' => $aula->getIdAula(),
            'nome_aula' => $aula->getNomeAula(),
            'id_modalidade' => $aula->getIdModalidade(),
            'id_instrutor' => $aula->getIdInstrutor(),
            'id_unidade' => $aula->getIdUnidade(),
            'dia_semana' => $aula->getDiaSemana(),
            'horario_inicio' => $aula->getHorarioInicio(),
            'horario_termino' => $aula->getHorarioTermino(),
            'duracao_minutos' => $aula->getDuracaoMinutos(),
            'vagas' => $aula->getVagas(),
            'criado_em' => $aula->getCriadoEm()
        ];
    }
    
    private function formatarAulaComRelacionamentos($dados) {
        // Se dados já é um objeto Aulas
        if ($dados instanceof Aulas) {
            return $this->formatarAula($dados);
        }
        
        // Se é um array associativo
        return [
            'id_aula' => $dados['ID_AULA'] ?? $dados['id_aula'] ?? null,
            'nome_aula' => $dados['NOME_AULA'] ?? $dados['nome_aula'] ?? null,
            'id_modalidade' => $dados['ID_MODALIDADE'] ?? $dados['id_modalidade'] ?? null,
            'nome_modalidade' => $dados['NOME_MODALIDADE'] ?? $dados['nome_modalidade'] ?? null,
            'id_instrutor' => $dados['ID_INSTRUTOR'] ?? $dados['id_instrutor'] ?? null,
            'nome_instrutor' => $dados['NOME_INSTRUTOR'] ?? $dados['nome_instrutor'] ?? null,
            'id_unidade' => $dados['ID_UNIDADE'] ?? $dados['id_unidade'] ?? null,
            'nome_unidade' => $dados['NOME_UNIDADE'] ?? $dados['nome_unidade'] ?? null,
            'endereco_unidade' => $dados['ENDERECO'] ?? $dados['endereco'] ?? null,
            'dia_semana' => $dados['DIA_SEMANA'] ?? $dados['dia_semana'] ?? null,
            'horario_inicio' => $dados['HORARIO_INICIO'] ?? $dados['horario_inicio'] ?? null,
            'duracao_minutos' => $dados['DURACAO_MINUTOS'] ?? $dados['duracao_minutos'] ?? null,
            'vagas' => $dados['VAGAS'] ?? $dados['vagas'] ?? null,
            'criado_em' => $dados['CRIADO_EM'] ?? $dados['criado_em'] ?? null,
            'horario_termino' => $this->calcularHorarioTermino(
                $dados['HORARIO_INICIO'] ?? $dados['horario_inicio'] ?? null,
                $dados['DURACAO_MINUTOS'] ?? $dados['duracao_minutos'] ?? null
            )
        ];
    }
    
    private function calcularHorarioTermino($horario_inicio, $duracao_minutos) {
        if (!$horario_inicio || !$duracao_minutos) {
            return null;
        }
        
        try {
            $inicio = new DateTime($horario_inicio);
            $inicio->modify("+{$duracao_minutos} minutes");
            return $inicio->format('H:i:s');
        } catch (Exception $e) {
            return null;
        }
    }
    
    private function getNomeDiaSemana($numero_dia) {
        $dias = [
            1 => 'Segunda-feira',
            2 => 'Terça-feira',
            3 => 'Quarta-feira',
            4 => 'Quinta-feira',
            5 => 'Sexta-feira',
            6 => 'Sábado',
            7 => 'Domingo'
        ];
        
        return $dias[$numero_dia] ?? 'Dia inválido';
    }
    
    private function filtrarAulas($aulas, $filtros) {
        return array_filter($aulas, function($aula) use ($filtros) {
            foreach ($filtros as $campo => $valor) {
                if (!empty($valor)) {
                    // Tenta várias formas de acessar o campo
                    $campoUpper = strtoupper($campo);
                    $campoLower = strtolower($campo);
                    $campoCamel = lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $campo))));
                    
                    $valorAula = null;
                    
                    if (isset($aula[$campoUpper])) {
                        $valorAula = $aula[$campoUpper];
                    } elseif (isset($aula[$campoLower])) {
                        $valorAula = $aula[$campoLower];
                    } elseif (isset($aula[$campo])) {
                        $valorAula = $aula[$campo];
                    } elseif (is_array($aula) && array_key_exists($campoCamel, $aula)) {
                        $valorAula = $aula[$campoCamel];
                    } elseif (is_object($aula) && property_exists($aula, $campoCamel)) {
                        $getter = 'get' . ucfirst($campoCamel);
                        if (method_exists($aula, $getter)) {
                            $valorAula = $aula->$getter();
                        }
                    } else {
                        // Se não encontrou o campo, ignora este filtro
                        continue;
                    }
                    
                    if ($campo === 'dia_semana') {
                        if (strtoupper($valorAula) !== strtoupper($valor)) {
                            return false;
                        }
                    } elseif ($valorAula != $valor) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    
    // 14. Método para validar dados da aula
    public function validarDadosAula($dados, $operacao = 'criar') {
        $erros = [];
        
        // Campos obrigatórios para criação
        if ($operacao === 'criar') {
            $campos_obrigatorios = ['nome_aula', 'id_modalidade', 'dia_semana', 'horario_inicio'];
            foreach ($campos_obrigatorios as $campo) {
                if (empty($dados[$campo])) {
                    $erros[] = "Campo obrigatório faltando: {$campo}";
                }
            }
        }
        
        // Validação de tipos
        if (isset($dados['id_modalidade']) && !is_numeric($dados['id_modalidade'])) {
            $erros[] = "ID modalidade deve ser numérico";
        }
        
        if (isset($dados['id_instrutor']) && !empty($dados['id_instrutor']) && !is_numeric($dados['id_instrutor'])) {
            $erros[] = "ID instrutor deve ser numérico";
        }
        
        if (isset($dados['id_unidade']) && !empty($dados['id_unidade']) && !is_numeric($dados['id_unidade'])) {
            $erros[] = "ID unidade deve ser numérico";
        }
        
        // Validação de dia da semana
        if (isset($dados['dia_semana']) && !empty($dados['dia_semana'])) {
            $dias_validos = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
            if (!in_array(strtoupper($dados['dia_semana']), $dias_validos)) {
                $erros[] = "Dia da semana inválido";
            }
        }
        
        // Validação de horário
        if (isset($dados['horario_inicio']) && !empty($dados['horario_inicio'])) {
            if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/', $dados['horario_inicio'])) {
                $erros[] = "Formato de horário inválido";
            }
        }
        
        // Validação de duração
        if (isset($dados['duracao_minutos']) && !empty($dados['duracao_minutos'])) {
            if (!is_numeric($dados['duracao_minutos']) || $dados['duracao_minutos'] < 1 || $dados['duracao_minutos'] > 480) {
                $erros[] = "Duração inválida (1-480 minutos)";
            }
        }
        
        // Validação de vagas
        if (isset($dados['vagas']) && !empty($dados['vagas'])) {
            if (!is_numeric($dados['vagas']) || $dados['vagas'] < 0 || $dados['vagas'] > 500) {
                $erros[] = "Número de vagas inválido (0-500)";
            }
        }
        
        return $erros;
    }
}
?>  