<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// arquivo responsavél por ser a API entre o frontend e backend do projeto

require_once __DIR__ . '/../Controller/ControllerALunos.php';

$controller = new ControllerALunos();

//CORS para a comunicação com o react


// Captura o método da busca (fetch) do nosso frontend
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    // metodo for get 
    case 'GET':
        // caso a busca seja pelo nome, roda a buscaAlunos
        if(isset($_GET['id'])){
            $nome =$_GET['id'];
            $result = $controller->buscarAlunosPorID($id);
            //Buscar por nome
        }  elseif (isset($_GET['nome'])) {
            $nome = $_GET['nome'];
            $result = $controller->buscarAlunos($nome);

            // senão exibe todos os alunos 
        }else{
            $result = $controller->ler();
        }
        http_response_code(200); // responsa para ok, essencial para API restful
        echo json_encode($result);
        break;
    //metodo sendo POST
    case 'POST':
        //decodificar os dados vindo do react 
        $data = json_decode(file_get_contents("php://input"),true);
        try{
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
        echo json_encode(["message"=> "Aluno criado com sucesso"]);
        }catch(Exception $erro){
            http_response_code(500); // Essencial para criar API restful, declara que deu erro interno no servidor
            echo json_encode(["message" => "Erro ao cadastrar aluno: " . $erro->getMessage()]);
        }
        break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"),true);
            try{
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
        http_response_code(200); // tudo ok com a atualização
        echo json_encode(["message" => "Aluno atualizado com sucesso"]);

        }catch(Exception $error){
                http_response_code(500); // erro interno
                echo json_encode(["message" => "Erro ao atualizar aluno: ". $error->getMessage()]);
        }
        break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            $controller->excluir($data['idAlunos']);

            http_response_code(200); // tudo ok com a exclusão
            echo json_encode(["message"=> "Aluno excluido com sucesso"]);
        break;
        
        default:
            http_response_code(405); // método não permitido
            echo json_encode(["error"=> "Método não suportado"]);
        break; 
    }  
?>