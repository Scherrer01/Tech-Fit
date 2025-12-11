// plano.js - Funcionalidade de Troca de Plano

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const planButtons = document.querySelectorAll('.plan-btn:not(.disabled)');
    const confirmModal = document.getElementById('confirmModal');
    const modalClose = confirmModal?.querySelector('.modal-close');
    const cancelBtn = confirmModal?.querySelector('.cancel-troca');
    const confirmBtn = confirmModal?.querySelector('.confirm-troca');
    const planoNome = document.getElementById('planoNome');
    const planoValor = document.getElementById('planoValor');
    const confirmMessage = document.getElementById('confirmMessage');

    // Verificar se o modal existe
    if (!confirmModal) {
        console.error('Modal de confirmação não encontrado!');
        return;
    }

    // Abrir modal ao clicar em um botão de plano
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planoId = this.dataset.planoId;
            const planoNomeText = this.dataset.planoNome;
            const planoValorText = this.dataset.planoValor;
            
            // Atualizar modal
            if (planoNome) planoNome.textContent = planoNomeText;
            if (planoValor) planoValor.textContent = planoValorText;
            if (confirmBtn) confirmBtn.dataset.planoId = planoId;
            
            // Restaurar mensagem original
            if (confirmMessage) {
                confirmMessage.innerHTML = `Tem certeza que deseja trocar para o plano <strong id="planoNome">${planoNomeText}</strong> por R$ <strong id="planoValor">${planoValorText}</strong>/mês?`;
                updateModalElements(); // Atualizar referências após mudar o HTML
            }
            
            // Mostrar modal
            confirmModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Atualizar elementos do modal após mudança no HTML
    function updateModalElements() {
        // Re-atribuir referências aos elementos atualizados
        const updatedPlanoNome = document.getElementById('planoNome');
        const updatedPlanoValor = document.getElementById('planoValor');
        if (updatedPlanoNome) planoNome = updatedPlanoNome;
        if (updatedPlanoValor) planoValor = updatedPlanoValor;
    }

    // Fechar modal
    function closeModal() {
        confirmModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Resetar botão de confirmação
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirmar Troca';
        }
    }

    // Event listeners para fechar modal
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Confirmar troca de plano
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function() {
            const planoId = this.dataset.planoId;
            const idAluno = this.dataset.idAluno;
            
            if (!planoId || !idAluno) {
                showNotification('Erro: Dados incompletos', 'error');
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
                
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();
                    
                    if (result.success) {
                        // Mostrar mensagem de sucesso no modal
                        if (confirmMessage) {
                            confirmMessage.innerHTML = `
                                <div class="success-message" style="background: #4CAF50; color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                    <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
                                    <strong style="font-size: 18px;">${result.message}</strong><br>
                                    Novo plano: <strong>${result.data.plano_nome}</strong><br>
                                    Valor: R$ ${result.data.plano_valor}/mês
                                </div>
                            `;
                        }
                        
                        // Atualizar interface
                        updatePlanCards(planoId, result.data.plano_nome);
                        
                        // Fechar modal após 3 segundos e redirecionar
                        setTimeout(() => {
                            closeModal();
                            window.location.href = '/PAINEL ALUNO/MINHA CONTA/conta.php';
                        }, 3000);
                        
                    } else {
                        showNotification('Erro: ' + result.message, 'error');
                        this.disabled = false;
                        this.textContent = 'Confirmar Troca';
                    }
                    
                } else {
                    // Se não for JSON, pode ser redirecionamento ou erro
                    const text = await response.text();
                    console.error('Resposta não-JSON:', text.substring(0, 200));
                    
                    if (response.ok) {
                        // Se a resposta for OK mas não JSON, assumir sucesso
                        showNotification('Plano alterado com sucesso!', 'success');
                        setTimeout(() => {
                            closeModal();
                            window.location.reload();
                        }, 1500);
                    } else {
                        showNotification('Erro ao processar solicitação', 'error');
                        this.disabled = false;
                        this.textContent = 'Confirmar Troca';
                    }
                }
                
            } catch (error) {
                console.error('Erro:', error);
                showNotification('Erro de conexão. Tente novamente.', 'error');
                this.disabled = false;
                this.textContent = 'Confirmar Troca';
            }
        });
    }

    // Atualizar visualização dos cards de plano
    function updatePlanCards(newPlanId, newPlanName) {
        // Remover badges de "Plano Atual"
        document.querySelectorAll('.current-badge').forEach(badge => {
            badge.remove();
        });
        
        // Atualizar todos os botões
        document.querySelectorAll('.plan-btn').forEach(btn => {
            const btnPlanId = btn.dataset.planoId;
            const isCurrent = (btnPlanId == newPlanId);
            
            if (isCurrent) {
                btn.textContent = 'Plano Atual';
                btn.classList.add('disabled', 'current');
                btn.disabled = true;
                
                // Adicionar badge ao card
                const planCard = btn.closest('.plan-card');
                if (planCard) {
                    const currentBadge = document.createElement('div');
                    currentBadge.className = 'plan-badge current-badge';
                    currentBadge.textContent = 'Plano Atual';
                    currentBadge.style.cssText = 'background: #4CAF50; color: white;';
                    planCard.appendChild(currentBadge);
                }
            } else {
                btn.textContent = 'Trocar para este plano';
                btn.classList.remove('disabled', 'current');
                btn.disabled = false;
            }
        });
        
        // Atualizar informação do plano atual no cabeçalho
        const currentPlanInfo = document.querySelector('.current-plan-info');
        if (currentPlanInfo) {
            const planPrice = document.querySelector(`[data-plano-id="${newPlanId}"]`)?.dataset.planoValor || '';
            currentPlanInfo.innerHTML = `
                <p>Seu plano atual: <strong>${newPlanName}</strong> - R$ ${planPrice}/mês</p>
            `;
        }
    }

    // Sistema de notificações
    function showNotification(message, type = 'info') {
        // Remover notificações antigas
        document.querySelectorAll('.notification-alert').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification-alert notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            font-size: 14px;
            max-width: 350px;
            animation: notificationSlideIn 0.3s ease;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        document.body.appendChild(notification);
        
        // Adicionar animações CSS se não existirem
        if (!document.querySelector('style[data-notification-animations]')) {
            const style = document.createElement('style');
            style.setAttribute('data-notification-animations', 'true');
            style.textContent = `
                @keyframes notificationSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes notificationSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Fechar modal ao clicar fora
    confirmModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirmModal.style.display === 'flex') {
            closeModal();
        }
    });

    // Adicionar estilos para o modal se não existirem
    if (!document.querySelector('style[data-plano-modal-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-plano-modal-styles', 'true');
        style.textContent = `
            .modal-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            
            .modal {
                background: #282828;
                border-radius: 10px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                border: 1px solid #444;
                animation: modalSlideIn 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .modal-header h3 {
                margin: 0;
                color: white;
                font-size: 24px;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: #b0b0b0;
                font-size: 28px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .modal-content {
                color: white;
                margin-bottom: 25px;
            }
            
            .modal-note {
                font-size: 14px;
                color: #b0b0b0;
                margin-top: 10px;
            }
            
            .modal-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .btn-primary, .btn-secondary {
                padding: 10px 20px;
                border-radius: 5px;
                border: none;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            }
            
            .btn-primary {
                background: #FF2626;
                color: white;
            }
            
            .btn-primary:hover:not(:disabled) {
                background: #cc0000;
                transform: translateY(-2px);
            }
            
            .btn-primary:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .btn-secondary {
                background: #444;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #555;
                transform: translateY(-2px);
            }
            
            @keyframes modalSlideIn {
                from {
                    transform: translateY(20px) scale(0.95);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }
            
            /* Badge para plano atual */
            .current-badge {
                background: #4CAF50 !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    }
});