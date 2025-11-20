<?php 

class Alunos{
    private $id_aluno;
    private $nome;
    private $endereco;
    private $nascimento;
    private $telefone;
    private $CPF;
    private $sexo;
    private $email;
    private $senha_hash;
    private $status_aluno;
    private $criado_em;
    private $id_plano;

    
    //Construtor da classe alunos 
    public function __construct($id_aluno,$nome, $endereco, $nascimento, $telefone, $CPF, $sexo, $email, $senha_hash, $status_aluno, $criado_em, $id_plano){
        $this->setId_aluno($id_aluno);
        $this->setNome($nome);
        $this->setEndereco($endereco);
        $this->setNascimento($nascimento);
        $this->setTelefone($telefone);
        $this->setCPF($CPF);
        $this->setSexo($sexo);
        $this->setEmail($email);
        $this->definirSenha($senha_hash);
        $this->setStatus_aluno($status_aluno);
        $this->setCriado_em($criado_em);
        $this->setId_plano($id_plano);
    }

    //Encapsulamento da classe alunos (getters e setters)
    public function getId_aluno()
    {
        return $this->id_aluno;
    }
    public function setId_aluno($id_aluno)
    {
        $this->id_aluno = $id_aluno;

        return $this;
    }

    public function getId_plano()
    {
        return $this->id_plano;
    }

    public function setId_plano($id_plano)
    {
        $this->id_plano = $id_plano;

        return $this;
    }

    public function getCriado_em()
    {
        return $this->criado_em;
    }

    public function setCriado_em($criado_em)
    {
        $this->criado_em = $criado_em ?? date("Y-m-d H:i:s");

        return $this;
    }

    public function getStatus_aluno()
    {
        return $this->status_aluno;
    }

    public function setStatus_aluno($status_aluno)
    {
        $this->status_aluno = $status_aluno;

        return $this;
    }

    public function definirSenha($senha) {
        $this->senha_hash = password_hash($senha, PASSWORD_DEFAULT);
        return $this;
    }

    public function verificarSenha($senhaDigitada) {
        return password_verify($senhaDigitada, $this->senha_hash);
    }
        public function getSenhaHash() {
        return $this->senha_hash;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email){
        $this->email = $email;
        return $this;
    }

    public function getSexo()
    {
        return $this->sexo;
    }

    public function setSexo($sexo)
    {
        $this->sexo = $sexo;

        return $this;
    }

    public function getCPF()
    {
        return $this->CPF;
    }

    public function setCPF($CPF)
    {
       $cpf = preg_replace('/\D/', '', $CPF); // remove caracteres não numéricos
        if (strlen($cpf) !== 11) {
            throw new InvalidArgumentException("CPF inválido!");
        }
        $this->CPF = $cpf;
        return $this;
    }

    public function getTelefone()
    {
        return $this->telefone;
    }

    public function setTelefone($telefone)
    {
        $this->telefone = preg_replace('/\D/', '', $telefone); // só números
        return $this;
    }

    public function getNascimento()
    {
        return $this->nascimento;
    }

    public function setNascimento($nascimento)
    {
        $this->nascimento = $nascimento;
        return $this;
    }

    public function getEndereco()
    {
        return $this->endereco;
    }

    public function setEndereco($endereco)
    {
        $this->endereco = $endereco;

        return $this;
    }

    public function getNome()
    {
        return $this->nome;
    }

    public function setNome($nome)
    {
        $this->nome = ucwords(strtolower($nome));

        return $this;
    }
    
}

?>