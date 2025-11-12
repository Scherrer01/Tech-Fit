<?php
// server.php - Servidor simples
echo "🏋️  Tech Fit - Servidor Iniciado\n";
echo "📁 Pasta: " . __DIR__ . "\n";
echo "🌐 Acesse: http://localhost:8000\n";
echo "🛑 Parar: Ctrl + C\n\n";

// Servidor simples sem roteador complexo
system("php -S localhost:8000");
?>