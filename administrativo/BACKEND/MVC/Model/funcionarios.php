<?php

class funcionarios{
    private $nome_funcionario;
    private $login_rede;
    private $nascimento_funcionario;
    private $cpf_funcionario;
    private $telefone_funcionario;
    private $data_admissao;
    private $salario;
    private $cargo;
    private $endereco_funcionario;
    private $email_funcionario;
    private $senha_funcionario;
    private $turno;
    private $id_modalidade;

    public function __construct($nome_funcionario, $login_rede, $nascimento_funcionario, $cpf_funcionario, $telefone_funcionario, $data_admissao, $salario, $cargo, $endereco_funcionario, $email_funcionario, $senha_funcionario, $turno, $id_modalidade){
        $this->setNomeFuncionario($nome_funcionario);
        $this->setLoginRede($login_rede);
        $this->setNascimentoFuncionario($nascimento_funcionario);
        $this->setCpfFuncionario($cpf_funcionario);
        $this->setTelefoneFuncionario($telefone_funcionario);
        $this->setDataAdmissao($data_admissao);
        $this->setSalario($salario);
        $this->setCargo($cargo);
        $this->setEnderecoFuncionario($endereco_funcionario);
        $this->setEmailFuncionario($email_funcionario);
        $this->setSenhaFuncionario($senha_funcionario);
        $this->setTurno($turno);
        $this->setIdModalidade($id_modalidade);
    }

    // Getters
    public function getNomeFuncionario(){
        return $this->nome_funcionario;
    }

    public function getLoginRede(){
        return $this->login_rede;
    }

    public function getNascimentoFuncionario(){
        return $this->nascimento_funcionario;
    }

    public function getCpfFuncionario(){
        return $this->cpf_funcionario;
    }

    public function getTelefoneFuncionario(){
        return $this->telefone_funcionario;
    }

    public function getDataAdmissao(){
        return $this->data_admissao;
    }

    public function getSalario(){
        return $this->salario;
    }

    public function getCargo(){
        return $this->cargo;
    }

    public function getEnderecoFuncionario(){
        return $this->endereco_funcionario;
    }

    public function getEmailFuncionario(){
        return $this->email_funcionario;
    }

    public function getSenhaFuncionario(){
        return $this->senha_funcionario;
    }

    public function getTurno(){
        return $this->turno;
    }

    public function getIdModalidade(){
        return $this->id_modalidade;
    }

    // Setters
    public function setNomeFuncionario($nome_funcionario){
        $this->nome_funcionario = $nome_funcionario;
    }

    public function setLoginRede($login_rede){
        $this->login_rede = $login_rede;
    }

    public function setNascimentoFuncionario($nascimento_funcionario){
        $this->nascimento_funcionario = $nascimento_funcionario;
    }

    public function setCpfFuncionario($cpf_funcionario){
        $this->cpf_funcionario = $cpf_funcionario;
    }

    public function setTelefoneFuncionario($telefone_funcionario){
        $this->telefone_funcionario = $telefone_funcionario;
    }

    public function setDataAdmissao($data_admissao){
        $this->data_admissao = $data_admissao;
    }

    public function setSalario($salario){
        $this->salario = $salario;
    }

    public function setCargo($cargo){
        $this->cargo = $cargo;
    }

    public function setEnderecoFuncionario($endereco_funcionario){
        $this->endereco_funcionario = $endereco_funcionario;
    }

    public function setEmailFuncionario($email_funcionario){
        $this->email_funcionario = $email_funcionario;
    }

    public function setSenhaFuncionario($senha_funcionario){
        $this->senha_funcionario = $senha_funcionario;
    }

    public function setTurno($turno){
        $this->turno = $turno;
    }

    public function setIdModalidade($id_modalidade){
        $this->id_modalidade = $id_modalidade;
    }
}

?>