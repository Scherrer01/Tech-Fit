<?php
// processar_cadastro.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

// Ler dados do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$data) {
    echo json_encode(['success' => false, 'message' => 'Método não permitido ou dados inválidos']);
    exit;
}

$nome = $data['nome'] ?? '';
$email = $data['email'] ?? '';
$nascimento = $data['nascimento'] ?? '';
$cpf = $data['cpf'] ?? '';
$telefone = $data['telefone'] ?? '';
$endereco = $data['endereco'] ?? '';
$sexo = $data['sexo'] ?? '';
$id_plano = $data['id_plano'] ?? '';
$senha = $data['senha'] ?? '';
$confirmar_senha = $data['confirmar_senha'] ?? '';

// Validar dados obrigatórios
if (empty($nome) || empty($email) || empty($nascimento) || empty($cpf) || 
    empty($telefone) || empty($endereco) || empty($sexo) || empty($id_plano) || 
    empty($senha) || empty($confirmar_senha)) {
    echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
    exit;
}

// Validar confirmação de senha
if ($senha !== $confirmar_senha) {
    echo json_encode(['success' => false, 'message' => 'As senhas não coincidem']);
    exit;
}

// Validar formato do email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Formato de email inválido']);
    exit;
}

// Validar CPF (apenas formato básico)
if (strlen($cpf) !== 11 || !is_numeric($cpf)) {
    echo json_encode(['success' => false, 'message' => 'CPF inválido']);
    exit;
}

// Validar idade mínima (16 anos)
$dataNascimento = new DateTime($nascimento);
$hoje = new DateTime();
$idade = $hoje->diff($dataNascimento)->y;
if ($idade < 16) {
    echo json_encode(['success' => false, 'message' => 'É necessário ter pelo menos 16 anos para se cadastrar']);
    exit;
}

// Validar plano
if (!in_array($id_plano, ['1', '2', '3'])) {
    echo json_encode(['success' => false, 'message' => 'Plano selecionado é inválido']);
    exit;
}

// Conexão com o banco
$database = new Database();
$conn = $database->getConnection();

try {
    // Verificar email duplicado
    $query = "SELECT ID_ALUNO FROM ALUNOS WHERE EMAIL = :email";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Este email já está cadastrado']);
        exit;
    }

    // Verificar CPF duplicado
    $query = "SELECT ID_ALUNO FROM ALUNOS WHERE CPF = :cpf";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Este CPF já está cadastrado']);
        exit;
    }

    // Formatar telefone (remover caracteres não numéricos e garantir formato)
    $telefone_formatado = preg_replace('/\D/', '', $telefone);
    
    // Hash da senha (EM PRODUÇÃO, USE password_hash - aqui usando md5 para demonstração)
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    // EM PRODUÇÃO: $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

    // Inserir no banco de dados
    $query = "INSERT INTO ALUNOS (
                NOME, 
                EMAIL, 
                NASCIMENTO, 
                CPF, 
                TELEFONE, 
                ENDERECO, 
                SEXO, 
                SENHA_HASH, 
                ID_PLANO, 
                STATUS_ALUNO
              ) VALUES (
                :nome, 
                :email, 
                :nascimento, 
                :cpf, 
                :telefone, 
                :endereco, 
                :sexo, 
                :senha_hash, 
                :id_plano, 
                'ATIVO'
              )";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':nascimento', $nascimento);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->bindParam(':telefone', $telefone_formatado);
    $stmt->bindParam(':endereco', $endereco);
    $stmt->bindParam(':sexo', $sexo);
    $stmt->bindParam(':id_plano', $id_plano);
    $stmt->bindParam(':senha_hash', $senha_hash);

    $id_unidade = $data['id_unidade'] ?? 1;
    
    if ($stmt->execute()) {
        // Cadastro bem-sucedido - também inserir na tabela PERTENCE (unidade padrão 1)
        $id_aluno = $conn->lastInsertId();
        
        $query_pertence = "INSERT INTO PERTENCE (ID_UNIDADE, ID_ALUNO, DATA_INSCRICAO) 
                   VALUES (:id_unidade, :id_aluno, CURDATE())";
                        $stmt_pertence = $conn->prepare($query_pertence);
                        $stmt_pertence->bindParam(':id_unidade', $id_unidade);
                        $stmt_pertence->bindParam(':id_aluno', $id_aluno);
                        $stmt_pertence->execute();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Cadastro realizado com sucesso!',
            'id_aluno' => $id_aluno
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar no banco de dados']);
    }
    
} catch (PDOException $e) {
    error_log("Erro no cadastro: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro no servidor. Tente novamente.']);
}
?>