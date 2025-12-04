<?php
// login.php
session_start();

// Se já estiver logado, redireciona para o painel
if (isset($_SESSION['logado']) && $_SESSION['logado'] === true) {
    header('Location: ../../Painel Aluno/index.php');
    exit;
}

// URLs (substitua pelas suas reais)
define('HOME_URL', '#');
define('PLANOS_URL', '#');
define('SOBRE_URL', '#');
define('LOGIN_URL', 'login.php');
define('REGISTRO_URL', '../registro/register.php');
define('ESQUECI_SENHA_URL', '#');

// Verificar se há mensagem de sucesso do cadastro
$mensagem_sucesso = '';
if (isset($_GET['sucesso'])) {
    $mensagem_sucesso = htmlspecialchars($_GET['sucesso']);
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" href="login.css">
    <title>Login - Tech Fit</title>
</head>
<body>
<!-- ============================================================================================-->
    <!-- Cabeçalho padrão -->
    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="../../logo.png" alt="Tech Fit">
            </div>
            <h1>Tech <span class="color-accent">Fit</span></h1>
        </div>
        <nav>
            <ul>
                <li><a href="<?php echo HOME_URL; ?>">Início</a></li>
                <li><a href="<?php echo PLANOS_URL; ?>">Planos</a></li>
                <li><a href="<?php echo SOBRE_URL; ?>">Sobre nós</a></li>
                <li id="login"><a href="<?php echo REGISTRO_URL; ?>">Cadastre-se</a></li>
            </ul>
        </nav>
    </header>
<!-- ============================================================================================-->

<!-- ============================================================================================-->
  <div class="container">
        <!-- Mensagem de sucesso do cadastro -->
        <?php if ($mensagem_sucesso): ?>
            <div class="mensagem-sucesso">
                ✅ <?php echo $mensagem_sucesso; ?>
            </div>
        <?php endif; ?>

        <div class="login-container">
            <div class="login-card">
                <h2 class="login-titulo">Acesse sua <span class="color-accent">Conta</span></h2>
                
                <form class="formulario" id="formLogin">
                    <div class="campo-grupo">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required>
                    </div>

                    <div class="campo-grupo">
                        <label for="senha">Senha</label>
                        <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required>
                    </div>

                    <div class="opcoes-login">
                        <label class="lembrar-me">
                            <input type="checkbox" id="lembrar" name="lembrar">
                            <span class="checkmark"></span>
                            Lembrar-me
                        </label>
                        <a href="<?php echo ESQUECI_SENHA_URL; ?>" class="esqueci-senha" 
                           onclick="alert('Recuperação de senha em desenvolvimento')">Esqueci minha senha</a>
                    </div>

                    <button type="submit" class="btn-login" id="btnLogin">Entrar</button>

                    <div class="registro-link">
                        <p>Não tem uma conta? <a href="<?php echo REGISTRO_URL; ?>">Cadastre-se aqui</a></p>
                    </div>
                </form>
            </div>
            <div class="bem-vindo-container">
                <div class="bem-vindo-logo">
                    <img src="../../logo.png" alt="Tech Fit">
                </div>
                <h2 class="bem-vindo-titulo">Bem-vindo de Volta</h2>
                <p class="bem-vindo-texto">Acesse sua conta e continue sua jornada fitness.</p>
                
                <?php if (isset($_SESSION['cadastro_sucesso'])): ?>
                <div class="novo-cadastro-info">
                    <h3>🎉 Novo por aqui?</h3>
                    <p>Seu cadastro foi realizado! Use o email e senha cadastrados para fazer login.</p>
                </div>
                <?php 
                    // Limpar a sessão após mostrar
                    unset($_SESSION['cadastro_sucesso']);
                endif; ?>
            </div>
        </div>
    </div>
<!-- ============================================================================================-->

<script src="login.js"></script>
</body>
</html>