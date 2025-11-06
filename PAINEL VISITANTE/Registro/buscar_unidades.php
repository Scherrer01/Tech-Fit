<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
include 'config.php';

$database = new Database();
$conn = $database->getConnection();

try {
    $query = "SELECT ID_UNIDADE, NOME_UNIDADE, ENDERECO_UNIDADE FROM UNIDADES ORDER BY NOME_UNIDADE";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $unidades = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'unidades' => $unidades]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao buscar unidades: ' . $e->getMessage()]);
}
?>