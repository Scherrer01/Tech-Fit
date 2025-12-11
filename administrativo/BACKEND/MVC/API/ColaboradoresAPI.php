<?php
// funcionarios_API.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../Controller/ControllerColaboradores.php';

$controller = new ControllerFuncionarios();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ================================
    //              GET
    // ================================
    case 'GET':

        // Buscar por ID
        if (isset($_GET['id_funcionario'])) {
            $id = $_GET['id_funcionario'];
            $result = $controller->buscarFuncionario($id);
            echo json_encode($result);
            exit;
        }

        // Buscar por nome
        if (isset($_GET['nome'])) {
            $nome = $_GET['nome'];
            $result = $controller->buscarFuncionariosPorNome($nome);
            echo json_encode($result);
            exit;
        }

        // Buscar por cargo
        if (isset($_GET['cargo'])) {
            $cargo = $_GET['cargo'];
            $result = $controller->buscarFuncionariosPorCargo($cargo);
            echo json_encode($result);
            exit;
        }

        // Buscar por turno
        if (isset($_GET['turno'])) {
            $turno = $_GET['turno'];
            $result = $controller->buscarFuncionariosPorTurno($turno);
            echo json_encode($result);
            exit;
        }

        // Buscar por modalidade
        if (isset($_GET['id_modalidade'])) {
            $id_modalidade = $_GET['id_modalidade'];
            $result = $controller->buscarFuncionariosPorModalidade($id_modalidade);
            echo json_encode($result);
            exit;
        }

        // Buscar por search (nome ou cargo)
        if (isset($_GET['search'])) {
            $search = $_GET['search'];
            // Tentar buscar por nome primeiro, depois por cargo
            $result = $controller->buscarFuncionariosPorNome($search);
            echo json_encode($result);
            exit;
        }

        // Buscar estatísticas
        if (isset($_GET['estatisticas'])) {
            $result = $controller->buscarEstatisticas();
            echo json_encode($result);
            exit;
        }

        // Autenticar (login)
        if (isset($_GET['login']) && isset($_GET['senha'])) {
            $login = $_GET['login'];
            $senha = $_GET['senha'];
            $result = $controller->autenticarFuncionario($login, $senha);
            echo json_encode($result);
            exit;
        }

        // Listar todos (com filtros opcionais)
        $filtros = [];
        if (isset($_GET['nome'])) $filtros['nome'] = $_GET['nome'];
        if (isset($_GET['cargo'])) $filtros['cargo'] = $_GET['cargo'];
        if (isset($_GET['turno'])) $filtros['turno'] = $_GET['turno'];
        if (isset($_GET['id_modalidade'])) $filtros['id_modalidade'] = $_GET['id_modalidade'];
        
        $result = $controller->listarFuncionarios($filtros);
        echo json_encode($result);
        exit;


    // ================================
    //             POST
    // ================================
    case 'POST':

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dados inválidos ou não fornecidos"]);
            exit;
        }

        try {
            $result = $controller->criarFuncionario($data);
            
            if ($result['success']) {
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode($result);
            }
            
        } catch (Exception $erro) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Erro ao criar funcionário: " . $erro->getMessage()
            ]);
        }
        break;


    // ================================
    //              PUT
    // ================================
    case 'PUT':

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dados inválidos ou não fornecidos"]);
            exit;
        }

        if (!isset($data['id_funcionario'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID do funcionário não fornecido"]);
            exit;
        }

        try {
            $result = $controller->atualizarFuncionario($data['id_funcionario'], $data);
            
            if ($result['success']) {
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode($result);
            }
            
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Erro ao atualizar funcionário: " . $error->getMessage()
            ]);
        }
        break;


    // ================================
    //              DELETE
    // ================================
    case 'DELETE':

        $id_funcionario = null;

        // Tentar obter ID do corpo da requisição
        $input = file_get_contents("php://input");
        if (!empty($input)) {
            $data = json_decode($input, true);
            if ($data && isset($data['id_funcionario'])) {
                $id_funcionario = $data['id_funcionario'];
            }
        }

        // Se não veio no corpo, tentar na query string
        if (!$id_funcionario && isset($_GET['id_funcionario'])) {
            $id_funcionario = $_GET['id_funcionario'];
        }

        if (!$id_funcionario) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID do funcionário não informado"]);
            exit;
        }

        try {
            $result = $controller->excluirFuncionario($id_funcionario);
            
            if ($result['success']) {
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode($result);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Erro ao excluir funcionário: " . $e->getMessage()
            ]);
        }
        break;


    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método não suportado"]);
        break;
}
?>