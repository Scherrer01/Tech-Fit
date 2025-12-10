<?php
// aulas_API.php

// Desativar exibição de erros no output (evita HTML antes do JSON)
ini_set('display_errors', 0);
error_reporting(0);

// Headers para CORS e JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Lidar com preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Buffer de saída para capturar erros
ob_start();

try {
    // Verificar se o arquivo do controller existe
    $controllerPath = __DIR__ . '/../Controller/ControllerAulas.php';
    if (!file_exists($controllerPath)) {
        throw new Exception("Arquivo ControllerAulas.php não encontrado em: " . $controllerPath);
    }
    
    require_once $controllerPath;
    
    // Verificar se a classe existe
    if (!class_exists('ControllerAulas')) {
        throw new Exception("Classe ControllerAulas não encontrada");
    }
    
    $controller = new ControllerAulas();
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Limpar qualquer output buffer
    ob_clean();
    
    switch ($method) {
        // ================================
        //              GET
        // ================================
        case 'GET':
            try {
                // Preparar filtros
                $filtros = [];
                
                // Coletar todos os parâmetros possíveis
                $parametros = [
                    'search' => 'nome_aula',
                    'id_modalidade' => 'id_modalidade',
                    'id_unidade' => 'id_unidade',
                    'id_instrutor' => 'id_instrutor',
                    'dia_semana' => 'dia_semana',
                    'nome_aula' => 'nome_aula'
                ];
                
                foreach ($parametros as $getParam => $filterKey) {
                    if (isset($_GET[$getParam]) && !empty($_GET[$getParam])) {
                        $filtros[$filterKey] = $_GET[$getParam];
                    }
                }
                
                // Caso especial: buscar por ID
                if (isset($_GET['id_aula']) && !empty($_GET['id_aula'])) {
                    $id = filter_var($_GET['id_aula'], FILTER_VALIDATE_INT);
                    if ($id === false) {
                        http_response_code(400);
                        echo json_encode([
                            "success" => false,
                            "message" => "ID da aula inválido"
                        ]);
                        exit;
                    }
                    
                    // Verificar se o método existe
                    if (method_exists($controller, 'buscarAula')) {
                        $result = $controller->buscarAula($id);
                    } else {
                        // Fallback: usar listarAulas com filtro
                        $result = $controller->listarAulas(['id_aula' => $id]);
                    }
                    
                    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                    exit;
                }
                
                // Casos especiais (métodos específicos)
                if (isset($_GET['agenda']) && method_exists($controller, 'buscarAgendaSemanal')) {
                    $id_unidade = $_GET['id_unidade'] ?? null;
                    $data_referencia = $_GET['data'] ?? null;
                    $result = $controller->buscarAgendaSemanal($id_unidade, $data_referencia);
                    echo json_encode($result, JSON_UNESCAPED_UNICODE);
                    exit;
                }
                
                if (isset($_GET['verificar_conflito']) && method_exists($controller, 'verificarConflito')) {
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
                
                if (isset($_GET['completo']) && method_exists($controller, 'listarAulasCompletas')) {
                    $filtrosCompletos = [];
                    if (isset($_GET['id_modalidade'])) $filtrosCompletos['id_modalidade'] = $_GET['id_modalidade'];
                    if (isset($_GET['id_unidade'])) $filtrosCompletos['id_unidade'] = $_GET['id_unidade'];
                    if (isset($_GET['id_instrutor'])) $filtrosCompletos['id_instrutor'] = $_GET['id_instrutor'];
                    
                    $result = $controller->listarAulasCompletas($filtrosCompletos);
                    echo json_encode($result, JSON_UNESCAPED_UNICODE);
                    exit;
                }
                
                // Listar todas as aulas com filtros
                if (!method_exists($controller, 'listarAulas')) {
                    throw new Exception("Método listarAulas não encontrado no controller");
                }
                
                $result = $controller->listarAulas($filtros);
                
                // Garantir estrutura padrão
                if (!isset($result['success'])) {
                    $result = [
                        'success' => true,
                        'data' => $result,
                        'count' => is_array($result) ? count($result) : 0
                    ];
                }
                
                echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    "success" => false, 
                    "message" => "Erro ao processar requisição GET",
                    "error" => $e->getMessage()
                ]);
            }
            break;

        // ================================
        //             POST
        // ================================
        case 'POST':
            try {
                $input = file_get_contents("php://input");
                
                if (empty($input)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false, 
                        "message" => "Nenhum dado fornecido"
                    ]);
                    exit;
                }
                
                $data = json_decode($input, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false, 
                        "message" => "JSON inválido: " . json_last_error_msg()
                    ]);
                    exit;
                }
                
                // Validação básica
                if (!method_exists($controller, 'validarDadosAula')) {
                    // Validação mínima se o método não existir
                    $required = ['nome_aula', 'id_modalidade', 'id_unidade', 'horario_inicio'];
                    $missing = [];
                    foreach ($required as $field) {
                        if (!isset($data[$field]) || empty($data[$field])) {
                            $missing[] = $field;
                        }
                    }
                    
                    if (!empty($missing)) {
                        http_response_code(400);
                        echo json_encode([
                            "success" => false, 
                            "message" => "Campos obrigatórios faltando: " . implode(', ', $missing)
                        ]);
                        exit;
                    }
                } else {
                    $erros = $controller->validarDadosAula($data, 'criar');
                    if (!empty($erros)) {
                        http_response_code(400);
                        echo json_encode([
                            "success" => false, 
                            "message" => "Erros de validação", 
                            "errors" => $erros
                        ]);
                        exit;
                    }
                }
                
                if (!method_exists($controller, 'criarAula')) {
                    throw new Exception("Método criarAula não encontrado");
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
                echo json_encode([
                    "success" => false, 
                    "message" => "Erro ao criar aula: " . $e->getMessage()
                ]);
            }
            break;

        // ================================
        //              PUT
        // ================================
        case 'PUT':
            try {
                $input = file_get_contents("php://input");
                
                if (empty($input)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false, 
                        "message" => "Nenhum dado fornecido"
                    ]);
                    exit;
                }
                
                $data = json_decode($input, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false, 
                        "message" => "JSON inválido: " . json_last_error_msg()
                    ]);
                    exit;
                }
                
                if (!isset($data['id_aula']) || empty($data['id_aula'])) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false, 
                        "message" => "ID da aula não fornecido"
                    ]);
                    exit;
                }
                
                // Validação
                if (method_exists($controller, 'validarDadosAula')) {
                    $erros = $controller->validarDadosAula($data, 'atualizar');
                    if (!empty($erros)) {
                        http_response_code(400);
                        echo json_encode([
                            "success" => false, 
                            "message" => "Erros de validação", 
                            "errors" => $erros
                        ]);
                        exit;
                    }
                }
                
                if (!method_exists($controller, 'atualizarAula')) {
                    throw new Exception("Método atualizarAula não encontrado");
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
                echo json_encode([
                    "success" => false, 
                    "message" => "Erro ao atualizar aula: " . $e->getMessage()
                ]);
            }
            break;

        // ================================
        //             DELETE
        // ================================
        case 'DELETE':
            try {
                // Tentar obter ID de várias formas
                $id_aula = null;
                
                // 1. Do corpo JSON
                $input = file_get_contents("php://input");
                if (!empty($input)) {
                    $data = json_decode($input, true);
                    if (json_last_error() === JSON_ERROR_NONE && isset($data['id_aula'])) {
                        $id_aula = $data['id_aula'];
                    }
                }
                
                // 2. Do parâmetro GET
                if (!$id_aula && isset($_GET['id_aula'])) {
                    $id_aula = $_GET['id_aula'];
                }
                
                // 3. Do POST (form-data)
                if (!$id_aula && isset($_POST['id_aula'])) {
                    $id_aula = $_POST['id_aula'];
                }
                
                if (!$id_aula || !is_numeric($id_aula)) {
                    http_response_code(400);
                    echo json_encode([
                        "success" => false, 
                        "message" => "ID da aula não fornecido ou inválido"
                    ]);
                    exit;
                }
                
                if (!method_exists($controller, 'excluirAula')) {
                    throw new Exception("Método excluirAula não encontrado");
                }
                
                $result = $controller->excluirAula(intval($id_aula));
                
                if ($result['success']) {
                    http_response_code(200);
                } else {
                    http_response_code(400);
                }
                
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    "success" => false, 
                    "message" => "Erro ao excluir aula: " . $e->getMessage()
                ]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode([
                "success" => false, 
                "message" => "Método não permitido: $method"
            ]);
            break;
    }
    
} catch (Exception $e) {
    // Limpar buffer e retornar erro JSON
    ob_clean();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erro fatal na API",
        "error" => $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ]);
}

// Limpar qualquer output que possa ter escapado
ob_end_flush();
?>