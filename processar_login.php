<?php
// processar_login.php - Versão completa
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir configuração do banco
require_once 'config.php';

// Verificar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Ler dados do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar dados recebidos
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';
$lembrar = $data['lembrar'] ?? false;

// Validações básicas
if (empty($email) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// Conectar ao banco
$database = new Database();
$conn = $database->getConnection();

try {
    // Buscar aluno pelo email
    $query = "SELECT ID_ALUNO, NOME, EMAIL, SENHA_HASH, STATUS_ALUNO, ID_PLANO 
              FROM ALUNOS WHERE EMAIL = :email";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Email não encontrado']);
        exit;
    }
    
    $aluno = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Verificar status do aluno
    if ($aluno['STATUS_ALUNO'] !== 'ATIVO') {
        echo json_encode(['success' => false, 'message' => 'Conta inativa']);
        exit;
    }
    
    // Verificar senha
    if (!password_verify($senha, $aluno['SENHA_HASH'])) {
        echo json_encode(['success' => false, 'message' => 'Senha incorreta']);
        exit;
    }
    
    // Login bem-sucedido
    $_SESSION['logado'] = true;
    $_SESSION['id_aluno'] = $aluno['ID_ALUNO'];
    $_SESSION['nome_aluno'] = $aluno['NOME'];
    $_SESSION['email_aluno'] = $aluno['EMAIL'];
    $_SESSION['plano_aluno'] = $aluno['ID_PLANO'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Login realizado com sucesso!',
        'redirect' => '../../Painel Aluno/index.php'
    ]);
    
} catch (PDOException $e) {
    error_log("Erro no login: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados']);
}
?>