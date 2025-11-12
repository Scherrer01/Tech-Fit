<?php

// URLs - ajustadas para a pasta Registro
$home_url = $base_path . 'Home/home.php';
$planos_url = $base_path . 'Planos/planos.php';
$sobre_url = $base_path . 'Sobre Nós/sobreNós.php';
$login_url = 'Painel Visitante/login.php';
$pagamento_url = 'pagamento.php'; // Na mesma pasta
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?php echo $css_path; ?>register.css">
    <title>Cadastro - Tech Fit</title>
</head>
<body>
<!-- ============================================================================================-->
    <!-- Cabeçalho padrão -->
    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="<?php echo $images_path; ?>logo.png" alt="Tech Fit">
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
        <div class="registro-container">
            <div class="registro-card">
                <h2 class="registro-titulo">Criar <span class="color-accent">Conta</span></h2>
                <p class="registro-descricao">Preencha os dados abaixo para criar sua conta.</p>
                
                <form class="formulario" id="formRegistro">
                    <div class="campo-grupo">
                        <label for="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo" required>
                    </div>

                    <div class="campo-grupo">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required>
                    </div>

                    <div class="campo-grupo">
                        <label for="senha">Senha</label>
                        <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required minlength="6">
                    </div>

                    <div class="campo-grupo">
                        <label for="confirmar_senha">Confirmar Senha</label>
                        <input type="password" id="confirmar_senha" name="confirmar_senha" placeholder="Confirme sua senha" required>
                    </div>

                    <button type="submit" class="btn-registro">Criar Conta</button>

                    <div class="login-link">
                        <p>Já tem uma conta? <a href="<?php echo $login_url; ?>">Faça login aqui</a></p>
                    </div>
                </form>
            </div>
            <div class="bem-vindo-container">
                <div class="bem-vindo-logo">
                    <img src="<?php echo $images_path; ?>logo.png" alt="Tech Fit">
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