<?php
// plano.php
session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['id_aluno'])) {
    header("Location: /PAINEL ALUNO/index.php");
    exit();
}

$id_aluno = $_SESSION['id_aluno'];

// Incluir a classe Database
require_once '../../database.php';

// Conexão com o banco de dados
$database = new Database();
$conn = $database->getConnection();

// ==============================================================
// PROCESSAR TROCA DE PLANO VIA AJAX
// ==============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'trocar_plano') {
    
    $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
    
    try {
        // Validar dados
        if (!isset($_POST['plano_id']) || !isset($_POST['id_aluno'])) {
            throw new Exception("Dados incompletos para troca de plano.");
        }
        
        // Verificar se o ID do aluno corresponde ao da sessão
        if ($_POST['id_aluno'] != $id_aluno) {
            throw new Exception("Acesso não autorizado.");
        }
        
        $plano_id = (int)$_POST['plano_id'];
        $id_aluno_post = (int)$_POST['id_aluno'];
        
        // Verificar se o plano existe
        $sql_verificar_plano = "SELECT ID_PLANO, NOME_PLANO, VALOR FROM PLANOS WHERE ID_PLANO = :plano_id";
        $stmt_verificar_plano = $conn->prepare($sql_verificar_plano);
        $stmt_verificar_plano->bindParam(':plano_id', $plano_id, PDO::PARAM_INT);
        $stmt_verificar_plano->execute();
        
        if ($stmt_verificar_plano->rowCount() === 0) {
            throw new Exception("Plano não encontrado.");
        }
        
        $plano = $stmt_verificar_plano->fetch(PDO::FETCH_ASSOC);
        
        // Verificar se o aluno já tem este plano
        $sql_verificar_aluno_plano = "SELECT ID_PLANO FROM ALUNOS WHERE ID_ALUNO = :id_aluno";
        $stmt_verificar_aluno_plano = $conn->prepare($sql_verificar_aluno_plano);
        $stmt_verificar_aluno_plano->bindParam(':id_aluno', $id_aluno_post, PDO::PARAM_INT);
        $stmt_verificar_aluno_plano->execute();
        
        $aluno_atual = $stmt_verificar_aluno_plano->fetch(PDO::FETCH_ASSOC);
        
        if ($aluno_atual['ID_PLANO'] == $plano_id) {
            throw new Exception("Você já possui este plano.");
        }
        
        // Atualizar plano do aluno
        $sql_atualizar_plano = "UPDATE ALUNOS SET ID_PLANO = :plano_id WHERE ID_ALUNO = :id_aluno";
        $stmt_atualizar_plano = $conn->prepare($sql_atualizar_plano);
        $stmt_atualizar_plano->bindParam(':plano_id', $plano_id, PDO::PARAM_INT);
        $stmt_atualizar_plano->bindParam(':id_aluno', $id_aluno_post, PDO::PARAM_INT);
        
        if ($stmt_atualizar_plano->execute()) {
            // Registrar pagamento - USANDO 'PIX' (ou outro valor válido do ENUM)
            $sql_registrar_pagamento = "INSERT INTO PAGAMENTOS (ID_ALUNO, TIPO_PAGAMENTO, VALOR_PAGAMENTO, DATA_PAGAMENTO) 
                                        VALUES (:id_aluno, 'PIX', :valor, CURDATE())";
            $stmt_registrar_pagamento = $conn->prepare($sql_registrar_pagamento);
            $stmt_registrar_pagamento->bindParam(':id_aluno', $id_aluno_post, PDO::PARAM_INT);
            $stmt_registrar_pagamento->bindParam(':valor', $plano['VALOR'], PDO::PARAM_STR);
            $stmt_registrar_pagamento->execute();
            
            $response = [
                'success' => true,
                'message' => 'Plano alterado com sucesso!',
                'data' => [
                    'plano_nome' => $plano['NOME_PLANO'],
                    'plano_valor' => number_format($plano['VALOR'], 2, ',', '.'),
                    'plano_id' => $plano_id
                ]
            ];
        } else {
            throw new Exception("Erro ao atualizar plano.");
        }
        
    } catch (Exception $e) {
        $response = [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }
    
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    }
}

// Buscar todos os planos disponíveis
$sql_planos = "SELECT ID_PLANO, NOME_PLANO, VALOR, BENEFICIOS FROM PLANOS ORDER BY VALOR ASC";
$stmt_planos = $conn->prepare($sql_planos);
$stmt_planos->execute();
$planos = $stmt_planos->fetchAll(PDO::FETCH_ASSOC);

// Buscar plano atual do aluno
$sql_plano_atual = "SELECT p.ID_PLANO, p.NOME_PLANO, p.VALOR 
                    FROM ALUNOS a 
                    JOIN PLANOS p ON a.ID_PLANO = p.ID_PLANO 
                    WHERE a.ID_ALUNO = :id_aluno";
$stmt_plano_atual = $conn->prepare($sql_plano_atual);
$stmt_plano_atual->bindParam(':id_aluno', $id_aluno, PDO::PARAM_INT);
$stmt_plano_atual->execute();
$plano_atual = $stmt_plano_atual->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="plano.css">
    <title>Planos</title>
</head>
<body>
    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="../../logo.png" alt="Tech Fit">
            </div>
            <h1>Tech <span class="color-accent">Fit</span></h1>
        </div>
        <nav>
            <ul>
                <li><a href="/PAINEL ALUNO/index.php">Início</a></li>
                <li><a href="/PAINEL ALUNO/AULAS/aulas.php">Aulas</a></li>
                <li><a href="/PAINEL ALUNO/UNIDADES/unidades.php">Unidades</a></li>
                <li id="conta"><a href="/PAINEL ALUNO/MINHA CONTA/conta.php">Minha conta</a></li>
            </ul>
        </nav>
    </header>

    <!-- ================================================================================== -->
    <!-- Seção Planos -->
    <section class="plans">
        <div class="section-header">
            <h2>Troque seu Plano</h2>
            <p>Escolha o plano que melhor se adapta aos seus objetivos</p>
            <?php if ($plano_atual): ?>
                
            <?php endif; ?>
        </div>
        <div class="plans-grid">
            <?php foreach ($planos as $plano): 
                $is_current = ($plano_atual && $plano['ID_PLANO'] == $plano_atual['ID_PLANO']);
                $is_popular = ($plano['NOME_PLANO'] == 'Premium');
                
                // Decodificar benefícios do banco de dados
                $beneficios = explode(',', $plano['BENEFICIOS']);
            ?>
                <div class="plan-card <?php echo $is_popular ? 'featured' : ''; ?> <?php echo $is_current ? 'current' : ''; ?>">
                    <?php if ($is_popular): ?>
                        <div class="plan-badge">Mais Popular</div>
                    <?php endif; ?>
                    
                    <?php if ($is_current): ?>
                        <div class="plan-badge current-badge">Plano Atual</div>
                    <?php endif; ?>
                    
                    <div class="plan-header">
                        <h3><?php echo htmlspecialchars($plano['NOME_PLANO']); ?></h3>
                        <div class="plan-price">
                            <span class="price">R$ <?php echo number_format($plano['VALOR'], 0, ',', '.'); ?></span>
                            <span class="period">/mês</span>
                        </div>
                    </div>
                    <ul class="plan-features">
                        <?php foreach ($beneficios as $beneficio): 
                            $beneficio = trim($beneficio);
                            if (!empty($beneficio)): ?>
                                <li><?php echo htmlspecialchars($beneficio); ?></li>
                            <?php endif;
                        endforeach; ?>
                    </ul>
                    <button class="plan-btn <?php echo $is_popular ? 'primary' : ''; ?> 
                             <?php echo $is_current ? 'disabled' : ''; ?>" 
                            data-plano-id="<?php echo $plano['ID_PLANO']; ?>"
                            data-plano-nome="<?php echo htmlspecialchars($plano['NOME_PLANO']); ?>"
                            data-plano-valor="<?php echo number_format($plano['VALOR'], 2, ',', '.'); ?>"
                            <?php echo $is_current ? 'disabled' : ''; ?>>
                        <?php echo $is_current ? 'Plano Atual' : 'Trocar para este plano'; ?>
                    </button>
                </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Modal de Confirmação -->
    <div id="confirmModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h3>Confirmar Troca de Plano</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                <p id="confirmMessage">Tem certeza que deseja trocar para o plano <strong id="planoNome"></strong> por R$ <strong id="planoValor"></strong>/mês?</p>
                <p class="modal-note">A alteração será efetivada imediatamente e aparecerá na sua conta.</p>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary cancel-troca">Cancelar</button>
                <button class="btn-primary confirm-troca" data-plano-id="" data-id-aluno="<?php echo $id_aluno; ?>">Confirmar Troca</button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <div class="logo-container">
                            <div class="logo">
                                <img src="../../logo.png" alt="Tech Fit">
                            </div>
                            <h2>Tech <span class="color-accent">Fit</span></h2>
                        </div>
                        <p>Transformando vidas através da tecnologia e fitness.</p>
                    </div>
                    <div class="social-links">
                        <a href="#" class="whatsapp">
                            <svg viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.189-3.553-8.449"/>
                            </svg>
                        </a>
                        <a href="#" class="facebook">
                            <svg viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="#" class="instagram">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="#" class="youtube">
                            <svg viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Horários</h4>
                    <ul>
                        <li>Segunda a Sexta: 5h às 23h</li>
                        <li>Sábados: 6h às 20h</li>
                        <li>Domingos: 7h às 14h</li>
                        <li>Feriados: 7h às 12h</li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contato</h4>
                    <ul>
                        <li>📍 Rua Fitness, 123 - Centro</li>
                        <li>📞 (19) 98704-4392</li>
                        <li>✉️ diogo.scherrer@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Tech Fit Academia. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const planButtons = document.querySelectorAll('.plan-btn:not(.disabled)');
        const confirmModal = document.getElementById('confirmModal');
        const modalClose = confirmModal.querySelector('.modal-close');
        const cancelBtn = confirmModal.querySelector('.cancel-troca');
        const confirmBtn = confirmModal.querySelector('.confirm-troca');
        const planoNome = document.getElementById('planoNome');
        const planoValor = document.getElementById('planoValor');
        const confirmMessage = document.getElementById('confirmMessage');

        // Abrir modal ao clicar em um botão de plano
        planButtons.forEach(button => {
            button.addEventListener('click', function() {
                const planoId = this.dataset.planoId;
                const planoNomeText = this.dataset.planoNome;
                const planoValorText = this.dataset.planoValor;
                
                // Atualizar modal
                planoNome.textContent = planoNomeText;
                planoValor.textContent = planoValorText;
                confirmBtn.dataset.planoId = planoId;
                
                // Mostrar modal
                confirmModal.style.display = 'flex';
            });
        });

        // Fechar modal
        function closeModal() {
            confirmModal.style.display = 'none';
        }

        modalClose.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Confirmar troca de plano
        confirmBtn.addEventListener('click', async function() {
            const planoId = this.dataset.planoId;
            const idAluno = this.dataset.idAluno;
            
            if (!planoId || !idAluno) {
                alert('Erro: Dados incompletos');
                return;
            }
            
            // Desabilitar botão durante a requisição
            this.disabled = true;
            this.textContent = 'Processando...';
            
            try {
                // Enviar requisição AJAX
                const formData = new FormData();
                formData.append('action', 'trocar_plano');
                formData.append('plano_id', planoId);
                formData.append('id_aluno', idAluno);
                
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Mostrar mensagem de sucesso
                    confirmMessage.innerHTML = `
                        <div class="success-message">
                            ✅ ${result.message}<br>
                            Novo plano: <strong>${result.data.plano_nome}</strong> - R$ ${result.data.plano_valor}/mês
                        </div>
                    `;
                    
                    // Atualizar botões
                    document.querySelectorAll('.plan-btn').forEach(btn => {
                        btn.textContent = 'Trocar para este plano';
                        btn.classList.remove('disabled', 'current');
                    });
                    
                    // Marcar novo plano como atual
                    const newPlanBtn = document.querySelector(`[data-plano-id="${planoId}"]`);
                    if (newPlanBtn) {
                        newPlanBtn.textContent = 'Plano Atual';
                        newPlanBtn.classList.add('disabled', 'current');
                        newPlanBtn.disabled = true;
                        
                        // Adicionar badge ao card
                        const planCard = newPlanBtn.closest('.plan-card');
                        const currentBadge = document.createElement('div');
                        currentBadge.className = 'plan-badge current-badge';
                        currentBadge.textContent = 'Plano Atual';
                        planCard.appendChild(currentBadge);
                    }
                    
                    // Fechar modal após 3 segundos
                    setTimeout(() => {
                        closeModal();
                        // Redirecionar para página de confirmação ou atualizar a página
                        window.location.href = '/PAINEL ALUNO/MINHA CONTA/conta.php';
                    }, 3000);
                    
                } else {
                    alert('Erro: ' + result.message);
                    this.disabled = false;
                    this.textContent = 'Confirmar Troca';
                }
                
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro de conexão. Tente novamente.');
                this.disabled = false;
                this.textContent = 'Confirmar Troca';
            }
        });

        // Fechar modal ao clicar fora
        confirmModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
    </script>
</body>
</html>