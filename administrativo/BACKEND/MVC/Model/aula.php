<?php

class Aulas {
    private $id_aula;
    private $nome_aula;
    private $id_modalidade;
    private $id_instrutor;
    private $id_unidade;
    private $dia_semana;
    private $horario_inicio;
    private $duracao_minutos;
    private $vagas;
    private $criado_em;

    public function __construct($nome_aula, $id_modalidade, $id_instrutor = null, $id_unidade = null, 
                                $dia_semana, $horario_inicio, $duracao_minutos = 60, $vagas = 30, 
                                $criado_em = null) {
        $this->setNomeAula($nome_aula);
        $this->setIdModalidade($id_modalidade);
        $this->setIdInstrutor($id_instrutor);
        $this->setIdUnidade($id_unidade);
        $this->setDiaSemana($dia_semana);
        $this->setHorarioInicio($horario_inicio);
        $this->setDuracaoMinutos($duracao_minutos);
        $this->setVagas($vagas);
        $this->setCriadoEm($criado_em);
    }

    // Getters
    public function getIdAula() {
        return $this->id_aula;
    }

    public function getNomeAula() {
        return $this->nome_aula;
    }

    public function getIdModalidade() {
        return $this->id_modalidade;
    }

    public function getIdInstrutor() {
        return $this->id_instrutor;
    }

    public function getIdUnidade() {
        return $this->id_unidade;
    }

    public function getDiaSemana() {
        return $this->dia_semana;
    }

    public function getHorarioInicio() {
        return $this->horario_inicio;
    }

    public function getDuracaoMinutos() {
        return $this->duracao_minutos;
    }

    public function getVagas() {
        return $this->vagas;
    }

    public function getCriadoEm() {
        return $this->criado_em;
    }

    // Setters
    public function setIdAula($id_aula) {
        $this->id_aula = $id_aula;
    }

    public function setNomeAula($nome_aula) {
        $this->nome_aula = $nome_aula;
    }

    public function setIdModalidade($id_modalidade) {
        $this->id_modalidade = $id_modalidade;
    }

    public function setIdInstrutor($id_instrutor) {
        $this->id_instrutor = $id_instrutor;
    }

    public function setIdUnidade($id_unidade) {
        $this->id_unidade = $id_unidade;
    }

    public function setDiaSemana($dia_semana) {
        $dias_validos = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        if (in_array(strtoupper($dia_semana), $dias_validos)) {
            $this->dia_semana = strtoupper($dia_semana);
        } else {
            throw new Exception("Dia da semana inválido. Use: DOM, SEG, TER, QUA, QUI, SEX, SAB");
        }
    }

    public function setHorarioInicio($horario_inicio) {
        // Valida formato de horário HH:MM:SS
        if (preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/', $horario_inicio)) {
            $this->horario_inicio = $horario_inicio;
        } else {
            throw new Exception("Formato de horário inválido. Use HH:MM ou HH:MM:SS");
        }
    }

    public function setDuracaoMinutos($duracao_minutos) {
        if ($duracao_minutos > 0 && $duracao_minutos <= 480) { // Máximo 8 horas
            $this->duracao_minutos = $duracao_minutos;
        } else {
            throw new Exception("Duração inválida. Deve ser entre 1 e 480 minutos");
        }
    }

    public function setVagas($vagas) {
        if ($vagas >= 0 && $vagas <= 500) {
            $this->vagas = $vagas;
        } else {
            throw new Exception("Número de vagas inválido. Deve ser entre 0 e 500");
        }
    }

    public function setCriadoEm($criado_em) {
        $this->criado_em = $criado_em ?? date('Y-m-d H:i:s');
    }

    // Método para calcular horário de término
    public function getHorarioTermino() {
        if ($this->horario_inicio && $this->duracao_minutos) {
            $inicio = new DateTime($this->horario_inicio);
            $inicio->modify("+{$this->duracao_minutos} minutes");
            return $inicio->format('H:i:s');
        }
        return null;
    }

    // Método para verificar se há vagas disponíveis
    public function temVagasDisponiveis($vagasOcupadas) {
        return $vagasOcupadas < $this->vagas;
    }
}
?>