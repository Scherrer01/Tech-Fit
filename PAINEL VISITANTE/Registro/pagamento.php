<?php
session_start();

// Verificar se o usuário veio do cadastro
if (!isset($_SESSION['dados_cadastro'])) {
    header('Location: register.php?erro=Acesso inválido. Complete o cadastro primeiro.');
    exit;
}

$dados = $_SESSION['dados_cadastro'];

// Buscar informações do plano no banco
include 'database.php';

$plano_info = [];
$valor_plano = 0;

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        $sql = "SELECT NOME_PLANO, VALOR, BENEFICIOS FROM PLANOS WHERE ID_PLANO = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$dados['id_plano']]);
        $plano_info = $stmt->fetch();
        
        if ($plano_info) {
            $valor_plano = $plano_info['VALOR'];
        }
    }
} catch (Exception $e) {
    error_log("Erro ao buscar plano: " . $e->getMessage());
    $plano_info = ['NOME_PLANO' => 'Plano Selecionado', 'VALOR' => 0, 'BENEFICIOS' => ''];
    $valor_plano = 0;
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="pagamento.css">
    <title>Pagamento - Tech Fit</title>
</head>
<body>
    <div class="container">
        <div class="pagamento-container">
            <div class="pagamento-card">
                <h2 class="titulo">Finalizar Pagamento</h2>
                
                <?php if (isset($_GET['erro'])): ?>
                    <div class="mensagem-erro">
                        ❌ <?php echo htmlspecialchars($_GET['erro']); ?>
                    </div>
                <?php endif; ?>
                
                <?php if (isset($_GET['sucesso'])): ?>
                    <div class="mensagem-sucesso">
                        ✅ <?php echo htmlspecialchars($_GET['sucesso']); ?>
                    </div>
                <?php endif; ?>
                
                <div class="resumo-compra">
                    <h3>📋 Resumo da Compra</h3>
                    <div class="resumo-item">
                        <div class="resumo-linha">
                            <span>Plano:</span>
                            <strong><?php echo htmlspecialchars($plano_info['NOME_PLANO']); ?></strong>
                        </div>
                        <div class="resumo-linha">
                            <span>Valor mensal:</span>
                            <strong>R$ <?php echo number_format($valor_plano, 2, ',', '.'); ?></strong>
                        </div>
                        <div class="resumo-linha">
                            <span>Aluno:</span>
                            <span><?php echo htmlspecialchars($dados['nome']); ?></span>
                        </div>
                        <div class="resumo-linha">
                            <span>Email:</span>
                            <span><?php echo htmlspecialchars($dados['email']); ?></span>
                        </div>
                    </div>
                    <div class="total">
                        <strong>Total: R$ <?php echo number_format($valor_plano, 2, ',', '.'); ?></strong>
                    </div>
                </div>

                <form class="formulario-pagamento" id="formPagamento" action="processar_pagamento.php" method="POST">
                    <input type="hidden" name="id_aluno" value="<?php echo $dados['id_aluno']; ?>">
                    <input type="hidden" name="id_plano" value="<?php echo $dados['id_plano']; ?>">
                    <input type="hidden" name="valor" value="<?php echo $valor_plano; ?>">

                    <div class="campo-grupo">
                        <label for="tipo_pagamento">💳 Forma de Pagamento *</label>
                        <select id="tipo_pagamento" name="tipo_pagamento" required>
                            <option value="">Selecione a forma de pagamento</option>
                            <option value="PIX">PIX</option>
                            <option value="CREDITO">Cartão de Crédito</option>
                            <option value="DEBITO">Cartão de Débito</option>
                        </select>
                    </div>

                    <!-- Campos Cartão -->
                    <div id="campos-cartao" class="secao-pagamento hidden">
                        <h4>🔒 Dados do Cartão</h4>
                        <div class="campo-grupo">
                            <label for="numero_cartao">Número do Cartão *</label>
                            <input type="text" id="numero_cartao" name="numero_cartao" placeholder="0000 0000 0000 0000" maxlength="19">
                        </div>

                        <div class="campos-linha">
                            <div class="campo-grupo">
                                <label for="validade_cartao">Validade *</label>
                                <input type="text" id="validade_cartao" name="validade_cartao" placeholder="MM/AA" maxlength="5">
                            </div>

                            <div class="campo-grupo">
                                <label for="cvv_cartao">CVV *</label>
                                <input type="text" id="cvv_cartao" name="cvv_cartao" placeholder="000" maxlength="4">
                            </div>
                        </div>

                        <div class="campo-grupo">
                            <label for="nome_cartao">Nome no Cartão *</label>
                            <input type="text" id="nome_cartao" name="nome_cartao" placeholder="Como está no cartão">
                        </div>
                    </div>

                    <!-- Instruções PIX -->
                    <div id="instrucoes-pix" class="secao-pagamento hidden">
                        <div class="info-pagamento">
                            <h4>📱 Pagamento via PIX</h4>
                            <p>Após confirmar o pagamento, você receberá um QR Code para finalizar a transação.</p>
                            <div class="vantagens">
                                <span>✅ Pagamento instantâneo</span>
                                <span>✅ Sem taxas</span>
                                <span>✅ Disponível 24h</span>
                            </div>
                        </div>
                    </div>

                    <!-- Instruções Boleto -->
                    <div id="instrucoes-boleto" class="secao-pagamento hidden">
                        <div class="info-pagamento">
                            <h4>📄 Pagamento via Boleto</h4>
                            <p>O boleto será gerado após a confirmação e terá vencimento em 3 dias úteis.</p>
                            <div class="vantagens">
                                <span>✅ Aceito em qualquer banco</span>
                                <span>✅ Pagamento em até 3 dias</span>
                                <span>✅ Sem juros</span>
                            </div>
                        </div>
                    </div>

                    <div class="botoes-acao">
                        <button type="button" class="btn-voltar" onclick="window.location.href='register.php'">
                            ← Voltar para Cadastro
                        </button>
                        <button type="submit" class="btn-finalizar" id="btnFinalizar">
                            💳 Finalizar Pagamento
                        </button>
                    </div>
                </form>
            </div>

            <div class="info-container">
                <div class="info-logo">
                    <img src="../../logo.png" alt="Tech Fit">
                </div>
                <h2 class="info-titulo">🎉 Quase lá!</h2>
                <p class="info-texto">Finalize seu pagamento e comece hoje mesmo sua jornada fitness.</p>
                
                <div class="beneficios">
                    <h4>✨ Você receberá:</h4>
                    <ul>
                        <li>🏋️ Acesso imediato à academia</li>
                        <li>📱 Carteirinha digital</li>
                        <li>🛟 Suporte 24/7</li>
                        <li>📊 Avaliação física gratuita</li>
                        <li>👥 Acesso a todas as áreas</li>
                        <?php if (!empty($plano_info['BENEFICIOS'])): ?>
                            <li>⭐ <?php echo htmlspecialchars($plano_info['BENEFICIOS']); ?></li>
                        <?php endif; ?>
                    </ul>
                </div>

                <div class="seguranca">
                    <h4>🔒 Pagamento Seguro</h4>
                    <p>Seus dados estão protegidos com criptografia SSL.</p>
                </div>
            </div>
        </div>
    </div>

    <script src="pagamento.js"></script>
</body>
</html>