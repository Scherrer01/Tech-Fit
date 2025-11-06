<?php
// processar_cadastro_com_pagamento.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$data) {
    echo json_encode(['success' => false, 'message' => 'Método não permitido ou dados inválidos']);
    exit;
}

// Dados do cadastro (validações do arquivo anterior)
$nome = $data['nome'] ?? '';
$email = $data['email'] ?? '';
// ... (todas as validações do processar_cadastro.php)

// Dados do pagamento
$tipo_pagamento = $data['tipo_pagamento'] ?? '';
$valor_pagamento = $data['valor_pagamento'] ?? 0;

// Validar tipo de pagamento
$tipos_validos = ['DINHEIRO', 'CARTAO', 'PIX', 'TRANSFERENCIA'];
if (!in_array($tipo_pagamento, $tipos_validos)) {
    echo json_encode(['success' => false, 'message' => 'Tipo de pagamento inválido']);
    exit;
}

$database = new Database();
$conn = $database->getConnection();

try {
    $conn->beginTransaction();

    // 1. INSERIR ALUNO (código do processar_cadastro.php)
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    
    $query_aluno = "INSERT INTO ALUNOS (...) VALUES (...)";
    $stmt_aluno = $conn->prepare($query_aluno);
    // ... (bind parameters)
    
    if (!$stmt_aluno->execute()) {
        throw new Exception('Erro ao cadastrar aluno');
    }
    
    $id_aluno = $conn->lastInsertId();

    // 2. INSERIR NA TABELA PERTENCE
    $query_pertence = "INSERT INTO PERTENCE (ID_UNIDADE, ID_ALUNO, DATA_INSCRICAO) VALUES (1, :id_aluno, CURDATE())";
    $stmt_pertence = $conn->prepare($query_pertence);
    $stmt_pertence->bindParam(':id_aluno', $id_aluno);
    $stmt_pertence->execute();

    // 3. INSERIR PAGAMENTO
    $query_pagamento = "INSERT INTO PAGAMENTOS (
        ID_ALUNO, 
        TIPO_PAGAMENTO, 
        VALOR_PAGAMENTO, 
        DATA_PAGAMENTO,
        REFERENCIA
    ) VALUES (
        :id_aluno,
        :tipo_pagamento,
        :valor_pagamento,
        CURDATE(),
        :referencia
    )";
    
    $stmt_pagamento = $conn->prepare($query_pagamento);
    $stmt_pagamento->bindParam(':id_aluno', $id_aluno);
    $stmt_pagamento->bindParam(':tipo_pagamento', $tipo_pagamento);
    $stmt_pagamento->bindParam(':valor_pagamento', $valor_pagamento);
    $referencia = "Pagamento inicial - " . date('d/m/Y H:i');
    $stmt_pagamento->bindParam(':referencia', $referencia);
    
    if (!$stmt_pagamento->execute()) {
        throw new Exception('Erro ao registrar pagamento');
    }

    $conn->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Cadastro e pagamento realizados com sucesso!',
        'id_aluno' => $id_aluno
    ]);
    
} catch (Exception $e) {
    $conn->rollBack();
    error_log("Erro no cadastro com pagamento: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro no processamento: ' . $e->getMessage()]);
}
?>