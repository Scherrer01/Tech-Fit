// register.js

document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('formRegistro');
    const inputCPF = document.getElementById('cpf');
    const inputSenha = document.getElementById('senha');
    const inputNascimento = document.getElementById('nascimento');

    // Máscara para CPF
    inputCPF.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
            e.target.value = value.substring(0, 14);
        }
    });

    // Validação de CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = soma % 11;
        let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
        
        if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = soma % 11;
        let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
        
        return digitoVerificador2 === parseInt(cpf.charAt(10));
    }

    // Validação de idade mínima (16 anos)
    function validarIdade(dataNascimento) {
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            return idade - 1;
        }
        return idade;
    }

    // Validação de senha forte
    function validarSenha(senha) {
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{6,}$/;
    return regexSenha.test(senha);
}

    // Mostrar mensagem de erro
    function mostrarErro(campo, mensagem) {
        // Remove mensagem de erro anterior
        const erroAnterior = campo.parentNode.querySelector('.mensagem-erro');
        if (erroAnterior) {
            erroAnterior.remove();
        }
        
        // Adiciona borda vermelha
        campo.style.borderColor = '#e74c3c';
        
        // Cria e adiciona mensagem de erro
        const mensagemErro = document.createElement('span');
        mensagemErro.className = 'mensagem-erro';
        mensagemErro.style.color = '#e74c3c';
        mensagemErro.style.fontSize = '12px';
        mensagemErro.style.marginTop = '5px';
        mensagemErro.style.display = 'block';
        mensagemErro.textContent = mensagem;
        
        campo.parentNode.appendChild(mensagemErro);
    }

    // Remover mensagem de erro
    function removerErro(campo) {
        campo.style.borderColor = '';
        const erroAnterior = campo.parentNode.querySelector('.mensagem-erro');
        if (erroAnterior) {
            erroAnterior.remove();
        }
    }

    // Validação em tempo real
    inputCPF.addEventListener('blur', function() {
        if (this.value && !validarCPF(this.value)) {
            mostrarErro(this, 'CPF inválido');
        } else {
            removerErro(this);
        }
    });

    inputSenha.addEventListener('input', function() {
        if (this.value && !validarSenha(this.value)) {
            mostrarErro(this, 'A senha deve ter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos');
        } else {
            removerErro(this);
        }
    });

    inputNascimento.addEventListener('change', function() {
        const idade = validarIdade(this.value);
        if (idade < 16) {
            mostrarErro(this, 'É necessário ter pelo menos 16 anos para se cadastrar');
        } else {
            removerErro(this);
        }
    });

    // Validação do formulário
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let formValido = true;
        
        // Validação dos campos obrigatórios
        const camposObrigatorios = formRegistro.querySelectorAll('[required]');
        camposObrigatorios.forEach(campo => {
            if (!campo.value.trim()) {
                mostrarErro(campo, 'Este campo é obrigatório');
                formValido = false;
            }
        });

        // Validação específica do CPF
        if (inputCPF.value && !validarCPF(inputCPF.value)) {
            mostrarErro(inputCPF, 'CPF inválido');
            formValido = false;
        }

        // Validação da idade
        if (inputNascimento.value) {
            const idade = validarIdade(inputNascimento.value);
            if (idade < 16) {
                mostrarErro(inputNascimento, 'É necessário ter pelo menos 16 anos para se cadastrar');
                formValido = false;
            }
        }

        // Validação da senha
        if (inputSenha.value && !validarSenha(inputSenha.value)) {
            mostrarErro(inputSenha, 'A senha deve ter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos');
            formValido = false;
        }

        // Validação do email
        const email = document.getElementById('email').value;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !regexEmail.test(email)) {
            mostrarErro(document.getElementById('email'), 'E-mail inválido');
            formValido = false;
        }

        // Se o formulário for válido, processa o cadastro
        if (formValido) {
            processarCadastro();
        }
    });

    // Função para processar o cadastro
    // Função para processar o cadastro
function processarCadastro() {
    const dadosUsuario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        nascimento: document.getElementById('nascimento').value,
        cpf: inputCPF.value.replace(/\D/g, ''),
        senha: inputSenha.value
    };

    // Simulação de envio para o servidor
    console.log('Dados do usuário:', dadosUsuario);
    
    // Mostrar loading
    const botao = formRegistro.querySelector('.btn-registrar');
    const textoOriginal = botao.textContent;
    botao.textContent = 'Cadastrando...';
    botao.disabled = true;

    // Simulação de requisição AJAX
    setTimeout(() => {
        // Aqui você faria a requisição real para o servidor
        // fetch('/api/cadastro', { method: 'POST', body: JSON.stringify(dadosUsuario) })
        
        // Resetar formulário
        formRegistro.reset();
        
        // Restaurar botão
        botao.textContent = textoOriginal;
        botao.disabled = false;
        
        // REDIRECIONAMENTO PARA A PÁGINA HOME
        window.location.href = '/Home/home.html';
        
    }, 2000);
}

    // Prevenir colar em campos específicos
    inputCPF.addEventListener('paste', function(e) {
        e.preventDefault();
    });

    // Foco nos campos com erro
    formRegistro.addEventListener('input', function(e) {
        if (e.target.matches('input')) {
            removerErro(e.target);
        }
    });
});