<?php
// index.php - Sistema de rotas básico
$request = $_SERVER['REQUEST_URI'];
$base_path = '/';

switch ($request) {
    case $base_path:
    case $base_path . 'login':
        require __DIR__ . '/login/index.php';
        break;
    case $base_path . 'recuperar-senha':
        require __DIR__ . '/recuperar-senha/index.php';
        break;
    case $base_path . 'cadastro':
        require __DIR__ . '/cadastro/index.php';
        break;
    default:
        http_response_code(404);
        require __DIR__ . '/404.php';
        break;
}
?>