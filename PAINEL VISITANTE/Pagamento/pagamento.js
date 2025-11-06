// pagamento.js - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    const formPagamento = document.getElementById('formPagamento');
    const tipoPagamento = document.getElementById('tipo_pagamento');
    const btnFinalizar = document.getElementById('btnFinalizar');
    const resumoPlano = document.getElementById('resumo-plano');
    const valorTotal = document.getElementById('valor-total');

    // Valores dos planos
    const planos = {
        '1': { nome: 'Básico', valor: 89.00 },
        '2': { nome: 'Premium', valor: 129.00 },
        '3': { nome: 'Elite', valor: 180.00 }
    };

    // Mapeamento para o formato do banco
    const mapeamentoPagamento = {
        'Crédito': 'CARTAO',
        'Débito': 'CARTAO',
        'PIX': 'PIX',
        'Boleto': 'TRANSFERENCIA',
        'Dinheiro': 'DINHEIRO'
    };

    // Carregar dados da sessão/localStorage
    let dadosUsuario = {};

    try {
        const dadosSalvos = localStorage.getItem('dadosCadastroTechFit');
        if (dadosSalvos) {
            dadosUsuario = JSON.parse(dadosSalvos);
            atualizarResumo();
        } else {
            alert('Dados não encontrados. Por favor, volte e preencha o cadastro.');
            window.location.href = 'register.html';
            return;
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Por favor, recomece o cadastro.');
        window.location.href = 'register.html';
        return;
    }

    // Event Listeners
    tipoPagamento.addEventListener('change', mostrarCamposPagamento);
    formPagamento.addEventListener('submit', processarPagamento);

    // Máscaras CORRIGIDAS
    document.getElementById('numero_cartao').addEventListener('input', mascararNumeroCartao);
    document.getElementById('validade_cartao').addEventListener('input', mascararValidadeCartao);
    document.getElementById('cvv_cartao').addEventListener('input', mascararCVV);

    function atualizarResumo() {
        const plano = planos[dadosUsuario.id_plano];
        if (plano) {
            resumoPlano.innerHTML = `
                <p><strong>Plano:</strong> ${plano.nome}</p>
                <p><strong>Valor mensal:</strong> R$ ${plano.valor.toFixed(2)}</p>
                <p><strong>Aluno:</strong> ${dadosUsuario.nome}</p>
            `;
            valorTotal.textContent = `R$ ${plano.valor.toFixed(2)}`;
        }
    }

    function mostrarCamposPagamento() {
        const tipo = tipoPagamento.value;
        
        // Esconder todas as seções
        document.querySelectorAll('.secao-pagamento').forEach(sec => {
            sec.classList.add('hidden');
        });

        // Mostrar seção específica
        switch(tipo) {
            case 'Crédito':
            case 'Débito':
                document.getElementById('campos-cartao').classList.remove('hidden');
                break;
            case 'PIX':
                document.getElementById('instrucoes-pix').classList.remove('hidden');
                break;
            case 'Boleto':
                document.getElementById('instrucoes-boleto').classList.remove('hidden');
                break;
            case 'Dinheiro':
                document.getElementById('instrucoes-dinheiro').classList.remove('hidden');
                break;
        }
    }

    // MÁSCARAS CORRIGIDAS
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

    function validarCamposCartao() {
        const campos = ['numero_cartao', 'validade_cartao', 'cvv_cartao', 'nome_cartao'];
        let valido = true;

        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (!elemento.value.trim()) {
                mostrarErro(elemento, 'Este campo é obrigatório');
                valido = false;
            } else {
                removerErro(elemento);
            }
        });

        // Validação adicional do número do cartão
        const numeroCartao = document.getElementById('numero_cartao').value.replace(/\s/g, '');
        if (numeroCartao && numeroCartao.length < 13) {
            mostrarErro(document.getElementById('numero_cartao'), 'Número do cartão inválido');
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

    async function processarPagamento(e) {
        e.preventDefault();

        const tipo = tipoPagamento.value;
        if (!tipo) {
            alert('Selecione uma forma de pagamento');
            return;
        }

        // Validar campos de cartão se necessário
        if ((tipo === 'Crédito' || tipo === 'Débito') && !validarCamposCartao()) {
            return;
        }

        // Preparar dados para o PHP (formato correto do banco)
        const dadosParaPHP = {
            // Dados do cadastro
            nome: dadosUsuario.nome,
            email: dadosUsuario.email,
            nascimento: dadosUsuario.nascimento,
            cpf: dadosUsuario.cpf,
            telefone: dadosUsuario.telefone,
            endereco: dadosUsuario.endereco,
            sexo: dadosUsuario.sexo,
            id_plano: dadosUsuario.id_plano,
            senha: dadosUsuario.senha,
            confirmar_senha: dadosUsuario.confirmar_senha,
            
            // Dados do pagamento (formato do banco)
            tipo_pagamento: mapeamentoPagamento[tipo],
            valor_pagamento: planos[dadosUsuario.id_plano].valor
        };

        // Mostrar loading
        btnFinalizar.innerHTML = '<div class="loading"></div> Processando...';
        btnFinalizar.disabled = true;

        try {
            const response = await fetch('processar_cadastro_com_pagamento.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaPHP)
            });

            const data = await response.json();

            if (data.success) {
                // Limpar dados temporários
                localStorage.removeItem('dadosCadastroTechFit');
                
                alert('🎉 Cadastro e pagamento realizados com sucesso!\nBem-vindo à Tech Fit!');
                window.location.href = '/Home/home.html';
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro no processamento: ' + error.message);
        } finally {
            btnFinalizar.innerHTML = 'Finalizar Pagamento';
            btnFinalizar.disabled = false;
        }
    }
});