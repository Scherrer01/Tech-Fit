<?php

class Funcionarios {
    private $id_funcionario;
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
    private $criado_em;
    private $atualizado_em;

    // Construtor com todos os parâmetros (incluindo opcionais)
    public function __construct(
        $nome_funcionario, 
        $login_rede, 
        $nascimento_funcionario, 
        $cpf_funcionario,
        $data_admissao, 
        $salario, 
        $cargo,
        $email_funcionario,
        $senha_funcionario,
        $turno = 'ROTATIVO',
        $id_modalidade = null,
        $telefone_funcionario = null,
        $endereco_funcionario = null,
        $id_funcionario = null,
        $criado_em = null,
        $atualizado_em = null
    ){
        $this->setIdFuncionario($id_funcionario);
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
        $this->setCriadoEm($criado_em);
        $this->setAtualizadoEm($atualizado_em);
    }

    // Método estático para criar a partir de array (útil para DAO)
    public static function criarDeArray($dados) {
        return new Funcionarios(
            $dados['nome_funcionario'] ?? '',
            $dados['login_rede'] ?? '',
            $dados['nascimento_funcionario'] ?? '',
            $dados['cpf_funcionario'] ?? '',
            $dados['data_admissao'] ?? '',
            $dados['salario'] ?? 0,
            $dados['cargo'] ?? '',
            $dados['email_funcionario'] ?? '',
            $dados['senha_funcionario'] ?? '',
            $dados['turno'] ?? 'ROTATIVO',
            $dados['id_modalidade'] ?? null,
            $dados['telefone_funcionario'] ?? null,
            $dados['endereco_funcionario'] ?? null,
            $dados['id_funcionario'] ?? null,
            $dados['criado_em'] ?? null,
            $dados['atualizado_em'] ?? null
        );
    }

    // Método estático para criar a partir de dados do banco
    public static function criarDeBanco($dados) {
        return new Funcionarios(
            $dados['NOME_FUNCIONARIO'] ?? '',
            $dados['LOGIN_REDE'] ?? '',
            $dados['NASCIMENTO_FUNCIONARIO'] ?? '',
            $dados['CPF_FUNCIONARIO'] ?? '',
            $dados['DATA_ADMISSAO'] ?? '',
            $dados['SALARIO'] ?? 0,
            $dados['CARGO'] ?? '',
            $dados['EMAIL_FUNCIONARIO'] ?? '',
            $dados['SENHA_FUNCIONARIO'] ?? '',
            $dados['TURNO'] ?? 'ROTATIVO',
            $dados['ID_MODALIDADE'] ?? null,
            $dados['TELEFONE_FUNCIONARIO'] ?? null,
            $dados['ENDERECO_FUNCIONARIO'] ?? null,
            $dados['ID_FUNCIONARIO'] ?? null,
            $dados['CRIADO_EM'] ?? null,
            $dados['ATUALIZADO_EM'] ?? null
        );
    }

    // Getters
    public function getIdFuncionario(){
        return $this->id_funcionario;
    }

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

    public function getCriadoEm(){
        return $this->criado_em;
    }

    public function getAtualizadoEm(){
        return $this->atualizado_em;
    }

    // Setters com validações básicas
    public function setIdFuncionario($id_funcionario){
        $this->id_funcionario = $id_funcionario;
    }

    public function setNomeFuncionario($nome_funcionario){
        if (empty($nome_funcionario)) {
            throw new InvalidArgumentException("Nome do funcionário é obrigatório");
        }
        $this->nome_funcionario = trim($nome_funcionario);
    }

    public function setLoginRede($login_rede){
        if (empty($login_rede)) {
            throw new InvalidArgumentException("Login de rede é obrigatório");
        }
        $this->login_rede = trim($login_rede);
    }

    public function setNascimentoFuncionario($nascimento_funcionario){
        if (empty($nascimento_funcionario)) {
            throw new InvalidArgumentException("Data de nascimento é obrigatória");
        }
        $this->nascimento_funcionario = $nascimento_funcionario;
    }

    public function setCpfFuncionario($cpf_funcionario){
        if (empty($cpf_funcionario)) {
            throw new InvalidArgumentException("CPF é obrigatório");
        }
        // Remove caracteres não numéricos
        $cpf = preg_replace('/[^0-9]/', '', $cpf_funcionario);
        if (strlen($cpf) != 11) {
            throw new InvalidArgumentException("CPF inválido");
        }
        $this->cpf_funcionario = $cpf_funcionario;
    }

    public function setTelefoneFuncionario($telefone_funcionario){
        $this->telefone_funcionario = $telefone_funcionario;
    }

    public function setDataAdmissao($data_admissao){
        if (empty($data_admissao)) {
            throw new InvalidArgumentException("Data de admissão é obrigatória");
        }
        $this->data_admissao = $data_admissao;
    }

    public function setSalario($salario){
        if (!is_numeric($salario) || $salario < 0) {
            throw new InvalidArgumentException("Salário deve ser um número positivo");
        }
        $this->salario = (float) $salario;
    }

    public function setCargo($cargo){
        if (empty($cargo)) {
            throw new InvalidArgumentException("Cargo é obrigatório");
        }
        $this->cargo = trim($cargo);
    }

    public function setEnderecoFuncionario($endereco_funcionario){
        $this->endereco_funcionario = $endereco_funcionario;
    }

    public function setEmailFuncionario($email_funcionario){
        if (empty($email_funcionario)) {
            throw new InvalidArgumentException("Email é obrigatório");
        }
        if (!filter_var($email_funcionario, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Email inválido");
        }
        $this->email_funcionario = trim($email_funcionario);
    }

    public function setSenhaFuncionario($senha_funcionario){
        $this->senha_funcionario = $senha_funcionario;
    }

    public function setTurno($turno){
        $turnos_validos = ['MANHA', 'TARDE', 'NOITE', 'ROTATIVO'];
        $turno_upper = strtoupper($turno);
        
        if (!in_array($turno_upper, $turnos_validos)) {
            throw new InvalidArgumentException("Turno inválido. Valores aceitos: " . implode(', ', $turnos_validos));
        }
        $this->turno = $turno_upper;
    }

    public function setIdModalidade($id_modalidade){
        $this->id_modalidade = $id_modalidade;
    }

    public function setCriadoEm($criado_em){
        $this->criado_em = $criado_em;
    }

    public function setAtualizadoEm($atualizado_em){
        $this->atualizado_em = $atualizado_em;
    }

    // Método para criptografar senha
    public function criptografarSenha() {
        if (!empty($this->senha_funcionario)) {
            $this->senha_funcionario = password_hash($this->senha_funcionario, PASSWORD_DEFAULT);
        }
    }

    // Método para verificar senha
    public function verificarSenha($senha) {
        if (empty($this->senha_funcionario)) {
            return false;
        }
        return password_verify($senha, $this->senha_funcionario);
    }

    // Método para converter para array (útil para JSON)
    public function toArray() {
        return [
            'id_funcionario' => $this->id_funcionario,
            'nome_funcionario' => $this->nome_funcionario,
            'login_rede' => $this->login_rede,
            'nascimento_funcionario' => $this->nascimento_funcionario,
            'cpf_funcionario' => $this->cpf_funcionario,
            'telefone_funcionario' => $this->telefone_funcionario,
            'data_admissao' => $this->data_admissao,
            'salario' => $this->salario,
            'cargo' => $this->cargo,
            'endereco_funcionario' => $this->endereco_funcionario,
            'email_funcionario' => $this->email_funcionario,
            'turno' => $this->turno,
            'id_modalidade' => $this->id_modalidade,
            'criado_em' => $this->criado_em,
            'atualizado_em' => $this->atualizado_em
        ];
    }

    // Método para converter para array sem dados sensíveis
    public function toArrayPublico() {
        $dados = $this->toArray();
        unset($dados['senha_funcionario']);
        unset($dados['cpf_funcionario']); // Opcional: remover CPF se quiser mais privacidade
        return $dados;
    }

    // Método para validar dados básicos
    public function validar() {
        $erros = [];
        
        if (empty($this->nome_funcionario)) {
            $erros[] = "Nome do funcionário é obrigatório";
        }
        
        if (empty($this->login_rede)) {
            $erros[] = "Login de rede é obrigatório";
        }
        
        if (empty($this->cpf_funcionario)) {
            $erros[] = "CPF é obrigatório";
        }
        
        if (empty($this->data_admissao)) {
            $erros[] = "Data de admissão é obrigatória";
        }
        
        if (empty($this->salario) || $this->salario < 0) {
            $erros[] = "Salário inválido";
        }
        
        if (empty($this->cargo)) {
            $erros[] = "Cargo é obrigatório";
        }
        
        if (empty($this->email_funcionario) || !filter_var($this->email_funcionario, FILTER_VALIDATE_EMAIL)) {
            $erros[] = "Email inválido";
        }
        
        return $erros;
    }

    // Método para formatar CPF
    public function getCpfFormatado() {
        $cpf = preg_replace('/[^0-9]/', '', $this->cpf_funcionario);
        if (strlen($cpf) == 11) {
            return preg_replace('/(\d{3})(\d{3})(\d{3})(\d{2})/', '$1.$2.$3-$4', $cpf);
        }
        return $this->cpf_funcionario;
    }

    // Método para formatar telefone
    public function getTelefoneFormatado() {
        if (empty($this->telefone_funcionario)) {
            return '';
        }
        
        $telefone = preg_replace('/[^0-9]/', '', $this->telefone_funcionario);
        
        if (strlen($telefone) == 11) {
            return preg_replace('/(\d{2})(\d{5})(\d{4})/', '($1) $2-$3', $telefone);
        } elseif (strlen($telefone) == 10) {
            return preg_replace('/(\d{2})(\d{4})(\d{4})/', '($1) $2-$3', $telefone);
        }
        
        return $this->telefone_funcionario;
    }

    // Método para formatar salário
    public function getSalarioFormatado() {
        return 'R$ ' . number_format($this->salario, 2, ',', '.');
    }

    // Método para calcular idade
    public function getIdade() {
        if (empty($this->nascimento_funcionario)) {
            return null;
        }
        
        $nascimento = new DateTime($this->nascimento_funcionario);
        $hoje = new DateTime();
        $idade = $hoje->diff($nascimento);
        
        return $idade->y;
    }

    // Método para calcular tempo de empresa
    public function getTempoEmpresa() {
        if (empty($this->data_admissao)) {
            return null;
        }
        
        $admissao = new DateTime($this->data_admissao);
        $hoje = new DateTime();
        $tempo = $hoje->diff($admissao);
        
        return $tempo->y . ' anos e ' . $tempo->m . ' meses';
    }
}

?>