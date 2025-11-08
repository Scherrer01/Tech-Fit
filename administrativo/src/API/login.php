<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
// Se for uma requisição OPTIONS (preflight), encerre aqui
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "minhasenha", "tech_fit");

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

$dados = json_decode(file_get_contents("php://input"), true);
$usuario = $dados['usuario'];
$senha = $dados['senha'];

$stmt = $conn->prepare("SELECT senha FROM funcionarios WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row && password_verify($senha, $row['senha'])) {
    echo json_encode(["status" => "sucesso"]);
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Usuário ou senha inválidos!"]);
}

$stmt->close();
$conn->close();

?>
