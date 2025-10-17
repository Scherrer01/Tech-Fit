-- -----------------------------------------------------------
-- Banco de Dados: TECH_FIT
-- Compatível com MySQL 8+
-- Created by: Henrique (modelo otimizado)
-- -----------------------------------------------------------

-- Remover e recriar o banco (opcional)
DROP DATABASE IF EXISTS `TECH_FIT`;
CREATE DATABASE `TECH_FIT` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE `TECH_FIT`;

-- MODE: garantir InnoDB e charset
SET default_storage_engine = 'InnoDB';

-- -----------------------------------------------------------
-- Tabelas principais: PLANOS, ALUNOS, MODALIDADES, FUNCIONARIOS
-- -----------------------------------------------------------

-- PLANOS
DROP TABLE IF EXISTS `PLANOS`;
CREATE TABLE `PLANOS` (
  `ID_PLANO` INT AUTO_INCREMENT PRIMARY KEY,
  `NOME_PLANO` VARCHAR(100) NOT NULL,
  `VALOR` DECIMAL(8,2) NOT NULL CHECK (VALOR >= 0),
  `BENEFICIOS` VARCHAR(1000) DEFAULT NULL,
  `DURACAO_MES` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_planos_nome` (`NOME_PLANO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ALUNOS
DROP TABLE IF EXISTS `ALUNOS`;
CREATE TABLE `ALUNOS` (
  `ID_ALUNO` INT AUTO_INCREMENT PRIMARY KEY,
  `NOME` VARCHAR(150) NOT NULL,
  `ENDERECO` VARCHAR(500),
  `NASCIMENTO` DATE NOT NULL,
  `TELEFONE` VARCHAR(20),
  `CPF` VARCHAR(14) NOT NULL,
  `SEXO` ENUM('MASCULINO','FEMININO','OUTRO','NAO_DECLARAR') DEFAULT 'NAO_DECLARAR',
  `EMAIL` VARCHAR(255) NOT NULL,
  `SENHA_HASH` VARCHAR(255) NOT NULL, -- armazenar hash, não senha em claro
  `STATUS_ALUNO` ENUM('ATIVO','INATIVO','SUSPENSO') NOT NULL DEFAULT 'ATIVO',
  `ID_PLANO` INT NOT NULL,
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_alunos_cpf` (`CPF`),
  UNIQUE KEY `uk_alunos_email` (`EMAIL`),
  INDEX `idx_alunos_plano` (`ID_PLANO`),
  CONSTRAINT `fk_alunos_planos` FOREIGN KEY (`ID_PLANO`) REFERENCES `PLANOS`(`ID_PLANO`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MODALIDADES
DROP TABLE IF EXISTS `MODALIDADES`;
CREATE TABLE `MODALIDADES` (
  `ID_MODALIDADE` INT AUTO_INCREMENT PRIMARY KEY,
  `NOME_MODALIDADE` VARCHAR(120) NOT NULL,
  `DESCRICAO_MODALIDADE` VARCHAR(1000),
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_modalidades_nome` (`NOME_MODALIDADE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- FUNCIONARIOS
DROP TABLE IF EXISTS `FUNCIONARIOS`;
CREATE TABLE `FUNCIONARIOS` (
  `ID_FUNCIONARIO` INT AUTO_INCREMENT PRIMARY KEY,
  `NOME_FUNCIONARIO` VARCHAR(150) NOT NULL,
  -- LOGIN_REDE gerado a partir do primeiro + último nome, em lowercase (ex: joao.silva)
  `LOGIN_REDE` VARCHAR(150) AS (
      LOWER(CONCAT(
        SUBSTRING_INDEX(TRIM(NOME_FUNCIONARIO), ' ', 1),
        '.',
        SUBSTRING_INDEX(TRIM(NOME_FUNCIONARIO), ' ', -1)
      ))
  ) STORED,
  `NASCIMENTO_FUNCIONARIO` DATE NOT NULL,
  `CPF_FUNCIONARIO` VARCHAR(14) NOT NULL,
  `TELEFONE_FUNCIONARIO` VARCHAR(20),
  `DATA_ADMISSAO` DATE NOT NULL,
  `SALARIO` DECIMAL(10,2) NOT NULL CHECK (SALARIO >= 0),
  `CARGO` VARCHAR(80) NOT NULL,
  `ENDERECO_FUNCIONARIO` VARCHAR(500),
  `TURNO` ENUM('MANHA','TARDE','NOITE','ROTATIVO') DEFAULT 'ROTATIVO',
  `ID_MODALIDADE_PREFERENCIAL` INT DEFAULT NULL, -- modalidade que o funcionário pode ministrar
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_funcionarios_cpf` (`CPF_FUNCIONARIO`),
  INDEX `idx_funcionarios_modalidade` (`ID_MODALIDADE_PREFERENCIAL`),
  CONSTRAINT `fk_funcionarios_modalidade` FOREIGN KEY (`ID_MODALIDADE_PREFERENCIAL`)
    REFERENCES `MODALIDADES` (`ID_MODALIDADE`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Tabelas de unidade e relacionamentos (unidade <-> alunos, funcionários)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `UNIDADES`;
CREATE TABLE `UNIDADES` (
  `ID_UNIDADE` INT AUTO_INCREMENT PRIMARY KEY,
  `NOME_UNIDADE` VARCHAR(120) NOT NULL,
  `ENDERECO_UNIDADE` VARCHAR(500) NOT NULL,
  `TELEFONE_UNIDADE` VARCHAR(20),
  `ID_GERENTE` INT DEFAULT NULL, -- funcionário responsável (se houver)
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_unidades_nome` (`NOME_UNIDADE`),
  INDEX `idx_unidades_gerente` (`ID_GERENTE`),
  CONSTRAINT `fk_unidades_gerente` FOREIGN KEY (`ID_GERENTE`) REFERENCES `FUNCIONARIOS` (`ID_FUNCIONARIO`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- EXERCICIOS (ligado a modalidades e possivelmente a aparelhos)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `EXERCICIOS`;
CREATE TABLE `EXERCICIOS` (
  `ID_EXERCICIO` INT AUTO_INCREMENT PRIMARY KEY,
  `NOME_EXERCICIO` VARCHAR(150) NOT NULL,
  `DESCRICAO_EXERCICIO` TEXT,
  `GRUPO_MUSCULAR` VARCHAR(100),
  `APARELHO` VARCHAR(120),
  `ID_MODALIDADE` INT DEFAULT NULL,
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_exercicios_modalidade` (`ID_MODALIDADE`),
  CONSTRAINT `fk_exercicios_modalidade` FOREIGN KEY (`ID_MODALIDADE`) REFERENCES `MODALIDADES` (`ID_MODALIDADE`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- AULAS (com vínculo a modalidade, instrutor e unidade)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `AULAS`;
CREATE TABLE `AULAS` (
  `ID_AULA` INT AUTO_INCREMENT PRIMARY KEY,
  `NOME_AULA` VARCHAR(150),
  `ID_MODALIDADE` INT NOT NULL,
  `ID_INSTRUTOR` INT DEFAULT NULL, -- funcionário que ministra
  `ID_UNIDADE` INT DEFAULT NULL,
  `DIA_SEMANA` ENUM('DOM','SEG','TER','QUA','QUI','SEX','SAB') NOT NULL,
  `HORARIO_INICIO` TIME NOT NULL,
  `DURACAO_MINUTOS` SMALLINT UNSIGNED NOT NULL DEFAULT 60,
  `VAGAS` SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_aulas_modalidade` (`ID_MODALIDADE`),
  INDEX `idx_aulas_instrutor` (`ID_INSTRUTOR`),
  INDEX `idx_aulas_unidade` (`ID_UNIDADE`),
  CONSTRAINT `fk_aulas_modalidade` FOREIGN KEY (`ID_MODALIDADE`) REFERENCES `MODALIDADES`(`ID_MODALIDADE`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_aulas_instrutor` FOREIGN KEY (`ID_INSTRUTOR`) REFERENCES `FUNCIONARIOS`(`ID_FUNCIONARIO`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_aulas_unidade` FOREIGN KEY (`ID_UNIDADE`) REFERENCES `UNIDADES`(`ID_UNIDADE`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- PAGAMENTOS
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `PAGAMENTOS`;
CREATE TABLE `PAGAMENTOS` (
  `ID_PAGAMENTO` INT AUTO_INCREMENT PRIMARY KEY,
  `ID_ALUNO` INT NOT NULL,
  `TIPO_PAGAMENTO` ENUM('DINHEIRO','CARTAO','PIX','TRANSFERENCIA') NOT NULL,
  `VALOR_PAGAMENTO` DECIMAL(10,2) NOT NULL CHECK (VALOR_PAGAMENTO >= 0),
  `DATA_PAGAMENTO` DATE NOT NULL,
  `REFERENCIA` VARCHAR(255), -- ex: numero do recibo / id transação
  `CRIADO_EM` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pagamentos_aluno` (`ID_ALUNO`),
  CONSTRAINT `fk_pagamentos_alunos` FOREIGN KEY (`ID_ALUNO`) REFERENCES `ALUNOS`(`ID_ALUNO`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- TABELAS DE RELACIONAMENTO (M:N) com PK composta para evitar duplicidade
-- -----------------------------------------------------------

-- Alunos pertencem a Unidades (matrícula/filial do aluno)
DROP TABLE IF EXISTS `PERTENCE`;
CREATE TABLE `PERTENCE` (
  `ID_UNIDADE` INT NOT NULL,
  `ID_ALUNO` INT NOT NULL,
  `DATA_INSCRICAO` DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`ID_UNIDADE`,`ID_ALUNO`),
  INDEX `idx_pertence_aluno` (`ID_ALUNO`),
  CONSTRAINT `fk_pertence_unidade` FOREIGN KEY (`ID_UNIDADE`) REFERENCES `UNIDADES`(`ID_UNIDADE`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_pertence_aluno` FOREIGN KEY (`ID_ALUNO`) REFERENCES `ALUNOS`(`ID_ALUNO`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Participação em aulas (inscritos por aula)
DROP TABLE IF EXISTS `PARTICIPAM`;
CREATE TABLE `PARTICIPAM` (
  `ID_AULA` INT NOT NULL,
  `ID_ALUNO` INT NOT NULL,
  `DATA_PARTICIPACAO` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_AULA`,`ID_ALUNO`),
  INDEX `idx_participam_aluno` (`ID_ALUNO`),
  CONSTRAINT `fk_participam_aula` FOREIGN KEY (`ID_AULA`) REFERENCES `AULAS`(`ID_AULA`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_participam_aluno` FOREIGN KEY (`ID_ALUNO`) REFERENCES `ALUNOS`(`ID_ALUNO`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inscritos em modalidades (aluno <-> modalidade)
DROP TABLE IF EXISTS `INSCRITOS`;
CREATE TABLE `INSCRITOS` (
  `ID_MODALIDADE` INT NOT NULL,
  `ID_ALUNO` INT NOT NULL,
  `DATA_INSCRICAO` DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`ID_MODALIDADE`,`ID_ALUNO`),
  INDEX `idx_inscritos_aluno` (`ID_ALUNO`),
  CONSTRAINT `fk_inscritos_modalidade` FOREIGN KEY (`ID_MODALIDADE`) REFERENCES `MODALIDADES`(`ID_MODALIDADE`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_inscritos_aluno` FOREIGN KEY (`ID_ALUNO`) REFERENCES `ALUNOS`(`ID_ALUNO`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Funcionários que ministram modalidades (M:N)
DROP TABLE IF EXISTS `TEM`;
CREATE TABLE `TEM` (
  `ID_MODALIDADE` INT NOT NULL,
  `ID_FUNCIONARIO` INT NOT NULL,
  `DATA_ATUACAO` DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`ID_MODALIDADE`,`ID_FUNCIONARIO`),
  INDEX `idx_tem_funcionario` (`ID_FUNCIONARIO`),
  CONSTRAINT `fk_tem_modalidade` FOREIGN KEY (`ID_MODALIDADE`) REFERENCES `MODALIDADES`(`ID_MODALIDADE`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_tem_funcionario` FOREIGN KEY (`ID_FUNCIONARIO`) REFERENCES `FUNCIONARIOS`(`ID_FUNCIONARIO`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- Índices adicionais e algumas views (opcional)
-- -----------------------------------------------------------

-- View para acompanhar saldo de pagamentos por aluno (exemplo)
DROP VIEW IF EXISTS `VW_SALDO_ALUNO`;
CREATE VIEW `VW_SALDO_ALUNO` AS
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


