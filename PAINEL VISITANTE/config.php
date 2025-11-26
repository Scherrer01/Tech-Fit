<?php
// Painel Visitante/config.php - Configuração central

// Detecta automaticamente o base path
$script_dir = dirname($_SERVER['SCRIPT_NAME']);
$path_parts = explode('/', trim($script_dir, '/'));
$nivel_profundidade = count($path_parts);

// Calcula o caminho base dinamicamente
$base_path = str_repeat('../', $nivel_profundidade);

// URLs principais
define('BASE_PATH', $base_path);
define('HOME_URL', BASE_PATH . 'Home/home.php');
define('PLANOS_URL', BASE_PATH . 'Planos/planos.php');
define('SOBRE_URL', BASE_PATH . 'Sobre Nós/sobreNós.php');

// URLs do Painel Visitante
define('LOGIN_URL', 'login.php'); // Relativo à pasta Login
define('REGISTRO_URL', '/register.php'); // De Login para Registro
define('ESQUECI_SENHA_URL', 'esqueciSenha.php'); // Relativo à pasta Login

// Assets
define('CSS_PATH', BASE_PATH . 'assets/css/');
define('JS_PATH', BASE_PATH . 'assets/js/');
define('IMAGES_PATH', BASE_PATH . 'assets/images/');

// Funções auxiliares
function url($path) {
    return BASE_PATH . ltrim($path, '/');
}

function asset($type, $file) {
    switch($type) {
        case 'css':
            return CSS_PATH . $file;
        case 'js':
            return JS_PATH . $file;
        case 'image':
            return IMAGES_PATH . $file;
        default:
            return BASE_PATH . $file;
    }
}
?>