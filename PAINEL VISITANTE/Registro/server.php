<?php
// server.php - Servidor de desenvolvimento local
echo "🔄 Iniciando servidor PHP...\n";
echo "📁 Diretório: " . __DIR__ . "\n";
echo "🌐 URL: http://localhost:8000\n";
echo "🛑 Para parar: Ctrl + C\n\n";

// Executar servidor PHP embutido
$command = "php -S localhost:8000 -t .";

echo "▶️  Executando: $command\n\n";

// Executar o comando
system($command);
?>