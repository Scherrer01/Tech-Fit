<?php
// aulas.php
session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['id_aluno'])) {
    header('Location: ../../PAINEL VISITANTE/registro/login.php');
    exit();
}

$id_aluno = $_SESSION['id_aluno'];

// Incluir a classe Database
require_once '../../database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    die("Erro na conexão com o banco de dados.");
}

// ==============================================================
// PROCESSAR AGENDAMENTO DE AULA VIA AJAX
// ==============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'agendar_aula') {
    
    $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
    
    try {
        // Validar dados
        $required_fields = ['nome_aula', 'horario', 'dia_semana', 'id_aluno'];
        foreach ($required_fields as $field) {
            if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
                throw new Exception("Campo obrigatório '$field' não preenchido.");
            }
        }
        
        if ($_POST['id_aluno'] != $id_aluno) {
            throw new Exception("Acesso não autorizado.");
        }
        
        // Buscar ID da aula pelo nome
        $nome_aula = trim($_POST['nome_aula']);
        $dia_semana = trim($_POST['dia_semana']);
        $horario = trim($_POST['horario']);
        
        $sql_aula = "SELECT ID_AULA FROM AULAS WHERE NOME_AULA = :nome_aula AND DIA_SEMANA = :dia_semana AND HORARIO_INICIO = :horario LIMIT 1";
        $stmt_aula = $conn->prepare($sql_aula);
        $stmt_aula->bindParam(':nome_aula', $nome_aula);
        $stmt_aula->bindParam(':dia_semana', $dia_semana);
        $stmt_aula->bindParam(':horario', $horario);
        $stmt_aula->execute();
        
        if ($stmt_aula->rowCount() === 0) {
            throw new Exception("Aula não encontrada.");
        }
        
        $aula = $stmt_aula->fetch(PDO::FETCH_ASSOC);
        $id_aula = $aula['ID_AULA'];
        
        // Verificar se já está agendado
        $sql_verificar = "SELECT COUNT(*) as total FROM PARTICIPAM WHERE ID_AULA = :id_aula AND ID_ALUNO = :id_aluno";
        $stmt_verificar = $conn->prepare($sql_verificar);
        $stmt_verificar->bindParam(':id_aula', $id_aula);
        $stmt_verificar->bindParam(':id_aluno', $id_aluno);
        $stmt_verificar->execute();
        $result = $stmt_verificar->fetch(PDO::FETCH_ASSOC);
        
        if ($result['total'] > 0) {
            throw new Exception("Você já está inscrito nesta aula.");
        }
        
        // Verificar vagas disponíveis
        $sql_vagas = "SELECT VAGAS FROM AULAS WHERE ID_AULA = :id_aula";
        $stmt_vagas = $conn->prepare($sql_vagas);
        $stmt_vagas->bindParam(':id_aula', $id_aula);
        $stmt_vagas->execute();
        $vaga = $stmt_vagas->fetch(PDO::FETCH_ASSOC);
        
        $vagas_ocupadas = "SELECT COUNT(*) as ocupadas FROM PARTICIPAM WHERE ID_AULA = :id_aula";
        $stmt_ocupadas = $conn->prepare($vagas_ocupadas);
        $stmt_ocupadas->bindParam(':id_aula', $id_aula);
        $stmt_ocupadas->execute();
        $ocupadas = $stmt_ocupadas->fetch(PDO::FETCH_ASSOC);
        
        if ($ocupadas['ocupadas'] >= $vaga['VAGAS']) {
            throw new Exception("Não há vagas disponíveis para esta aula.");
        }
        
        // Agendar a aula
        $sql_agendar = "INSERT INTO PARTICIPAM (ID_AULA, ID_ALUNO, DATA_PARTICIPACAO) VALUES (:id_aula, :id_aluno, NOW())";
        $stmt_agendar = $conn->prepare($sql_agendar);
        $stmt_agendar->bindParam(':id_aula', $id_aula);
        $stmt_agendar->bindParam(':id_aluno', $id_aluno);
        
        if ($stmt_agendar->execute()) {
            $response = [
                'success' => true,
                'message' => 'Aula agendada com sucesso!',
                'data' => [
                    'nome_aula' => $nome_aula,
                    'dia_semana' => $dia_semana,
                    'horario' => $horario
                ]
            ];
        } else {
            throw new Exception("Erro ao agendar aula.");
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

// ==============================================================
// BUSCAR AULAS AGENDADAS PELO ALUNO
// ==============================================================
try {
    $sql_aulas_agendadas = "SELECT 
        a.NOME_AULA,
        a.DIA_SEMANA,
        a.HORARIO_INICIO,
        a.DURACAO_MINUTOS,
        m.NOME_MODALIDADE,
        f.NOME_FUNCIONARIO as INSTRUTOR,
        p.DATA_PARTICIPACAO
    FROM PARTICIPAM p
    JOIN AULAS a ON p.ID_AULA = a.ID_AULA
    JOIN MODALIDADES m ON a.ID_MODALIDADE = m.ID_MODALIDADE
    LEFT JOIN FUNCIONARIOS f ON a.ID_INSTRUTOR = f.ID_FUNCIONARIO
    WHERE p.ID_ALUNO = :id_aluno
    ORDER BY p.DATA_PARTICIPACAO DESC";
    
    $stmt_agendadas = $conn->prepare($sql_aulas_agendadas);
    $stmt_agendadas->bindParam(':id_aluno', $id_aluno);
    $stmt_agendadas->execute();
    $aulas_agendadas = $stmt_agendadas->fetchAll(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    $aulas_agendadas = [];
    error_log("Erro ao buscar aulas agendadas: " . $e->getMessage());
}

// ==============================================================
// BUSCAR TODAS AS AULAS DISPONÍVEIS
// ==============================================================
try {
    // Buscar aulas do banco de dados
    $sql_aulas = "SELECT 
        a.*, 
        m.NOME_MODALIDADE, 
        f.NOME_FUNCIONARIO, 
        u.NOME_UNIDADE,
        (SELECT COUNT(*) FROM PARTICIPAM p WHERE p.ID_AULA = a.ID_AULA) as inscritos,
        (SELECT COUNT(*) FROM PARTICIPAM p2 WHERE p2.ID_AULA = a.ID_AULA AND p2.ID_ALUNO = :id_aluno) as aluno_inscrito
    FROM AULAS a
    JOIN MODALIDADES m ON a.ID_MODALIDADE = m.ID_MODALIDADE
    LEFT JOIN FUNCIONARIOS f ON a.ID_INSTRUTOR = f.ID_FUNCIONARIO
    LEFT JOIN UNIDADES u ON a.ID_UNIDADE = u.ID_UNIDADE
    ORDER BY 
        FIELD(a.DIA_SEMANA, 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'),
        a.HORARIO_INICIO";
    
    $stmt_aulas = $conn->prepare($sql_aulas);
    $stmt_aulas->bindParam(':id_aluno', $id_aluno);
    $stmt_aulas->execute();
    $aulas_disponiveis = $stmt_aulas->fetchAll(PDO::FETCH_ASSOC);
    
    // Agrupar aulas por nome para exibição
    $aulas_agrupadas = [];
    foreach ($aulas_disponiveis as $aula) {
        $nome_aula = $aula['NOME_AULA'];
        if (!isset($aulas_agrupadas[$nome_aula])) {
            $aulas_agrupadas[$nome_aula] = [
                'NOME_AULA' => $aula['NOME_AULA'],
                'NOME_MODALIDADE' => $aula['NOME_MODALIDADE'],
                'NOME_FUNCIONARIO' => $aula['NOME_FUNCIONARIO'],
                'NOME_UNIDADE' => $aula['NOME_UNIDADE'],
                'DURACAO_MINUTOS' => $aula['DURACAO_MINUTOS'],
                'horarios' => []
            ];
        }
        
        $aulas_agrupadas[$nome_aula]['horarios'][] = [
            'DIA_SEMANA' => $aula['DIA_SEMANA'],
            'HORARIO_INICIO' => $aula['HORARIO_INICIO'],
            'VAGAS' => $aula['VAGAS'],
            'INSCRITOS' => $aula['inscritos'],
            'ALUNO_INSCRITO' => $aula['aluno_inscrito'] > 0,
            'ID_AULA' => $aula['ID_AULA']
        ];
    }
    
} catch (PDOException $e) {
    error_log("Erro PDO: " . $e->getMessage());
    die("Erro ao carregar aulas.");
}

// Mapeamento de dias da semana
$dias_semana = [
    'DOM' => 'Domingo',
    'SEG' => 'Segunda',
    'TER' => 'Terça',
    'QUA' => 'Quarta',
    'QUI' => 'Quinta',
    'SEX' => 'Sexta',
    'SAB' => 'Sábado'
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aulas - Tech Fit</title>
    <link rel="stylesheet" href="aulas.css">
    <style>
        /* Estilos específicos para o sistema de agendamento */
        .schedule-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-width: 100px;
        }

        .schedule-btn.agendar {
            background-color: #FF2626;
            color: white;
        }

        .schedule-btn.agendar:hover:not(:disabled) {
            background-color: #e02020;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 38, 38, 0.3);
        }

        .schedule-btn.agendado {
            background-color: #4CAF50 !important;
            color: white !important;
            cursor: default !important;
        }

        .schedule-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }

        .vagas-info {
            font-size: 12px;
            color: #b0b0b0;
            margin: 5px 0;
            display: block;
        }

        .schedule-item {
            padding: 10px 0;
            border-bottom: 1px solid #333;
        }

        .schedule-item:last-child {
            border-bottom: none;
        }

        /* Status das vagas */
        .vagas-poucas {
            color: #FF9800;
        }

        .vagas-lotado {
            color: #F44336;
        }

        /* Filtros */
        .filter-btn {
            padding: 8px 16px;
            background: #282828;
            border: 1px solid #444;
            color: #b0b0b0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .filter-btn.active {
            background-color: #FF2626;
            color: white;
            border-color: #FF2626;
        }

        .filter-btn:hover:not(.active) {
            background-color: #333;
            color: white;
        }

        /* Notificações */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: notificationSlideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification.success {
            background-color: #4CAF50;
        }

        .notification.error {
            background-color: #F44336;
        }

        @keyframes notificationSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        /* Seção de aulas agendadas */
        .scheduled-classes-section {
            margin-bottom: 40px;
        }

        .scheduled-classes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .scheduled-class-card {
            background: #282828;
            border-radius: 10px;
            padding: 20px;
            border: 1px solid #444;
            transition: transform 0.3s ease;
        }

        .scheduled-class-card:hover {
            transform: translateY(-5px);
            border-color: #FF2626;
        }

        .class-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .status-agendada {
            background-color: #2196F3;
            color: white;
        }

        .status-realizada {
            background-color: #4CAF50;
            color: white;
        }

        /* Modal de confirmação */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .modal-content {
            background: #282828;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            border: 1px solid #444;
        }

        .modal-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: flex-end;
        }

        .modal-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .modal-btn.confirm {
            background-color: #FF2626;
            color: white;
        }

        .modal-btn.cancel {
            background-color: #444;
            color: #b0b0b0;
        }

        .modal-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }

        /* Contador de aulas */
        .class-counter {
            background: #FF2626;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 5px;
        }

        /* Esconde seções por padrão */
        .section-hidden {
            display: none;
        }
    </style>
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
                <li><a href="/PAINEL ALUNO/index.php">Início</a></li>
                <li><a href="/PAINEL ALUNO/MODALIDADES/modalidades.php">Modalidades</a></li>
                <li><a href="/PAINEL ALUNO/UNIDADES/unidades.php">Unidades</a></li>
                <li><a href="/PAINEL ALUNO/PLANOS/plano.php">Planos</a></li>
                <li id="conta"><a href="/PAINEL ALUNO/MINHA CONTA/conta.php">Minha conta</a></li>
            </ul>
        </nav>
    </header>
    <!-- ================================================================================= -->

    <!-- Notificação -->
    <div id="notification" class="notification" style="display: none;"></div>

    <!-- Modal de confirmação -->
    <div id="modalOverlay" class="modal-overlay">
        <div class="modal-content">
            <h3 id="modalTitle">Confirmar agendamento</h3>
            <p id="modalMessage">Tem certeza que deseja agendar esta aula?</p>
            <div class="modal-buttons">
                <button id="modalCancel" class="modal-btn cancel">Cancelar</button>
                <button id="modalConfirm" class="modal-btn confirm">Confirmar</button>
            </div>
        </div>
    </div>

    <!-- Conteúdo Principal -->
    <main class="aulas-container">
        <!-- Cabeçalho da Página -->
        <section class="page-header">
            <h1>Aulas Tech Fit</h1>
            <p>Acompanhe suas aulas agendadas e histórico de treinos</p>
        </section>

        <!-- Filtros e Busca -->
        <section class="filters-section">
            <div class="filters-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Buscar aula...">
                    <button id="searchButton">🔍</button>
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="todas">Todas</button>
                    <button class="filter-btn" data-filter="agendadas">
                        Agendadas <span class="class-counter"><?php echo count($aulas_agendadas); ?></span>
                    </button>
                    <button class="filter-btn" data-filter="disponiveis">Disponíveis</button>
                </div>
            </div>
        </section>

        <!-- Aulas Agendadas -->
        <section id="agendadasSection" class="scheduled-classes-section section-hidden">
            <h2 style="color: white;">Suas Aulas Agendadas</h2>
            
            <?php if (count($aulas_agendadas) > 0): ?>
            <div class="scheduled-classes-grid">
                <?php foreach ($aulas_agendadas as $aula): 
                    $data_participacao = new DateTime($aula['DATA_PARTICIPACAO']);
                    $hoje = new DateTime();
                    $status = ($data_participacao < $hoje) ? 'realizada' : 'agendada';
                ?>
                <div class="scheduled-class-card">
                    <span class="class-status status-<?php echo $status; ?>">
                        <?php echo ucfirst($status); ?>
                    </span>
                    <h3><?php echo htmlspecialchars($aula['NOME_AULA']); ?></h3>
                    <p><?php echo htmlspecialchars($aula['NOME_MODALIDADE']); ?></p>
                    
                    <div class="class-details">
                        <p><strong>Dia:</strong> <?php echo $dias_semana[$aula['DIA_SEMANA']] ?? $aula['DIA_SEMANA']; ?></p>
                        <p><strong>Horário:</strong> <?php echo date('H:i', strtotime($aula['HORARIO_INICIO'])); ?></p>
                        <p><strong>Duração:</strong> <?php echo $aula['DURACAO_MINUTOS']; ?> min</p>
                        <p><strong>Instrutor:</strong> <?php echo htmlspecialchars($aula['INSTRUTOR'] ?? 'Não definido'); ?></p>
                        <p><strong>Agendado em:</strong> <?php echo date('d/m/Y H:i', strtotime($aula['DATA_PARTICIPACAO'])); ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php else: ?>
            <div class="no-classes" style="text-align: center; padding: 40px; color: #b0b0b0;">
                <p>Você ainda não tem aulas agendadas.</p>
                <p style="margin-top: 10px;">Explore as aulas disponíveis abaixo e faça seu primeiro agendamento!</p>
            </div>
            <?php endif; ?>
        </section>

        <!-- Aulas Disponíveis -->
        <section id="disponiveisSection" class="available-classes">
            <h2 style="color: white;">Aulas Disponíveis</h2>
            <div class="classes-grid">
                <?php foreach ($aulas_agrupadas as $nome_aula => $dados_aula): 
                    // Determinar classe CSS baseada na modalidade
                    $modalidade_class = strtolower(preg_replace('/[^a-zA-Z0-9]/', '-', $dados_aula['NOME_MODALIDADE']));
                ?>
                <div class="class-card available" data-modalidade="<?php echo htmlspecialchars($dados_aula['NOME_MODALIDADE']); ?>">
                    <div class="class-image <?php echo $modalidade_class; ?>"></div>
                    <div class="class-info">
                        <h3><?php echo htmlspecialchars($nome_aula); ?></h3>
                        <p><?php echo htmlspecialchars($dados_aula['NOME_MODALIDADE']); ?> com monitoramento de performance</p>
                        <div class="class-meta">
                            <span>⏱️ <?php echo $dados_aula['DURACAO_MINUTOS']; ?>min</span>
                            <span>👨‍🏫 <?php echo htmlspecialchars($dados_aula['NOME_FUNCIONARIO'] ?? 'Professor não definido'); ?></span>
                            <?php if (!empty($dados_aula['NOME_UNIDADE'])): ?>
                            <span>🏢 <?php echo htmlspecialchars($dados_aula['NOME_UNIDADE']); ?></span>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="class-schedule">
                        <?php foreach ($dados_aula['horarios'] as $horario): 
                            $dia_formatado = $dias_semana[$horario['DIA_SEMANA']] ?? $horario['DIA_SEMANA'];
                            $vagas_disponiveis = $horario['VAGAS'] - $horario['INSCRITOS'];
                            $vaga_class = ($vagas_disponiveis <= 2) ? 'vagas-poucas' : (($vagas_disponiveis <= 0) ? 'vagas-lotado' : '');
                        ?>
                        <div class="schedule-item" data-aula-id="<?php echo $horario['ID_AULA']; ?>">
                            <span><?php echo $dia_formatado; ?> - <?php echo date('H:i', strtotime($horario['HORARIO_INICIO'])); ?></span>
                            <span class="vagas-info <?php echo $vaga_class; ?>">
                                Vagas: <?php echo $vagas_disponiveis; ?>/<?php echo $horario['VAGAS']; ?>
                            </span>
                            <?php if ($horario['ALUNO_INSCRITO']): ?>
                                <button class="schedule-btn agendado" disabled>✓ Agendada</button>
                            <?php else: ?>
                                <button class="schedule-btn agendar" 
                                        data-nome-aula="<?php echo htmlspecialchars($nome_aula); ?>"
                                        data-dia-semana="<?php echo $horario['DIA_SEMANA']; ?>"
                                        data-horario="<?php echo $horario['HORARIO_INICIO']; ?>"
                                        data-id-aluno="<?php echo $id_aluno; ?>"
                                        <?php echo ($vagas_disponiveis <= 0) ? 'disabled' : ''; ?>>
                                    <?php echo ($vagas_disponiveis <= 0) ? 'Lotado' : 'Agendar'; ?>
                                </button>
                            <?php endif; ?>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endforeach; ?>
                
                <?php if (empty($aulas_agrupadas)): ?>
                <div class="no-classes">
                    <p>Não há aulas disponíveis no momento.</p>
                </div>
                <?php endif; ?>
            </div>
        </section>
    </main>

    <!-- ================================================================================= -->
    <!-- FOOTER -->
    <footer class="footer">
        <!-- ... código do footer ... -->
    </footer>

    <script src="aulas.js"></script>
    <script src="pesquisa.js"></script>
</body>
</html>