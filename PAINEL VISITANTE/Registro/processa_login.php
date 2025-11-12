<?php
// processa_login.php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $senha = $_POST['senha'];
    
    // Aqui você deve verificar no banco de dados
    // Exemplo básico de validação (substitua pela sua lógica real)
    
    // Conexão com banco de dados (exemplo)
    /*
    $pdo = new PDO('mysql:host=localhost;dbname=techfit', 'usuario', 'senha');
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();
    
    if ($usuario && password_verify($senha, $usuario['senha'])) {
        $_SESSION['usuario'] = [
            'id' => $usuario['id'],
            'nome' => $usuario['nome'],
            'email' => $usuario['email']
        ];
        
        echo json_encode([
            'success' => true,
            'usuario' => $_SESSION['usuario']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'E-mail ou senha incorretos'
        ]);
    }
    */
    
    // Validação temporária (REMOVA EM PRODUÇÃO)
    if ($email === 'usuario@exemplo.com' && $senha === '123456') {
        $_SESSION['usuario'] = [
            'id' => 1,
            'nome' => 'Usuário Exemplo',
            'email' => $email
        ];
        
        echo json_encode([
            'success' => true,
            'usuario' => $_SESSION['usuario']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'E-mail ou senha incorretos'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido'
    ]);
}
?>