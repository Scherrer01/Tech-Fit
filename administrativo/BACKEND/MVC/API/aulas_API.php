<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../Controller/ControllerAulas.php';

$controller = new AulasController();
$method = $_SERVER['REQUEST_METHOD'];

// Helper function para extrair dados do corpo da requisição
function getRequestBody() {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        // Se não for JSON, tenta como form-data
        parse_str($input, $data);
    }
    
    return $data ?: [];
}

switch ($method) {

    // ================================
    //              GET
    // ================================
    case 'GET':
        try {
            // Buscar aula por ID
            if (isset($_GET['id'])) {
                $id = (int)$_GET['id'];
                $result = $controller->buscarAulaPorId($id);
                echo json_encode($result);
                exit;
            }

            // Buscar por múltiplos filtros
            $filtros = [];
            $filtrosPossiveis = [
                'nome' => 'nome',
                'modalidade' => 'id_modalidade',
                'instrutor' => 'id_instrutor',
                'unidade' => 'id_unidade',
                'dia' => 'dia_semana'
            ];

            foreach ($filtrosPossiveis as $param => $campo) {
                if (isset($_GET[$param])) {
                    $filtros[$campo] = $_GET[$param];
                }
            }

            if (!empty($filtros)) {
                $result = $controller->buscarAulas($filtros);
                echo json_encode($result);
                exit;
            }

            // Buscar apenas aulas com vagas
            if (isset($_GET['com_vagas']) && $_GET['com_vagas'] === 'true') {
                $result = $controller->buscarAulas(['com_vagas' => true]);
                echo json_encode($result);
                exit;
            }

            // Obter estatísticas
            if (isset($_GET['estatisticas']) && $_GET['estatisticas'] === 'true') {
                $result = $controller->obterEstatisticas();
                echo json_encode($result);
                exit;
            }

            // Listar todas as aulas (padrão)
            $result = $controller->listarAulas();
            echo json_encode($result);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro interno do servidor: ' . $e->getMessage()
            ]);
        }
        break;


    // ================================
    //             POST
    // ================================
    case 'POST':
        try {
            $data = getRequestBody();

            // Validação básica dos dados obrigatórios
            $validacao = $controller->validarDadosAula($data);
            
            if (!$validacao['valido']) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validacao['erros']
                ]);
                exit;
            }

            // Criar a aula
            $result = $controller->criarAula($data);
            
            if ($result['success']) {
                http_response_code(201);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode($result);
            }

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao criar aula: ' . $e->getMessage()
            ]);
        }
        break;


    // ================================
    //              PUT
    // ================================
    case 'PUT':
        try {
            $data = getRequestBody();

            if (!isset($data['id']) || empty($data['id'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID da aula é obrigatório'
                ]);
                exit;
            }

            // Validação dos dados
            $validacao = $controller->validarDadosAula($data);
            
            if (!$validacao['valido']) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Dados inválidos',
                    'errors' => $validacao['erros']
                ]);
                exit;
            }

            // Atualizar a aula
            $result = $controller->atualizarAula($data['id'], $data);
            
            if ($result['success']) {
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode($result);
            }

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao atualizar aula: ' . $e->getMessage()
            ]);
        }
        break;


    // ================================
    //              DELETE
    // ================================
    case 'DELETE':
        try {
            // Pode vir pelo corpo da requisição ou parâmetro de URL
            $data = getRequestBody();
            
            if (isset($_GET['id'])) {
                $id = (int)$_GET['id'];
            } elseif (isset($data['id'])) {
                $id = (int)$data['id'];
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID da aula é obrigatório'
                ]);
                exit;
            }

            $result = $controller->deletarAula($id);
            
            if ($result['success']) {
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode($result);
            }

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao deletar aula: ' . $e->getMessage()
            ]);
        }
        break;


    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Método não suportado'
        ]);
        break;
}
?>