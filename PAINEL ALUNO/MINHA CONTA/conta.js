// ==============================================================
// MINHA CONTA - TECH FIT
// ==============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Dados do usuário (simulados)
    const userData = {
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '(19) 98765-4321',
        dataNascimento: '15/03/1990',
        cpf: '123.456.789-00',
        unidade: 'Tech Fit Centro - Campinas',
        plano: 'Black Tech - R$ 199,90/mês',
        memberId: 'TF202400123',
        memberSince: 'Jan/2024'
    };

    // Dados das aulas (simulados)
    const aulasData = {
        proximaAula: {
            nome: 'Cardio Tech',
            horario: 'Hoje 18:00',
            professor: 'Prof. Carlos'
        },
        aulasRealizadas: 12,
        frequencia: '85%',
        proximasAulas: [
            {
                nome: 'Cardio Tech',
                data: 'Hoje - 18:00 às 18:45',
                professor: 'Prof. Carlos'
            },
            {
                nome: 'Força & Potência',
                data: 'Amanhã - 19:00 às 20:00',
                professor: 'Prof. Ana'
            }
        ]
    };

    // Dados de progresso (simulados)
    const progressoData = {
        peso: { atual: 68, variacao: -2 },
        gordura: { atual: 15, variacao: -3 },
        cintura: { atual: 42, variacao: -5 },
        sequencia: { atual: 28, variacao: 5 }
    };

    // Dados de pagamentos (simulados)
    const pagamentosData = {
        planoAtual: 'Black Tech',
        valor: 'R$ 199,90',
        status: 'Ativo',
        proximoPagamento: '10/04/2024',
        historico: [
            { data: '10/03/2024', valor: 'R$ 199,90', status: 'Pago' },
            { data: '10/02/2024', valor: 'R$ 199,90', status: 'Pago' },
            { data: '10/01/2024', valor: 'R$ 199,90', status: 'Pago' }
        ]
    };

    // ==============================================================
    // INICIALIZAÇÃO
    // ==============================================================

    function init() {
        setupNavigation();
        loadUserData();
        loadAulasData();
        loadProgressoData();
        loadPagamentosData();
        setupEventListeners();
    }

    // ==============================================================
    // NAVEGAÇÃO ENTRE SEÇÕES
    // ==============================================================

    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove classe active de todos os itens
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Adiciona classe active ao item clicado
                this.classList.add('active');
                
                // Mostra a seção correspondente
                const targetId = this.getAttribute('href').substring(1);
                showSection(targetId);
            });
        });
    }

    function showSection(sectionId) {
        // Esconde todas as seções
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostra a seção selecionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Animação de entrada
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetSection.style.transition = 'all 0.3s ease';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // ==============================================================
    // CARREGAMENTO DE DADOS
    // ==============================================================

    function loadUserData() {
        // Atualiza informações do perfil na sidebar
        document.querySelector('.user-profile h3').textContent = userData.nome;
        document.querySelector('.member-since').textContent = `Membro desde: ${userData.memberSince}`;
        
        // Atualiza informações detalhadas do perfil
        document.querySelector('.profile-info h3').textContent = userData.nome;
        document.querySelector('.member-id').textContent = `ID: ${userData.memberId}`;
        
        // Preenche os detalhes do perfil
        const detailItems = {
            'joao.silva@email.com': userData.email,
            '(19) 98765-4321': userData.telefone,
            '15/03/1990': userData.dataNascimento,
            '123.456.789-00': userData.cpf,
            'Tech Fit Centro - Campinas': userData.unidade,
            'Black Tech - R$ 199,90/mês': userData.plano
        };
        
        // Atualiza cada item de detalhe
        document.querySelectorAll('.detail-item p').forEach((p, index) => {
            const keys = Object.keys(detailItems);
            if (keys[index]) {
                p.textContent = detailItems[keys[index]];
            }
        });
    }

    function loadAulasData() {
        // Atualiza resumo de aulas
        document.querySelector('.summary-card:nth-child(1) p').textContent = 
            `${aulasData.proximaAula.nome} - ${aulasData.proximaAula.horario}`;
        
        document.querySelector('.summary-card:nth-child(2) p').textContent = 
            `${aulasData.aulasRealizadas} este mês`;
        
        document.querySelector('.summary-card:nth-child(3) p').textContent = 
            `${aulasData.frequencia} de presença`;
        
        // Atualiza lista de próximas aulas
        const classList = document.querySelector('.class-list');
        classList.innerHTML = '';
        
        aulasData.proximasAulas.forEach(aula => {
            const classItem = document.createElement('div');
            classItem.className = 'class-item';
            classItem.innerHTML = `
                <div class="class-info">
                    <h4>${aula.nome}</h4>
                    <p>${aula.data}</p>
                    <span class="instructor">${aula.professor}</span>
                </div>
                <div class="class-actions">
                    <button class="btn-small primary">${aula.data.includes('Hoje') ? 'Entrar' : 'Lembrar'}</button>
                    <button class="btn-small secondary">Cancelar</button>
                </div>
            `;
            classList.appendChild(classItem);
        });
        
        // Adiciona event listeners para os botões das aulas
        setupAulasEventListeners();
    }

    function loadProgressoData() {
        // Atualiza estatísticas
        document.querySelector('.stat-card:nth-child(1) .stat-value').innerHTML = 
            `${progressoData.peso.atual}<span>kg</span>`;
        document.querySelector('.stat-card:nth-child(1) .stat-trend').textContent = 
            `${progressoData.peso.variacao > 0 ? '+' : ''}${progressoData.peso.variacao}kg`;
        
        document.querySelector('.stat-card:nth-child(2) .stat-value').innerHTML = 
            `${progressoData.gordura.atual}<span>%</span>`;
        document.querySelector('.stat-card:nth-child(2) .stat-trend').textContent = 
            `${progressoData.gordura.variacao > 0 ? '+' : ''}${progressoData.gordura.variacao}%`;
        
        document.querySelector('.stat-card:nth-child(3) .stat-value').innerHTML = 
            `${progressoData.cintura.atual}<span>cm</span>`;
        document.querySelector('.stat-card:nth-child(3) .stat-trend').textContent = 
            `${progressoData.cintura.variacao > 0 ? '+' : ''}${progressoData.cintura.variacao}cm`;
        
        document.querySelector('.stat-card:nth-child(4) .stat-value').innerHTML = 
            `${progressoData.sequencia.atual}<span>dias</span>`;
        document.querySelector('.stat-card:nth-child(4) .stat-trend').textContent = 
            `+${progressoData.sequencia.variacao}`;
    }

    function loadPagamentosData() {
        // Atualiza informações do plano atual
        document.querySelector('.plan-name').textContent = pagamentosData.planoAtual;
        document.querySelector('.plan-price').innerHTML = 
            `${pagamentosData.valor}<span>/mês</span>`;
        document.querySelector('.next-payment strong').textContent = pagamentosData.proximoPagamento;
        
        // Atualiza histórico de pagamentos
        const paymentList = document.querySelector('.payment-list');
        paymentList.innerHTML = '';
        
        pagamentosData.historico.forEach(pagamento => {
            const paymentItem = document.createElement('div');
            paymentItem.className = 'payment-item';
            paymentItem.innerHTML = `
                <div class="payment-date">${pagamento.data}</div>
                <div class="payment-amount">${pagamento.valor}</div>
                <div class="payment-status ${pagamento.status.toLowerCase()}">${pagamento.status}</div>
            `;
            paymentList.appendChild(paymentItem);
        });
    }

    // ==============================================================
    // EVENT LISTENERS
    // ==============================================================

    function setupEventListeners() {
        // Botões de edição do perfil
        document.querySelector('.profile-actions .btn-primary').addEventListener('click', editarPerfil);
        document.querySelector('.profile-actions .btn-secondary').addEventListener('click', alterarSenha);
        
        // Botão de editar avatar
        document.querySelector('.edit-avatar').addEventListener('click', editarAvatar);
        
        // Toggles de configurações
        document.querySelectorAll('.toggle input').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const setting = this.closest('.setting-item').querySelector('h4').textContent;
                console.log(`${setting}: ${this.checked ? 'Ativado' : 'Desativado'}`);
                showNotification(`${setting} ${this.checked ? 'ativado' : 'desativado'} com sucesso!`);
            });
        });
        
        // Botões de configurações
        document.querySelectorAll('.setting-item .btn-small').forEach(btn => {
            btn.addEventListener('click', function() {
                const setting = this.closest('.setting-item').querySelector('h4').textContent;
                showNotification(`Abrindo configurações de ${setting}`);
            });
        });
    }

    function setupAulasEventListeners() {
        // Botões das aulas
        document.querySelectorAll('.class-actions .btn-small.primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const aulaNome = this.closest('.class-item').querySelector('h4').textContent;
                if (this.textContent === 'Entrar') {
                    entrarNaAula(aulaNome);
                } else {
                    lembrarAula(aulaNome);
                }
            });
        });
        
        document.querySelectorAll('.class-actions .btn-small.secondary').forEach(btn => {
            btn.addEventListener('click', function() {
                const aulaNome = this.closest('.class-item').querySelector('h4').textContent;
                cancelarAula(aulaNome);
            });
        });
    }

    // ==============================================================
    // FUNÇÕES DE AÇÃO
    // ==============================================================

    function editarPerfil() {
        showNotification('Abrindo editor de perfil...');
        // Aqui você implementaria a lógica para abrir um modal de edição
        setTimeout(() => {
            showNotification('Perfil atualizado com sucesso!', 'success');
        }, 1000);
    }

    function alterarSenha() {
        showNotification('Abrindo alteração de senha...');
        // Aqui você implementaria a lógica para alterar senha
    }

    function editarAvatar() {
        showNotification('Abrindo seletor de avatar...');
        // Aqui você implementaria a lógica para alterar o avatar
    }

    function entrarNaAula(nomeAula) {
        showNotification(`Entrando na aula: ${nomeAula}`, 'success');
        // Aqui você implementaria a lógica para entrar na aula
    }

    function lembrarAula(nomeAula) {
        showNotification(`Lembrete ativado para: ${nomeAula}`);
        // Aqui você implementaria a lógica para ativar lembrete
    }

    function cancelarAula(nomeAula) {
        if (confirm(`Tem certeza que deseja cancelar a aula "${nomeAula}"?`)) {
            showNotification(`Aula "${nomeAula}" cancelada com sucesso!`, 'warning');
            // Aqui você implementaria a lógica para cancelar a aula
        }
    }

    // ==============================================================
    // FUNÇÕES UTILITÁRIAS
    // ==============================================================

    function showNotification(mensagem, tipo = 'info') {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${tipo}`;
        notification.innerHTML = `
            <span>${mensagem}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#4CAF50' : tipo === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideIn 0.3s ease;
        `;
        
        // Botão de fechar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    // ==============================================================
    // ANIMAÇÕES CSS
    // ==============================================================

    function addCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .stat-card {
                transition: all 0.3s ease;
            }
            
            .class-item {
                transition: all 0.3s ease;
            }
            
            .class-item:hover {
                transform: translateX(5px);
            }
            
            .btn-primary, .btn-secondary {
                transition: all 0.3s ease;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 38, 38, 0.3);
            }
            
            .btn-secondary:hover {
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }

    // ==============================================================
    // INICIALIZAÇÃO FINAL
    // ==============================================================

    // Adiciona animações CSS
    addCSSAnimations();
    
    // Inicializa a aplicação
    init();
    
    console.log('Tech Fit - Minha Conta carregada com sucesso!');
});

// ==============================================================
// FUNÇÕES GLOBAIS (caso precise acessar de outros arquivos)
// ==============================================================

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // Aqui você implementaria a lógica de logout
        window.location.href = '/Login/login.html';
    }
}

function exportarDados() {
    showNotification('Exportando dados do usuário...');
    // Aqui você implementaria a lógica para exportar dados
}

// Função para atualizar dados em tempo real (pode ser chamada por WebSockets, etc.)
function atualizarDadosUsuario(novosDados) {
    Object.assign(userData, novosDados);
    loadUserData();
}