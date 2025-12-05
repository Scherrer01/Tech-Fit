<?php
// modalidades.php
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modalidades - Tech Fit</title>
    <link rel="stylesheet" href="modalidades.css">
</head>
<body>
    <!-- ================================================================================= -->
    <!-- CABEÃ‡ALHO -->
    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="../../logo.png" alt="Tech Fit">
            </div>
            <h1>Tech <span class="color-accent">Fit</span></h1>
        </div>
        <nav>
            <ul>
                <li><a href="/PAINEL ALUNO/index.php">Início</a></li>
                <li><a href="/PAINEL ALUNO/AULAS/aulas.php">Aulas</a></li>
                <li><a href="/PAINEL ALUNO/PLANOS/plano.php">Planos</a></li>
                <li><a href="/PAINEL ALUNO/UNIDADES/unidades.php">Unidades</a></li>
                <li id="conta"><a href="/PAINEL ALUNO/MINHA CONTA/conta.php">Minha conta</a></li>
            </ul>
        </nav>
    </header>
    <!-- ================================================================================= -->

    <!-- ConteÃºdo Principal -->
    <main class="modalidades-container">
        <!-- CabeÃ§alho da PÃ¡gina -->
        <section class="page-header">
            <h1>Nossas Modalidades</h1>
            <p>ConheÃ§a todas as opÃ§Ãµes de treino com tecnologia de ponta</p>
        </section>

        <!-- Grid de Modalidades -->
        <section class="modalities-grid">
            <!-- Cardio Tech -->
            <div class="modality-card" data-category="cardio tech">
                <div class="modality-image cardio-tech"></div>
                <div class="modality-content">
                    <div class="modality-header">
                        <h3>Cardio</h3>
                        <div class="modality-badges">
                            <span class="badge cardio">Cardio</span>
                        </div>
                    </div>
                    <p class="modality-description">
                        Aulas de cardio com equipamentos de Ãºltima geraÃ§Ã£o e monitoramento em tempo real. 
                        Esteiras, bikes e elÃ­pticos inteligentes que ajustam automaticamente a intensidade.
                    </p>
                    <div class="modality-details">
                        <div class="detail-item">
                            <span class="icon">â±</span>
                            <span>45-60 min</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ”¥</span>
                            <span>500-800 cal</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ’ª</span>
                            <span>Alta Intensidade</span>
                        </div>
                    </div>
                    <div class="modality-benefits">
                        <h4>BenefÃ­cios:</h4>
                        <ul>
                            <li>Melhora capacidade cardiovascular</li>
                            <li>Queima calÃ³rica acelerada</li>
                            <li>Monitoramento preciso de performance</li>
                            <li>Treinos personalizados automÃ¡ticos</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- ForÃ§a & PotÃªncia -->
            <div class="modality-card" data-category="strength tech">
                <div class="modality-image strength-tech"></div>
                <div class="modality-content">
                    <div class="modality-header">
                        <h3>ForÃ§a & PotÃªncia</h3>
                        <div class="modality-badges">
                            <span class="badge strength">ForÃ§a</span>
                        </div>
                    </div>
                    <p class="modality-description">
                        Treino de forÃ§a com equipamentos inteligentes que monitoram carga, repetiÃ§Ãµes e 
                        tÃ©cnica. MÃ¡quinas com sensores que previnem lesÃµes e otimizam resultados.
                    </p>
                    <div class="modality-details">
                        <div class="detail-item">
                            <span class="icon">â±</span>
                            <span>60 min</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ‹ï¸</span>
                            <span>Massa Muscular</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ“Š</span>
                            <span>Progresso Digital</span>
                        </div>
                    </div>
                    <div class="modality-benefits">
                        <h4>BenefÃ­cios:</h4>
                        <ul>
                            <li>Ganho de massa muscular</li>
                            <li>Aumento da forÃ§a mÃ¡xima</li>
                            <li>CorreÃ§Ã£o automÃ¡tica de postura</li>
                            <li>Tracking detalhado do progresso</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Yoga Tech -->
            <div class="modality-card" data-category="mind-body tech">
                <div class="modality-image yoga-tech"></div>
                <div class="modality-content">
                    <div class="modality-header">
                        <h3>Yoga</h3>
                        <div class="modality-badges">
                            <span class="badge mind-body">Mind & Body</span>
                        </div>
                    </div>
                    <p class="modality-description">
                        PrÃ¡tica de yoga com sensores de movimento que garantem o alinhamento perfeito 
                        das posturas. Realidade aumentada para guiar as sequÃªncias de forma precisa.
                    </p>
                    <div class="modality-details">
                        <div class="detail-item">
                            <span class="icon">â±</span>
                            <span>50-60 min</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ§˜â€â™€ï¸</span>
                            <span>Baixo Impacto</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸŽ¯</span>
                            <span>Alinhamento Perfeito</span>
                        </div>
                    </div>
                    <div class="modality-benefits">
                        <h4>BenefÃ­cios:</h4>
                        <ul>
                            <li>Melhora da flexibilidade</li>
                            <li>ReduÃ§Ã£o do estresse</li>
                            <li>CorreÃ§Ã£o postural</li>
                            <li>ConsciÃªncia corporal</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Muay Thai Tech -->
            <div class="modality-card" data-category="fight tech">
                <div class="modality-image muaythai-tech"></div>
                <div class="modality-content">
                    <div class="modality-header">
                        <h3>Muay Thai </h3>
                        <div class="modality-badges">
                            <span class="badge fight">Luta</span>
                        </div>
                    </div>
                    <p class="modality-description">
                        Arte marcial tailandesa com equipamentos inteligentes que medem forÃ§a, velocidade 
                        e precisÃ£o dos golpes. Sacos de pancada com sensores de impacto.
                    </p>
                    <div class="modality-details">
                        <div class="detail-item">
                            <span class="icon">â±</span>
                            <span>55 min</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ¥Š</span>
                            <span>Alta Intensidade</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ“ˆ</span>
                            <span>AnÃ¡lise de Golpes</span>
                        </div>
                    </div>
                    <div class="modality-benefits">
                        <h4>BenefÃ­cios:</h4>
                        <ul>
                            <li>Condicionamento fÃ­sico completo</li>
                            <li>Autodefesa</li>
                            <li>Alta queima calÃ³rica</li>
                            <li>Melhora da coordenaÃ§Ã£o</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Zumba Tech -->
            <div class="modality-card" data-category="cardio tech">
                <div class="modality-image zumba-tech"></div>
                <div class="modality-content">
                    <div class="modality-header">
                        <h3>Zumba</h3>
                        <div class="modality-badges">
                            <span class="badge cardio">Cardio</span>
                        </div>
                    </div>
                    <p class="modality-description">
                        DanÃ§a fitness com ritmos latinos e tecnologia de monitoramento. Sensores de 
                        movimento acompanham a coreografia e calculam a queima calÃ³rica em tempo real.
                    </p>
                    <div class="modality-details">
                        <div class="detail-item">
                            <span class="icon">â±</span>
                            <span>50 min</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ’ƒ</span>
                            <span>Cardio Dance</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸŽµ</span>
                            <span>MÃºsica Interativa</span>
                        </div>
                    </div>
                    <div class="modality-benefits">
                        <h4>BenefÃ­cios:</h4>
                        <ul>
                            <li>Alta queima calÃ³rica (atÃ© 800cal)</li>
                            <li>Melhora do ritmo e coordenaÃ§Ã£o</li>
                            <li>ReduÃ§Ã£o do estresse</li>
                            <li>SocializaÃ§Ã£o e diversÃ£o</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Core Tech - AbdÃ´men -->
            <div class="modality-card" data-category="strength tech">
                <div class="modality-image core-tech"></div>
                <div class="modality-content">
                    <div class="modality-header">
                        <h3>Abdominal</h3>
                        <div class="modality-badges">
                            <span class="badge strength">ForÃ§a</span>
                        </div>
                    </div>
                    <p class="modality-description">
                        Treino especÃ­fico para core e abdÃ´men com eletromiografia (EMG) que monitora 
                        a ativaÃ§Ã£o muscular. Equipamentos que garantem a execuÃ§Ã£o perfeita dos exercÃ­cios.
                    </p>
                    <div class="modality-details">
                        <div class="detail-item">
                            <span class="icon">â±</span>
                            <span>45 min</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ’ª</span>
                            <span>DefiniÃ§Ã£o</span>
                        </div>
                        <div class="detail-item">
                            <span class="icon">ðŸ“Š</span>
                            <span>Biofeedback</span>
                        </div>
                    </div>
                    <div class="modality-benefits">
                        <h4>BenefÃ­cios:</h4>
                        <ul>
                            <li>DefiniÃ§Ã£o abdominal</li>
                            <li>Fortalecimento do core</li>
                            <li>Melhora da postura</li>
                            <li>PrevenÃ§Ã£o de dores lombares</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- ComparaÃ§Ã£o de Modalidades -->
        <section class="comparison-section">
            <h2>Encontre a Modalidade Ideal para VocÃª</h2>
            <div class="comparison-table">
                <div class="table-header">
                    <div class="header-cell">Modalidade</div>
                    <div class="header-cell">Intensidade</div>
                    <div class="header-cell">Queima CalÃ³rica</div>
                    <div class="header-cell">Foco Principal</div>
                    <div class="header-cell">Recomendado para</div>
                </div>
                
                <div class="table-row">
                    <div class="cell modality-name">Cardio</div>
                    <div class="cell intensity-high">Alta</div>
                    <div class="cell">500-800 cal</div>
                    <div class="cell">Condicionamento</div>
                    <div class="cell">Perda de peso, cardio</div>
                </div>
                
                <div class="table-row">
                    <div class="cell modality-name">ForÃ§a & PotÃªncia</div>
                    <div class="cell intensity-high">Alta</div>
                    <div class="cell">400-600 cal</div>
                    <div class="cell">Massa muscular</div>
                    <div class="cell">Hipertrofia, forÃ§a</div>
                </div>
                
                <div class="table-row">
                    <div class="cell modality-name">Yoga</div>
                    <div class="cell intensity-low">Baixa</div>
                    <div class="cell">200-300 cal</div>
                    <div class="cell">Flexibilidade</div>
                    <div class="cell">Relaxamento, postura</div>
                </div>
                
                <div class="table-row">
                    <div class="cell modality-name">Muay Thai</div>
                    <div class="cell intensity-high">Alta</div>
                    <div class="cell">600-900 cal</div>
                    <div class="cell">Condicionamento total</div>
                    <div class="cell">Defesa, alto gasto calÃ³rico</div>
                </div>
                
                <div class="table-row">
                    <div class="cell modality-name">Zumba</div>
                    <div class="cell intensity-medium">MÃ©dia</div>
                    <div class="cell">500-800 cal</div>
                    <div class="cell">Cardio divertido</div>
                    <div class="cell">DiversÃ£o, socializaÃ§Ã£o</div>
                </div>
                
                <div class="table-row">
                    <div class="cell modality-name">Abdominal</div>
                    <div class="cell intensity-medium">MÃ©dia</div>
                    <div class="cell">300-500 cal</div>
                    <div class="cell">DefiniÃ§Ã£o abdominal</div>
                    <div class="cell">AbdÃ´men, postura</div>
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

    <script src="modalidades.js"></script>
</body>
</html>

