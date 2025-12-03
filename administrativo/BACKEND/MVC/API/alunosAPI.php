<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../Controller/ControllerALunos.php';

$controller = new ControllerALunos();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ================================
    //              GET
    // ================================
    case 'GET':

        // Buscar por ID
        if (isset($_GET['idAlunos'])) {
            $id = $_GET['idAlunos'];
            $result = $controller->buscarAlunosPorID($id);
            echo json_encode($result);
            exit;
        }

        // Buscar por nome
        if (isset($_GET['nome'])) {
            $nome = $_GET['nome'];
            $result = $controller->buscarAlunos($nome);
            echo json_encode($result);
            exit;
        }

        // Buscar por search (nome, email ou ID)
        if (isset($_GET['search'])) {
            $search = $_GET['search'];
            $result = $controller->buscarAlunos($search); 
            echo json_encode($result);
            exit;
        }

        // Listar todos
        $result = $controller->ler();
        echo json_encode($result);
        exit;


    // ================================
    //             POST
    // ================================
    case 'POST':

        $data = json_decode(file_get_contents("php://input"), true);

        try {
            $controller->criar(
                $data['nome'],
                $data['endereco'],
                $data['nascimento'],
                $data['telefone'],
                $data['CPF'],
                $data['sexo'],
                $data['email'],
                $data['senha_hash'],
                $data['statusAluno'],
                $data['Id_plano'],
                date("Y-m-d H:i:s")
            );

            echo json_encode(["message" => "Aluno criado com sucesso"]);
        } catch (Exception $erro) {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao cadastrar aluno: " . $erro->getMessage()]);
        }
        break;


    // ================================
    //              PUT
    // ================================
    case 'PUT':

        $data = json_decode(file_get_contents("php://input"), true);

        try {
            $controller->editar(
                $data['idAlunos'],
                $data['nome'],
                $data['endereco'],
                $data['email'],
                $data['nascimento'],
                $data['telefone'],
                $data['CPF'],
                $data['sexo'],
                $data['senha_hash'],
                $data['statusAluno']
            );

            echo json_encode(["message" => "Aluno atualizado com sucesso"]);
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode(["message" => "Erro ao atualizar aluno: " . $error->getMessage()]);
        }
        break;


    // ================================
    //              DELETE
    // ================================
    case 'DELETE':

        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['idAlunos'])) {
            try {
                $controller->excluir($data['idAlunos']);
                echo json_encode(["success" => true, "message" => "Aluno excluído com sucesso"]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "error" => $e->getMessage()]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "ID não informado"]);
        }
        break;


    default:
        http_response_code(405);
        echo json_encode(["error" => "Método não suportado"]);
        break;
}
?>
