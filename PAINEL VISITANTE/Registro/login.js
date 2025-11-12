// Função chamada quando o login é bem-sucedido
function loginSucesso(data) {
    // Salva informações do usuário no sessionStorage
    sessionStorage.setItem('techFit_usuario', JSON.stringify(data.usuario));
    sessionStorage.setItem('techFit_logado', 'true');

    // Redireciona para a página inicial
    window.location.href = '../../Home/home.php';
}

// No realizarLogin(), atualize o fetch:
function realizarLogin() {
    // ... código anterior ...
    
    fetch('processa_login.php', {  // Arquivo na mesma pasta
        method: 'POST',
        body: formData
    })
    // ... resto do código ...
}