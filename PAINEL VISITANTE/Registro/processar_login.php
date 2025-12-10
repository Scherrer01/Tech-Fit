<?php
// processar_login.php
session_start();
header('Content-Type: application/json');

// Para evitar erros HTML em respostas JSON
error_reporting(0);
ini_set('display_errors', 0);

// Incluir configuração do banco - AJUSTE O CAMINHO
$caminho_base = dirname(__DIR__, 2); // Sobe 2 níveis da pasta atual

// Tente incluir config.php primeiro
if (file_exists($caminho_base . '/config.php')) {
    require_once $caminho_base . '/config.php';
} 
// Se não encontrar, tente database.php
elseif (file_exists($caminho_base . '/database.php')) {
    require_once $caminho_base . '/database.php';
}
// Se não encontrar nenhum, tente caminhos alternativos
elseif (file_exists(__DIR__ . '/../../config.php')) {
    require_once __DIR__ . '/../../config.php';
}
elseif (file_exists(__DIR__ . '/../../database.php')) {
    require_once __DIR__ . '/../../database.php';
}
else {
    // Se não encontrar nenhum arquivo de configuração
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Arquivo de configuração não encontrado'
    ]);
    exit;
}

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
if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados inválidos ou mal formatados']);
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

try {
    // Conectar ao banco
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception('Não foi possível conectar ao banco de dados');
    }

    // Buscar aluno pelo email
    $query = "SELECT 
                ID_ALUNO, 
                NOME, 
                EMAIL, 
                SENHA_HASH, 
                STATUS_ALUNO,
                ID_PLANO
              FROM ALUNOS 
              WHERE EMAIL = :email";
    
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
        echo json_encode([
            'success' => false, 
            'message' => 'Conta inativa. Entre em contato com a academia.'
        ]);
        exit;
    }
    
    // Verificar senha
    if (!password_verify($senha, $aluno['SENHA_HASH'])) {
        echo json_encode(['success' => false, 'message' => 'Senha incorreta']);
        exit;
    }
    
    // Login bem-sucedido - criar sessão
    $_SESSION['logado'] = true;
    $_SESSION['id_aluno'] = $aluno['ID_ALUNO'];
    $_SESSION['nome_aluno'] = $aluno['NOME'];
    $_SESSION['email_aluno'] = $aluno['EMAIL'];
    $_SESSION['plano_aluno'] = $aluno['ID_PLANO'];
    $_SESSION['login_time'] = time();
    
    echo json_encode([
        'success' => true,
        'message' => 'Login realizado com sucesso!',
        'redirect' => '../../Painel%20Aluno/index.php'
    ]);
    
} catch (PDOException $e) {
    error_log("Erro no login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erro de conexão com o banco de dados'
    ]);
} catch (Exception $e) {
    error_log("Erro geral: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erro interno do sistema: ' . $e->getMessage()
    ]);
}
?>