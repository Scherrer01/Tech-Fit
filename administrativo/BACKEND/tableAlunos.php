<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
$conn = new mysqli("localhost", "root", "senaisp", "tech_fit");

if($conn->connect_error){
    die ("Erro ao conectar com o banco de dados: ".$conn->connect_error);
}

$result = $conn->query("SELECT * FROM ALUNOS");

$alunos = [];
while ($row = $result->fetch_assoc()) {
    $alunos[] = $row;
}

// Retorna JSON para o React
header('Content-Type: application/json');
echo json_encode($alunos);
?>
