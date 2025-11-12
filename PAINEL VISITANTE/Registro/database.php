<?php
// Verificar se a classe já foi declarada para evitar redeclaração
if (!class_exists('Database')) {
    class Database {
        // ⚠️ CONFIGURE COM SUAS CREDENCIAIS DO MYSQL!
        private $host = "localhost";
        private $db_name = "tech_fit";
        private $username = "root";      // Usuário do MySQL
        private $password = "senaisp";          // Senha do MySQL (vazia padrão XAMPP)
        public $conn;
        
        public function getConnection() {
            $this->conn = null;
            
            try {
                $this->conn = new PDO(
                    "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                    $this->username,
                    $this->password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]
                );
                
            } catch(PDOException $exception) {
                // Apenas log do erro, não exibe para o usuário
                error_log("Erro de conexão com banco: " . $exception->getMessage());
            }
            
            return $this->conn;
        }
    }
}

// REMOVA completamente a função testarConexao() daqui
// Ela só causa problemas de redeclaração
?>