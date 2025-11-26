-- -----------------------------------------------------------
-- Banco de Dados: TECH_FIT
-- Compatível com MySQL 8+
-- Created by: Henrique e Scherrer (modelo otimizado)
-- -----------------------------------------------------------

DROP DATABASE IF EXISTS TECH_FIT;
CREATE DATABASE TECH_FIT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE TECH_FIT;

-- MODE: garantir InnoDB e charset
SET default_storage_engine = 'InnoDB';

-- -----------------------------------------------------------
-- Tabelas principais: PLANOS, ALUNOS, MODALIDADES, FUNCIONARIOS
-- -----------------------------------------------------------

-- PLANOS
DROP TABLE IF EXISTS PLANOS;
CREATE TABLE PLANOS (
  ID_PLANO INT AUTO_INCREMENT PRIMARY KEY,
  NOME_PLANO VARCHAR(100) NOT NULL,
  VALOR DECIMAL(8,2) NOT NULL CHECK (VALOR >= 0),
  BENEFICIOS VARCHAR(1000) DEFAULT NULL,
  DURACAO_MES SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_planos_nome (NOME_PLANO)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ALUNOS
DROP TABLE IF EXISTS ALUNOS;
CREATE TABLE ALUNOS (
  ID_ALUNO INT AUTO_INCREMENT PRIMARY KEY,
  NOME VARCHAR(150) NOT NULL,
  ENDERECO VARCHAR(500),
  NASCIMENTO DATE NOT NULL,
  TELEFONE VARCHAR(20),
  CPF VARCHAR(14) NOT NULL,
  SEXO ENUM('MASCULINO','FEMININO','OUTRO','NAO_DECLARAR') DEFAULT 'NAO_DECLARAR',
  EMAIL VARCHAR(255) NOT NULL,
  SENHA_HASH VARCHAR(255) NOT NULL,
  STATUS_ALUNO ENUM('ATIVO','INATIVO','SUSPENSO') NOT NULL DEFAULT 'ATIVO',
  ID_PLANO INT NOT NULL,
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_alunos_cpf (CPF),
  UNIQUE KEY uk_alunos_email (EMAIL),
  INDEX idx_alunos_plano (ID_PLANO),
  CONSTRAINT fk_alunos_planos FOREIGN KEY (ID_PLANO) REFERENCES PLANOS(ID_PLANO)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MODALIDADES
DROP TABLE IF EXISTS MODALIDADES;
CREATE TABLE MODALIDADES (
  ID_MODALIDADE INT AUTO_INCREMENT PRIMARY KEY,
  NOME_MODALIDADE VARCHAR(120) NOT NULL,
  DESCRICAO_MODALIDADE VARCHAR(1000),
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_modalidades_nome (NOME_MODALIDADE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- FUNCIONARIOS
DROP TABLE IF EXISTS FUNCIONARIOS;
CREATE TABLE FUNCIONARIOS (
  ID_FUNCIONARIO INT AUTO_INCREMENT PRIMARY KEY,
  NOME_FUNCIONARIO VARCHAR(150) NOT NULL,
  LOGIN_REDE VARCHAR(255) NOT NULL,
  NASCIMENTO_FUNCIONARIO DATE NOT NULL,
  CPF_FUNCIONARIO VARCHAR(14) NOT NULL,
  TELEFOHNE_FUNCIONARIO VARCHAR(20),
  DATA_ADMISSAO DATE NOT NULL,
  SALARIO DECIMAL(10,2) NOT NULL CHECK (SALARIO >= 0),
  CARGO VARCHAR(80) NOT NULL,
  ENDERECO_FUNCIONARIO VARCHAR(500),
  SENHA_FUNCIONARIO VARCHAR(255),
  TURNO ENUM('MANHA','TARDE','NOITE','ROTATIVO') DEFAULT 'ROTATIVO',
  ID_MODALIDADE_PREFERENCIAL INT DEFAULT NULL,
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_funcionarios_cpf (CPF_FUNCIONARIO),
  INDEX idx_funcionarios_modalidade (ID_MODALIDADE_PREFERENCIAL),
  CONSTRAINT fk_funcionarios_modalidade FOREIGN KEY (ID_MODALIDADE_PREFERENCIAL)
    REFERENCES MODALIDADES (ID_MODALIDADE)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Tabelas de unidade e relacionamentos (unidade <-> alunos, funcionários)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS UNIDADES;
CREATE TABLE UNIDADES (
  ID_UNIDADE INT AUTO_INCREMENT PRIMARY KEY,
  NOME_UNIDADE VARCHAR(120) NOT NULL,
  ENDERECO_UNIDADE VARCHAR(500) NOT NULL,
  TELEFONE_UNIDADE VARCHAR(20),
  ID_GERENTE INT DEFAULT NULL,
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_unidades_nome (NOME_UNIDADE),
  INDEX idx_unidades_gerente (ID_GERENTE),
  CONSTRAINT fk_unidades_gerente FOREIGN KEY (ID_GERENTE) REFERENCES FUNCIONARIOS (ID_FUNCIONARIO)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- EXERCICIOS (ligado a modalidades e possivelmente a aparelhos)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS EXERCICIOS;
CREATE TABLE EXERCICIOS (
  ID_EXERCICIO INT AUTO_INCREMENT PRIMARY KEY,
  NOME_EXERCICIO VARCHAR(150) NOT NULL,
  DESCRICAO_EXERCICIO TEXT,
  GRUPO_MUSCULAR VARCHAR(100),
  APARELHO VARCHAR(120),
  ID_MODALIDADE INT DEFAULT NULL,
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_exercicios_modalidade (ID_MODALIDADE),
  CONSTRAINT fk_exercicios_modalidade FOREIGN KEY (ID_MODALIDADE) REFERENCES MODALIDADES (ID_MODALIDADE)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- AULAS (com vínculo a modalidade, instrutor e unidade)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS AULAS;
CREATE TABLE AULAS (
  ID_AULA INT AUTO_INCREMENT PRIMARY KEY,
  NOME_AULA VARCHAR(150),
  ID_MODALIDADE INT NOT NULL,
  ID_INSTRUTOR INT DEFAULT NULL,
  ID_UNIDADE INT DEFAULT NULL,
  DIA_SEMANA ENUM('DOM','SEG','TER','QUA','QUI','SEX','SAB') NOT NULL,
  HORARIO_INICIO TIME NOT NULL,
  DURACAO_MINUTOS SMALLINT UNSIGNED NOT NULL DEFAULT 60,
  VAGAS SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_aulas_modalidade (ID_MODALIDADE),
  INDEX idx_aulas_instrutor (ID_INSTRUTOR),
  INDEX idx_aulas_unidade (ID_UNIDADE),
  CONSTRAINT fk_aulas_modalidade FOREIGN KEY (ID_MODALIDADE) REFERENCES MODALIDADES(ID_MODALIDADE)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_aulas_instrutor FOREIGN KEY (ID_INSTRUTOR) REFERENCES FUNCIONARIOS(ID_FUNCIONARIO)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_aulas_unidade FOREIGN KEY (ID_UNIDADE) REFERENCES UNIDADES(ID_UNIDADE)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- PAGAMENTOS
-- -----------------------------------------------------------

DROP TABLE IF EXISTS PAGAMENTOS;
CREATE TABLE PAGAMENTOS (
  ID_PAGAMENTO INT AUTO_INCREMENT PRIMARY KEY,
  ID_ALUNO INT NOT NULL,
  TIPO_PAGAMENTO ENUM('DINHEIRO','CARTAO','PIX','TRANSFERENCIA') NOT NULL,
  VALOR_PAGAMENTO DECIMAL(10,2) NOT NULL CHECK (VALOR_PAGAMENTO >= 0),
  DATA_PAGAMENTO DATE NOT NULL,
  REFERENCIA VARCHAR(255),
  CRIADO_EM TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pagamentos_aluno (ID_ALUNO),
  CONSTRAINT fk_pagamentos_alunos FOREIGN KEY (ID_ALUNO) REFERENCES ALUNOS(ID_ALUNO)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- TABELAS DE RELACIONAMENTO (M:N) com PK composta para evitar duplicidade
-- -----------------------------------------------------------

-- Alunos pertencem a Unidades (matrícula/filial do aluno)
DROP TABLE IF EXISTS PERTENCE;
CREATE TABLE PERTENCE (
  ID_UNIDADE INT NOT NULL,
  ID_ALUNO INT NOT NULL,
  DATA_INSCRICAO DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (ID_UNIDADE, ID_ALUNO),
  INDEX idx_pertence_aluno (ID_ALUNO),
  CONSTRAINT fk_pertence_unidade FOREIGN KEY (ID_UNIDADE) REFERENCES UNIDADES(ID_UNIDADE)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_pertence_aluno FOREIGN KEY (ID_ALUNO) REFERENCES ALUNOS(ID_ALUNO)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Participação em aulas (inscritos por aula)
DROP TABLE IF EXISTS PARTICIPAM;
CREATE TABLE PARTICIPAM (
  ID_AULA INT NOT NULL,
  ID_ALUNO INT NOT NULL,
  DATA_PARTICIPACAO DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID_AULA, ID_ALUNO),
  INDEX idx_participam_aluno (ID_ALUNO),
  CONSTRAINT fk_participam_aula FOREIGN KEY (ID_AULA) REFERENCES AULAS(ID_AULA)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_participam_aluno FOREIGN KEY (ID_ALUNO) REFERENCES ALUNOS(ID_ALUNO)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inscritos em modalidades (aluno <-> modalidade)
DROP TABLE IF EXISTS INSCRITOS;
CREATE TABLE INSCRITOS (
  ID_MODALIDADE INT NOT NULL,
  ID_ALUNO INT NOT NULL,
  DATA_INSCRICAO DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (ID_MODALIDADE, ID_ALUNO),
  INDEX idx_inscritos_aluno (ID_ALUNO),
  CONSTRAINT fk_inscritos_modalidade FOREIGN KEY (ID_MODALIDADE) REFERENCES MODALIDADES(ID_MODALIDADE)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_inscritos_aluno FOREIGN KEY (ID_ALUNO) REFERENCES ALUNOS(ID_ALUNO)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Funcionários que ministram modalidades (M:N)
DROP TABLE IF EXISTS  TEM;
CREATE TABLE TEM (
  ID_MODALIDADE INT NOT NULL,
  ID_FUNCIONARIO INT NOT NULL,
  DATA_ATUACAO DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY (ID_MODALIDADE, ID_FUNCIONARIO),
  INDEX idx_tem_funcionario (ID_FUNCIONARIO),
  CONSTRAINT fk_tem_modalidade FOREIGN KEY (ID_MODALIDADE) REFERENCES MODALIDADES(ID_MODALIDADE)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tem_funcionario FOREIGN KEY (ID_FUNCIONARIO) REFERENCES FUNCIONARIOS(ID_FUNCIONARIO)
    ON UPDATE CASCADE ON DELETE CE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Índices adicionais e algumas views (opcional)
-- -----------------------------------------------------------

-- View para acompanhar saldo de pagamentos por aluno (exemplo)
DROP VIEW IF EXISTS VW_SALDO_ALUNO;
CREATE VIEW VW_SALDO_ALUNO AS
SELECT a.ID_ALUNO,
       a.NOME,
       COALESCE(SUM(p.VALOR_PAGAMENTO), 0) AS TOTAL_PAGO,
       a.ID_PLANO
FROM ALUNOS a
LEFT JOIN PAGAMENTOS p ON p.ID_ALUNO = a.ID_ALUNO
GROUP BY a.ID_ALUNO, a.NOME, a.ID_PLANO;

-- -----------------------------------------------------------
-- Exemplo: trigger para validar limite de vagas em AULAS (opcional)
-- Observação: triggers complexas podem impactar desempenho; revise antes de usar.
-- -----------------------------------------------------------
DROP TRIGGER IF EXISTS trg_check_vagas;
DELIMITER $$
CREATE TRIGGER trg_check_vagas
BEFORE INSERT ON PARTICIPAM
FOR EACH ROW
BEGIN
  DECLARE vagas_disponiveis INT;
  SELECT VAGAS - (SELECT COUNT(*) FROM PARTICIPAM p WHERE p.ID_AULA = NEW.ID_AULA) INTO vagas_disponiveis
  FROM AULAS WHERE ID_AULA = NEW.ID_AULA;
  IF vagas_disponiveis <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sem vagas disponíveis para esta aula.';
  END IF;
END$$
DELIMITER ;

-- -----------------------------------------------------------
-- Observações finais:
-- - Armazene senhas como hash (bcrypt/argon2) em `SENHA_HASH`.
-- - Ajuste tamanhos e tipos conforme regras do cliente (ex: máscaras para CPF/telefone).
-- - Reveja políticas de ON DELETE (RESTRICT/SET NULL/CASCADE) conforme regra de negócio.
-- - Considere adicionar logging/auditoria em tabelas críticas.
-- -----------------------------------------------------------

-- Depois inserir com os IDs desejados
INSERT INTO PLANOS (ID_PLANO, NOME_PLANO, VALOR, BENEFICIOS, DURACAO_MES) VALUES
(1, 'Básico', 89.00, 'Acesso à área de musculação|Avaliação física inicial', 1),
(2, 'Premium', 129.00, 'Acesso à área de musculação|Avaliação física mensal|Todas as aulas coletivas', 1),
(3, 'Elite', 180.00, 'Acesso à área de musculação|Avaliação física quinzenal|Todas as aulas coletivas|4 sessões com personal trainer', 1);

select * from planos;

INSERT INTO MODALIDADES (NOME_MODALIDADE, DESCRICAO_MODALIDADE) VALUES
('Cardio', 'Aula de alta intensidade com monitoramento cardíaco em tempo real'),
('Força & Potência', 'Treino focado em ganho de massa muscular e força máxima'),
('Yoga', 'Prática de yoga com auxílio do professor'),
('Muay Thai', 'Treino de Muay Thai com tecnologia de impacto e performance'),
('Zumba', 'Dança, diversão e queima calórica com tecnologia de monitoramento'),
('Abdominal', 'Treino específico para fortalecimento e definição do abdômen');

select * from modalidades;

INSERT INTO FUNCIONARIOS 
(NOME_FUNCIONARIO, NASCIMENTO_FUNCIONARIO, CPF_FUNCIONARIO, TELEFONE_FUNCIONARIO, DATA_ADMISSAO, SALARIO, CARGO, ENDERECO_FUNCIONARIO, TURNO)
VALUES
('Carlos Silva', '1988-02-14', '123.456.789-00', '(19)99999-1111', '2020-03-10', 3500.00, 'Instrutor', 'Rua A, 123', 'Manhã'),
('Ana Souza', '1990-06-11', '234.567.890-11', '(19)98888-2222', '2019-04-20', 3800.00, 'Instrutora', 'Rua B, 234', 'Tarde'),
('João Mendes', '1985-03-22', '345.678.901-22', '(19)97777-3333', '2021-01-05', 4000.00, 'Personal', 'Rua C, 345', 'Noite'),
('Fernanda Lima', '1992-10-01', '456.789.012-33', '(19)96666-4444', '2020-07-15', 3200.00, 'Recepcionista', 'Rua D, 456', 'Manhã'),
('Bruno Alves', '1987-05-09', '567.890.123-44', '(19)95555-5555', '2022-02-01', 4200.00, 'Instrutor', 'Rua E, 567', 'Tarde'),
('Mariana Torres', '1991-09-30', '678.901.234-55', '(19)94444-6666', '2018-09-15', 3600.00, 'Instrutora', 'Rua F, 678', 'Noite'),
('Gustavo Neri', '1989-01-25', '789.012.345-66', '(19)93333-7777', '2019-11-10', 3900.00, 'Gerente', 'Rua G, 789', 'Manhã'),
('Patrícia Gomes', '1993-12-02', '890.123.456-77', '(19)92222-8888', '2020-06-01', 3100.00, 'Recepcionista', 'Rua H, 890', 'Tarde'),
('Eduardo Pinto', '1986-07-19', '901.234.567-88', '(19)91111-9999', '2017-12-05', 4500.00, 'Instrutor', 'Rua I, 901', 'Noite'),
('Juliana Costa', '1995-11-23', '012.345.678-99', '(19)90000-0000', '2021-08-12', 3300.00, 'Instrutora', 'Rua J, 012', 'Manhã');

select * from funcionarios;

INSERT INTO ALUNOS 
(NOME, ENDERECO, NASCIMENTO, TELEFONE, CPF, SEXO, EMAIL, SENHA_HASH, STATUS_ALUNO, ID_PLANO)
VALUES
('Lucas Pereira', 'Av. Brasil, 123', '2000-01-10', '(19)99888-1111', '111.111.111-11', 'Masculino', 'lucas@gmail.com', '1234', 'ATIVO', 1),
('Beatriz Andrade', 'Rua das Flores, 45', '1999-05-22', '(19)97777-2222', '222.222.222-22', 'Feminino', 'bia@gmail.com', 'abcd', 'ATIVO', 1),
('Rafael Santos', 'Av. Central, 567', '2002-07-14', '(19)96666-3333', '333.333.333-33', 'Masculino', 'rafael@gmail.com', '1234', 'ATIVO', 2),
('Carla Mendes', 'Rua Azul, 78', '1998-09-03', '(19)95555-4444', '444.444.444-44', 'Feminino', 'carla@gmail.com', 'abcd', 'ATIVO', 2),
('Thiago Lima', 'Av. Amarela, 12', '2001-02-11', '(19)94444-5555', '555.555.555-55', 'Masculino', 'thiago@gmail.com', 'xyz', 'ATIVO', 3),
('Juliana Souza', 'Rua Verde, 90', '1997-03-15', '(19)93333-6666', '666.666.666-66', 'Feminino', 'ju@gmail.com', 'senha', 'ATIVO', 3),
('Pedro Martins', 'Rua A, 321', '2003-04-20', '(19)92222-7777', '777.777.777-77', 'Masculino', 'pedro@gmail.com', 'teste', 'ATIVO', 1),
('Isabela Rocha', 'Av. B, 654', '2000-06-17', '(19)91111-8888', '888.888.888-88', 'Feminino', 'isa@gmail.com', 'senha', 'ATIVO', 2),
('Gabriel Torres', 'Rua C, 987', '1999-11-09', '(19)90000-9999', '999.999.999-99', 'Masculino', 'gabriel@gmail.com', '12345', 'ATIVO', 3),
('Amanda Silva', 'Av. D, 741', '2001-12-25', '(19)98888-0000', '000.000.000-00', 'Feminino', 'amanda@gmail.com', 'abcd', 'ATIVO', 1);

select * from alunos;

INSERT INTO PAGAMENTOS (TIPO_PAGAMENTO, VALOR_PAGAMENTO, DATA_PAGAMENTO, ID_ALUNO) VALUES
('CARTAO', 89.00, '2025-01-10', 1),
('CARTAO', 129.00, '2025-01-11', 2),
('PIX', 180.00, '2025-01-12', 3),
('CARTAO', 89.00, '2025-01-13', 4),
('PIX', 129.00, '2025-01-14', 5),
('CARTAO', 180.00, '2025-01-15', 6),
('CARTAO', 89.00, '2025-01-16', 7),
('PIX', 129.00, '2025-01-17', 8),
('CARTAO', 180.00, '2025-01-18', 9),
('PIX', 89.00, '2025-01-19', 10);

SELECT * FROM PAGAMENTOS;

INSERT INTO EXERCICIOS (NOME_EXERCICIO, DESCRICAO_EXERCICIO, GRUPO_MUSCULAR, APARELHO) VALUES
('Supino Reto', 'Fortalece peitoral e tríceps', 'Peito', 'Banco e barra'),
('Agachamento Livre', 'Trabalha quadríceps e glúteos', 'Pernas', 'Barra'),
('Puxada Frontal', 'Fortalece costas e bíceps', 'Costas', 'Máquina de puxada'),
('Rosca Direta', 'Trabalha bíceps', 'Braços', 'Halteres'),
('Tríceps Testa', 'Foco em tríceps', 'Braços', 'Barra W'),
('Cadeira Extensora', 'Isolamento de quadríceps', 'Pernas', 'Cadeira extensora'),
('Crucifixo', 'Aumenta definição peitoral', 'Peito', 'Máquina crucifixo'),
('Leg Press', 'Trabalha glúteos e coxas', 'Pernas', 'Leg Press'),
('Abdominal Supra', 'Fortalece abdômen', 'Abdômen', 'Colchonete'),
('Remada Baixa', 'Fortalece costas', 'Costas', 'Máquina remada');

SELECT * FROM EXERCICIOS;

INSERT INTO UNIDADES 
(NOME_UNIDADE, ENDERECO_UNIDADE, TELEFONE_UNIDADE, ID_GERENTE) 
VALUES
('Tech Fit Centro', 'Rua das Palmeiras, 120 - Centro, Campinas/SP', '(19) 3333-1100', 1),
('Tech Fit Taquaral', 'Av. Júlio de Mesquita, 55 - Taquaral, Campinas/SP', '(19) 3344-2200', 2),
('Tech Fit Barão Geraldo', 'Av. Santa Isabel, 980 - Barão Geraldo, Campinas/SP', '(19) 3355-3300', 3),
('Tech Fit São Bernardo', 'Rua Álvares Machado, 210 - São Bernardo, Campinas/SP', '(19) 3366-4400', 4),
('Tech Fit Cambuí', 'Rua Coronel Quirino, 450 - Cambuí, Campinas/SP', '(19) 3377-5500', 5),
('Tech Fit Paulínia', 'Av. José Paulino, 1800 - Centro, Paulínia/SP', '(19) 3388-6600', 6),
('Tech Fit Americana', 'Rua dos Lírios, 230 - Jardim São Paulo, Americana/SP', '(19) 3399-7700', 7),
('Tech Fit Hortolândia', 'Av. Santana, 540 - Jardim Amanda, Hortolândia/SP', '(19) 3400-8800', 8),
('Tech Fit Limeira', 'Rua Presidente Vargas, 910 - Centro, Limeira/SP', '(19) 3411-9900', 9),
('Tech Fit Sumaré', 'Av. 3 de Maio, 700 - Centro, Sumaré/SP', '(19) 3422-1000', 10),
('Tech Fit Valinhos', 'Rua 13 de Maio, 350 - Centro, Valinhos/SP', '(19) 3423-1100', 1),
('Tech Fit Vinhedo', 'Av. Independência, 780 - Centro, Vinhedo/SP', '(19) 3424-1200', 2),
('Tech Fit Jaguariúna', 'Rua São Paulo, 230 - Centro, Jaguariúna/SP', '(19) 3425-1300', 3),
('Tech Fit Pedreira', 'Av. 21 de Abril, 450 - Centro, Pedreira/SP', '(19) 3426-1400', 4),
('Tech Fit Mogi-Guaçu', 'Rua Dr. João, 670 - Centro, Mogi-Guaçu/SP', '(19) 3427-1500', 5);

SELECT * FROM UNIDADES;

INSERT INTO AULAS (NOME_AULA, ID_MODALIDADE, ID_INSTRUTOR, ID_UNIDADE, DIA_SEMANA, HORARIO_INICIO, DURACAO_MINUTOS, VAGAS) VALUES
-- Cardio - Prof. Carlos
('Cardio Intensivo', 1, 1, 1, 'SEG', '18:00:00', 45, 25),
('Cardio Intensivo', 1, 1, 1, 'QUA', '19:30:00', 45, 25),
('Cardio Intensivo', 1, 1, 1, 'SEX', '17:00:00', 45, 25),

-- Força & Potência - Prof. Ana
('Força & Potência', 2, 2, 1, 'TER', '19:00:00', 60, 20),
('Força & Potência', 2, 2, 1, 'QUI', '20:00:00', 60, 20),
('Força & Potência', 2, 2, 1, 'SAB', '10:00:00', 60, 20),

-- Yoga - Prof. João
('Yoga Relax', 3, 3, 1, 'SEG', '07:00:00', 50, 15),
('Yoga Relax', 3, 3, 1, 'QUA', '08:00:00', 50, 15),
('Yoga Relax', 3, 3, 1, 'SEX', '07:30:00', 50, 15),

-- Muay Thai - Prof. Maria
('Muay Thai', 4, 4, 1, 'TER', '18:30:00', 55, 18),
('Muay Thai', 4, 4, 1, 'QUI', '19:00:00', 55, 18),
('Muay Thai', 4, 4, 1, 'SAB', '11:00:00', 55, 18),

-- Zumba - Prof. Carla
('Zumba Dance', 5, 5, 1, 'SEG', '19:00:00', 50, 30),
('Zumba Dance', 5, 5, 1, 'QUA', '20:00:00', 50, 30),
('Zumba Dance', 5, 5, 1, 'SEX', '18:30:00', 50, 30),

-- Abdominal - Prof. Marcos
('Abdominal Definidor', 6, 6, 1, 'TER', '07:00:00', 45, 20),
('Abdominal Definidor', 6, 6, 1, 'QUI', '19:30:00', 45, 20),
('Abdominal Definidor', 6, 6, 1, 'SAB', '10:30:00', 45, 20);

SELECT * FROM AULAS;

-- PERTENCE (usando IDs reais dos alunos: 51-60)
INSERT INTO PERTENCE (ID_UNIDADE, ID_ALUNO, DATA_INSCRICAO) VALUES
(1,1, '2025-01-10'),
(2,2, '2025-01-11'),
(3,3, '2025-01-12'),
(4,4, '2025-01-13'),
(5,5, '2025-01-14'),
(6,6, '2025-01-15'),
(7,7, '2025-01-16'),
(8,8, '2025-01-17'),
(9,9, '2025-01-18'),
(10,10, '2025-01-19');

-- PARTICIPAM (usando IDs reais dos alunos: 51-60)
INSERT INTO PARTICIPAM (ID_AULA, ID_ALUNO) VALUES
(1,1), (2,2), (3,3), (4,4), (5,5), 
(6,6), (7,7), (8,8), (9,9), (10,10);

-- INSCRITOS (usando IDs reais dos alunos: 51-60)
INSERT INTO INSCRITOS (ID_MODALIDADE, ID_ALUNO) VALUES
(1,1), (2,2), (3,3), (4,4), (5,5), (6,6),
(1,7), (2,8), (3,9), (4,10);

-- TEM (precisa verificar IDs reais de funcionários)
INSERT INTO TEM (ID_MODALIDADE, ID_FUNCIONARIO) VALUES
(1,1), (2,2), (3,3), (4,4), (5,5), (6,6);
