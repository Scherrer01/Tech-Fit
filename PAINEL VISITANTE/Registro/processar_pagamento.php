<?php
session_start();
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: pagamento.php?erro=Método não permitido');
    exit;
}

try {
    // Validar dados da sessão
    if (!isset($_SESSION['dados_cadastro'])) {
        throw new Exception('Dados do cadastro não encontrados. Por favor, refaça o cadastro.');
    }

    $dados_cadastro = $_SESSION['dados_cadastro'];

    // Validar campos do pagamento
    if (empty($_POST['tipo_pagamento']) || empty($_POST['valor'])) {
        throw new Exception('Dados de pagamento incompletos');
    }

    // Conectar ao banco
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception('Erro temporário no sistema. Tente novamente em alguns minutos.');
    }

    // Inserir pagamento na tabela PAGAMENTOS
    $sql_pagamento = "INSERT INTO PAGAMENTOS (
        ID_ALUNO, TIPO_PAGAMENTO, VALOR_PAGAMENTO, DATA_PAGAMENTO
    ) VALUES (?, ?, ?, CURDATE())";

    $stmt_pagamento = $conn->prepare($sql_pagamento);
    $stmt_pagamento->execute([
        $dados_cadastro['id_aluno'],
        $_POST['tipo_pagamento'],
        $_POST['valor']
    ]);

    $id_pagamento = $conn->lastInsertId();

    // Atualizar status do aluno para ATIVO
    $sql_aluno = "UPDATE ALUNOS SET STATUS_ALUNO = 'ATIVO' WHERE ID_ALUNO = ?";
    $stmt_aluno = $conn->prepare($sql_aluno);
    $stmt_aluno->execute([$dados_cadastro['id_aluno']]);

    // Limpar sessão
    unset($_SESSION['dados_cadastro']);

    // Redirecionar para sucesso
    header('Location: sucesso.php?id=' . $dados_cadastro['id_aluno'] . '&pagamento=' . $id_pagamento);
    exit;

} catch (Exception $e) {
    // Em caso de erro, redirecionar de volta com mensagem
    header('Location: pagamento.php?erro=' . urlencode($e->getMessage()));
    exit;
}
?>