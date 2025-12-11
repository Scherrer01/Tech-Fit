// aulas.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const notification = document.getElementById('notification');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Dados temporários para agendamento
    let aulaParaAgendar = null;
    
    // ==============================================================
    // FUNÇÃO DE NOTIFICAÇÃO
    // ==============================================================
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // ==============================================================
    // FUNÇÃO DO MODAL
    // ==============================================================
    function showModal(title, message, confirmCallback) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalOverlay.style.display = 'flex';
        
        modalConfirm.onclick = function() {
            if (confirmCallback) confirmCallback();
            modalOverlay.style.display = 'none';
        };
        
        modalCancel.onclick = function() {
            modalOverlay.style.display = 'none';
            aulaParaAgendar = null;
        };
    }
    
    // ==============================================================
    // AGENDAMENTO DE AULAS
    // ==============================================================
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('agendar') && !e.target.disabled) {
            e.preventDefault();
            
            const button = e.target;
            const nomeAula = button.dataset.nomeAula;
            const diaSemana = button.dataset.diaSemana;
            const horario = button.dataset.horario;
            const idAluno = button.dataset.idAluno;
            
            aulaParaAgendar = {
                button: button,
                nome_aula: nomeAula,
                dia_semana: diaSemana,
                horario: horario,
                id_aluno: idAluno
            };
            
            const dias = {
                'DOM': 'Domingo',
                'SEG': 'Segunda',
                'TER': 'Terça',
                'QUA': 'Quarta',
                'QUI': 'Quinta',
                'SEX': 'Sexta',
                'SAB': 'Sábado'
            };
            
            const diaFormatado = dias[diaSemana] || diaSemana;
            const horarioFormatado = horario.substring(0, 5);
            
            showModal(
                'Confirmar Agendamento',
                `Deseja agendar a aula "${nomeAula}" para ${diaFormatado} às ${horarioFormatado}?`,
                agendarAula
            );
        }
    });
    
    // ==============================================================
    // FUNÇÃO PARA AGENDAR AULA VIA AJAX
    // ==============================================================
    // ==============================================================
// FUNÇÃO PARA AGENDAR AULA VIA AJAX
// ==============================================================
async function agendarAula() {
    if (!aulaParaAgendar) return;
    
    const formData = new FormData();
    formData.append('action', 'agendar_aula');
    formData.append('nome_aula', aulaParaAgendar.nome_aula);
    formData.append('dia_semana', aulaParaAgendar.dia_semana);
    formData.append('horario', aulaParaAgendar.horario);
    formData.append('id_aluno', aulaParaAgendar.id_aluno);
    
    try {
        const response = await fetch('aulas.php', {
            method: 'POST',
            body: formData
        });
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            // Se não for JSON, pegar o texto para debug
            const text = await response.text();
            console.error('Resposta não é JSON:', text.substring(0, 200));
            throw new Error('Resposta do servidor não é JSON. Possível erro PHP.');
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Atualizar botão
            aulaParaAgendar.button.classList.remove('agendar');
            aulaParaAgendar.button.classList.add('agendado');
            aulaParaAgendar.button.disabled = true;
            aulaParaAgendar.button.textContent = '✓ Agendada';
            
            // Atualizar contador de vagas
            const vagasSpan = aulaParaAgendar.button.parentElement.querySelector('.vagas-info');
            if (vagasSpan) {
                const vagasText = vagasSpan.textContent;
                const [vagasAtuais, total] = vagasText.match(/\d+/g).map(Number);
                if (vagasAtuais > 0) {
                    const novasVagas = vagasAtuais - 1;
                    vagasSpan.textContent = `Vagas: ${novasVagas}/${total}`;
                    
                    // Atualizar cor das vagas
                    if (novasVagas <= 2) {
                        vagasSpan.classList.add('vagas-poucas');
                    }
                    if (novasVagas <= 0) {
                        vagasSpan.classList.add('vagas-lotado');
                    }
                }
            }
            
            // Atualizar contador de aulas agendadas
            const agendadasBtn = document.querySelector('[data-filter="agendadas"] .class-counter');
            if (agendadasBtn) {
                const currentCount = parseInt(agendadasBtn.textContent) || 0;
                agendadasBtn.textContent = currentCount + 1;
            }
            
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        showNotification('Erro ao agendar aula. ' + error.message, 'error');
    }
    
    aulaParaAgendar = null;
}
    
    // ==============================================================
    // FILTROS DE AULAS
    // ==============================================================
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            aplicarFiltro(filter);
        });
    });
    
    function aplicarFiltro(filter) {
        const agendadasSection = document.getElementById('agendadasSection');
        const disponiveisSection = document.getElementById('disponiveisSection');
        
        switch(filter) {
            case 'todas':
                agendadasSection.classList.add('section-hidden');
                disponiveisSection.classList.remove('section-hidden');
                break;
            case 'agendadas':
                disponiveisSection.classList.add('section-hidden');
                agendadasSection.classList.remove('section-hidden');
                break;
            case 'disponiveis':
                agendadasSection.classList.add('section-hidden');
                disponiveisSection.classList.remove('section-hidden');
                break;
        }
    }
    
    // ==============================================================
    // BUSCA DE AULAS
    // ==============================================================
    function buscarAulas(termo) {
        const classCards = document.querySelectorAll('.class-card');
        const termoLower = termo.toLowerCase();
        
        classCards.forEach(card => {
            const titulo = card.querySelector('h3').textContent.toLowerCase();
            const modalidade = card.querySelector('.class-info p').textContent.toLowerCase();
            const instrutor = card.querySelector('.class-meta span:nth-child(2)').textContent.toLowerCase();
            
            const textoBusca = titulo + ' ' + modalidade + ' ' + instrutor;
            
            if (textoBusca.includes(termoLower)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchButton.addEventListener('click', function() {
        buscarAulas(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            buscarAulas(searchInput.value);
        }
    });
    
    // ==============================================================
    // ANIMAÇÕES E EFEITOS VISUAIS
    // ==============================================================
    const classCards = document.querySelectorAll('.class-card');
    
    classCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // ==============================================================
    // VALIDAÇÃO EM TEMPO REAL
    // ==============================================================
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            this.style.borderColor = '#FF2626';
        } else {
            this.style.borderColor = '#444';
        }
    });
});