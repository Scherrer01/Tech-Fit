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
        } else if (tipo === 'PIX') {
            document.getElementById('instrucoes-pix').classList.remove('hidden');
        } else if (tipo === 'BOLETO') {
            document.getElementById('instrucoes-boleto').classList.remove('hidden');
        }
    });

    // Máscaras para os campos do cartão
    if (numeroCartao) {
        numeroCartao.addEventListener('input', mascararNumeroCartao);
    }
    if (validadeCartao) {
        validadeCartao.addEventListener('input', mascararValidadeCartao);
    }
    if (cvvCartao) {
        cvvCartao.addEventListener('input', mascararCVV);
    }

    // Validação do formulário
    formPagamento.addEventListener('submit', function(e) {
        if (!validarFormulario()) {
            e.preventDefault();
        } else {
            // Mostrar loading
            btnFinalizar.innerHTML = 'Processando...';
            btnFinalizar.disabled = true;
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
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    }

    function validarFormulario() {
        const tipo = tipoPagamento.value;
        
        if (!tipo) {
            alert('Selecione uma forma de pagamento');
            tipoPagamento.focus();
            return false;
        }

        // Validar campos de cartão se necessário
        if ((tipo === 'CREDITO' || tipo === 'DEBITO') && !validarCamposCartao()) {
            return false;
        }

        return true;
    }

    function validarCamposCartao() {
        const campos = [numeroCartao, validadeCartao, cvvCartao, nomeCartao];
        let valido = true;

        campos.forEach(campo => {
            if (!campo.value.trim()) {
                mostrarErro(campo, 'Este campo é obrigatório');
                valido = false;
            } else {
                removerErro(campo);
            }
        });

        // Validação adicional do número do cartão
        const numeroCartaoLimpo = numeroCartao.value.replace(/\s/g, '');
        if (numeroCartaoLimpo && numeroCartaoLimpo.length < 13) {
            mostrarErro(numeroCartao, 'Número do cartão inválido');
            valido = false;
        }

        return valido;
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
});