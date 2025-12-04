// ==============================================================
// MINHA CONTA - TECH FIT - FUNCIONALIDADES DE INTERFACE APENAS
// ==============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais - APENAS PARA NAVEGAÇÃO
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    // ==============================================================
    // INICIALIZAÇÃO - APENAS FUNCIONALIDADES DE UI
    // ==============================================================

    function init() {
        setupNavigation();
        setupEventListeners();
        setupAulasEventListeners();
        addCSSAnimations();
        
        console.log('Tech Fit - Interface carregada com sucesso!');
    }

    // ==============================================================
    // NAVEGAÇÃO ENTRE SEÇÕES - APENAS UI
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
                
                // Atualizar URL sem recarregar a página (opcional)
                history.pushState(null, null, `#${targetId}`);
            });
        });
        
        // Verificar hash na URL inicial
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetNav = document.querySelector(`.nav-item[href="#${hash}"]`);
            if (targetNav) {
                navItems.forEach(nav => nav.classList.remove('active'));
                targetNav.classList.add('active');
                showSection(hash);
            }
        }
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
            
            // Animação de entrada suave
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                targetSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 10);
        }
    }

    // ==============================================================
    // EVENT LISTENERS - APENAS PARA INTERAÇÃO
    // ==============================================================

    function setupEventListeners() {
        // Botões de edição do perfil
        const btnEditarPerfil = document.querySelector('.profile-actions .btn-primary');
        const btnAlterarSenha = document.querySelector('.profile-actions .btn-secondary');
        
        if (btnEditarPerfil) {
            btnEditarPerfil.addEventListener('click', editarPerfil);
        }
        
        if (btnAlterarSenha) {
            btnAlterarSenha.addEventListener('click', alterarSenha);
        }
        
        // Botão de editar avatar (se existir)
        const btnEditAvatar = document.querySelector('.edit-avatar');
        if (btnEditAvatar) {
            btnEditAvatar.addEventListener('click', editarAvatar);
        }
        
        // Toggles de configurações
        document.querySelectorAll('.toggle input').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const setting = this.closest('.setting-item').querySelector('h4').textContent;
                showNotification(`${setting} ${this.checked ? 'ativado' : 'desativado'}`, 'info');
                
                // Aqui você poderia fazer uma requisição AJAX para salvar a preferência
                // saveSetting(setting, this.checked);
            });
        });
        
        // Botões de configurações
        document.querySelectorAll('.setting-item .btn-small').forEach(btn => {
            btn.addEventListener('click', function() {
                const setting = this.closest('.setting-item').querySelector('h4').textContent;
                showNotification(`Abrindo configurações de ${setting}`, 'info');
            });
        });
        
        // Botões de ação nas aulas
        setupAulasEventListeners();
    }

    function setupAulasEventListeners() {
        // Botões "Entrar" ou "Lembrar" das aulas
        document.querySelectorAll('.class-actions .btn-small.primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const aulaNome = this.closest('.class-item').querySelector('h4').textContent;
                if (this.textContent.includes('Entrar')) {
                    entrarNaAula(aulaNome);
                } else if (this.textContent.includes('Lembrar')) {
                    lembrarAula(aulaNome);
                } else if (this.textContent.includes('Ver')) {
                    verDetalhesAula(aulaNome);
                }
            });
        });
        
        // Botões "Cancelar" das aulas
        document.querySelectorAll('.class-actions .btn-small.secondary').forEach(btn => {
            btn.addEventListener('click', function() {
                const aulaNome = this.closest('.class-item').querySelector('h4').textContent;
                cancelarAula(aulaNome);
            });
        });
    }

    // ==============================================================
    // FUNÇÕES DE AÇÃO - APENAS NOTIFICAÇÕES/INTERAÇÃO
    // ==============================================================

    function editarPerfil() {
        showNotification('Redirecionando para edição de perfil...', 'info');
        // Aqui você poderia redirecionar para a página de edição
        // window.location.href = 'editar_perfil.php';
    }

    function alterarSenha() {
        showNotification('Redirecionando para alteração de senha...', 'info');
        // Aqui você poderia redirecionar para a página de alteração de senha
        // window.location.href = 'alterar_senha.php';
    }

    function editarAvatar() {
        showNotification('Selecionar nova foto de perfil', 'info');
        // Aqui você poderia abrir um seletor de arquivos
        // const input = document.createElement('input');
        // input.type = 'file';
        // input.accept = 'image/*';
        // input.click();
    }

    function entrarNaAula(nomeAula) {
        showNotification(`Preparando entrada na aula: ${nomeAula}`, 'success');
        // Aqui você poderia iniciar a aula ou redirecionar
    }

    function verDetalhesAula(nomeAula) {
        showNotification(`Mostrando detalhes da aula: ${nomeAula}`, 'info');
        // Aqui você poderia abrir um modal com detalhes
    }

    function lembrarAula(nomeAula) {
        showNotification(`Lembrete ativado para: ${nomeAula}`, 'info');
        // Aqui você poderia ativar notificações no navegador
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Lembrete: ${nomeAula}`);
        }
    }

    function cancelarAula(nomeAula) {
        if (confirm(`Tem certeza que deseja cancelar sua inscrição na aula "${nomeAula}"?`)) {
            showNotification(`Inscrição na aula "${nomeAula}" cancelada`, 'warning');
            // Aqui você poderia fazer uma requisição AJAX para cancelar
            // cancelarInscricaoAula(aulaId);
        }
    }

    // ==============================================================
    // FUNÇÕES UTILITÁRIAS - NOTIFICAÇÕES
    // ==============================================================

    function showNotification(mensagem, tipo = 'info') {
        // Cores por tipo
        const colors = {
            'success': '#4CAF50',
            'warning': '#FF9800',
            'error': '#F44336',
            'info': '#2196F3'
        };
        
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'techfit-notification';
        notification.innerHTML = `
            <span>${mensagem}</span>
            <button class="techfit-notification-close">&times;</button>
        `;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[tipo] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 14px;
            max-width: 350px;
            animation: techfitNotificationSlideIn 0.3s ease;
        `;
        
        // Botão de fechar
        const closeBtn = notification.querySelector('.techfit-notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            margin: 0;
            line-height: 1;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'techfitNotificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        document.body.appendChild(notification);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'techfitNotificationSlideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ==============================================================
    // ANIMAÇÕES CSS - APENAS EFEITOS VISUAIS
    // ==============================================================

    function addCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animações de notificação */
            @keyframes techfitNotificationSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes techfitNotificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            /* Efeitos hover suaves */
            .nav-item:hover {
                transform: translateX(5px);
                transition: transform 0.2s ease;
            }
            
            .class-item:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }
            
            .btn-primary:hover, .btn-secondary:hover {
                transform: translateY(-2px);
                transition: transform 0.2s ease;
            }
            
            .btn-small:hover {
                transform: translateY(-1px);
                transition: transform 0.2s ease;
            }
            
            .summary-card:hover {
                transform: translateY(-3px);
                transition: all 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-3px);
                transition: all 0.3s ease;
            }
            
            /* Transição suave entre seções */
            .content-section {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ==============================================================
    // FUNÇÕES EXTRAS - VALIDAÇÃO DE FORMULÁRIOS
    // ==============================================================

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function formatarTelefone(telefone) {
        // Remove tudo que não é número
        const numeros = telefone.replace(/\D/g, '');
        
        // Formata como (XX) XXXXX-XXXX
        if (numeros.length === 11) {
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (numeros.length === 10) {
            return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return telefone;
    }

    // ==============================================================
    // INICIALIZAÇÃO FINAL
    // ==============================================================

    // Inicializa a aplicação
    init();
    
    // Adiciona listener para o botão de logout se existir
    const logoutBtn = document.querySelector('a[href*="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            if (!confirm('Tem certeza que deseja sair?')) {
                e.preventDefault();
            }
        });
    }
});

// ==============================================================
// FUNÇÕES GLOBAIS (opcionais)
// ==============================================================

// Função para alternar modo escuro/claro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    return isDark;
}

// Verificar preferência de modo escuro
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Função para rolar até uma seção
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}