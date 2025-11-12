<?php
// Verificar se veio do processamento
if (empty($_GET['id']) || empty($_GET['pagamento'])) {
    header('Location: register.php');
    exit;
}

$id_aluno = $_GET['id'];
$id_pagamento = $_GET['pagamento'];

// Buscar informações do aluno no banco
include 'database.php';

$aluno_info = [];
$login_url = '';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        // Buscar dados do aluno
        $sql_aluno = "SELECT a.NOME, a.EMAIL, p.NOME_PLANO 
                     FROM ALUNOS a 
                     JOIN PLANOS p ON a.ID_PLANO = p.ID_PLANO 
                     WHERE a.ID_ALUNO = ?";
        $stmt_aluno = $conn->prepare($sql_aluno);
        $stmt_aluno->execute([$id_aluno]);
        $aluno_info = $stmt_aluno->fetch();
    }
} catch (Exception $e) {
    $aluno_info = ['NOME' => 'Aluno', 'NOME_PLANO' => 'Plano Contratado'];
}



foreach ($possible_paths as $path) {
    if (file_exists($path)) {
        $login_url = $path;
        break;
    }
}

// Se não encontrou, usa o padrão
if (empty($login_url)) {
    $login_url = 'login.php';
}

// Redirecionamento automático após 10 segundos
header("Refresh: 10; url=$login_url");
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="pagamento.css">
    <title>Sucesso - Tech Fit</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #FF2626, #282828);
            color: white;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        .container {
            background: rgba(40, 40, 40, 0.95);
            padding: 40px;
            border-radius: 15px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
            color: #FF2626;
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        .info-box {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: left;
        }
        .btn {
            background: #FF2626;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: background 0.3s ease;
        }
        .btn:hover {
            background: #ff4444;
            transform: translateY(-2px);
        }
        .success-icon {
            font-size: 4em;
            margin-bottom: 20px;
        }
        .welcome-message {
            font-size: 1.2em;
            margin: 20px 0;
            line-height: 1.6;
        }
        .countdown {
            font-size: 1.1em;
            margin: 20px 0;
            padding: 10px;
            background: rgba(255, 38, 38, 0.2);
            border-radius: 5px;
            display: inline-block;
        }
        .auto-redirect {
            color: #FFD700;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">🎉</div>
        <h1>Cadastro Realizado com Sucesso!</h1>
        
        <?php if ($aluno_info): ?>
        <div class="info-box">
            <h3>Detalhes da Matrícula</h3>
            <p><strong>Aluno:</strong> <?php echo htmlspecialchars($aluno_info['NOME']); ?></p>
            <p><strong>Plano:</strong> <?php echo htmlspecialchars($aluno_info['NOME_PLANO']); ?></p>
            <p><strong>Número da Matrícula:</strong> #<?php echo $id_aluno; ?></p>
            <p><strong>Pagamento:</strong> #<?php echo $id_pagamento; ?> (Processado)</p>
        </div>
        <?php endif; ?>

        <div class="welcome-message">
            <p><strong>Bem-vindo à Tech Fit!</strong> Seu pagamento foi processado e sua matrícula está ativa.</p>
            <p>Agora você pode acessar sua área personalizada e começar seus treinos.</p>
        </div>

        <!-- Contador regressivo -->
        <div class="countdown">
            <span class="auto-redirect">Redirecionando automaticamente para login em: <span id="countdown">10</span> segundos</span>
        </div>
        
        <div style="margin-top: 20px;">
            <a href="<?php echo $login_url; ?>" class="btn">Fazer Login Agora</a>
            <a href="../home.php" class="btn" style="background: #444;">Voltar ao Início</a>
        </div>
    </div>

    <script>
        // Contador regressivo
        let seconds = 10;
        const countdownElement = document.getElementById('countdown');
        
        const countdown = setInterval(function() {
            seconds--;
            countdownElement.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(countdown);
                // Redireciona imediatamente quando chegar a 0
                window.location.href = '<?php echo $login_url; ?>';
            }
        }, 1000);

        // Salvar informações do cadastro no localStorage
        localStorage.setItem('usuario_recém_cadastrado', 'true');
        localStorage.setItem('id_aluno_cadastrado', '<?php echo $id_aluno; ?>');
        localStorage.setItem('email_cadastrado', '<?php echo isset($aluno_info['EMAIL']) ? $aluno_info['EMAIL'] : ''; ?>');

        // Debug no console
        console.log('Redirecionando para:', '<?php echo $login_url; ?>');
        console.log('ID Aluno:', '<?php echo $id_aluno; ?>');
        
        // Se o usuário clicar em "Fazer Login Agora", para o redirecionamento automático
        document.querySelector('.btn').addEventListener('click', function() {
            clearInterval(countdown);
        });
    </script>
</body>
</html>