<?php
// conta.php - Painel Aluno/Minha Conta/conta.php
session_start();

// DEBUG: Mostrar dados da sessão (remova depois)
error_log("Sessão conta.php - id_aluno: " . ($_SESSION['id_aluno'] ?? 'NÃO DEFINIDO'));

// Verificar se o usuário está logado
if (!isset($_SESSION['id_aluno'])) {
    error_log("Redirecionando para login - sessão vazia");
    header('Location: ../../PAINEL VISITANTE/registro/login.php');
    exit();
}

$id_aluno = $_SESSION['id_aluno'];

// Incluir a classe Database
require_once '../../database.php';

// Criar instância da conexão PDO
$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
        echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados.']);
        exit();
    } else {
        die("Erro na conexão com o banco de dados.");
    }
}

// ==============================================================
// PROCESSAR ATUALIZAÇÃO DE PERFIL VIA AJAX
// ==============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_profile') {
    
    // Verificar se é uma requisição AJAX
    $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
    
    try {
        // Validar dados
        $required_fields = ['nome', 'id_aluno'];
        foreach ($required_fields as $field) {
            if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
                throw new Exception("Campo obrigatório '$field' não preenchido.");
            }
        }
        
        // Verificar se o ID do aluno corresponde ao da sessão
        if ($_POST['id_aluno'] != $id_aluno) {
            throw new Exception("Acesso não autorizado.");
        }
        
        // Coletar e sanitizar dados
        $nome = trim($_POST['nome']);
        $telefone = isset($_POST['telefone']) ? trim($_POST['telefone']) : null;
        $endereco = isset($_POST['endereco']) ? trim($_POST['endereco']) : null;
        $sexo = isset($_POST['sexo']) ? $_POST['sexo'] : null;
        $nascimento = isset($_POST['nascimento']) ? $_POST['nascimento'] : null;
        
        // Validações
        if (strlen($nome) < 3) {
            throw new Exception("O nome deve ter pelo menos 3 caracteres.");
        }
        
        // Formatar telefone (remover formatação para salvar no banco)
        if ($telefone) {
            $telefone = preg_replace('/[^0-9]/', '', $telefone);
            if (strlen($telefone) < 10 || strlen($telefone) > 11) {
                throw new Exception("Telefone inválido. Deve ter 10 ou 11 dígitos.");
            }
        }
        
        // Validar data de nascimento
        if ($nascimento) {
            $date = DateTime::createFromFormat('Y-m-d', $nascimento);
            if (!$date || $date->format('Y-m-d') !== $nascimento) {
                throw new Exception("Data de nascimento inválida.");
            }
            
            // Verificar se é uma data válida (não no futuro)
            $hoje = new DateTime();
            $dataNasc = new DateTime($nascimento);
            if ($dataNasc > $hoje) {
                throw new Exception("Data de nascimento não pode ser no futuro.");
            }
        }
        
        // Atualizar no banco de dados
        $sql = "UPDATE ALUNOS SET 
                NOME = :nome,
                TELEFONE = :telefone,
                ENDERECO = :endereco,
                SEXO = :sexo,
                NASCIMENTO = :nascimento
                WHERE ID_ALUNO = :id_aluno";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
        $stmt->bindParam(':telefone', $telefone, PDO::PARAM_STR);
        $stmt->bindParam(':endereco', $endereco, PDO::PARAM_STR);
        $stmt->bindParam(':sexo', $sexo, PDO::PARAM_STR);
        $stmt->bindParam(':nascimento', $nascimento, PDO::PARAM_STR);
        $stmt->bindParam(':id_aluno', $id_aluno, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            // Preparar resposta de sucesso
            $response = [
                'success' => true,
                'message' => 'Perfil atualizado com sucesso!',
                'data' => [
                    'nome' => $nome,
                    'telefone' => $telefone ? formatarTelefoneExibicao($telefone) : '',
                    'endereco' => $endereco,
                    'sexo' => $sexo,
                    'nascimento' => $nascimento
                ]
            ];
            
            // Atualizar sessão se necessário
            $_SESSION['nome_aluno'] = $nome;
            
        } else {
            throw new Exception("Erro ao atualizar no banco de dados.");
        }
        
    } catch (Exception $e) {
        $response = [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }
    
    // Retornar resposta JSON
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    } else {
        // Se não for AJAX, redirecionar com mensagem
        $_SESSION['flash_message'] = isset($response['success']) && $response['success'] ? 
            ['type' => 'success', 'text' => $response['message']] : 
            ['type' => 'error', 'text' => $response['message']];
        header('Location: conta.php');
        exit();
    }
}

// Função para formatar telefone para exibição
function formatarTelefoneExibicao($telefone) {
    if (strlen($telefone) === 11) {
        return '(' . substr($telefone, 0, 2) . ') ' . substr($telefone, 2, 5) . '-' . substr($telefone, 7);
    } elseif (strlen($telefone) === 10) {
        return '(' . substr($telefone, 0, 2) . ') ' . substr($telefone, 2, 4) . '-' . substr($telefone, 6);
    }
    return $telefone;
}

// ==============================================================
// CÓDIGO ORIGINAL (BUSCAR DADOS PARA EXIBIÇÃO)
// ==============================================================

try {
    // Buscar dados do aluno usando PDO
    $sql = "SELECT a.*, p.NOME_PLANO, p.VALOR 
            FROM ALUNOS a 
            LEFT JOIN PLANOS p ON a.ID_PLANO = p.ID_PLANO 
            WHERE a.ID_ALUNO = :id_aluno";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id_aluno', $id_aluno, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        // Aluno não encontrado
        session_destroy();
        header('Location: ../../PAINEL VISITANTE/registro/login.php');
        exit();
    }
    
    $aluno = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Buscar unidade do aluno
    $sql_unidade = "SELECT u.NOME_UNIDADE, u.ENDERECO_UNIDADE 
                    FROM PERTENCE p
                    JOIN UNIDADES u ON p.ID_UNIDADE = u.ID_UNIDADE
                    WHERE p.ID_ALUNO = :id_aluno
                    LIMIT 1";
    
    $stmt_unidade = $conn->prepare($sql_unidade);
    $stmt_unidade->bindParam(':id_aluno', $id_aluno, PDO::PARAM_INT);
    $stmt_unidade->execute();
    $unidade = $stmt_unidade->fetch(PDO::FETCH_ASSOC);
    
    // Buscar aulas agendadas do aluno
    $sql_aulas = "SELECT a.NOME_AULA, a.DIA_SEMANA, a.HORARIO_INICIO, a.DURACAO_MINUTOS,
                         m.NOME_MODALIDADE, f.NOME_FUNCIONARIO
                  FROM PARTICIPAM pa
                  JOIN AULAS a ON pa.ID_AULA = a.ID_AULA
                  JOIN MODALIDADES m ON a.ID_MODALIDADE = m.ID_MODALIDADE
                  LEFT JOIN FUNCIONARIOS f ON a.ID_INSTRUTOR = f.ID_FUNCIONARIO
                  WHERE pa.ID_ALUNO = :id_aluno
                  ORDER BY a.DIA_SEMANA, a.HORARIO_INICIO";
    
    $stmt_aulas = $conn->prepare($sql_aulas);
    $stmt_aulas->bindParam(':id_aluno', $id_aluno, PDO::PARAM_INT);
    $stmt_aulas->execute();
    $aulas_agendadas = $stmt_aulas->fetchAll(PDO::FETCH_ASSOC);
    
    // Buscar histórico de pagamentos
    $sql_pagamentos = "SELECT DATA_PAGAMENTO, VALOR_PAGAMENTO, TIPO_PAGAMENTO 
                       FROM PAGAMENTOS 
                       WHERE ID_ALUNO = :id_aluno 
                       ORDER BY DATA_PAGAMENTO DESC 
                       LIMIT 5";
    
    $stmt_pagamentos = $conn->prepare($sql_pagamentos);
    $stmt_pagamentos->bindParam(':id_aluno', $id_aluno, PDO::PARAM_INT);
    $stmt_pagamentos->execute();
    $pagamentos = $stmt_pagamentos->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatar dados
    $data_nascimento = date('d/m/Y', strtotime($aluno['NASCIMENTO']));
    $data_cadastro = date('M/Y', strtotime($aluno['CRIADO_EM']));
    $valor_plano = number_format($aluno['VALOR'], 2, ',', '.');
    $nome_unidade = $unidade ? htmlspecialchars($unidade['NOME_UNIDADE']) : 'Não cadastrada';
    
} catch (PDOException $e) {
    error_log("Erro PDO: " . $e->getMessage());
    die("Erro ao processar dados. Tente novamente.");
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Conta - Tech Fit</title>
    <link rel="stylesheet" href="conta.css">
</head>
<body>
    <!-- ================================================================================= -->
    <!-- CABEÇALHO -->
    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="../../logo.png" alt="Tech Fit">
            </div>
            <h1>Tech <span class="color-accent">Fit</span></h1>
        </div>
        <nav>
            <ul>
                <li><a href="../index.php">Início</a></li>
                <li><a href="../AULAS/aulas.php">Aulas</a></li>
                <li><a href="../PLANOS/plano.php">Planos</a></li>
                <li><a href="../MODALIDADES/modalidades.php">Modalidades</a></li>
                <li><a href="../UNIDADES/unidades.php">Unidades</a></li>
                <li id="login"><a href="../../PAINEL VISITANTE/registro/logout.php">Sair</a></li>
            </ul>
        </nav>
    </header>
    <!-- ================================================================================= -->

    <!-- Conteúdo Principal -->
    <main class="minha-conta-container">
        <!-- Cabeçalho da Página -->
        <section class="page-header">
            <h1>Minha Conta</h1>
            <p>Gerencie suas informações e acompanhe seu progresso</p>
        </section>

        <div class="account-layout">
            <!-- Sidebar de Navegação -->
            <aside class="account-sidebar">
                <div class="user-profile">
                    <div class="avatar">
                        <span>👤</span>
                    </div>
                    <h3><?php echo htmlspecialchars($aluno['NOME']); ?></h3>
                    <p>Plano: <span class="plan-type"><?php echo htmlspecialchars($aluno['NOME_PLANO']); ?></span></p>
                    <p class="member-since">Membro desde: <?php echo htmlspecialchars($data_cadastro); ?></p>
                </div>
                
                <nav class="sidebar-nav">
                    <a href="#perfil" class="nav-item active">
                        <span class="nav-icon">👤</span>
                        <span>Meu Perfil</span>
                    </a>
                    <a href="#aulas" class="nav-item">
                        <span class="nav-icon">📅</span>
                        <span>Minhas Aulas</span>
                    </a>
                    <a href="#progresso" class="nav-item">
                        <span class="nav-icon">📊</span>
                        <span>Meu Progresso</span>
                    </a>
                    <a href="#pagamentos" class="nav-item">
                        <span class="nav-icon">💰</span>
                        <span>Pagamentos</span>
                    </a>
                    <a href="#configuracoes" class="nav-item">
                        <span class="nav-icon">⚙️</span>
                        <span>Configurações</span>
                    </a>
                </nav>
            </aside>

            <!-- Conteúdo Principal -->
            <section class="account-content">
                <!-- Seção: Meu Perfil -->
                <div id="perfil" class="content-section active">
                    <h2>Meu Perfil</h2>
                    <div class="profile-card">
                        <div class="profile-header">
                            <div class="avatar-large">
                                <span>👤</span>
                                <button class="edit-avatar">📷</button>
                            </div>
                            <div class="profile-info">
                                <h3><?php echo htmlspecialchars($aluno['NOME']); ?></h3>
                                <p class="member-id">ID: TF<?php echo str_pad($aluno['ID_ALUNO'], 6, '0', STR_PAD_LEFT); ?></p>
                                <div class="status-badge <?php echo strtolower($aluno['STATUS_ALUNO']); ?>">
                                    <?php echo htmlspecialchars($aluno['STATUS_ALUNO']); ?>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-details">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Email</label>
                                    <p><?php echo htmlspecialchars($aluno['EMAIL']); ?></p>
                                </div>
                                <div class="detail-item">
                                    <label>Telefone</label>
                                    <p><?php echo htmlspecialchars($aluno['TELEFONE'] ?? 'Não cadastrado'); ?></p>
                                </div>
                                <div class="detail-item">
                                    <label>Data de Nascimento</label>
                                    <p><?php echo htmlspecialchars($data_nascimento); ?></p>
                                </div>
                                <div class="detail-item">
                                    <label>CPF</label>
                                    <p><?php echo htmlspecialchars($aluno['CPF']); ?></p>
                                </div>
                                <div class="detail-item">
                                    <label>Unidade Principal</label>
                                    <p><?php echo $nome_unidade; ?></p>
                                </div>
                                <div class="detail-item">
                                    <label>Plano Atual</label>
                                    <p><?php echo htmlspecialchars($aluno['NOME_PLANO']); ?> - R$ <?php echo $valor_plano; ?>/mês</p>
                                </div>
                                <div class="detail-item">
                                    <label>Sexo</label>
                                    <p>
                                        <?php 
                                        $sexo_labels = [
                                            'MASCULINO' => 'Masculino',
                                            'FEMININO' => 'Feminino',
                                            'OUTRO' => 'Outro',
                                            'NAO_DECLARAR' => 'Não declarado'
                                        ];
                                        echo $sexo_labels[$aluno['SEXO']] ?? 'Não informado';
                                        ?>
                                    </p>
                                </div>
                                <div class="detail-item">
                                    <label>Endereço</label>
                                    <p><?php echo htmlspecialchars($aluno['ENDERECO'] ?? 'Não cadastrado'); ?></p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-actions">
                            <button class="btn-primary" onclick="window.location.href='editar_perfil.php'">Editar Perfil</button>
                            <button class="btn-secondary" onclick="window.location.href='alterar_senha.php'">Alterar Senha</button>
                        </div>
                    </div>
                </div>

                <!-- Seção: Minhas Aulas -->
                <div id="aulas" class="content-section">
                    <h2>Minhas Aulas Agendadas</h2>
                    
                    <div class="classes-summary">
                        <div class="summary-card">
                            <div class="summary-icon">📅</div>
                            <div class="summary-info">
                                <h4>Próxima Aula</h4>
                                <p>
                                    <?php if (!empty($aulas_agendadas)): ?>
                                        <?php 
                                        $proxima_aula = $aulas_agendadas[0];
                                        echo htmlspecialchars($proxima_aula['NOME_AULA']) . ' - ' . 
                                             htmlspecialchars($proxima_aula['DIA_SEMANA']) . ' ' . 
                                             date('H:i', strtotime($proxima_aula['HORARIO_INICIO']));
                                        ?>
                                    <?php else: ?>
                                        Nenhuma aula agendada
                                    <?php endif; ?>
                                </p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon">✅</div>
                            <div class="summary-info">
                                <h4>Aulas Agendadas</h4>
                                <p><?php echo count($aulas_agendadas); ?> aulas</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon">🎯</div>
                            <div class="summary-info">
                                <h4>Modalidades</h4>
                                <p>
                                    <?php 
                                    $modalidades = array_unique(array_column($aulas_agendadas, 'NOME_MODALIDADE'));
                                    echo count($modalidades) > 0 ? implode(', ', $modalidades) : 'Nenhuma';
                                    ?>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="upcoming-classes">
                        <h3>Minhas Aulas</h3>
                        <div class="class-list">
                            <?php if (!empty($aulas_agendadas)): ?>
                                <?php foreach ($aulas_agendadas as $aula): ?>
                                    <div class="class-item">
                                        <div class="class-info">
                                            <h4><?php echo htmlspecialchars($aula['NOME_AULA']); ?></h4>
                                            <p>
                                                <?php 
                                                $dias_semana = [
                                                    'DOM' => 'Domingo',
                                                    'SEG' => 'Segunda',
                                                    'TER' => 'Terça',
                                                    'QUA' => 'Quarta',
                                                    'QUI' => 'Quinta',
                                                    'SEX' => 'Sexta',
                                                    'SAB' => 'Sábado'
                                                ];
                                                echo $dias_semana[$aula['DIA_SEMANA']] . ' - ' . 
                                                     date('H:i', strtotime($aula['HORARIO_INICIO'])) . ' às ' . 
                                                     date('H:i', strtotime($aula['HORARIO_INICIO']) + $aula['DURACAO_MINUTOS'] * 60);
                                                ?>
                                            </p>
                                            <span class="instructor">
                                                <?php 
                                                echo $aula['NOME_FUNCIONARIO'] ? 
                                                    'Prof. ' . htmlspecialchars($aula['NOME_FUNCIONARIO']) : 
                                                    'Professor não definido';
                                                ?>
                                            </span>
                                            <span class="modalidade-badge">
                                                <?php echo htmlspecialchars($aula['NOME_MODALIDADE']); ?>
                                            </span>
                                        </div>
                                        <div class="class-actions">
                                            <button class="btn-small primary">Ver detalhes</button>
                                            <button class="btn-small secondary">Cancelar</button>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="no-classes">
                                    <p>Você não está inscrito em nenhuma aula. <a href="../AULAS/aulas.php">Inscreva-se agora!</a></p>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <!-- Seção: Meu Progresso -->
                <div id="progresso" class="content-section">
                    <h2>Meu Progresso</h2>
                    
                    <div class="progress-stats">
                        <div class="stat-card">
                            <div class="stat-value">
                                <?php echo "---"; ?><span>kg</span>
                            </div>
                            <div class="stat-label">Peso Atual</div>
                            <div class="stat-trend positive">--</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">
                                <?php echo "---"; ?><span>%</span>
                            </div>
                            <div class="stat-label">Frequência</div>
                            <div class="stat-trend neutral">--</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">
                                <?php echo count($aulas_agendadas); ?><span>aulas</span>
                            </div>
                            <div class="stat-label">Total Inscrito</div>
                            <div class="stat-trend positive">--</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">
                                <?php 
                                $cadastro = new DateTime($aluno['CRIADO_EM']);
                                $hoje = new DateTime();
                                $dias = $hoje->diff($cadastro)->days;
                                echo $dias;
                                ?><span>dias</span>
                            </div>
                            <div class="stat-label">Como membro</div>
                            <div class="stat-trend neutral">+<?php echo $dias; ?></div>
                        </div>
                    </div>

                    <div class="progress-chart">
                        <h3>Resumo de Atividades</h3>
                        <div class="chart-placeholder">
                            <div class="chart-icon">📊</div>
                            <p>
                                <?php if (!empty($aulas_agendadas)): ?>
                                    Você está inscrito em <strong><?php echo count($aulas_agendadas); ?> aulas</strong><br>
                                    em <strong><?php echo count($modalidades); ?> modalidades</strong> diferentes
                                <?php else: ?>
                                    Comece suas atividades! Inscreva-se em aulas para acompanhar seu progresso.
                                <?php endif; ?>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Seção: Pagamentos -->
                <div id="pagamentos" class="content-section">
                    <h2>Pagamentos</h2>
                    
                    <div class="payment-info">
                        <div class="payment-card">
                            <h3>Plano Atual</h3>
                            <div class="plan-details">
                                <div class="plan-name"><?php echo htmlspecialchars($aluno['NOME_PLANO']); ?></div>
                                <div class="plan-price">R$ <?php echo $valor_plano; ?><span>/mês</span></div>
                                <div class="plan-status <?php echo strtolower($aluno['STATUS_ALUNO']); ?>">
                                    <?php echo htmlspecialchars($aluno['STATUS_ALUNO']); ?>
                                </div>
                            </div>
                            <div class="next-payment">
                                <p>Próximo vencimento: <strong>
                                    <?php 
                                    $proximo = date('d/m/Y', strtotime($aluno['CRIADO_EM'] . ' +1 month'));
                                    echo $proximo;
                                    ?>
                                </strong></p>
                            </div>
                        </div>

                        <div class="payment-history">
                            <h3>Histórico de Pagamentos</h3>
                            <div class="payment-list">
                                <?php if (!empty($pagamentos)): ?>
                                    <?php foreach ($pagamentos as $pagamento): ?>
                                        <div class="payment-item">
                                            <div class="payment-date">
                                                <?php echo date('d/m/Y', strtotime($pagamento['DATA_PAGAMENTO'])); ?>
                                            </div>
                                            <div class="payment-amount">
                                                R$ <?php echo number_format($pagamento['VALOR_PAGAMENTO'], 2, ',', '.'); ?>
                                            </div>
                                            <div class="payment-type">
                                                <?php echo htmlspecialchars($pagamento['TIPO_PAGAMENTO']); ?>
                                            </div>
                                            <div class="payment-status paid">
                                                Pago
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <div class="no-payments">
                                        <p>Nenhum pagamento registrado.</p>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Seção: Configurações -->
                <div id="configuracoes" class="content-section">
                    <h2>Configurações</h2>
                    
                    <div class="settings-grid">
                        <div class="setting-item">
                            <h4>🔔 Notificações</h4>
                            <p>Receber lembretes de aulas</p>
                            <label class="toggle">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <h4>📧 Comunicações</h4>
                            <p>Receber novidades e promoções</p>
                            <label class="toggle">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <h4>🔒 Privacidade</h4>
                            <p>Configurar visibilidade do perfil</p>
                            <button class="btn-small secondary">Configurar</button>
                        </div>
                        <div class="setting-item">
                            <h4>📱 Dados Pessoais</h4>
                            <p>Atualizar informações cadastrais</p>
                            <button class="btn-small secondary" onclick="window.location.href='editar_perfil.php'">Editar</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- ================================================================================= -->
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

<!-- Modal de Edição de Perfil -->
<div id="editModal" class="edit-modal-overlay">
    <div class="edit-modal">
        <div class="modal-header">
            <h3>Editar Perfil</h3>
            <button class="modal-close">&times;</button>
        </div>
        
        <form id="editProfileForm" class="modal-form">
            <div id="modalMessage" class="modal-message"></div>
            
            <div class="form-group">
                <label for="edit_nome">Nome Completo *</label>
                <input type="text" id="edit_nome" name="nome" value="<?php echo htmlspecialchars($aluno['NOME']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="edit_email">E-mail *</label>
                <input type="email" id="edit_email" name="email" value="<?php echo htmlspecialchars($aluno['EMAIL']); ?>" required readonly disabled>
                <small class="form-help">Para alterar o e-mail, entre em contato com a unidade.</small>
            </div>
            
            <div class="form-group">
                <label for="edit_telefone">Telefone</label>
                <input type="tel" id="edit_telefone" name="telefone" value="<?php echo htmlspecialchars($aluno['TELEFONE'] ?? ''); ?>" placeholder="(99) 99999-9999">
            </div>
            
            <div class="form-group">
                <label for="edit_endereco">Endereço</label>
                <textarea id="edit_endereco" name="endereco" rows="3"><?php echo htmlspecialchars($aluno['ENDERECO'] ?? ''); ?></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit_sexo">Sexo</label>
                    <select id="edit_sexo" name="sexo">
                        <option value="">Selecione</option>
                        <option value="MASCULINO" <?php echo $aluno['SEXO'] == 'MASCULINO' ? 'selected' : ''; ?>>Masculino</option>
                        <option value="FEMININO" <?php echo $aluno['SEXO'] == 'FEMININO' ? 'selected' : ''; ?>>Feminino</option>
                        <option value="OUTRO" <?php echo $aluno['SEXO'] == 'OUTRO' ? 'selected' : ''; ?>>Outro</option>
                        <option value="NAO_DECLARAR" <?php echo $aluno['SEXO'] == 'NAO_DECLARAR' ? 'selected' : ''; ?>>Prefiro não declarar</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit_nascimento">Data de Nascimento</label>
                    <input type="date" id="edit_nascimento" name="nascimento" value="<?php echo $aluno['NASCIMENTO']; ?>">
                </div>
            </div>
            
            <div class="form-actions">
    <input type="hidden" name="action" value="update_profile">
    <input type="hidden" name="id_aluno" value="<?php echo $id_aluno; ?>">
    <button type="button" class="btn-secondary modal-close">Cancelar</button>
    <button type="submit" class="btn-primary">Salvar Alterações</button>
</div>
        </form>
    </div>
</div>

    <script src="conta.js"></script>
</body>
</html>