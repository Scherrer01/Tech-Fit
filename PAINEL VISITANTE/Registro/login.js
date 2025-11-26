// login.js - VERSÃO ATUALIZADA
document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const btnLogin = document.querySelector('.btn-login');

    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            realizarLogin();
        }
    });

    function validarFormulario() {
        let valido = true;
        
        // Limpar erros anteriores
        document.querySelectorAll('.erro-mensagem').forEach(erro => erro.remove());
        emailInput.style.borderColor = '';
        senhaInput.style.borderColor = '';

        // Validar email
        if (!emailInput.value.trim()) {
            mostrarErro(emailInput, 'E-mail é obrigatório');
            valido = false;
        } else if (!validarEmail(emailInput.value)) {
            mostrarErro(emailInput, 'E-mail inválido');
            valido = false;
        }

        // Validar senha
        if (!senhaInput.value.trim()) {
            mostrarErro(senhaInput, 'Senha é obrigatória');
            valido = false;
        }

        return valido;
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function realizarLogin() {
        const formData = new FormData(formLogin);
        
        // Mostrar loading
        btnLogin.textContent = 'Entrando...';
        btnLogin.disabled = true;

        fetch('processa_login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginSucesso(data);
            } else {
                mostrarErroLogin(data.message || 'Erro ao fazer login');
            }
            
            btnLogin.textContent = 'Entrar';
            btnLogin.disabled = false;
        })
        .catch(error => {
            console.error('Erro:', error);
            mostrarErroLogin('Erro de conexão. Tente novamente.');
            btnLogin.textContent = 'Entrar';
            btnLogin.disabled = false;
        });
    }

    function loginSucesso(data) {
        // Salva informações do usuário no sessionStorage
        sessionStorage.setItem('techFit_usuario', JSON.stringify(data.usuario));
        sessionStorage.setItem('techFit_logado', 'true');

        // Redireciona para a página inicial
        window.location.href = '../../Home/home.php';
    }

    function mostrarErro(input, mensagem) {
        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-mensagem';
        erroDiv.textContent = mensagem;
        erroDiv.style.color = '#ff4444';
        erroDiv.style.fontSize = '12px';
        erroDiv.style.marginTop = '5px';
        
        input.style.borderColor = '#ff4444';
        input.parentNode.appendChild(erroDiv);
    }

    function mostrarErroLogin(mensagem) {
        // Remove erro anterior
        const erroAnterior = document.querySelector('.erro-login-geral');
        if (erroAnterior) {
            erroAnterior.remove();
        }

        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-login-geral';
        erroDiv.textContent = mensagem;
    }
});
