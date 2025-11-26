<?php
// sucesso.php
session_start();

if (!isset($_GET['id']) || !isset($_GET['pagamento'])) {
    header('Location: index.php');
    exit;
}

$id_aluno = $_GET['id'];
$id_pagamento = $_GET['pagamento'];

include 'database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Buscar dados do aluno
    $sql = "SELECT a.NOME, a.EMAIL, p.NOME_PLANO, pg.VALOR_PAGAMENTO, pg.DATA_PAGAMENTO 
            FROM ALUNOS a 
            JOIN PLANOS p ON a.ID_PLANO = p.ID_PLANO 
            JOIN PAGAMENTOS pg ON a.ID_ALUNO = pg.ID_ALUNO 
            WHERE a.ID_ALUNO = ? AND pg.ID_PAGAMENTO = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id_aluno, $id_pagamento]);
    $dados = $stmt->fetch();
    
} catch (Exception $e) {
    $dados = ['NOME' => 'Aluno', 'NOME_PLANO' => 'Plano', 'VALOR_PAGAMENTO' => 0];
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro Realizado - Tech Fit</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 20px; 
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sucesso-container { 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
        }
        .checkmark { 
            color: #27ae60; 
            font-size: 80px; 
            margin-bottom: 20px;
        }
        h1 { color: #27ae60; margin-bottom: 20px; }
        .detalhes { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
            text-align: left;
        }
        .btn { 
            background: #667eea; 
            color: white; 
            padding: 15px 30px; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 16px; 
            margin: 10px;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover { background: #5a6fd8; }
    </style>
</head>
<body>
    <div class="sucesso-container">
        <div class="checkmark">✅</div>
        <h1>Parabéns! Cadastro Realizado</h1>
        <p>Seu pagamento foi processado com sucesso e sua conta está ativa!</p>
        
        <div class="detalhes">
            <h3>📋 Detalhes do Cadastro:</h3>
            <p><strong>Aluno:</strong> <?php echo htmlspecialchars($dados['NOME']); ?></p>
            <p><strong>Plano:</strong> <?php echo htmlspecialchars($dados['NOME_PLANO']); ?></p>
            <p><strong>Valor:</strong> R$ <?php echo number_format($dados['VALOR_PAGAMENTO'], 2, ',', '.'); ?></p>
            <p><strong>Data:</strong> <?php echo date('d/m/Y', strtotime($dados['DATA_PAGAMENTO'])); ?></p>
            <p><strong>Status:</strong> <span style="color: #27ae60;">✅ Ativo</span></p>
        </div>
        
        <p>📧 Enviamos um email com todos os detalhes do seu plano e acesso.</p>
        
        <div>
            <a href="login.php" class="btn">Fazer Login</a>
            <a href="index.php" class="btn" style="background: #95a5a6;">Página Inicial</a>
        </div>
    </div>
</body>
</html>