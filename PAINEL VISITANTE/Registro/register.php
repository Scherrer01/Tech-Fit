<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="register.css">
    <title>Cadastro - Tech Fit</title>
</head>
<body>
<?php
session_start();
include 'database.php';

// Configurações de URL
$home_url = "index.php";
$planos_url = "planos.php";
$sobre_url = "sobre.php";
$login_url = "login.php";
$js_path = "js/";

// Verificar mensagens de erro/sucesso
$mensagem_erro = "";
$mensagem_sucesso = "";

if (isset($_GET['erro'])) {
    $mensagem_erro = htmlspecialchars($_GET['erro']);
}

if (isset($_GET['sucesso'])) {
    $mensagem_sucesso = htmlspecialchars($_GET['sucesso']);
}

// Buscar planos e unidades do banco
$planos = [];
$unidades = [];

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Buscar planos
    $stmt_planos = $conn->query("SELECT ID_PLANO, NOME_PLANO, VALOR FROM PLANOS ORDER BY VALOR");
    $planos = $stmt_planos->fetchAll();
    
    // Buscar unidades
    $stmt_unidades = $conn->query("SELECT ID_UNIDADE, NOME_UNIDADE FROM UNIDADES ORDER BY NOME_UNIDADE");
    $unidades = $stmt_unidades->fetchAll();
    
} catch (Exception $e) {
    error_log("Erro ao buscar dados: " . $e->getMessage());
}
?>

<!-- ============================================================================================-->
    <!-- Cabeçalho padrão -->
    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="logo.png" alt="">
            </div>
            <h1>Tech <span class="color-accent">Fit</span></h1>
        </div>
        <nav>
            <ul>
                <li><a href="<?php echo $home_url; ?>">Início</a></li>
                <li><a href="<?php echo $planos_url; ?>">Planos</a></li>
                <li><a href="<?php echo $sobre_url; ?>">Sobre nós</a></li>
                <li id="login"><a href="<?php echo $login_url; ?>">Login</a></li>
            </ul>
        </nav>
    </header>
<!-- ============================================================================================-->

<!-- ============================================================================================-->
  <div class="container">
        <!-- Mensagens de sucesso/erro -->
        <?php if ($mensagem_erro): ?>
            <div class="mensagem erro">
                <?php echo $mensagem_erro; ?>
            </div>
        <?php endif; ?>
        
        <?php if ($mensagem_sucesso): ?>
            <div class="mensagem sucesso">
                <?php echo $mensagem_sucesso; ?>
            </div>
        <?php endif; ?>

        <div class="registro-container">
            <div class="registro-card">
                <h2 class="registro-titulo">Criar <span class="color-accent">Conta</span></h2>
                
                <form class="formulario" id="formRegistro" method="POST" action="processar_registro.php">
                    <div class="campo-grupo">
                        <label for="nome">Nome Completo *</label>
                        <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo" required 
                               value="<?php echo isset($_POST['nome']) ? htmlspecialchars($_POST['nome']) : ''; ?>">
                    </div>

                    <div class="campo-grupo">
                        <label for="email">E-mail *</label>
                        <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required
                               value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                    </div>

                    <div class="campo-grupo">
                        <label for="cpf">CPF *</label>
                        <input type="text" id="cpf" name="cpf" placeholder="Digite seu CPF" required
                               value="<?php echo isset($_POST['cpf']) ? htmlspecialchars($_POST['cpf']) : ''; ?>">
                    </div>

                    <div class="campo-grupo">
                        <label for="nascimento">Data de Nascimento *</label>
                        <input type="date" id="nascimento" name="nascimento" required
                               value="<?php echo isset($_POST['nascimento']) ? htmlspecialchars($_POST['nascimento']) : ''; ?>">
                    </div>

                    <div class="campo-grupo">
                        <label for="telefone">Telefone *</label>
                        <input type="text" id="telefone" name="telefone" placeholder="Digite seu telefone" required
                               value="<?php echo isset($_POST['telefone']) ? htmlspecialchars($_POST['telefone']) : ''; ?>">
                    </div>

                    <div class="campo-grupo">
                        <label for="endereco">Endereço *</label>
                        <input type="text" id="endereco" name="endereco" placeholder="Digite seu endereço completo" required
                               value="<?php echo isset($_POST['endereco']) ? htmlspecialchars($_POST['endereco']) : ''; ?>">
                    </div>

                    <div class="campo-grupo">
                        <label for="sexo">Sexo *</label>
                        <select id="sexo" name="sexo" required>
                            <option value="">Selecione...</option>
                            <option value="MASCULINO" <?php echo (isset($_POST['sexo']) && $_POST['sexo'] == 'MASCULINO') ? 'selected' : ''; ?>>Masculino</option>
                            <option value="FEMININO" <?php echo (isset($_POST['sexo']) && $_POST['sexo'] == 'FEMININO') ? 'selected' : ''; ?>>Feminino</option>
                        </select>
                    </div>

                    <div class="campo-grupo">
                        <label for="id_plano">Plano *</label>
                        <select id="id_plano" name="id_plano" required>
                            <option value="">Selecione um plano...</option>
                            <?php foreach ($planos as $plano): ?>
                                <option value="<?php echo $plano['ID_PLANO']; ?>" 
                                    <?php echo (isset($_POST['id_plano']) && $_POST['id_plano'] == $plano['ID_PLANO']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($plano['NOME_PLANO'] . ' - R$ ' . number_format($plano['VALOR'], 2, ',', '.')); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="campo-grupo">
                        <label for="id_unidade">Unidade *</label>
                        <select id="id_unidade" name="id_unidade" required>
                            <option value="">Selecione uma unidade...</option>
                            <?php foreach ($unidades as $unidade): ?>
                                <option value="<?php echo $unidade['ID_UNIDADE']; ?>" 
                                    <?php echo (isset($_POST['id_unidade']) && $_POST['id_unidade'] == $unidade['ID_UNIDADE']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($unidade['NOME_UNIDADE']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="campo-grupo">
                        <label for="senha">Senha *</label>
                        <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required minlength="6">
                    </div>

                    <div class="campo-grupo">
                        <label for="confirmar_senha">Confirmar Senha *</label>
                        <input type="password" id="confirmar_senha" name="confirmar_senha" placeholder="Confirme sua senha" required>
                    </div>

                    <button type="submit" class="btn-registrar">Criar Conta</button>

                    <div class="login-link">
                        <p>Já tem uma conta? <a href="<?php echo $login_url; ?>">Faça login aqui</a></p>
                    </div>
                </form>
            </div>
            <div class="bem-vindo-container">
                <div class="bem-vindo-logo">
                    <img src="logo.png" alt="">
                </div>
                <h2 class="bem-vindo-titulo">Junte-se a Nós</h2>
                <p class="bem-vindo-texto">Crie sua conta e comece sua transformação fitness hoje mesmo.</p>
            </div>
        </div>
    </div>
<!-- ============================================================================================-->

<script src="<?php echo $js_path; ?>register.js"></script>
</body>
</html>