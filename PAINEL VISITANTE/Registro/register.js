// register.js - VERSÃO ATUALIZADA PARA PHP
document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('formRegistro');
    const inputCPF = document.getElementById('cpf');
    const inputSenha = document.getElementById('senha');
    const inputNascimento = document.getElementById('nascimento');
    const inputTelefone = document.getElementById('telefone');
    const inputConfirmarSenha = document.getElementById('confirmar_senha');

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

    // Máscara para telefone
    inputTelefone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value.substring(0, 15);
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
        const erroAnterior = campo.parentNode.querySelector('.mensagem-erro');
        if (erroAnterior) {
            erroAnterior.remove();
        }
        
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

    // Remover mensagem de erro
    function removerErro(campo) {
        campo.style.borderColor = '';
        const erroAnterior = campo.parentNode.querySelector('.mensagem-erro');
        if (erroAnterior) {
            erroAnterior.remove();
        }
    }

    // Mostrar mensagem de sucesso
    function mostrarSucesso(campo, mensagem) {
        const sucessoAnterior = campo.parentNode.querySelector('.mensagem-sucesso');
        if (sucessoAnterior) {
            sucessoAnterior.remove();
        }
        
        campo.style.borderColor = '#27ae60';
        
        const mensagemSucesso = document.createElement('span');
        mensagemSucesso.className = 'mensagem-sucesso';
        mensagemSucesso.style.color = '#27ae60';
        mensagemSucesso.style.fontSize = '12px';
        mensagemSucesso.style.marginTop = '5px';
        mensagemSucesso.style.display = 'block';
        mensagemSucesso.textContent = mensagem;
        
        campo.parentNode.appendChild(mensagemSucesso);
    }

    // Validação em tempo real do CPF
    inputCPF.addEventListener('blur', function() {
        if (this.value && !validarCPF(this.value)) {
            mostrarErro(this, 'CPF inválido');
        } else if (this.value && validarCPF(this.value)) {
            removerErro(this);
            mostrarSucesso(this, 'CPF válido');
            setTimeout(() => {
                removerErro(this); // Remove a mensagem de sucesso também
            }, 2000);
        } else {
            removerErro(this);
        }
    });

    // Validação em tempo real da senha
    inputSenha.addEventListener('input', function() {
        if (this.value && !validarSenha(this.value)) {
            mostrarErro(this, 'A senha deve ter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos');
        } else if (this.value && validarSenha(this.value)) {
            removerErro(this);
            mostrarSucesso(this, 'Senha forte!');
        } else {
            removerErro(this);
        }
    });

    // Validação em tempo real da confirmação de senha
    inputConfirmarSenha.addEventListener('input', function() {
        const senha = inputSenha.value;
        const confirmarSenha = this.value;
        
        if (confirmarSenha && senha !== confirmarSenha) {
            mostrarErro(this, 'As senhas não coincidem');
        } else if (confirmarSenha && senha === confirmarSenha) {
            removerErro(this);
            mostrarSucesso(this, 'Senhas coincidem!');
            setTimeout(() => {
                removerErro(this);
            }, 2000);
        } else {
            removerErro(this);
        }
    });

    // Validação em tempo real da idade
    inputNascimento.addEventListener('change', function() {
        const idade = validarIdade(this.value);
        if (idade < 16) {
            mostrarErro(this, 'É necessário ter pelo menos 16 anos para se cadastrar');
        } else {
            removerErro(this);
            mostrarSucesso(this, `Idade válida: ${idade} anos`);
            setTimeout(() => {
                removerErro(this);
            }, 2000);
        }
    });

    // Validação em tempo real do email
    const inputEmail = document.getElementById('email');
    inputEmail.addEventListener('blur', function() {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !regexEmail.test(this.value)) {
            mostrarErro(this, 'E-mail inválido');
        } else if (this.value && regexEmail.test(this.value)) {
            removerErro(this);
            mostrarSucesso(this, 'E-mail válido');
            setTimeout(() => {
                removerErro(this);
            }, 2000);
        } else {
            removerErro(this);
        }
    });

    // Validação em tempo real do telefone
    inputTelefone.addEventListener('blur', function() {
        const telefoneLimpo = this.value.replace(/\D/g, '');
        if (telefoneLimpo && telefoneLimpo.length < 10) {
            mostrarErro(this, 'Telefone inválido');
        } else if (telefoneLimpo && telefoneLimpo.length >= 10) {
            removerErro(this);
            mostrarSucesso(this, 'Telefone válido');
            setTimeout(() => {
                removerErro(this);
            }, 2000);
        } else {
            removerErro(this);
        }
    });

    // Validação do formulário antes do envio
    formRegistro.addEventListener('submit', function(e) {
        let formValido = true;
        
        // Limpar todas as mensagens de erro anteriores
        const mensagensErro = formRegistro.querySelectorAll('.mensagem-erro');
        mensagensErro.forEach(erro => erro.remove());
        
        // Resetar bordas
        const inputs = formRegistro.querySelectorAll('input, select');
        inputs.forEach(input => input.style.borderColor = '');

        // Validação dos campos obrigatórios
        const camposObrigatorios = formRegistro.querySelectorAll('[required]');
        camposObrigatorios.forEach(campo => {
            if (!campo.value.trim()) {
                mostrarErro(campo, 'Este campo é obrigatório');
                formValido = false;
                
                // Scroll para o primeiro campo com erro
                if (formValido === false) {
                    campo.focus();
                    formValido = null; // Para evitar múltiplos focus
                }
            }
        });

        if (!formValido) {
            e.preventDefault();
            return;
        }

        // Validação específica do CPF
        if (inputCPF.value && !validarCPF(inputCPF.value)) {
            mostrarErro(inputCPF, 'CPF inválido');
            formValido = false;
            inputCPF.focus();
            e.preventDefault();
            return;
        }

        // Validação da idade
        if (inputNascimento.value) {
            const idade = validarIdade(inputNascimento.value);
            if (idade < 16) {
                mostrarErro(inputNascimento, 'É necessário ter pelo menos 16 anos para se cadastrar');
                formValido = false;
                inputNascimento.focus();
                e.preventDefault();
                return;
            }
        }

        // Validação da senha
        if (inputSenha.value && !validarSenha(inputSenha.value)) {
            mostrarErro(inputSenha, 'A senha deve ter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos');
            formValido = false;
            inputSenha.focus();
            e.preventDefault();
            return;
        }

        // Validação do email
        const email = document.getElementById('email').value;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !regexEmail.test(email)) {
            mostrarErro(document.getElementById('email'), 'E-mail inválido');
            formValido = false;
            document.getElementById('email').focus();
            e.preventDefault();
            return;
        }

        // Validação de confirmação de senha
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar_senha').value;
        if (senha && confirmarSenha && senha !== confirmarSenha) {
            mostrarErro(document.getElementById('confirmar_senha'), 'As senhas não coincidem');
            formValido = false;
            document.getElementById('confirmar_senha').focus();
            e.preventDefault();
            return;
        }

        // Validação do telefone
        const telefoneLimpo = inputTelefone.value.replace(/\D/g, '');
        if (telefoneLimpo && telefoneLimpo.length < 10) {
            mostrarErro(inputTelefone, 'Telefone inválido');
            formValido = false;
            inputTelefone.focus();
            e.preventDefault();
            return;
        }

        // Se todas as validações passarem, mostrar loading
        if (formValido) {
            const btnSubmit = formRegistro.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            
            btnSubmit.textContent = 'Cadastrando...';
            btnSubmit.disabled = true;
            
            // O formulário será enviado normalmente para o PHP
            // O loading será mostrado até a página recarregar
            
            // Caso queira fazer algo antes do envio, pode adicionar aqui
            console.log('Formulário válido, enviando para o servidor...');
        }
    });

    // Prevenir colar em campos específicos
    inputCPF.addEventListener('paste', function(e) {
        e.preventDefault();
        mostrarErro(this, 'Cole não é permitido neste campo. Digite manualmente.');
        setTimeout(() => removerErro(this), 3000);
    });

    // Foco nos campos com erro
    formRegistro.addEventListener('input', function(e) {
        if (e.target.matches('input, select')) {
            removerErro(e.target);
        }
    });

    // Limpar erros ao mudar de campo
    formRegistro.addEventListener('focusin', function(e) {
        if (e.target.matches('input, select')) {
            removerErro(e.target);
        }
    });

    // Função para buscar CEP automático (opcional)
    function buscarCEP() {
        // Adicione um campo CEP se quiser usar esta função
        const inputCEP = document.getElementById('cep');
        if (inputCEP) {
            inputCEP.addEventListener('blur', function() {
                const cep = this.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.erro) {
                                document.getElementById('endereco').value = 
                                    `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                            }
                        })
                        .catch(error => console.log('Erro ao buscar CEP:', error));
                }
            });
        }
    }

    // Inicializar busca de CEP se o campo existir
    buscarCEP();

    // Efeito de foco nos campos
    const todosCampos = formRegistro.querySelectorAll('input, select');
    todosCampos.forEach(campo => {
        campo.addEventListener('focus', function() {
            this.style.borderColor = '#3498db';
            this.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
        });
        
        campo.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });

    // Mostrar/ocultar senha (opcional)
    function togglePasswordVisibility() {
        const toggleSenha = document.createElement('span');
        toggleSenha.innerHTML = '👁️';
        toggleSenha.style.position = 'absolute';
        toggleSenha.style.right = '10px';
        toggleSenha.style.top = '50%';
        toggleSenha.style.transform = 'translateY(-50%)';
        toggleSenha.style.cursor = 'pointer';
        toggleSenha.style.fontSize = '16px';
        
        const toggleConfirmar = toggleSenha.cloneNode(true);
        
        // Adicionar ao campo senha
        const campoSenha = inputSenha.parentNode;
        campoSenha.style.position = 'relative';
        campoSenha.appendChild(toggleSenha);
        
        // Adicionar ao campo confirmar senha
        const campoConfirmar = inputConfirmarSenha.parentNode;
        campoConfirmar.style.position = 'relative';
        campoConfirmar.appendChild(toggleConfirmar);
        
        // Funcionalidade
        toggleSenha.addEventListener('click', function() {
            const type = inputSenha.getAttribute('type') === 'password' ? 'text' : 'password';
            inputSenha.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '👁️' : '🔒';
        });
        
        toggleConfirmar.addEventListener('click', function() {
            const type = inputConfirmarSenha.getAttribute('type') === 'password' ? 'text' : 'password';
            inputConfirmarSenha.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '👁️' : '🔒';
        });
    }

    // Inicializar toggle de senha
    togglePasswordVisibility();

    console.log('Tech Fit - Sistema de cadastro inicializado!');
});