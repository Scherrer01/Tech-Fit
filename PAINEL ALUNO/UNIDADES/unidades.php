<?php
// unidades.php
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unidades - Tech Fit</title>
    <link rel="stylesheet" href="unidades.css">
</head>
<body>
    <!-- ================================================================================= -->
    <!-- CABEÃÇALHO -->
    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="../../logo.png" alt="Tech Fit">
            </div>
            <h1>Tech <span class="color-accent">Fit</span></h1>
        </div>
        <nav>
            <ul>
            <li><a href="/PAINEL ALUNO/index.php">iní­cio</a></li>
            <li><a href="/PAINEL ALUNO/AULAS/aulas.php">Aulas</a></li>
            <li><a href="/PAINEL ALUNO/MODALIDADES/modalidades.php">Modalidades</a></li>
            <li><a href="/PAINEL ALUNO/PLANOS/plano.php">Planos</a></li>
            <li id="conta"><a href="/PAINEL ALUNO/MINHA CONTA/conta.php">Minha conta</a></li>
            </ul>
        </nav>
    </header>
    <!-- ================================================================================= -->

    <!-- ConteÃºdo Principal -->
    <main class="unidades-container">
        <!-- CabeÃ§alho da PÃ¡gina -->
        <section class="page-header">
            <h1>Nossas Unidades</h1>
            <p>Encontre a Tech Fit mais perto de vocÃª</p>
        </section>

        <!-- Filtros por Cidade -->
        <section class="filters-section">
            <div class="filters-container">
                <div class="search-box">
                    <input type="text" placeholder="Buscar unidade...">
                    <button>ðŸ”</button>
                </div>
            </div>
        </section>

<!-- Grid de Unidades -->
<section class="unidades-grid">
    <!-- Tech Fit Centro -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Centro</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua das Palmeiras, 120 - Centro, Campinas/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3333-1100</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸŠâ€â™‚ï¸</span>
                        <span>Piscina</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ¥Š</span>
                        <span>Ãrea de Lutas</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio Luxo</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Esteiras Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi 5G</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit Taquaral -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Taquaral</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Av. JÃºlio de Mesquita, 55 - Taquaral, Campinas/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3344-2200</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸŠâ€â™‚ï¸</span>
                        <span>Piscina</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ…¿ï¸</span>
                        <span>Estacionamento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit BarÃ£o Geraldo -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit BarÃ£o Geraldo</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Av. Santa Isabel, 980 - BarÃ£o Geraldo, Campinas/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3355-3300</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ¥Š</span>
                        <span>Ãrea de Lutas</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ…¿ï¸</span>
                        <span>Estacionamento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit SÃ£o Bernardo -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit SÃ£o Bernardo</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua Ãlvares Machado, 210 - SÃ£o Bernardo, Campinas/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3366-4400</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit CambuÃ­ -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit CambuÃ­</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua Coronel Quirino, 450 - CambuÃ­, Campinas/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3377-5500</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸŠâ€â™‚ï¸</span>
                        <span>Piscina</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio Luxo</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Esteiras Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ¥—</span>
                        <span>Juice Bar</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit PaulÃ­nia -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit PaulÃ­nia</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Av. JosÃ© Paulino, 1800 - Centro, PaulÃ­nia/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3388-6600</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ…¿ï¸</span>
                        <span>Estacionamento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit Americana -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Americana</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua dos LÃ­rios, 230 - Jardim SÃ£o Paulo, Americana/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3399-7700</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸŠâ€â™‚ï¸</span>
                        <span>Piscina</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit HortolÃ¢ndia -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit HortolÃ¢ndia</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Av. Santana, 540 - Jardim Amanda, HortolÃ¢ndia/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3400-8800</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ¥Š</span>
                        <span>Ãrea de Lutas</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ…¿ï¸</span>
                        <span>Estacionamento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit Limeira -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Limeira</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua Presidente Vargas, 910 - Centro, Limeira/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3411-9900</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸŠâ€â™‚ï¸</span>
                        <span>Piscina</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio Luxo</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Esteiras Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ¥—</span>
                        <span>Juice Bar</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit SumarÃ© -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit SumarÃ©</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Av. 3 de Maio, 700 - Centro, SumarÃ©/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3422-1000</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit Valinhos -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Valinhos</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua 13 de Maio, 350 - Centro, Valinhos/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3423-1100</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ¥Š</span>
                        <span>Ãrea de Lutas</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ…¿ï¸</span>
                        <span>Estacionamento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit Vinhedo -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Vinhedo</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Av. IndependÃªncia, 780 - Centro, Vinhedo/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3424-1200</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸŠâ€â™‚ï¸</span>
                        <span>Piscina</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ…¿ï¸</span>
                        <span>Estacionamento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit JaguariÃºna -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit JaguariÃºna</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua SÃ£o Paulo, 230 - Centro, JaguariÃºna/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3425-1300</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’»</span>
                        <span>Wi-Fi</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit Pedreira -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Pedreira</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Av. 21 de Abril, 450 - Centro, Pedreira/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3426-1400</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸŠâ€â™‚ï¸</span>
                        <span>Piscina</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ§˜â€â™€ï¸</span>
                        <span>Studio Yoga</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio Luxo</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Esteiras Tech</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ¥—</span>
                        <span>Juice Bar</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tech Fit Mogi-GuaÃ§u -->
    <div class="unidade-card">
        <div class="unidade-header">
            <h3>Tech Fit Mogi-GuaÃ§u</h3>
        </div>
        <div class="unidade-content">
            <div class="unidade-info">
                <div class="info-item">
                    <span class="icon">ðŸ“</span>
                    <span>Rua Dr. JoÃ£o, 670 - Centro, Mogi-GuaÃ§u/SP</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ“ž</span>
                    <span>(19) 3427-1500</span>
                </div>
                <div class="info-item">
                    <span class="icon">ðŸ•’</span>
                    <span>Seg a Sex: 5h Ã s 23h | SÃ¡b: 6h Ã s 20h | Dom: 7h Ã s 14h</span>
                </div>
            </div>
            <div class="unidade-features">
                <h4>Estrutura:</h4>
                <div class="features-grid">
                    <div class="feature">
                        <span class="feature-icon">ðŸ’ª</span>
                        <span>MusculaÃ§Ã£o</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸƒâ€â™‚ï¸</span>
                        <span>Ãrea Cardio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸš¿</span>
                        <span>VestiÃ¡rio</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">ðŸ…¿ï¸</span>
                        <span>Estacionamento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

    </main>

    <!-- ================================================================================= -->
    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <div class="logo-container">
                            <div class="logo">
                                <img src="../../logo.png" alt="Tech Fit">
                            </div>
                            <h2>Tech <span class="color-accent">Fit</span></h2>
                        </div>
                        <p>Transformando vidas atravÃ©s da tecnologia e fitness.</p>
                    </div>
                    <div class="social-links">
                        <a href="#" class="whatsapp">
                            <svg viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.189-3.553-8.449"/>
                            </svg>
                        </a>
                        <a href="#" class="facebook">
                            <svg viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="#" class="instagram">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="#" class="youtube">
                            <svg viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>HorÃ¡rios</h4>
                    <ul>
                        <li>Segunda a Sexta: 5h Ã s 23h</li>
                        <li>SÃ¡bados: 6h Ã s 20h</li>
                        <li>Domingos: 7h Ã s 14h</li>
                        <li>Feriados: 7h Ã s 12h</li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contato</h4>
                    <ul>
                        <li>ðŸ“ Rua Fitness, 123 - Centro</li>
                        <li>ðŸ“ž (19) 98704-4392</li>
                        <li>âœ‰ï¸ diogo.scherrer@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Tech Fit Academia. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="unidades.js"></script>
</body>
</html>

