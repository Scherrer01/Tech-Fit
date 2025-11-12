<?php
// processa_recuperacao.php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'] ?? '';
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    
    switch ($acao) {
        case 'solicitar_recuperacao':
            solicitarRecuperacao($email);
            break;
            
        case 'verificar_codigo':
            $codigo = $_POST['codigo'] ?? '';
            verificarCodigo($email, $codigo);
            break;
            
        case 'reenviar_codigo':
            reenviarCodigo($email);
            break;
            
        case 'redefinir_senha':
            $novaSenha = $_POST['novaSenha'] ?? '';
            redefinirSenha($email, $novaSenha);
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Ação inválida']);
    }
}

function solicitarRecuperacao($email) {
    // Verificar se o email existe no banco de dados
    // Aqui você faria uma consulta ao banco
    /*
    $pdo = new PDO('mysql:host=localhost;dbname=techfit', 'usuario', 'senha');
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();
    
    if (!$usuario) {
        echo json_encode(['success' => false, 'message' => 'E-mail não encontrado']);
        return;
    }
    */
    
    // Gerar código de 6 dígitos
    $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    
    // Salvar código na sessão (em produção, salvaria no banco)
    $_SESSION['codigo_recuperacao'] = $codigo;
    $_SESSION['email_recuperacao'] = $email;
    $_SESSION['codigo_expira'] = time() + 600; // 10 minutos
    
    // Em produção, enviar email real aqui
    // enviarEmailRecuperacao($email, $codigo);
    
    // Para testes, retornar sucesso
    echo json_encode(['success' => true, 'message' => 'E-mail enviado com sucesso']);
}

function verificarCodigo($email, $codigo) {
    // Verificar se o código está correto e não expirou
    if (!isset($_SESSION['codigo_recuperacao']) || 
        !isset($_SESSION['email_recuperacao']) ||
        !isset($_SESSION['codigo_expira'])) {
        echo json_encode(['success' => false, 'message' => 'Código expirado ou inválido']);
        return;
    }
    
    if ($_SESSION['email_recuperacao'] !== $email) {
        echo json_encode(['success' => false, 'message' => 'E-mail não corresponde']);
        return;
    }
    
    if (time() > $_SESSION['codigo_expira']) {
        echo json_encode(['success' => false, 'message' => 'Código expirado']);
        return;
    }
    
    if ($_SESSION['codigo_recuperacao'] !== $codigo) {
        echo json_encode(['success' => false, 'message' => 'Código inválido']);
        return;
    }
    
    // Código válido
    $_SESSION['codigo_verificado'] = true;
    echo json_encode(['success' => true, 'message' => 'Código verificado com sucesso']);
}

function reenviarCodigo($email) {
    // Reutilizar a mesma função de solicitação
    solicitarRecuperacao($email);
}

function redefinirSenha($email, $novaSenha) {
    // Verificar se o código foi verificado
    if (!isset($_SESSION['codigo_verificado']) || $_SESSION['codigo_verificado'] !== true) {
        echo json_encode(['success' => false, 'message' => 'Código não verificado']);
        return;
    }
    
    // Em produção, atualizar no banco de dados
    /*
    $pdo = new PDO('mysql:host=localhost;dbname=techfit', 'usuario', 'senha');
    $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE usuarios SET senha = ? WHERE email = ?");
    $stmt->execute([$senhaHash, $email]);
    */
    
    // Limpar sessão
    unset($_SESSION['codigo_recuperacao']);
    unset($_SESSION['email_recuperacao']);
    unset($_SESSION['codigo_expira']);
    unset($_SESSION['codigo_verificado']);
    
    echo json_encode(['success' => true, 'message' => 'Senha redefinida com sucesso']);
}
?>