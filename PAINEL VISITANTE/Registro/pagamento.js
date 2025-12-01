document.addEventListener('DOMContentLoaded', function() {
    const formPagamento = document.getElementById('formPagamento');
    const tipoPagamento = document.getElementById('tipo_pagamento');
    const btnFinalizar = document.getElementById('btnFinalizar');

    // Elementos dos campos do cartão
    const numeroCartao = document.getElementById('numero_cartao');
    const validadeCartao = document.getElementById('validade_cartao');
    const cvvCartao = document.getElementById('cvv_cartao');
    const nomeCartao = document.getElementById('nome_cartao');

    // Mostrar/ocultar campos de pagamento
    tipoPagamento.addEventListener('change', function() {
        // Esconder todas as seções
        document.querySelectorAll('.secao-pagamento').forEach(sec => {
            sec.classList.add('hidden');
        });

        // Mostrar seção específica
        const tipo = this.value;
        if (tipo === 'CREDITO' || tipo === 'DEBITO') {
            document.getElementById('campos-cartao').classList.remove('hidden');
            // Tornar campos do cartão obrigatórios
            tornarCamposCartaoObrigatorios(true);
        } else {
            // Tornar campos do cartão não obrigatórios
            tornarCamposCartaoObrigatorios(false);
        }
        
        if (tipo === 'PIX') {
            document.getElementById('instrucoes-pix').classList.remove('hidden');
        } else if (tipo === 'BOLETO') {
            document.getElementById('instrucoes-boleto').classList.remove('hidden');
        }
    });

    // Função para tornar campos do cartão obrigatórios ou não
    function tornarCamposCartaoObrigatorios(obrigatorio) {
        const camposCartao = [numeroCartao, validadeCartao, cvvCartao, nomeCartao];
        camposCartao.forEach(campo => {
            if (campo) {
                campo.required = obrigatorio;
                if (!obrigatorio) {
                    removerErro(campo);
                }
            }
        });
    }

    // Máscaras para os campos do cartão
    if (numeroCartao) {
        numeroCartao.addEventListener('input', mascararNumeroCartao);
        numeroCartao.addEventListener('blur', validarNumeroCartao);
    }
    if (validadeCartao) {
        validadeCartao.addEventListener('input', mascararValidadeCartao);
        validadeCartao.addEventListener('blur', validarValidadeCartao);
    }
    if (cvvCartao) {
        cvvCartao.addEventListener('input', mascararCVV);
        cvvCartao.addEventListener('blur', validarCVV);
    }
    if (nomeCartao) {
        nomeCartao.addEventListener('blur', validarNomeCartao);
    }

    // Validação do formulário
    formPagamento.addEventListener('submit', function(e) {
        if (!validarFormulario()) {
            e.preventDefault();
        } else {
            // Mostrar loading
            btnFinalizar.innerHTML = 'Processando Pagamento...';
            btnFinalizar.disabled = true;
            btnFinalizar.style.opacity = '0.7';
            btnFinalizar.style.cursor = 'not-allowed';
            
            // Adicionar spinner
            const spinner = document.createElement('span');
            spinner.innerHTML = ' ⏳';
            btnFinalizar.appendChild(spinner);
            
            console.log('Processando pagamento...');
        }
    });

    function mascararNumeroCartao(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value.substring(0, 19);
    }

    function mascararValidadeCartao(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.replace(/(\d{2})(?=\d)/, '$1/');
        }
        e.target.value = value.substring(0, 5);
    }

    function mascararCVV(e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4); // Alguns cartões têm 4 dígitos
    }

    function validarNumeroCartao() {
        const numeroLimpo = numeroCartao.value.replace(/\s/g, '');
        if (numeroLimpo && (numeroLimpo.length < 13 || numeroLimpo.length > 19)) {
            mostrarErro(numeroCartao, 'Número do cartão deve ter entre 13 e 19 dígitos');
            return false;
        }
        removerErro(numeroCartao);
        return true;
    }

    function validarValidadeCartao() {
        const valor = validadeCartao.value;
        if (valor && !/^\d{2}\/\d{2}$/.test(valor)) {
            mostrarErro(validadeCartao, 'Formato inválido (use MM/AA)');
            return false;
        }
        
        // Validar se não é uma data expirada
        if (valor) {
            const [mes, ano] = valor.split('/');
            const dataValidade = new Date(2000 + parseInt(ano), parseInt(mes) - 1);
            const hoje = new Date();
            
            if (dataValidade < hoje) {
                mostrarErro(validadeCartao, 'Cartão expirado');
                return false;
            }
        }
        
        removerErro(validadeCartao);
        return true;
    }

    function validarCVV() {
        const cvv = cvvCartao.value;
        if (cvv && (cvv.length < 3 || cvv.length > 4)) {
            mostrarErro(cvvCartao, 'CVV deve ter 3 ou 4 dígitos');
            return false;
        }
        removerErro(cvvCartao);
        return true;
    }

    function validarNomeCartao() {
        if (nomeCartao.value && nomeCartao.value.trim().length < 2) {
            mostrarErro(nomeCartao, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        removerErro(nomeCartao);
        return true;
    }

    function validarFormulario() {
        let formValido = true;
        const tipo = tipoPagamento.value;
        
        // Limpar erros anteriores
        document.querySelectorAll('.mensagem-erro').forEach(erro => erro.remove());
        
        // Validar tipo de pagamento
        if (!tipo) {
            mostrarErro(tipoPagamento, 'Selecione uma forma de pagamento');
            tipoPagamento.focus();
            formValido = false;
        } else {
            removerErro(tipoPagamento);
        }

        // Validar campos de cartão se necessário
        if ((tipo === 'CREDITO' || tipo === 'DEBITO') && !validarCamposCartao()) {
            formValido = false;
        }

        // Scroll para o primeiro erro
        if (!formValido) {
            const primeiroErro = document.querySelector('.mensagem-erro');
            if (primeiroErro) {
                primeiroErro.closest('.campo-grupo').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }

        return formValido;
    }

    function validarCamposCartao() {
        let valido = true;

        if (!validarNumeroCartao()) valido = false;
        if (!validarValidadeCartao()) valido = false;
        if (!validarCVV()) valido = false;
        if (!validarNomeCartao()) valido = false;

        // Validação adicional de campos vazios
        const campos = [numeroCartao, validadeCartao, cvvCartao, nomeCartao];
        campos.forEach(campo => {
            if (campo && !campo.value.trim()) {
                mostrarErro(campo, 'Este campo é obrigatório');
                valido = false;
            }
        });

        return valido;
    }

    function mostrarErro(campo, mensagem) {
        removerErro(campo);
        campo.style.borderColor = '#e74c3c';
        campo.classList.add('error');
        
        const mensagemErro = document.createElement('span');
        mensagemErro.className = 'mensagem-erro';
        mensagemErro.style.color = '#e74c3c';
        mensagemErro.style.fontSize = '12px';
        mensagemErro.style.marginTop = '5px';
        mensagemErro.style.display = 'block';
        mensagemErro.textContent = mensagem;
        
        const parent = campo.closest('.campo-grupo') || campo.parentNode;
        parent.appendChild(mensagemErro);
    }

    function removerErro(campo) {
        campo.style.borderColor = '';
        campo.classList.remove('error');
        const parent = campo.closest('.campo-grupo') || campo.parentNode;
        const erroAnterior = parent.querySelector('.mensagem-erro');
        if (erroAnterior) {
            erroAnterior.remove();
        }
    }

    // Adicionar CSS para estilos dinâmicos
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #e74c3c !important;
            background-color: #fee !important;
        }
        
        .hidden {
            display: none !important;
        }
        
        button:disabled {
            opacity: 0.7 !important;
            cursor: not-allowed !important;
        }
        
        .mensagem-erro {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        }
    `;
    document.head.appendChild(style);

    console.log('Sistema de pagamento inicializado!');
});