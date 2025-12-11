// pesquisa.js - Funcionalidade de busca para Unidades e Aulas

document.addEventListener('DOMContentLoaded', function() {
    // Configurações comuns
    const config = {
        unidades: {
            inputSelector: '.search-box input[type="text"]',
            buttonSelector: '.search-box button',
            cardSelector: '.unidade-card',
            titleSelector: '.unidade-header h3',
            contentSelector: '.unidade-content'
        },
        aulas: {
            inputSelector: '.search-box input[type="text"]',
            buttonSelector: '.search-box button',
            cardSelector: '.class-card',
            titleSelector: '.class-info h3',
            contentSelector: '.class-info'
        }
    };

    // Inicializar com base na página atual
    initSearch();
    
    function initSearch() {
        const isUnidadesPage = document.querySelector('.unidades-grid');
        const isAulasPage = document.querySelector('.available-classes');
        
        if (isUnidadesPage) {
            setupSearch('unidades');
        }
        
        if (isAulasPage) {
            setupSearch('aulas');
        }
    }
    
    function setupSearch(pageType) {
        const configPage = config[pageType];
        const searchInput = document.querySelector(configPage.inputSelector);
        const searchButton = document.querySelector(configPage.buttonSelector);
        const cards = document.querySelectorAll(configPage.cardSelector);
        
        if (!searchInput || !searchButton || !cards.length) return;
        
        // Função de pesquisa específica para unidades
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            cards.forEach(card => {
                const title = card.querySelector(configPage.titleSelector);
                const content = card.querySelector(configPage.contentSelector);
                
                if (!title || !content) return;
                
                let titleText = title.textContent.toLowerCase();
                const contentText = content.textContent.toLowerCase();
                
                // PARA UNIDADES: Remover "Tech Fit" do título para facilitar a busca
                if (pageType === 'unidades') {
                    titleText = titleText.replace('tech fit', '').trim();
                }
                
                // Verificar se o termo aparece no título ou conteúdo
                const matches = titleText.includes(searchTerm) || contentText.includes(searchTerm);
                
                if (matches) {
                    card.style.display = 'block';
                    highlightText(card, searchTerm, pageType);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Mostrar mensagem se nenhum resultado for encontrado
            showNoResultsMessage(cards, pageType);
        }
        
        // Eventos
        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        
        // Pesquisa em tempo real (opcional)
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                resetSearch(cards);
            } else {
                performSearch();
            }
        });
    }
    
    function highlightText(card, searchTerm, pageType) {
        if (!searchTerm) return;
        
        // Remover realces anteriores
        const highlights = card.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
        
        // Realçar no título
        const title = card.querySelector('h3');
        if (title) {
            highlightInElement(title, searchTerm, pageType);
        }
        
        // Realçar no conteúdo (descrição)
        const content = card.querySelector('p');
        if (content) {
            highlightInElement(content, searchTerm, pageType);
        }
    }
    
    function highlightInElement(element, searchTerm, pageType) {
        let text = element.textContent;
        
        // PARA UNIDADES: Criar uma versão do texto sem "Tech Fit" para o regex
        if (pageType === 'unidades' && element.tagName === 'H3') {
            // Criar regex que ignora "Tech Fit" no início
            const textWithoutPrefix = text.replace(/^Tech Fit\s*/i, '');
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            
            // Se o texto sem "Tech Fit" contém o termo
            if (regex.test(textWithoutPrefix)) {
                // Manter o "Tech Fit" original e realçar o restante
                const prefix = text.match(/^Tech Fit\s*/i)?.[0] || '';
                const rest = text.substring(prefix.length);
                element.innerHTML = prefix + rest.replace(regex, '<span class="search-highlight">$1</span>');
            }
        } else {
            // Para outros elementos (descrições) ou para aulas
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            if (regex.test(text)) {
                element.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
            }
        }
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function resetSearch(cards) {
        cards.forEach(card => {
            card.style.display = 'block';
            
            // Remover realces
            const highlights = card.querySelectorAll('.search-highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
        });
        
        // Remover mensagem de nenhum resultado
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    function showNoResultsMessage(cards, pageType) {
        // Verificar se há algum card visível
        const visibleCards = Array.from(cards).filter(card => 
            card.style.display !== 'none' && 
            getComputedStyle(card).display !== 'none'
        );
        
        // Remover mensagem anterior se existir
        const existingMsg = document.querySelector('.no-results-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Se não houver cards visíveis, mostrar mensagem
        if (visibleCards.length === 0) {
            const containerSelector = pageType === 'unidades' ? '.unidades-grid' : '.classes-grid';
            const container = document.querySelector(containerSelector);
            
            if (container) {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h3 style="margin-bottom: 10px;">Nenhum resultado encontrado</h3>
                        <p>Tente usar outros termos de busca.</p>
                    </div>
                `;
                
                container.appendChild(message);
            }
        }
    }
});