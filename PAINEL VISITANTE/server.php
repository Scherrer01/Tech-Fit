<?php
// server.php - Servidor inteligente
$request = $_SERVER['REQUEST_URI'];

// Log para debugging
error_log("Request: " . $request);

// Roteamento para arquivos importantes
$routes = [
    '/processar_login.php' => __DIR__ . '/processar_login.php',
    '/logo.png' => __DIR__ . '/logo.png',
    '/config.php' => __DIR__ . '/config.php',
];

// Se for uma rota conhecida, serve o arquivo
if (isset($routes[$request]) && file_exists($routes[$request])) {
    include $routes[$request];
    exit;
}

// Se não for rota conhecida, deixa o PHP servir normalmente
echo "🏋️  Tech Fit Server\n";
echo "📁 Request: " . $request . "\n";
echo "📂 Diretório: " . __DIR__ . "\n";
echo "🌐 URLs:\n";
echo "   • Login: http://localhost:8000/Painel%20Visitante/login/login.php\n";
echo "   • API Login: http://localhost:8000/processar_login.php\n";
echo "   • Logo: http://localhost:8000/logo.png\n";

system("php -S localhost:8000");
?>