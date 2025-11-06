// register.js - VERSÃO COMPLETA E CORRIGIDA COM SELEÇÃO DE UNIDADE
document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('formRegistro');
    const inputCPF = document.getElementById('cpf');
    const inputSenha = document.getElementById('senha');
    const inputNascimento = document.getElementById('nascimento');
    const inputTelefone = document.getElementById('telefone');
    const selectUnidade = document.getElementById('unidade');

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

    // Carregar unidades disponíveis
    carregarUnidades();

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

    // Carregar unidades do banco
    async function carregarUnidades() {
        try {
            const response = await fetch('buscar_unidades.php');
            const data = await response.json();
            
            if (data.success) {
                selectUnidade.innerHTML = '<option value="">Selecione uma unidade</option>';
                
                data.unidades.forEach(unidade => {
                    const option = document.createElement('option');
                    option.value = unidade.ID_UNIDADE;
                    option.textContent = `${unidade.NOME_UNIDADE}`;
                    selectUnidade.appendChild(option);
                });
            } else {
                // Fallback para unidades fixas se a API falhar
                carregarUnidadesFallback();
            }
        } catch (error) {
            console.error('Erro ao carregar unidades:', error);
            // Fallback em caso de erro
            carregarUnidadesFallback();
        }
    }

    // Fallback com unidades fixas
    function carregarUnidadesFallback() {
        const unidadesFallback = [
            { ID_UNIDADE: 1, NOME_UNIDADE: 'Tech Fit Centro' },
            { ID_UNIDADE: 2, NOME_UNIDADE: 'Tech Fit Taquaral' },
            { ID_UNIDADE: 3, NOME_UNIDADE: 'Tech Fit Barão Geraldo' },
            { ID_UNIDADE: 4, NOME_UNIDADE: 'Tech Fit São Bernardo' },
            { ID_UNIDADE: 5, NOME_UNIDADE: 'Tech Fit Cambuí' },
            { ID_UNIDADE: 6, NOME_UNIDADE: 'Tech Fit Paulínia' },
            { ID_UNIDADE: 7, NOME_UNIDADE: 'Tech Fit Americana' },
            { ID_UNIDADE: 8, NOME_UNIDADE: 'Tech Fit Hortolândia' },
            { ID_UNIDADE: 9, NOME_UNIDADE: 'Tech Fit Limeira' },
            { ID_UNIDADE: 10, NOME_UNIDADE: 'Tech Fit Sumaré' }
        ];
        
        selectUnidade.innerHTML = '<option value="">Selecione uma unidade</option>';
        unidadesFallback.forEach(unidade => {
            const option = document.createElement('option');
            option.value = unidade.ID_UNIDADE;
            option.textContent = unidade.NOME_UNIDADE;
            selectUnidade.appendChild(option);
        });
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

    // Validação da unidade
    selectUnidade.addEventListener('change', function() {
        if (!this.value) {
            mostrarErro(this, 'Selecione uma unidade');
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

        // Validação de confirmação de senha
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar_senha').value;
        if (senha && confirmarSenha && senha !== confirmarSenha) {
            mostrarErro(document.getElementById('confirmar_senha'), 'As senhas não coincidem');
            formValido = false;
        }

        // Validação da unidade
        if (!selectUnidade.value) {
            mostrarErro(selectUnidade, 'Selecione uma unidade');
            formValido = false;
        }

        if (formValido) {
            processarCadastro();
        }
    });

    // Função para processar o cadastro
    function processarCadastro() {
        const dadosUsuario = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            nascimento: document.getElementById('nascimento').value,
            cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
            telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
            endereco: document.getElementById('endereco').value,
            sexo: document.getElementById('sexo').value,
            id_plano: document.getElementById('plano').value,
            id_unidade: document.getElementById('unidade').value,
            senha: document.getElementById('senha').value,
            confirmar_senha: document.getElementById('confirmar_senha').value
        };

        // Salvar dados temporariamente e redirecionar para pagamento
        localStorage.setItem('dadosCadastroTechFit', JSON.stringify(dadosUsuario));
        window.location.href = 'pagamento.html';
    }

    // Prevenir colar em campos específicos
    inputCPF.addEventListener('paste', function(e) {
        e.preventDefault();
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

    // Validação adicional do telefone
    inputTelefone.addEventListener('blur', function() {
        const telefoneLimpo = this.value.replace(/\D/g, '');
        if (telefoneLimpo && telefoneLimpo.length < 10) {
            mostrarErro(this, 'Telefone inválido');
        } else {
            removerErro(this);
        }
    });

    // Preenchimento automático do endereço baseado no CEP (opcional)
    function buscarCEP(cep) {
        cep = cep.replace(/\D/g, '');
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
    }
});