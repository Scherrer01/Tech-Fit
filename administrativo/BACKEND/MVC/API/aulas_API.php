<?php
// aulas_API.php

// Headers para CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../Controller/ControllerAulas.php';

$controller = new ControllerAulas();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // ================================
    //              GET
    // ================================
    case 'GET':
        try {
            // Buscar aula por ID
            if (isset($_GET['id_aula'])) {
                $id = $_GET['id_aula'];
                $result = $controller->buscarAula($id);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar por nome da aula (search)
            if (isset($_GET['search'])) {
                $search = $_GET['search'];
                $result = $controller->listarAulas(['search' => $search]);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar por modalidade
            if (isset($_GET['id_modalidade'])) {
                $id_modalidade = $_GET['id_modalidade'];
                $result = $controller->listarPorModalidade($id_modalidade);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar por unidade
            if (isset($_GET['id_unidade'])) {
                $id_unidade = $_GET['id_unidade'];
                $result = $controller->listarPorUnidade($id_unidade);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar por instrutor
            if (isset($_GET['id_instrutor'])) {
                $id_instrutor = $_GET['id_instrutor'];
                $result = $controller->listarPorInstrutor($id_instrutor);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar por dia da semana
            if (isset($_GET['dia_semana'])) {
                $dia_semana = $_GET['dia_semana'];
                $result = $controller->listarAulas(['dia_semana' => $dia_semana]);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar agenda semanal
            if (isset($_GET['agenda'])) {
                $id_unidade = $_GET['id_unidade'] ?? null;
                $data_referencia = $_GET['data'] ?? null;
                $result = $controller->buscarAgendaSemanal($id_unidade, $data_referencia);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Verificar conflito de horário
            if (isset($_GET['verificar_conflito'])) {
                $dados = [
                    'id_unidade' => $_GET['id_unidade'] ?? null,
                    'dia_semana' => $_GET['dia_semana'] ?? null,
                    'horario_inicio' => $_GET['horario_inicio'] ?? null,
                    'duracao_minutos' => $_GET['duracao_minutos'] ?? 60,
                    'id_aula_excluir' => $_GET['id_aula_excluir'] ?? null
                ];
                $result = $controller->verificarConflito($dados);
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar aulas com relacionamentos (para relatórios)
            if (isset($_GET['completo'])) {
                if (isset($_GET['id_aula'])) {
                    $result = $controller->buscarAulaCompleta($_GET['id_aula']);
                } else {
                    $filtros = [];
                    if (isset($_GET['id_modalidade'])) $filtros['id_modalidade'] = $_GET['id_modalidade'];
                    if (isset($_GET['id_unidade'])) $filtros['id_unidade'] = $_GET['id_unidade'];
                    if (isset($_GET['id_instrutor'])) $filtros['id_instrutor'] = $_GET['id_instrutor'];
                    $result = $controller->listarAulasCompletas($filtros);
                }
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Listar todas as aulas (com filtros opcionais)
            $filtros = [];
            if (isset($_GET['nome_aula'])) $filtros['nome_aula'] = $_GET['nome_aula'];
            if (isset($_GET['id_modalidade'])) $filtros['id_modalidade'] = $_GET['id_modalidade'];
            if (isset($_GET['id_unidade'])) $filtros['id_unidade'] = $_GET['id_unidade'];
            if (isset($_GET['id_instrutor'])) $filtros['id_instrutor'] = $_GET['id_instrutor'];
            if (isset($_GET['dia_semana'])) $filtros['dia_semana'] = $_GET['dia_semana'];
            
            $result = $controller->listarAulas($filtros);
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Erro ao processar requisição GET: " . $e->getMessage()]);
        }
        break;

    // ================================
    //             POST
    // ================================
    case 'POST':
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new Exception("Dados inválidos ou não fornecidos");
            }
            
            // Validação básica
            $erros = $controller->validarDadosAula($data, 'criar');
            if (!empty($erros)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Erros de validação", "errors" => $erros]);
                exit;
            }
            
            $result = $controller->criarAula($data);
            
            if ($result['success']) {
                http_response_code(201);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Erro ao criar aula: " . $e->getMessage()]);
        }
        break;

    // ================================
    //              PUT
    // ================================
    case 'PUT':
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new Exception("Dados inválidos ou não fornecidos");
            }
            
            if (!isset($data['id_aula']) || empty($data['id_aula'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "ID da aula não fornecido"]);
                exit;
            }
            
            // Validação básica
            $erros = $controller->validarDadosAula($data, 'atualizar');
            if (!empty($erros)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Erros de validação", "errors" => $erros]);
                exit;
            }
            
            $result = $controller->atualizarAula($data['id_aula'], $data);
            
            if ($result['success']) {
                http_response_code(200);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Erro ao atualizar aula: " . $e->getMessage()]);
        }
        break;

    // ================================
    //             DELETE
    // ================================
    case 'DELETE':
        try {
            // Tentar obter ID do corpo da requisição
            $data = json_decode(file_get_contents("php://input"), true);
            
            $id_aula = null;
            
            // Verificar se ID veio no corpo da requisição
            if ($data && isset($data['id_aula'])) {
                $id_aula = $data['id_aula'];
            }
            // Verificar se ID veio como parâmetro de consulta
            elseif (isset($_GET['id_aula'])) {
                $id_aula = $_GET['id_aula'];
            }
            
            if (!$id_aula || !is_numeric($id_aula)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "ID da aula não fornecido ou inválido"]);
                exit;
            }
            
            $result = $controller->excluirAula($id_aula);
            
            if ($result['success']) {
                http_response_code(200);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Erro ao excluir aula: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método não permitido"]);
        break;
}
?>