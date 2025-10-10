// esqueciSenha.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const formRecuperacao = document.getElementById('formRecuperacao');
    const etapaCodigo = document.getElementById('etapaCodigo');
    const etapaNovaSenha = document.getElementById('etapaNovaSenha');
    const sucessoMensagem = document.getElementById('sucessoMensagem');
    const emailInput = document.getElementById('email');
    const emailDestino = document.getElementById('emailDestino');
    const codigoInputs = document.querySelectorAll('.codigo-digito');
    const codigoCompleto = document.getElementById('codigoCompleto');
    const btnVerificar = document.getElementById('btnVerificar');
    const reenviarCodigo = document.getElementById('reenviarCodigo');
    const contador = document.getElementById('contador');
    const novaSenhaInput = document.getElementById('novaSenha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const btnRedefinir = document.getElementById('btnRedefinir');
    
    // Requisitos de senha
    const reqTamanho = document.getElementById('reqTamanho');
    const reqMaiuscula = document.getElementById('reqMaiuscula');
    const reqNumero = document.getElementById('reqNumero');

    // Variáveis de controle
    let codigoGerado = '';
    let tempoRestante = 60;
    let contadorInterval;
    let emailUsuario = '';

    // Event Listeners
    formRecuperacao.addEventListener('submit', enviarEmailRecuperacao);
    btnVerificar.addEventListener('click', verificarCodigo);
    reenviarCodigo.addEventListener('click', reenviarCodigoVerificacao);
    btnRedefinir.addEventListener('click', redefinirSenha);

    // Configuração dos inputs de código
    configurarInputsCodigo();

    // Validação em tempo real da nova senha
    novaSenhaInput.addEventListener('input', validarSenhaEmTempoReal);
    confirmarSenhaInput.addEventListener('input', validarConfirmacaoSenha);

    function configurarInputsCodigo() {
        codigoInputs.forEach((input, index) => {
            // Permite apenas números
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Move para o próximo input automaticamente
                if (this.value.length === 1 && index < codigoInputs.length - 1) {
                    codigoInputs[index + 1].focus();
                }
                
                atualizarCodigoCompleto();
            });

            // Permite navegação com backspace e setas
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    codigoInputs[index - 1].focus();
                } else if (e.key === 'ArrowLeft' && index > 0) {
                    codigoInputs[index - 1].focus();
                } else if (e.key === 'ArrowRight' && index < codigoInputs.length - 1) {
                    codigoInputs[index + 1].focus();
                }
            });
        });
    }

    function atualizarCodigoCompleto() {
        let codigo = '';
        codigoInputs.forEach(input => {
            codigo += input.value;
        });
        codigoCompleto.value = codigo;
    }

    function enviarEmailRecuperacao(event) {
        event.preventDefault();
        
        if (!validarEmail()) {
            return;
        }

        emailUsuario = emailInput.value.trim();
        
        // Simulação de envio de email
        const btnEnviar = document.querySelector('.btn-recuperar');
        const textoOriginal = btnEnviar.textContent;
        btnEnviar.textContent = 'Enviando...';
        btnEnviar.disabled = true;

        setTimeout(() => {
            // Gerar código aleatório de 6 dígitos
            codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
            console.log('Código gerado (para testes):', codigoGerado); // Remover em produção
            
            // Atualizar interface para etapa do código
            emailDestino.textContent = emailUsuario;
            formRecuperacao.style.display = 'none';
            etapaCodigo.style.display = 'block';
            
            // Iniciar contador para reenvio
            iniciarContador();
            
            btnEnviar.textContent = textoOriginal;
            btnEnviar.disabled = false;
            
            // Em produção, aqui você enviaria o email:
            // enviarEmailReal(emailUsuario, codigoGerado);
            
        }, 1500);
    }

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

    function verificarCodigo() {
        const codigoDigitado = codigoCompleto.value;

        if (codigoDigitado.length !== 6) {
            mostrarErroCodigo('Por favor, preencha todos os dígitos do código');
            return;
        }

        // Simulação de verificação do código
        btnVerificar.textContent = 'Verificando...';
        btnVerificar.disabled = true;

        setTimeout(() => {
            if (codigoDigitado === codigoGerado) {
                // Código correto - avançar para próxima etapa
                etapaCodigo.style.display = 'none';
                etapaNovaSenha.style.display = 'block';
                pararContador();
            } else {
                // Código incorreto
                mostrarErroCodigo('Código inválido. Tente novamente.');
                limparInputsCodigo();
            }
            
            btnVerificar.textContent = 'Verificar Código';
            btnVerificar.disabled = false;
        }, 1000);
    }

    function reenviarCodigoVerificacao(event) {
        event.preventDefault();
        
        if (reenviarCodigo.classList.contains('desabilitado')) {
            return;
        }

        // Gerar novo código
        codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Novo código gerado (para testes):', codigoGerado); // Remover em produção
        
        // Limpar inputs e focar no primeiro
        limparInputsCodigo();
        codigoInputs[0].focus();
        
        // Reiniciar contador
        tempoRestante = 60;
        iniciarContador();
        
        // Em produção, reenviar email:
        // enviarEmailReal(emailUsuario, codigoGerado);
        
        mostrarMensagemTemporaria('Código reenviado com sucesso!', 'sucesso');
    }

    function iniciarContador() {
        reenviarCodigo.classList.add('desabilitado');
        reenviarCodigo.style.color = '#999';
        reenviarCodigo.style.cursor = 'not-allowed';
        
        contadorInterval = setInterval(() => {
            tempoRestante--;
            contador.textContent = tempoRestante;
            
            if (tempoRestante <= 0) {
                pararContador();
            }
        }, 1000);
    }

    function pararContador() {
        clearInterval(contadorInterval);
        reenviarCodigo.classList.remove('desabilitado');
        reenviarCodigo.style.color = '';
        reenviarCodigo.style.cursor = 'pointer';
        contador.textContent = '';
    }

    function redefinirSenha() {
        if (!validarNovaSenha()) {
            return;
        }

        // Simulação de redefinição de senha
        btnRedefinir.textContent = 'Redefinindo...';
        btnRedefinir.disabled = true;

        setTimeout(() => {
            // Em produção, aqui você enviaria a nova senha para o servidor:
            /*
            fetch('/api/redefinir-senha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailUsuario,
                    novaSenha: novaSenhaInput.value
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarTelaSucesso();
                } else {
                    mostrarErro('Erro ao redefinir senha. Tente novamente.');
                }
            });
            */

            // Simulação de sucesso
            mostrarTelaSucesso();
            
        }, 1500);
    }

    function validarNovaSenha() {
        const senha = novaSenhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        if (!validarForcaSenha(senha)) {
            mostrarErro(novaSenhaInput, 'A senha não atende aos requisitos mínimos');
            return false;
        }

        if (senha !== confirmarSenha) {
            mostrarErro(confirmarSenhaInput, 'As senhas não coincidem');
            return false;
        }

        removerErro(novaSenhaInput);
        removerErro(confirmarSenhaInput);
        return true;
    }

    function validarForcaSenha(senha) {
        const temTamanho = senha.length >= 6;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);

        return temTamanho && temMaiuscula && temNumero;
    }

    function validarSenhaEmTempoReal() {
        const senha = novaSenhaInput.value;
        
        // Atualizar indicadores visuais
        reqTamanho.classList.toggle('atendido', senha.length >= 6);
        reqMaiuscula.classList.toggle('atendido', /[A-Z]/.test(senha));
        reqNumero.classList.toggle('atendido', /[0-9]/.test(senha));
    }

    function validarConfirmacaoSenha() {
        const senha = novaSenhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        if (confirmarSenha && senha !== confirmarSenha) {
            confirmarSenhaInput.style.borderColor = '#ff4444';
        } else if (confirmarSenha) {
            confirmarSenhaInput.style.borderColor = '#00C853';
        } else {
            confirmarSenhaInput.style.borderColor = '';
        }
    }

    function mostrarTelaSucesso() {
        etapaNovaSenha.style.display = 'none';
        sucessoMensagem.style.display = 'block';
    }

    function limparInputsCodigo() {
        codigoInputs.forEach(input => {
            input.value = '';
        });
        codigoCompleto.value = '';
        removerErroCodigo();
    }

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

    function removerErro(input) {
        input.style.borderColor = '';
        const erroExistente = input.parentNode.querySelector('.erro-mensagem');
        if (erroExistente) {
            erroExistente.remove();
        }
    }

    function mostrarErroCodigo(mensagem) {
        // Remove erro anterior
        const erroAnterior = etapaCodigo.querySelector('.erro-codigo');
        if (erroAnterior) {
            erroAnterior.remove();
        }

        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-codigo';
        erroDiv.textContent = mensagem;
        erroDiv.style.color = '#ff4444';
        erroDiv.style.fontSize = '14px';
        erroDiv.style.textAlign = 'center';
        erroDiv.style.marginTop = '10px';
        erroDiv.style.padding = '10px';
        erroDiv.style.backgroundColor = '#ffeaea';
        erroDiv.style.borderRadius = '5px';

        etapaCodigo.querySelector('.codigo-grupo').appendChild(erroDiv);
    }

    function removerErroCodigo() {
        const erroAnterior = etapaCodigo.querySelector('.erro-codigo');
        if (erroAnterior) {
            erroAnterior.remove();
        }
    }

    function mostrarMensagemTemporaria(mensagem, tipo) {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.textContent = mensagem;
        mensagemDiv.style.position = 'fixed';
        mensagemDiv.style.top = '20px';
        mensagemDiv.style.right = '20px';
        mensagemDiv.style.padding = '15px 20px';
        mensagemDiv.style.borderRadius = '5px';
        mensagemDiv.style.color = 'white';
        mensagemDiv.style.zIndex = '1000';
        mensagemDiv.style.fontWeight = '500';
        
        if (tipo === 'sucesso') {
            mensagemDiv.style.backgroundColor = '#00C853';
        } else {
            mensagemDiv.style.backgroundColor = '#ff4444';
        }

        document.body.appendChild(mensagemDiv);

        setTimeout(() => {
            mensagemDiv.remove();
        }, 3000);
    }

    // Adicionar estilos CSS dinamicamente
    const style = document.createElement('style');
    style.textContent = `
        .erro-mensagem {
            color: #ff4444;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        }
        
        .requisito.atendido {
            color: #00C853;
        }
        
        .requisito:not(.atendido) {
            color: #666;
        }
        
        .desabilitado {
            pointer-events: none;
        }
        
        .codigo-inputs {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        
        .codigo-digito {
            width: 40px;
            height: 50px;
            text-align: center;
            font-size: 18px;
            border: 2px solid #ddd;
            border-radius: 5px;
        }
        
        .codigo-digito:focus {
            border-color: #007bff;
            outline: none;
        }
    `;
    document.head.appendChild(style);
});