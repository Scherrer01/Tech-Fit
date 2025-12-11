<?php
// index.php - Painel do Aluno (convertido de HTML para PHP)
session_start();

// Verificar se está logado
if (!isset($_SESSION['logado']) || $_SESSION['logado'] !== true) {
    header('Location: ../../PAINEL VISITANTE/registro/login.php');
    exit;
}

// Dados do aluno da sessão
$nome_aluno = $_SESSION['nome_aluno'] ?? 'Aluno';
$id_aluno = $_SESSION['id_aluno'] ?? '';
$email_aluno = $_SESSION['email_aluno'] ?? '';
$plano_aluno = $_SESSION['plano_aluno'] ?? '';

// Definir URLs das páginas (ajuste conforme sua estrutura)
define('AULAS_URL', 'AULAS/aulas.php');
define('MODALIDADES_URL', 'MODALIDADES/modalidades.php');
define('UNIDADES_URL', 'UNIDADES/unidades.php');
define('PLANOS_URL', 'PLANOS/plano.php');
define('CONTA_URL', 'MINHA CONTA/conta.php');
define('LOGIN_URL', '../../Painel Visitante/login/login.php');
define('LOGO_URL', '../../logo.png'); // Ajuste conforme necessário
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Painel do Aluno - Tech Fit</title>
</head>
<body>
    <!-- Banner de boas-vindas com informações do aluno -->
    

    <header class="cabecalho">
        <div class="logo-container">
            <div class="logo">
                <img src="../../logo.png" alt="Tech Fit">
            </div>
            <h1>Tech <span class="color-accent">Fit</span></h1>
        </div>
        <nav>
            <ul>
                <li><a href="<?php echo AULAS_URL; ?>">Aulas</a></li>
                <li><a href="<?php echo UNIDADES_URL; ?>">Unidades</a></li>
                <li><a href="<?php echo PLANOS_URL; ?>">Planos</a></li>
                <li id="conta"><a href="<?php echo CONTA_URL; ?>">Minha conta</a></li>
            </ul>
        </nav>
    </header>
<!-- ======================================================================= -->

  <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>Transforme seu corpo e mente</h1>
                <p>Na Tech Fit, combinamos tecnologia de ponta com treinamento especializado para resultados extraordinários</p>
                <div class="hero-buttons">
    <a href="/PAINEL ALUNO/AULAS/aulas.php" class="primary-btn">Agendar aula</a>
    <a href="/PAINEL ALUNO/PLANOS/plano.php" class="secondary-btn">Mude seu plano</a>
</div>
                <div class="hero-stats">
                    <div class="stat">
                        <h3>500+</h3>
                        <p>Alunos Ativos</p>
                    </div>
                    <div class="stat">
                        <h3>15</h3>
                        <p>Modalidades</p>
                    </div>
                    <div class="stat">
                        <h3>24/7</h3>
                        <p>Funcionamento</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features">
            <div class="section-header">
                <h2>Benefícios da tech fit</h2>
                <p>Oferecemos o que há de mais moderno em equipamentos e metodologia de treino</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🏋️</div>
                    <h3>Equipamentos High-Tech</h3>
                    <p>Aparelhos com tecnologia de ponta para maximizar seus resultados e segurança</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👨‍🏫</div>
                    <h3>Professores Certificados</h3>
                    <p>Equipe especializada com certificações internacionais em educação física</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Resultados Comprovados</h3>
                    <p>Metodologia baseada em ciência que garante evolução constante</p>
                </div>
            </div>
        </section>

        <!-- Classes Section -->
        <section class="classes">
            <div class="section-header">
                <h2>Nossas Aulas</h2>
                <p>Variedade de modalidades para todos os gostos e objetivos</p>
            </div>
            <div class="classes-grid">
                <div class="class-card">
                    <div class="class-image cardio"></div>
                    <div class="class-info">
                        <h3>Aeróbico</h3>
                        <p>Aulas de alta intensidade com monitoramento cardíaco em tempo real</p>
                        <div class="class-meta">
                            <span>⏱ 45min</span>
                            <span>🔥 Alta Intensidade</span>
                        </div>
                    </div>
                </div>
                <div class="class-card">
                    <div class="class-image strength"></div>
                    <div class="class-info">
                        <h3>Força & Potência</h3>
                        <p>Treino focado em ganho de massa muscular e força máxima</p>
                        <div class="class-meta">
                            <span>⏱ 60min</span>
                            <span>💪 Forte</span>
                        </div>
                    </div>
                </div>
                <div class="class-card">
                    <div class="class-image yoga"></div>
                    <div class="class-info">
                        <h3>Yoga</h3>
                        <p>Prática de yoga com auxílio de profissionais qualificados</p>
                        <div class="class-meta">
                            <span>⏱ 50min</span>
                            <span>🧘‍♀️ Relaxante</span>
                        </div>
                    </div>
                </div>
                <div class="class-card">
                    <div class="class-image boxing"></div>
                    <div class="class-info">
                        <h3>Muay Thai</h3>
                        <p>Treino de Muay Thai com o professor Bruno</p>
                        <div class="class-meta">
                            <span>⏱ 55min</span>
                            <span>🥊 Intenso</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="testimonials">
            <div class="testimonials-grid">
                <!-- Testimonial 1 -->
                <div class="testimonial-card">
                    <div class="quote">"</div>
                    <p>"O serviço foi excepcional! A equipe superou todas as nossas expectativas e entregou resultados incríveis no prazo estabelecido."</p>
                    <div class="client">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Maria Silva" class="client-avatar">
                        <div class="client-info">
                            <h4>Maria Silva</h4>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="testimonial-card">
                    <div class="quote">"</div>
                    <p>"Profissionalismo e qualidade impressionantes. Recomendo fortemente para qualquer empresa que busca excelência em seus projetos."</p>
                    <div class="client">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="João Santos" class="client-avatar">
                        <div class="client-info">
                            <h4>João Santos</h4>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="testimonial-card">
                    <div class="quote">"</div>
                    <p>"A experiência foi transformadora para nosso negócio. A atenção aos detalhes e o suporte pós-implantação foram fundamentais."</p>
                    <div class="client">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Ana Costa" class="client-avatar">
                        <div class="client-info">
                            <h4>Ana Costa</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
<section class="cta-section">
    <div class="cta-content">
        <h2>Pronto para transformar seu corpo?</h2>
        <p>Agende sua aula e venha conhecer a Tech Fit</p>
        <a href="/PAINEL ALUNO/AULAS/aulas.php" class="primary-btn-link">Agendar Aula</a>
    </div>
</section>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <div class="footer-logo">
                            <div class="logo-container">
                                <div class="logo">
                                    <img src="<?php echo LOGO_URL; ?>" alt="Tech Fit">
                                </div>
                                <h2>Tech <span class="color-accent">Fit</span></h2>
                            </div>
                            <p>Transformando vidas através da tecnologia e fitness.</p>
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
                        <h4>Horários</h4>
                        <ul>
                            <li>Segunda a Sexta: 5h às 23h</li>
                            <li>Sábados: 6h às 20h</li>
                            <li>Domingos: 7h às 14h</li>
                            <li>Feriados: 7h às 12h</li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Contato</h4>
                        <ul>
                            <li>📍 Rua Fitness, 123 - Centro</li>
                            <li>📞 (19) 98704-4392</li>
                            <li>✉️ diogo.scherrer@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 Tech Fit Academia. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>