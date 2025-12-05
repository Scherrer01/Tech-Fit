<?php
require_once 'AulaDAO.php';
require_once 'aulas.php';

class AulasController {
    private $aulaDAO;

    public function __construct() {
        $this->aulaDAO = new AulaDAO();
    }

    // Método para criar uma nova aula
    public function criarAula($dados) {
        try {
            // Validação dos dados obrigatórios
            if (empty($dados['nome_aula']) || empty($dados['id_modalidade']) || 
                empty($dados['dia_semana']) || empty($dados['horario_inicio'])) {
                return [
                    'success' => false,
                    'message' => 'Dados obrigatórios faltando: nome_aula, id_modalidade, dia_semana, horario_inicio'
                ];
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
                $dados['vagas'] ?? 30,
                $dados['criado_em'] ?? null
            );

            // Verificar conflito de horário se houver instrutor
            if (!empty($dados['id_instrutor'])) {
                $conflito = $this->aulaDAO->verificarConflitoHorarioInstrutor(
                    $dados['id_instrutor'],
                    $dados['dia_semana'],
                    $dados['horario_inicio'],
                    $dados['duracao_minutos'] ?? 60
                );
                
                if ($conflito) {
                    return [
                        'success' => false,
                        'message' => 'Instrutor já tem uma aula neste horário'
                    ];
                }
            }

            // Inserir no banco
            $idAula = $this->aulaDAO->criarAula($aula);

            return [
                'success' => true,
                'message' => 'Aula criada com sucesso',
                'id_aula' => $idAula,
                'aula' => $aula
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao criar aula: ' . $e->getMessage()
            ];
        }
    }

    // Método para listar todas as aulas
    public function listarAulas() {
        try {
            $aulas = $this->aulaDAO->lerAulasAll();
            
            return [
                'success' => true,
                'data' => $aulas,
                'total' => count($aulas)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao listar aulas: ' . $e->getMessage()
            ];
        }
    }

    // Método para buscar aula por ID
    public function buscarAulaPorId($id) {
        try {
            if (empty($id) || !is_numeric($id)) {
                return [
                    'success' => false,
                    'message' => 'ID inválido'
                ];
            }

            $aula = $this->aulaDAO->buscarAulaPorID($id);
            
            if (!$aula) {
                return [
                    'success' => false,
                    'message' => 'Aula não encontrada'
                ];
            }

            return [
                'success' => true,
                'data' => $aula
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar aula: ' . $e->getMessage()
            ];
        }
    }

    // Método para atualizar uma aula
    public function atualizarAula($id, $dados) {
        try {
            if (empty($id) || !is_numeric($id)) {
                return [
                    'success' => false,
                    'message' => 'ID inválido'
                ];
            }

            // Verificar se a aula existe
            $aulaExistente = $this->aulaDAO->buscarAulaPorID($id);
            if (!$aulaExistente) {
                return [
                    'success' => false,
                    'message' => 'Aula não encontrada'
                ];
            }

            // Validar dados obrigatórios para atualização
            if (empty($dados['nome_aula']) || empty($dados['id_modalidade']) || 
                empty($dados['dia_semana']) || empty($dados['horario_inicio'])) {
                return [
                    'success' => false,
                    'message' => 'Dados obrigatórios faltando'
                ];
            }

            // Verificar conflito de horário se houver instrutor (exceto para a própria aula)
            if (!empty($dados['id_instrutor'])) {
                $conflito = $this->aulaDAO->verificarConflitoHorarioInstrutor(
                    $dados['id_instrutor'],
                    $dados['dia_semana'],
                    $dados['horario_inicio'],
                    $dados['duracao_minutos'] ?? 60,
                    $id
                );
                
                if ($conflito) {
                    return [
                        'success' => false,
                        'message' => 'Instrutor já tem uma aula neste horário'
                    ];
                }
            }

            // Atualizar no banco
            $linhasAfetadas = $this->aulaDAO->atualizarAula(
                $id,
                $dados['nome_aula'],
                $dados['id_modalidade'],
                $dados['id_instrutor'] ?? null,
                $dados['id_unidade'] ?? null,
                $dados['dia_semana'],
                $dados['horario_inicio'],
                $dados['duracao_minutos'] ?? 60,
                $dados['vagas'] ?? 30
            );

            return [
                'success' => true,
                'message' => 'Aula atualizada com sucesso',
                'linhas_afetadas' => $linhasAfetadas
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao atualizar aula: ' . $e->getMessage()
            ];
        }
    }

    // Método para deletar uma aula
    public function deletarAula($id) {
        try {
            if (empty($id) || !is_numeric($id)) {
                return [
                    'success' => false,
                    'message' => 'ID inválido'
                ];
            }

            // Verificar se a aula existe
            $aulaExistente = $this->aulaDAO->buscarAulaPorID($id);
            if (!$aulaExistente) {
                return [
                    'success' => false,
                    'message' => 'Aula não encontrada'
                ];
            }

            // Deletar do banco
            $linhasAfetadas = $this->aulaDAO->deletarAula($id);

            return [
                'success' => true,
                'message' => 'Aula deletada com sucesso',
                'linhas_afetadas' => $linhasAfetadas
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao deletar aula: ' . $e->getMessage()
            ];
        }
    }

    // Método para buscar aulas por filtros
    public function buscarAulas($filtros) {
        try {
            $resultados = [];

            // Aplicar filtros conforme solicitado
            if (!empty($filtros['nome'])) {
                $resultados = $this->aulaDAO->buscarAulas($filtros['nome']);
            } 
            elseif (!empty($filtros['id_modalidade'])) {
                $resultados = $this->aulaDAO->buscarAulasPorModalidade($filtros['id_modalidade']);
            }
            elseif (!empty($filtros['id_instrutor'])) {
                $resultados = $this->aulaDAO->buscarAulasPorInstrutor($filtros['id_instrutor']);
            }
            elseif (!empty($filtros['id_unidade'])) {
                $resultados = $this->aulaDAO->buscarAulasPorUnidade($filtros['id_unidade']);
            }
            elseif (!empty($filtros['dia_semana'])) {
                $resultados = $this->aulaDAO->buscarAulasPorDia($filtros['dia_semana']);
            }
            elseif (!empty($filtros['com_vagas'])) {
                $resultados = $this->aulaDAO->buscarAulasComVagas();
            }
            else {
                // Se nenhum filtro específico, retorna todas
                $resultados = $this->aulaDAO->lerAulasAll();
            }

            return [
                'success' => true,
                'data' => $resultados,
                'total' => count($resultados),
                'filtros_aplicados' => array_keys($filtros)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar aulas: ' . $e->getMessage()
            ];
        }
    }

    // Método para obter estatísticas
    public function obterEstatisticas() {
        try {
            $totalAulas = $this->aulaDAO->lerAulasAll();
            $aulasPorModalidade = $this->aulaDAO->contarAulasPorModalidade();
            $aulasComVagas = $this->aulaDAO->buscarAulasComVagas();

            $estatisticas = [
                'total_aulas' => count($totalAulas),
                'aulas_com_vagas' => count($aulasComVagas),
                'aulas_sem_vagas' => count($totalAulas) - count($aulasComVagas),
                'aulas_por_modalidade' => $aulasPorModalidade,
                'distribuicao_dias' => $this->calcularDistribuicaoPorDia($totalAulas)
            ];

            return [
                'success' => true,
                'estatisticas' => $estatisticas
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao obter estatísticas: ' . $e->getMessage()
            ];
        }
    }

    // Método auxiliar para calcular distribuição por dia
    private function calcularDistribuicaoPorDia($aulas) {
        $distribuicao = [
            'DOM' => 0, 'SEG' => 0, 'TER' => 0, 
            'QUA' => 0, 'QUI' => 0, 'SEX' => 0, 'SAB' => 0
        ];

        foreach ($aulas as $aula) {
            $dia = strtoupper($aula['DIA_SEMANA']);
            if (isset($distribuicao[$dia])) {
                $distribuicao[$dia]++;
            }
        }

        return $distribuicao;
    }

    // Método para validar dados de aula
    public function validarDadosAula($dados) {
        $erros = [];

        // Validações básicas
        if (empty($dados['nome_aula']) || strlen($dados['nome_aula']) < 3) {
            $erros[] = 'Nome da aula deve ter pelo menos 3 caracteres';
        }

        if (empty($dados['id_modalidade']) || !is_numeric($dados['id_modalidade'])) {
            $erros[] = 'ID da modalidade é obrigatório e deve ser numérico';
        }

        if (!empty($dados['id_instrutor']) && !is_numeric($dados['id_instrutor'])) {
            $erros[] = 'ID do instrutor deve ser numérico';
        }

        if (!empty($dados['id_unidade']) && !is_numeric($dados['id_unidade'])) {
            $erros[] = 'ID da unidade deve ser numérico';
        }

        $diasValidos = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        if (empty($dados['dia_semana']) || !in_array(strtoupper($dados['dia_semana']), $diasValidos)) {
            $erros[] = 'Dia da semana inválido. Use: ' . implode(', ', $diasValidos);
        }

        if (empty($dados['horario_inicio']) || !preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/', $dados['horario_inicio'])) {
            $erros[] = 'Horário de início inválido. Use formato HH:MM ou HH:MM:SS';
        }

        if (!empty($dados['duracao_minutos']) && ($dados['duracao_minutos'] < 1 || $dados['duracao_minutos'] > 480)) {
            $erros[] = 'Duração deve ser entre 1 e 480 minutos';
        }

        if (!empty($dados['vagas']) && ($dados['vagas'] < 0 || $dados['vagas'] > 500)) {
            $erros[] = 'Vagas devem ser entre 0 e 500';
        }

        return [
            'valido' => empty($erros),
            'erros' => $erros
        ];
    }
}

?>