<?php
session_start();
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: register.php?erro=Método não permitido');
    exit;
}

try {
    // Validar campos obrigatórios
    $camposObrigatorios = ['nome', 'email', 'nascimento', 'cpf', 'telefone', 'endereco', 'sexo', 'id_plano', 'id_unidade', 'senha', 'confirmar_senha'];
    
    foreach ($camposObrigatorios as $campo) {
        if (empty($_POST[$campo])) {
            throw new Exception("O campo " . ucfirst(str_replace('_', ' ', $campo)) . " é obrigatório");
        }
    }
    
    // Validar email
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("E-mail inválido");
    }
    
    // Validar senha
    if ($_POST['senha'] !== $_POST['confirmar_senha']) {
        throw new Exception("As senhas não coincidem");
    }
    
    if (strlen($_POST['senha']) < 6) {
        throw new Exception("A senha deve ter pelo menos 6 caracteres");
    }
    
    // Validar idade mínima (16 anos)
    $nascimento = new DateTime($_POST['nascimento']);
    $hoje = new DateTime();
    $idade = $hoje->diff($nascimento)->y;
    
    if ($idade < 16) {
        throw new Exception("É necessário ter pelo menos 16 anos para se cadastrar");
    }
    
    // Validar CPF
    $cpf = preg_replace('/[^0-9]/', '', $_POST['cpf']);
    if (strlen($cpf) !== 11) {
        throw new Exception("CPF inválido");
    }

    // Conectar ao banco
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Erro de conexão com o banco de dados. Tente novamente.");
    }
    
    // Verificar se email já existe
    $checkEmail = $conn->prepare("SELECT ID_ALUNO FROM ALUNOS WHERE EMAIL = ?");
    $checkEmail->execute([$_POST['email']]);
    if ($checkEmail->fetch()) {
        throw new Exception("Este e-mail já está cadastrado");
    }
    
    // Verificar se CPF já existe
    $checkCPF = $conn->prepare("SELECT ID_ALUNO FROM ALUNOS WHERE CPF = ?");
    $checkCPF->execute([$cpf]);
    if ($checkCPF->fetch()) {
        throw new Exception("Este CPF já está cadastrado");
    }
    
    // Verificar se plano existe
    $checkPlano = $conn->prepare("SELECT ID_PLANO, VALOR FROM PLANOS WHERE ID_PLANO = ?");
    $checkPlano->execute([$_POST['id_plano']]);
    $plano = $checkPlano->fetch();
    if (!$plano) {
        throw new Exception("Plano selecionado não existe");
    }
    
    // Verificar se unidade existe
    $checkUnidade = $conn->prepare("SELECT ID_UNIDADE FROM UNIDADES WHERE ID_UNIDADE = ?");
    $checkUnidade->execute([$_POST['id_unidade']]);
    if (!$checkUnidade->fetch()) {
        throw new Exception("Unidade selecionada não existe");
    }
    
    // Hash da senha
    $senha_hash = password_hash($_POST['senha'], PASSWORD_DEFAULT);
    
    // Iniciar transação
    $conn->beginTransaction();
    
    try {
        // Inserir aluno (mas com status INATIVO até o pagamento)
        $sql = "INSERT INTO ALUNOS (
            NOME, ENDERECO, NASCIMENTO, TELEFONE, CPF, SEXO, EMAIL, SENHA_HASH, ID_PLANO, STATUS_ALUNO
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'INATIVO')"; // ✅ Status INATIVO até pagamento
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $_POST['nome'],
            $_POST['endereco'],
            $_POST['nascimento'],
            $_POST['telefone'],
            $cpf,
            $_POST['sexo'],
            $_POST['email'],
            $senha_hash,
            $_POST['id_plano']
        ]);
        
        $id_aluno = $conn->lastInsertId();
        
        // Inserir na tabela PERTENCE (relacionamento com unidade)
        $sql_pertence = "INSERT INTO PERTENCE (ID_UNIDADE, ID_ALUNO) VALUES (?, ?)";
        $stmt_pertence = $conn->prepare($sql_pertence);
        $stmt_pertence->execute([$_POST['id_unidade'], $id_aluno]);
        
        // Commit da transação
        $conn->commit();
        
        // ✅ AGORA VAI PARA PAGAMENTO (MESMA PASTA)
        $_SESSION['dados_cadastro'] = [
            'id_aluno' => $id_aluno,
            'nome' => $_POST['nome'],
            'email' => $_POST['email'],
            'id_plano' => $_POST['id_plano'],
            'id_unidade' => $_POST['id_unidade'],
            'valor_plano' => $plano['VALOR'] // Valor do plano para pagamento
        ];
        
        // Redirecionar para PAGAMENTO (MESMA PASTA)
        header('Location: pagamento.php');
        exit;
        
    } catch (Exception $e) {
        // Rollback em caso de erro
        $conn->rollBack();
        throw $e;
    }
    
} catch (Exception $e) {
    // Em caso de erro, redirecionar de volta com os dados preenchidos
    $dados_anteriores = http_build_query($_POST);
    header("Location: register.php?erro=" . urlencode($e->getMessage()) . "&" . $dados_anteriores);
    exit;
}
?>