// login.js
document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    const btnLogin = document.getElementById('btnLogin');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const checkLembrar = document.getElementById('lembrar');

    // Formulário tradicional com validação AJAX
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        await fazerLogin();
    });

    function validarFormulario() {
        let valido = true;
        
        // Validação do email
        const email = inputEmail.value.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            mostrarErro(inputEmail, 'Email é obrigatório');
            valido = false;
        } else if (!regexEmail.test(email)) {
            mostrarErro(inputEmail, 'Email inválido');
            valido = false;
        } else {
            removerErro(inputEmail);
        }

        // Validação da senha
        if (!inputSenha.value.trim()) {
            mostrarErro(inputSenha, 'Senha é obrigatória');
            valido = false;
        } else {
            removerErro(inputSenha);
        }
        
        return valido;
    }

    async function fazerLogin() {
        const dados = {
            email: inputEmail.value.trim(),
            senha: inputSenha.value,
            lembrar: checkLembrar.checked
        };

        // Mostrar loading
        btnLogin.textContent = 'Entrando...';
        btnLogin.disabled = true;
        btnLogin.style.opacity = '0.7';

        try {
             const response = await fetch('/processar_login.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });

            const data = await response.json();
            
            if (data.success) {
                // Login bem-sucedido - redirecionar para Painel Aluno
                window.location.href = '../../Painel Aluno/index.php';
            } else {
                // Mostrar erro
                mostrarErroGeral(data.message);
                // Limpar senha
                inputSenha.value = '';
                inputSenha.focus();
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarErroGeral('Erro ao conectar com o servidor. Tente novamente.');
        } finally {
            // Restaurar botão
            btnLogin.textContent = 'Entrar';
            btnLogin.disabled = false;
            btnLogin.style.opacity = '1';
        }
    }

    function mostrarErro(campo, mensagem) {
        removerErro(campo);
        campo.style.borderColor = '#e74c3c';
        
        const mensagemErro = document.createElement('span');
        mensagemErro.className = 'mensagem-erro';
        mensagemErro.style.color = '#e74c3c';
        mensagemErro.style.fontSize = '12px';
        mensagemErro.style.marginTop = '5px';
        mensagemErro.style.display = 'block';
        mensagemErro.textContent = mensagem;
        campo.parentNode.appendChild(mensagemErro);
    }

    function removerErro(campo) {
        campo.style.borderColor = '';
        const erroAnterior = campo.parentNode.querySelector('.mensagem-erro');
        if (erroAnterior) {
            erroAnterior.remove();
        }
    }

    function mostrarErroGeral(mensagem) {
        // Remover erros anteriores
        const errosAnteriores = document.querySelectorAll('.erro-geral');
        errosAnteriores.forEach(erro => erro.remove());
        
        // Criar novo erro
        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-geral';
        erroDiv.style.color = '#e74c3c';
        erroDiv.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        erroDiv.style.padding = '10px';
        erroDiv.style.borderRadius = '5px';
        erroDiv.style.marginBottom = '15px';
        erroDiv.style.textAlign = 'center';
        erroDiv.style.border = '1px solid #e74c3c';
        erroDiv.textContent = '❌ ' + mensagem;
        
        // Inserir antes do formulário
        const titulo = document.querySelector('.login-titulo');
        titulo.parentNode.insertBefore(erroDiv, titulo.nextSibling);
        
        // Remover após 5 segundos
        setTimeout(() => {
            erroDiv.remove();
        }, 5000);
    }

    // Carregar email salvo do localStorage
    const emailSalvo = localStorage.getItem('lembrarEmail');
    if (emailSalvo) {
        inputEmail.value = emailSalvo;
        checkLembrar.checked = true;
    }

    // Salvar email se marcar "Lembrar-me"
    checkLembrar.addEventListener('change', function() {
        if (this.checked && inputEmail.value.trim()) {
            localStorage.setItem('lembrarEmail', inputEmail.value.trim());
        } else {
            localStorage.removeItem('lembrarEmail');
        }
    });

    // Limpar erros ao digitar
    formLogin.addEventListener('input', function(e) {
        if (e.target.matches('input')) {
            removerErro(e.target);
        }
    });

    // Focar no email
    if (!inputEmail.value) {
        inputEmail.focus();
    }
});

async function fazerLogin() {
    console.log('Iniciando login...');
    
    try {
        const url = '../../processar_login.php';
        console.log('Tentando acessar:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });
        
        console.log('Resposta recebida:', response.status);
        
        if (!response.ok) {
            console.error('Erro HTTP:', response.status, response.statusText);
            throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
    } catch (error) {
        console.error('Erro completo:', error);
        mostrarErroGeral('Erro: ' + error.message);
    }
}