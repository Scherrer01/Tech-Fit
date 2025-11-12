<?php
echo "<h2>Teste de Conexão com Banco de Dados</h2>";

// Teste básico do PHP
echo "PHP Version: " . phpversion() . "<br>";
echo "PDO MySQL disponível: " . (extension_loaded('pdo_mysql') ? '✅ SIM' : '❌ NÃO') . "<br><br>";

// Teste de conexão
try {
    $host = "localhost";
    $dbname = "tech_fit";
    $username = "root";
    $password = "senaisp";
    
    echo "Tentando conectar...<br>";
    echo "Host: $host<br>";
    echo "Database: $dbname<br>";
    echo "Usuário: $username<br>";
    echo "Senha: " . (empty($password) ? "vazia" : "definida") . "<br><br>";
    
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ <strong>Conexão estabelecida com sucesso!</strong><br>";
    
    // Verificar se o banco existe e tem tabelas
    $tables = $conn->query("SHOW TABLES")->fetchAll();
    echo "📊 Tabelas encontradas: " . count($tables) . "<br>";
    
    foreach ($tables as $table) {
        echo " - " . $table[0] . "<br>";
    }
    
} catch (PDOException $e) {
    echo "❌ <strong>Erro de conexão:</strong> " . $e->getMessage() . "<br>";
    
    // Tentativas alternativas
    echo "<br><strong>Tentando alternativas...</strong><br>";
    
    // Tentativa 1: Sem database (só conectar ao MySQL)
    try {
        $conn = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
        echo "✅ Conectado ao MySQL (sem database)<br>";
        
        // Tentar criar o database
        $conn->exec("CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4");
        echo "✅ Database '$dbname' criado/verificado<br>";
        
    } catch (PDOException $e2) {
        echo "❌ Erro na conexão básica: " . $e2->getMessage() . "<br>";
    }
}
?>