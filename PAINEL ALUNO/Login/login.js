// login.js

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const lembrarCheckbox = document.getElementById('lembrar');

    // Verifica se há credenciais salvas no localStorage
    carregarCredenciaisSalvas();

    // Adiciona evento de submit ao formulário
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário
        
        if (validarFormulario()) {
            realizarLogin();
        }
    });

    // Validação em tempo real do email
    emailInput.addEventListener('blur', function() {
        validarEmail();
    });

    // Validação em tempo real da senha
    senhaInput.addEventListener('blur', function() {
        validarSenha();
    });

    // Função para carregar credenciais salvas
    function carregarCredenciaisSalvas() {
        const emailSalvo = localStorage.getItem('techFit_email');
        const senhaSalva = localStorage.getItem('techFit_senha');
        const lembrarSalvo = localStorage.getItem('techFit_lembrar');

        if (lembrarSalvo === 'true' && emailSalvo && senhaSalva) {
            emailInput.value = emailSalvo;
            senhaInput.value = senhaSalva;
            lembrarCheckbox.checked = true;
        }
    }

    // Função para validar o formulário completo
    function validarFormulario() {
        const emailValido = validarEmail();
        const senhaValida = validarSenha();

        return emailValido && senhaValida;
    }

    // Função para validar email
    function validarEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            mostrarErro(emailInput, 'Por favor, digite seu e-mail');
            return false;
        }

        if (!emailRegex.test(email)) {
            mostrarErro(emailInput, 'Por favor, digite um e-mail válido');
            return false;
        }

        removerErro(emailInput);
        return true;
    }

    // Função para validar senha
    function validarSenha() {
        const senha = senhaInput.value.trim();

        if (senha === '') {
            mostrarErro(senhaInput, 'Por favor, digite sua senha');
            return false;
        }

        if (senha.length < 6) {
            mostrarErro(senhaInput, 'A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        removerErro(senhaInput);
        return true;
    }

    // Função para mostrar mensagem de erro
    function mostrarErro(input, mensagem) {
        removerErro(input);
        
        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-mensagem';
        erroDiv.textContent = mensagem;
        erroDiv.style.color = '#ff4444';
        erroDiv.style.fontSize = '12px';
        erroDiv.style.marginTop = '5px';
        
        input.style.borderColor = '#ff4444';
        input.parentNode.appendChild(erroDiv);
    }

    // Função para remover mensagem de erro
    function removerErro(input) {
        input.style.borderColor = '';
        const erroExistente = input.parentNode.querySelector('.erro-mensagem');
        if (erroExistente) {
            erroExistente.remove();
        }
    }

    // Função para realizar o login
    function realizarLogin() {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const lembrar = lembrarCheckbox.checked;

        // Simulação de loading
        const btnLogin = document.querySelector('.btn-login');
        const textoOriginal = btnLogin.textContent;
        btnLogin.textContent = 'Entrando...';
        btnLogin.disabled = true;

        // Simula uma requisição de login (substitua por sua API real)
        setTimeout(() => {
            // Aqui você faria a requisição para sua API
            // Exemplo com fetch:
            /*
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loginSucesso(data);
                } else {
                    loginFalhou(data.message);
                }
            })
            .catch(error => {
                loginFalhou('Erro de conexão. Tente novamente.');
            });
            */

            // Simulação de login bem-sucedido (REMOVA ESTA PARTE EM PRODUÇÃO)
            if (email === 'usuario@exemplo.com' && senha === '123456') {
                loginSucesso({
                    usuario: {
                        nome: 'Usuário Exemplo',
                        email: email
                    }
                });
            } else {
                loginFalhou('E-mail ou senha incorretos');
            }

        }, 1500);

        // Salvar credenciais se "Lembrar-me" estiver marcado
        if (lembrar) {
            localStorage.setItem('techFit_email', email);
            localStorage.setItem('techFit_senha', senha);
            localStorage.setItem('techFit_lembrar', 'true');
        } else {
            localStorage.removeItem('techFit_email');
            localStorage.removeItem('techFit_senha');
            localStorage.removeItem('techFit_lembrar');
        }
    }

    // Função chamada quando o login é bem-sucedido
    function loginSucesso(data) {
        // Salva informações do usuário no sessionStorage
        sessionStorage.setItem('techFit_usuario', JSON.stringify(data.usuario));
        sessionStorage.setItem('techFit_logado', 'true');

        // Redireciona para a página inicial
        window.location.href = '/Home/home.html';
    }

    // Função chamada quando o login falha
    function loginFalhou(mensagem) {
        const btnLogin = document.querySelector('.btn-login');
        btnLogin.textContent = 'Entrar';
        btnLogin.disabled = false;

        // Mostra mensagem de erro geral
        const erroGeral = document.createElement('div');
        erroGeral.className = 'erro-geral';
        erroGeral.textContent = mensagem;
        erroGeral.style.color = '#ff4444';
        erroGeral.style.backgroundColor = '#ffeaea';
        erroGeral.style.padding = '10px';
        erroGeral.style.borderRadius = '5px';
        erroGeral.style.marginBottom = '15px';
        erroGeral.style.textAlign = 'center';
        erroGeral.style.border = '1px solid #ff4444';

        // Remove erro anterior se existir
        const erroAnterior = formLogin.querySelector('.erro-geral');
        if (erroAnterior) {
            erroAnterior.remove();
        }

        formLogin.insertBefore(erroGeral, formLogin.firstChild);

        // Remove o erro após 5 segundos
        setTimeout(() => {
            erroGeral.remove();
        }, 5000);
    }

    // Adiciona estilo CSS para os inputs com erro
    const style = document.createElement('style');
    style.textContent = `
        .erro-mensagem {
            color: #ff4444;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        }
        
        input.error {
            border-color: #ff4444 !important;
        }
    `;
    document.head.appendChild(style);
});

// login-extras.js - Funcionalidades adicionais

// Função para mostrar/ocultar senha
function toggleSenha() {
    const senhaInput = document.getElementById('senha');
    const tipo = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
    senhaInput.setAttribute('type', tipo);
}

// Função para verificar se o usuário já está logado
function verificarSessao() {
    const logado = sessionStorage.getItem('techFit_logado');
    if (logado === 'true') {
        window.location.href = '/Home/home.html';
    }
}

// Função para logout (útil para outras páginas)
function logout() {
    sessionStorage.removeItem('techFit_usuario');
    sessionStorage.removeItem('techFit_logado');
    window.location.href = '/Login/login.html';
}

// Função para obter dados do usuário logado
function getUsuarioLogado() {
    const usuario = sessionStorage.getItem('techFit_usuario');
    return usuario ? JSON.parse(usuario) : null;
}

// Adicione este código ao DOMContentLoaded se quiser o toggle de senha:
/*
const toggleSenhaBtn = document.createElement('button');
toggleSenhaBtn.type = 'button';
toggleSenhaBtn.textContent = '👁';
toggleSenhaBtn.style.position = 'absolute';
toggleSenhaBtn.style.right = '10px';
toggleSenhaBtn.style.top = '50%';
toggleSenhaBtn.style.transform = 'translateY(-50%)';
toggleSenhaBtn.style.background = 'none';
toggleSenhaBtn.style.border = 'none';
toggleSenhaBtn.style.cursor = 'pointer';

const senhaGroup = document.querySelector('.campo-grupo:nth-child(2)');
senhaGroup.style.position = 'relative';
senhaGroup.appendChild(toggleSenhaBtn);

toggleSenhaBtn.addEventListener('click', toggleSenha);
*/