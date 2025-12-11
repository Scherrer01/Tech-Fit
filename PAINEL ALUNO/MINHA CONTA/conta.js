// ==============================================================
// MINHA CONTA - TECH FIT - EDITAÇÃO LOCAL (CORRIGIDO)
// ==============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Variáveis de estado
    let isSubmitting = false;
    
    // ==============================================================
    // INICIALIZAÇÃO
    // ==============================================================

    function init() {
        setupNavigation();
        setupEventListeners();
        setupAulasEventListeners();
        setupEditModal();
        addCSSAnimations();
        
        console.log('Tech Fit - Interface carregada com sucesso!');
    }

    // ==============================================================
    // MODAL DE EDIÇÃO DE PERFIL (LOCAL)
    // ==============================================================

    function setupEditModal() {
        const modal = document.getElementById('editModal');
        if (!modal) {
            console.error('Modal não encontrado no HTML');
            showNotification('Erro: Modal de edição não encontrado', 'error');
            return;
        }
        
        // Configurar botões para abrir o modal
        setupEditModalButtons();
        
        // Configurar funcionalidades do modal
        setupModalFunctionality();
    }

    function setupEditModalButtons() {
        // Botão principal "Editar Perfil"
        const mainEditBtn = document.getElementById('editarPerfilBtn');
        if (mainEditBtn) {
            mainEditBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botão Editar Perfil clicado');
                openEditModal();
            });
        }
        
        // Botão "Editar" nas configurações
        const configEditBtn = document.getElementById('configEditarPerfilBtn');
        if (configEditBtn) {
            configEditBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botão Editar (configurações) clicado');
                openEditModal();
            });
        }
    }

    function setupModalFunctionality() {
        const modal = document.getElementById('editModal');
        if (!modal) return;
        
        // Botão de fechar modal
        const closeButtons = modal.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeEditModal();
            });
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeEditModal();
            }
        });
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === this && !isSubmitting) {
                closeEditModal();
            }
        });
        
        // Formatar telefone dinamicamente
        const telefoneInput = document.getElementById('edit_telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', formatarTelefoneInput);
        }
        
        // Formulário de edição
        const editForm = document.getElementById('editProfileForm');
        if (editForm) {
            editForm.addEventListener('submit', handleEditFormSubmit);
        }
    }

    function formatarTelefoneInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        
        e.target.value = value;
    }

    async function handleEditFormSubmit(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        const form = e.target;
        const nomeInput = form.querySelector('#edit_nome');
        const telefoneInput = form.querySelector('#edit_telefone');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!nomeInput || !telefoneInput || !submitBtn) return;
        
        // Validações
        const nome = nomeInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        
        if (!nome) {
            showModalMessage('Por favor, preencha o nome completo', 'error');
            nomeInput.focus();
            return;
        }
        
        if (nome.length < 3) {
            showModalMessage('O nome deve ter pelo menos 3 caracteres', 'error');
            nomeInput.focus();
            return;
        }
        
        if (telefone && !telefoneRegex.test(telefone)) {
            showModalMessage('Formato de telefone inválido. Use (99) 99999-9999', 'error');
            telefoneInput.focus();
            return;
        }
        
        // Desabilitar botão e mostrar loading
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Salvando...';
        submitBtn.style.opacity = '0.7';
        isSubmitting = true;
        
        // Coletar dados do formulário
        const formData = new FormData(form);
        
        try {
            console.log('Enviando dados para atualização...');
            
            // Enviar via AJAX para conta.php
            const response = await fetch(window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            console.log('Resposta recebida:', response.status);
            
            // Verificar se a resposta é JSON
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('Resposta JSON:', result);
                
                if (result.success) {
                    showModalMessage('Perfil atualizado com sucesso!', 'success');
                    
                    // Atualizar os dados na página sem recarregar
                    if (result.data) {
                        updateProfileData(result.data);
                    }
                    
                    // Fechar o modal após 1.5 segundos
                    setTimeout(() => {
                        // Resetar o botão primeiro
                        resetSubmitButton(submitBtn, originalText);
                        
                        // Fechar o modal
                        closeEditModal();
                        
                        // Mostrar notificação
                        showNotification('Perfil atualizado com sucesso!', 'success');
                    }, 1500);
                    
                } else {
                    showModalMessage(result.message || 'Erro ao atualizar perfil', 'error');
                    resetSubmitButton(submitBtn, originalText);
                }
            } else {
                // Se não for JSON, tentar extrair mensagem
                const text = await response.text();
                
                // Verificar padrões comuns de sucesso
                if (response.ok) {
                    showModalMessage('Perfil atualizado!', 'success');
                    
                    // Tentar extrair dados do HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = text;
                    
                    // Procurar dados atualizados
                    const nomeElement = tempDiv.querySelector('.profile-info h3');
                    if (nomeElement) {
                        updateProfileData({
                            nome: nomeElement.textContent
                        });
                    }
                    
                    // Fechar modal após 1.5 segundos
                    setTimeout(() => {
                        resetSubmitButton(submitBtn, originalText);
                        closeEditModal();
                        showNotification('Perfil atualizado com sucesso!', 'success');
                    }, 1500);
                    
                } else {
                    showModalMessage('Erro ao atualizar perfil', 'error');
                    resetSubmitButton(submitBtn, originalText);
                }
            }
            
        } catch (error) {
            console.error('Erro na requisição:', error);
            showModalMessage('Erro de conexão. Verifique sua internet.', 'error');
            resetSubmitButton(submitBtn, originalText);
        }
    }

    function updateProfileData(data) {
        console.log('Atualizando dados da página:', data);
        
        // Nome
        if (data.nome) {
            document.querySelectorAll('.user-profile h3, .profile-info h3').forEach(el => {
                if (el) el.textContent = data.nome;
            });
        }
        
        // Telefone
        if (data.telefone !== undefined) {
            const telefoneElement = document.querySelector('.detail-item:nth-child(2) p');
            if (telefoneElement) {
                telefoneElement.textContent = data.telefone || 'Não cadastrado';
            }
        }
        
        // Endereço
        if (data.endereco !== undefined) {
            const enderecoElement = document.querySelector('.detail-item:nth-child(8) p');
            if (enderecoElement) {
                enderecoElement.textContent = data.endereco || 'Não cadastrado';
            }
        }
        
        // Sexo
        if (data.sexo) {
            const sexoElement = document.querySelector('.detail-item:nth-child(7) p');
            if (sexoElement) {
                const sexoLabels = {
                    'MASCULINO': 'Masculino',
                    'FEMININO': 'Feminino',
                    'OUTRO': 'Outro',
                    'NAO_DECLARAR': 'Não declarado'
                };
                sexoElement.textContent = sexoLabels[data.sexo] || data.sexo;
            }
        }
        
        // Data de nascimento
        if (data.nascimento) {
            try {
                const [year, month, day] = data.nascimento.split('-');
                const formattedDate = `${day}/${month}/${year}`;
                const nascimentoElement = document.querySelector('.detail-item:nth-child(3) p');
                if (nascimentoElement) {
                    nascimentoElement.textContent = formattedDate;
                }
            } catch (e) {
                console.error('Erro ao formatar data:', e);
            }
        }
    }

    function resetSubmitButton(button, text) {
        if (button) {
            button.disabled = false;
            button.textContent = text;
            button.style.opacity = '1';
        }
        isSubmitting = false;
    }

    function openEditModal() {
        const modal = document.getElementById('editModal');
        if (!modal) {
            console.error('Modal não encontrado!');
            showNotification('Erro ao abrir editor de perfil', 'error');
            return;
        }
        
        console.log('Abrindo modal de edição...');
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Limpar mensagens anteriores
        showModalMessage('', '');
        
        // Focar no primeiro campo
        setTimeout(() => {
            const nomeInput = document.getElementById('edit_nome');
            if (nomeInput) {
                nomeInput.focus();
                nomeInput.select();
            }
        }, 300);
    }

    function closeEditModal() {
        console.log('Fechando modal...');
        
        // Primeiro resetar o estado de submissão
        isSubmitting = false;
        
        const modal = document.getElementById('editModal');
        if (modal) {
            // Remover a classe active
            modal.classList.remove('active');
            
            // Restaurar overflow do body
            document.body.style.overflow = '';
            
            console.log('Modal fechado com sucesso');
        } else {
            console.error('Modal não encontrado para fechar');
        }
        
        // Resetar botão de submit (se existir)
        const submitBtn = document.querySelector('#editProfileForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Salvar Alterações';
            submitBtn.style.opacity = '1';
        }
    }

    function showModalMessage(message, type) {
        const modalMessage = document.getElementById('modalMessage');
        if (modalMessage) {
            modalMessage.textContent = message;
            modalMessage.className = 'modal-message';
            
            if (message) {
                modalMessage.classList.add(type);
                modalMessage.style.display = 'block';
                
                // Rolar para a mensagem
                setTimeout(() => {
                    modalMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            } else {
                modalMessage.style.display = 'none';
            }
        }
    }

    // ==============================================================
    // NAVEGAÇÃO ENTRE SEÇÕES
    // ==============================================================

    function setupNavigation() {
        if (!navItems.length) return;
        
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = this.getAttribute('href').substring(1);
                showSection(targetId);
                
                history.pushState(null, null, `#${targetId}`);
            });
        });
        
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
        if (!contentSections.length) return;
        
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
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
    // FUNÇÕES DE AULAS (CANCELAMENTO)
    // ==============================================================

    function setupAulasEventListeners() {
        // Botões "Ver detalhes"
        document.querySelectorAll('.class-actions .ver-detalhes').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const aulaNome = this.dataset.aulaNome;
                const diaSemana = this.dataset.diaSemana;
                const horario = this.dataset.horario;
                const modalidade = this.dataset.modalidade;
                const instrutor = this.dataset.instrutor;
                verDetalhesAula(aulaNome, diaSemana, horario, modalidade, instrutor);
            });
        });
        
        // Botões "Cancelar"
        document.querySelectorAll('.class-actions .cancelar-aula').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const aulaItem = this.closest('.class-item');
                const aulaNome = this.dataset.aulaNome;
                const diaSemana = this.dataset.diaSemana;
                const horario = this.dataset.horario;
                const idAluno = this.dataset.idAluno;
                
                if (!aulaNome || !diaSemana || !horario || !idAluno) {
                    console.error('Dados incompletos para cancelamento:', { aulaNome, diaSemana, horario, idAluno });
                    showNotification('Erro: Dados da aula incompletos', 'error');
                    return;
                }
                
                await cancelarAula(aulaItem, aulaNome, diaSemana, horario, idAluno);
            });
        });
    }

    async function cancelarAula(aulaItem, nomeAula, diaSemana, horario, idAluno) {
        // Traduzir dia da semana para nome completo (para a mensagem de confirmação)
        const diasMap = {
            'DOM': 'Domingo',
            'SEG': 'Segunda',
            'TER': 'Terça', 
            'QUA': 'Quarta',
            'QUI': 'Quinta',
            'SEX': 'Sexta',
            'SAB': 'Sábado'
        };
        
        const diaSemanaNome = diasMap[diaSemana] || diaSemana;
        
        if (!confirm(`Tem certeza que deseja cancelar sua inscrição na aula "${nomeAula}" (${diaSemanaNome} ${horario})?`)) {
            return;
        }
        
        try {
            // Preparar dados para envio
            const formData = new FormData();
            formData.append('action', 'cancelar_aula');
            formData.append('nome_aula', nomeAula);
            formData.append('dia_semana', diaSemana);
            formData.append('horario', horario + ':00'); // Adicionar segundos
            formData.append('id_aluno', idAluno);
            
            // Enviar requisição AJAX
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
                    // Remover visualmente o item com animação
                    aulaItem.style.opacity = '0';
                    aulaItem.style.transform = 'translateX(-20px)';
                    aulaItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        aulaItem.remove();
                        
                        // Atualizar contadores
                        atualizarContadoresAposCancelamento();
                        
                        // Mostrar mensagem de sucesso
                        showNotification(result.message, 'success');
                        
                        // Verificar se não há mais aulas
                        verificarSeNaoHaAulas();
                        
                    }, 300);
                } else {
                    showNotification(result.message, 'error');
                }
            } else {
                // Se não for JSON, pode ser que houve um erro no servidor
                const text = await response.text();
                console.error('Resposta não-JSON:', text.substring(0, 200));
                showNotification('Erro ao processar cancelamento', 'error');
            }
            
        } catch (error) {
            console.error('Erro na requisição:', error);
            showNotification('Erro de conexão. Tente novamente.', 'error');
        }
    }

    function atualizarContadoresAposCancelamento() {
        // Contar aulas restantes
        const classItems = document.querySelectorAll('.class-item');
        const totalAulas = classItems.length;
        
        // Atualizar o número no resumo
        const summaryCount = document.getElementById('totalAulasText');
        if (summaryCount) {
            summaryCount.textContent = `${totalAulas} ${totalAulas === 1 ? 'aula' : 'aulas'}`;
        }
        
        // Atualizar o número no progresso
        const statCardCount = document.getElementById('statTotalAulas');
        if (statCardCount) {
            statCardCount.innerHTML = `${totalAulas}<span>aulas</span>`;
        }
        
        // Atualizar no gráfico
        const chartTotalAulas = document.getElementById('chartTotalAulas');
        if (chartTotalAulas) {
            chartTotalAulas.textContent = `${totalAulas} ${totalAulas === 1 ? 'aula' : 'aulas'}`;
        }
        
        // Atualizar as modalidades únicas
        const modalidadesSet = new Set();
        document.querySelectorAll('.modalidade-badge').forEach(badge => {
            modalidadesSet.add(badge.textContent);
        });
        
        const modalidadesText = document.getElementById('modalidadesText');
        const chartModalidades = document.getElementById('chartModalidades');
        const modalidadesArray = Array.from(modalidadesSet);
        
        if (modalidadesText) {
            modalidadesText.textContent = modalidadesArray.length > 0 ? 
                modalidadesArray.join(', ') : 'Nenhuma';
        }
        
        if (chartModalidades) {
            chartModalidades.textContent = `${modalidadesArray.length} modalidades`;
        }
        
        // Atualizar próxima aula
        const primeiraAulaItem = document.querySelector('.class-item');
        const proximaAulaText = document.getElementById('proximaAulaText');
        if (primeiraAulaItem && proximaAulaText) {
            const aulaNome = primeiraAulaItem.querySelector('h4').textContent;
            const aulaHorario = primeiraAulaItem.querySelector('.aula-horario').textContent;
            const hora = aulaHorario.split(' - ')[1]?.split(' às ')[0] || '';
            proximaAulaText.textContent = `${aulaNome} - ${aulaHorario.split(' - ')[0]} ${hora}`;
        } else if (proximaAulaText) {
            proximaAulaText.textContent = 'Nenhuma aula agendada';
        }
    }

    function verificarSeNaoHaAulas() {
        const classItems = document.querySelectorAll('.class-item');
        const noClassesDiv = document.getElementById('noClassesMessage');
        const classList = document.getElementById('classList');
        
        if (classItems.length === 0 && !noClassesDiv && classList) {
            // Criar mensagem de "sem aulas"
            classList.innerHTML = `
                <div class="no-classes" id="noClassesMessage">
                    <p>Você não está inscrito em nenhuma aula. <a href="../AULAS/aulas.php">Inscreva-se agora!</a></p>
                </div>
            `;
        }
    }

    function verDetalhesAula(nomeAula, diaSemana, horario, modalidade, instrutor) {
        // Traduzir dia da semana
        const diasMap = {
            'DOM': 'Domingo',
            'SEG': 'Segunda-feira',
            'TER': 'Terça-feira', 
            'QUA': 'Quarta-feira',
            'QUI': 'Quinta-feira',
            'SEX': 'Sexta-feira',
            'SAB': 'Sábado'
        };
        
        const diaSemanaNome = diasMap[diaSemana] || diaSemana;
        
        // Criar modal de detalhes
        const modalHtml = `
            <div class="aula-detalhes-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div style="
                    background: #282828;
                    border-radius: 10px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    border: 1px solid #444;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; color: white;">Detalhes da Aula</h3>
                        <button class="close-detalhes" style="
                            background: none;
                            border: none;
                            color: #b0b0b0;
                            font-size: 24px;
                            cursor: pointer;
                            padding: 0;
                        ">&times;</button>
                    </div>
                    
                    <div style="color: white;">
                        <h4 style="color: #FF2626; margin-top: 0;">${nomeAula}</h4>
                        <p><strong>Dia:</strong> ${diaSemanaNome}</p>
                        <p><strong>Horário:</strong> ${horario}</p>
                        <p><strong>Modalidade:</strong> ${modalidade}</p>
                        <p><strong>Instrutor:</strong> ${instrutor || 'Professor não definido'}</p>
                        <p><strong>Status:</strong> <span style="color: #4CAF50;">● Agendada</span></p>
                    </div>
                    
                    <div style="margin-top: 25px; display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn-small secondary" style="padding: 8px 16px;">Compartilhar</button>
                        <button class="btn-small primary" style="padding: 8px 16px;">Adicionar à Agenda</button>
                    </div>
                </div>
            </div>
        `;
        
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);
        
        // Configurar botão de fechar
        const closeBtn = modalElement.querySelector('.close-detalhes');
        closeBtn.addEventListener('click', () => {
            modalElement.style.opacity = '0';
            setTimeout(() => {
                if (modalElement.parentNode) {
                    modalElement.parentNode.removeChild(modalElement);
                }
            }, 300);
        });
        
        // Fechar ao clicar fora
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                closeBtn.click();
            }
        });
    }

    // ==============================================================
    // OUTROS EVENT LISTENERS
    // ==============================================================

    function setupEventListeners() {
        // Botão de editar avatar
        const btnEditAvatar = document.querySelector('.edit-avatar');
        if (btnEditAvatar) {
            btnEditAvatar.addEventListener('click', editarAvatar);
        }
        
        // Toggles de configurações
        document.querySelectorAll('.toggle input').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const setting = this.closest('.setting-item').querySelector('h4').textContent;
                showNotification(`${setting} ${this.checked ? 'ativado' : 'desativado'}`, 'info');
            });
        });
        
        // Botões de configurações
        document.querySelectorAll('.setting-item .btn-small').forEach(btn => {
            if (btn.textContent === 'Configurar') {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const setting = this.closest('.setting-item').querySelector('h4').textContent;
                    showNotification(`Abrindo configurações de ${setting}`, 'info');
                });
            }
        });
    }

    function editarAvatar() {
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    // ==============================================================
    // SISTEMA DE NOTIFICAÇÕES
    // ==============================================================

    function showNotification(mensagem, tipo = 'info') {
        const colors = {
            'success': '#4CAF50',
            'warning': '#FF9800',
            'error': '#F44336',
            'info': '#2196F3'
        };
        
        // Remover notificações antigas
        document.querySelectorAll('.techfit-notification').forEach(n => {
            n.style.animation = 'techfitNotificationSlideOut 0.3s ease';
            setTimeout(() => n.remove(), 300);
        });
        
        const notification = document.createElement('div');
        notification.className = 'techfit-notification';
        notification.innerHTML = `
            <span>${mensagem}</span>
            <button class="techfit-notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[tipo] || colors.info};
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
            animation: techfitNotificationSlideIn 0.3s ease;
        `;
        
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
            min-width: 24px;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'techfitNotificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'techfitNotificationSlideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        return notification;
    }

    // ==============================================================
    // ANIMAÇÕES CSS
    // ==============================================================

    function addCSSAnimations() {
        if (document.querySelector('style[data-techfit-animations]')) return;
        
        const style = document.createElement('style');
        style.setAttribute('data-techfit-animations', 'true');
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
            }
            
            .nav-item {
                transition: transform 0.2s ease;
            }
            
            .class-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.1);
            }
            
            .class-item {
                transition: all 0.3s ease;
            }
            
            .btn-primary:hover, .btn-secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .btn-primary, .btn-secondary {
                transition: all 0.2s ease;
            }
            
            .btn-small:hover {
                transform: translateY(-1px);
            }
            
            .btn-small {
                transition: transform 0.2s ease;
            }
            
            .summary-card:hover, .stat-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.1);
            }
            
            .summary-card, .stat-card {
                transition: all 0.3s ease;
            }
            
            /* Transição suave entre seções */
            .content-section {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            /* Animações para o modal */
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
            
            .edit-modal {
                animation: modalSlideIn 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ==============================================================
    // INICIALIZAÇÃO
    // ==============================================================

    init();
    
    // Confirmação de logout
    const logoutBtn = document.querySelector('a[href*="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            if (!confirm('Tem certeza que deseja sair?')) {
                e.preventDefault();
            }
        });
    }
});

// Funções globais
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    return isDark;
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}