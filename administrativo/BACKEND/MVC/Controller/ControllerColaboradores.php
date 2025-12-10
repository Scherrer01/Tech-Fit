<?php
// Controller/ControllerFuncionarios.php

require_once '../Model/funcionarios.php';
require_once '../Model/funcionariosDAO.php';

class ControllerFuncionarios {
    private $funcionarioDAO;
    
    public function __construct() {
        $this->funcionarioDAO = new FuncionarioDAO();
    }
    
    // 1. Criar funcionário
    public function criarFuncionario($dados) {
        try {
            // Validação dos dados obrigatórios
            $erros = $this->validarDadosFuncionario($dados, 'criar');
            if (!empty($erros)) {
                return ['success' => false, 'message' => 'Erros de validação', 'errors' => $erros];
            }
            
            // Verificar se CPF já existe
            if ($this->funcionarioDAO->cpfExiste($dados['cpf_funcionario'])) {
                return ['success' => false, 'message' => 'CPF já cadastrado'];
            }
            
            // Verificar se email já existe
            if ($this->funcionarioDAO->emailExiste($dados['email_funcionario'])) {
                return ['success' => false, 'message' => 'Email já cadastrado'];
            }
            
            // Verificar se login já existe
            if ($this->funcionarioDAO->loginExiste($dados['login_rede'])) {
                return ['success' => false, 'message' => 'Login de rede já cadastrado'];
            }
            
            // Criptografar senha se fornecida
            if (isset($dados['senha_funcionario']) && !empty($dados['senha_funcionario'])) {
                $dados['senha_funcionario'] = password_hash($dados['senha_funcionario'], PASSWORD_DEFAULT);
            }
            
            // Criar objeto Funcionarios usando o método estático
            $funcionario = Funcionarios::criarDeArray($dados);
            
            // Criptografar senha (segunda camada)
            $funcionario->criptografarSenha();
            
            // Salvar no banco
            $id_funcionario = $this->funcionarioDAO->criar($funcionario);
            
            if (!$id_funcionario) {
                throw new Exception("Falha ao criar funcionário no banco de dados");
            }
            
            // Buscar o funcionário recém-criado
            $funcionarioCriado = $this->funcionarioDAO->buscarPorId($id_funcionario);
            
            if (!$funcionarioCriado) {
                return [
                    'success' => true,
                    'message' => 'Funcionário criado com sucesso',
                    'id_funcionario' => $id_funcionario
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Funcionário criado com sucesso',
                'data' => $this->formatarFuncionario($funcionarioCriado)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao criar funcionário: ' . $e->getMessage()
            ];
        }
    }
    
    // 2. Listar funcionários
    public function listarFuncionarios($filtros = []) {
        try {
            $funcionarios = $this->funcionarioDAO->listarTodos($filtros);
            
            $funcionariosFormatados = [];
            foreach ($funcionarios as $funcionario) {
                $funcionariosFormatados[] = $this->formatarFuncionario($funcionario);
            }
            
            return [
                'success' => true,
                'data' => $funcionariosFormatados,
                'total' => count($funcionariosFormatados)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao listar funcionários: ' . $e->getMessage()
            ];
        }
    }
    
    // 3. Buscar funcionário por ID
    public function buscarFuncionario($id_funcionario) {
        try {
            if (empty($id_funcionario) || !is_numeric($id_funcionario)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            $funcionario = $this->funcionarioDAO->buscarPorId($id_funcionario);
            
            if (!$funcionario) {
                return ['success' => false, 'message' => 'Funcionário não encontrado'];
            }
            
            return [
                'success' => true,
                'data' => $this->formatarFuncionario($funcionario)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar funcionário: ' . $e->getMessage()
            ];
        }
    }
    
    // 4. Atualizar funcionário
    public function atualizarFuncionario($id_funcionario, $dados) {
        try {
            if (empty($id_funcionario) || !is_numeric($id_funcionario)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            // Verificar se funcionário existe
            $funcionarioExistente = $this->funcionarioDAO->buscarPorId($id_funcionario);
            if (!$funcionarioExistente) {
                return ['success' => false, 'message' => 'Funcionário não encontrado'];
            }
            
            // Validação dos dados
            $erros = $this->validarDadosFuncionario($dados, 'atualizar');
            if (!empty($erros)) {
                return ['success' => false, 'message' => 'Erros de validação', 'errors' => $erros];
            }
            
            // Verificar se CPF já existe (outro funcionário)
            if (isset($dados['cpf_funcionario']) && 
                $this->funcionarioDAO->cpfExiste($dados['cpf_funcionario'], $id_funcionario)) {
                return ['success' => false, 'message' => 'CPF já cadastrado para outro funcionário'];
            }
            
            // Verificar se email já existe (outro funcionário)
            if (isset($dados['email_funcionario']) && 
                $this->funcionarioDAO->emailExiste($dados['email_funcionario'], $id_funcionario)) {
                return ['success' => false, 'message' => 'Email já cadastrado para outro funcionário'];
            }
            
            // Verificar se login já existe (outro funcionário)
            if (isset($dados['login_rede']) && 
                $this->funcionarioDAO->loginExiste($dados['login_rede'], $id_funcionario)) {
                return ['success' => false, 'message' => 'Login de rede já cadastrado para outro funcionário'];
            }
            
            // Se nova senha foi fornecida, criptografar
            if (isset($dados['senha_funcionario']) && !empty($dados['senha_funcionario'])) {
                $dados['senha_funcionario'] = password_hash($dados['senha_funcionario'], PASSWORD_DEFAULT);
            } else {
                // Manter senha atual se não for fornecida nova
                unset($dados['senha_funcionario']);
            }
            
            // Adicionar ID ao array de dados
            $dados['id_funcionario'] = $id_funcionario;
            
            // Atualizar no banco usando o método atualizarFuncionario
            $resultado = $this->funcionarioDAO->atualizarFuncionario($id_funcionario, $dados);
            
            if (!$resultado) {
                return ['success' => false, 'message' => 'Nenhuma alteração realizada'];
            }
            
            // Buscar funcionário atualizado
            $funcionarioAtualizado = $this->funcionarioDAO->buscarPorId($id_funcionario);
            
            return [
                'success' => true,
                'message' => 'Funcionário atualizado com sucesso',
                'data' => $this->formatarFuncionario($funcionarioAtualizado)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao atualizar funcionário: ' . $e->getMessage()
            ];
        }
    }
    
    // 5. Excluir funcionário
    public function excluirFuncionario($id_funcionario) {
        try {
            if (empty($id_funcionario) || !is_numeric($id_funcionario)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            // Verificar se funcionário existe
            $funcionario = $this->funcionarioDAO->buscarPorId($id_funcionario);
            if (!$funcionario) {
                return ['success' => false, 'message' => 'Funcionário não encontrado'];
            }
            
            $resultado = $this->funcionarioDAO->excluir($id_funcionario);
            
            if (!$resultado) {
                return ['success' => false, 'message' => 'Erro ao excluir funcionário'];
            }
            
            return [
                'success' => true,
                'message' => 'Funcionário excluído com sucesso'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao excluir funcionário: ' . $e->getMessage()
            ];
        }
    }
    
    // 6. Buscar funcionários por nome
    public function buscarFuncionariosPorNome($nome) {
        try {
            if (empty($nome)) {
                return ['success' => false, 'message' => 'Nome não fornecido'];
            }
            
            $funcionarios = $this->funcionarioDAO->buscarPorNome($nome);
            
            $funcionariosFormatados = [];
            foreach ($funcionarios as $funcionario) {
                $funcionariosFormatados[] = $this->formatarFuncionario($funcionario);
            }
            
            return [
                'success' => true,
                'data' => $funcionariosFormatados,
                'total' => count($funcionariosFormatados)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar funcionários por nome: ' . $e->getMessage()
            ];
        }
    }
    
    // 7. Buscar funcionários por cargo
    public function buscarFuncionariosPorCargo($cargo) {
        try {
            if (empty($cargo)) {
                return ['success' => false, 'message' => 'Cargo não fornecido'];
            }
            
            $funcionarios = $this->funcionarioDAO->buscarPorCargo($cargo);
            
            $funcionariosFormatados = [];
            foreach ($funcionarios as $funcionario) {
                $funcionariosFormatados[] = $this->formatarFuncionario($funcionario);
            }
            
            return [
                'success' => true,
                'data' => $funcionariosFormatados,
                'total' => count($funcionariosFormatados)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar funcionários por cargo: ' . $e->getMessage()
            ];
        }
    }
    
    // 8. Buscar funcionários por turno
    public function buscarFuncionariosPorTurno($turno) {
        try {
            if (empty($turno)) {
                return ['success' => false, 'message' => 'Turno não fornecido'];
            }
            
            $turnos_validos = ['MANHA', 'TARDE', 'NOITE', 'ROTATIVO'];
            $turno_upper = strtoupper($turno);
            
            if (!in_array($turno_upper, $turnos_validos)) {
                return [
                    'success' => false, 
                    'message' => 'Turno inválido. Valores aceitos: ' . implode(', ', $turnos_validos)
                ];
            }
            
            $funcionarios = $this->funcionarioDAO->buscarPorTurno($turno_upper);
            
            $funcionariosFormatados = [];
            foreach ($funcionarios as $funcionario) {
                $funcionariosFormatados[] = $this->formatarFuncionario($funcionario);
            }
            
            return [
                'success' => true,
                'data' => $funcionariosFormatados,
                'total' => count($funcionariosFormatados)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar funcionários por turno: ' . $e->getMessage()
            ];
        }
    }
    
    // 9. Buscar funcionários por modalidade
    public function buscarFuncionariosPorModalidade($id_modalidade) {
        try {
            if (empty($id_modalidade) || !is_numeric($id_modalidade)) {
                return ['success' => false, 'message' => 'ID da modalidade inválido'];
            }
            
            $funcionarios = $this->funcionarioDAO->buscarPorModalidade($id_modalidade);
            
            $funcionariosFormatados = [];
            foreach ($funcionarios as $funcionario) {
                $funcionariosFormatados[] = $this->formatarFuncionario($funcionario);
            }
            
            return [
                'success' => true,
                'data' => $funcionariosFormatados,
                'total' => count($funcionariosFormatados)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar funcionários por modalidade: ' . $e->getMessage()
            ];
        }
    }
    
    // 10. Autenticar funcionário
    public function autenticarFuncionario($login, $senha) {
        try {
            if (empty($login) || empty($senha)) {
                return ['success' => false, 'message' => 'Login e senha são obrigatórios'];
            }
            
            $funcionario = $this->funcionarioDAO->autenticar($login, $senha);
            
            if (!$funcionario) {
                return ['success' => false, 'message' => 'Login ou senha incorretos'];
            }
            
            return [
                'success' => true,
                'message' => 'Autenticação bem-sucedida',
                'data' => $this->formatarFuncionario($funcionario)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro na autenticação: ' . $e->getMessage()
            ];
        }
    }
    
    // 11. Buscar estatísticas
    public function buscarEstatisticas() {
        try {
            $estatisticas = $this->funcionarioDAO->buscarEstatisticas();
            
            return [
                'success' => true,
                'data' => $estatisticas
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar estatísticas: ' . $e->getMessage()
            ];
        }
    }
    
    // 12. Buscar funcionário com relacionamentos
    public function buscarFuncionarioCompleto($id_funcionario) {
        try {
            if (empty($id_funcionario) || !is_numeric($id_funcionario)) {
                return ['success' => false, 'message' => 'ID inválido'];
            }
            
            $funcionario = $this->funcionarioDAO->buscarComRelacionamentos($id_funcionario);
            
            if (!$funcionario) {
                return ['success' => false, 'message' => 'Funcionário não encontrado'];
            }
            
            return [
                'success' => true,
                'data' => $this->formatarFuncionarioComRelacionamentos($funcionario)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar funcionário completo: ' . $e->getMessage()
            ];
        }
    }
    
    // 13. Listar funcionários com relacionamentos
    public function listarFuncionariosCompletos($filtros = []) {
        try {
            $funcionarios = $this->funcionarioDAO->buscarComRelacionamentos();
            
            // Aplicar filtros
            if (!empty($filtros)) {
                $funcionarios = $this->aplicarFiltros($funcionarios, $filtros);
            }
            
            $funcionariosFormatados = [];
            foreach ($funcionarios as $funcionario) {
                $funcionariosFormatados[] = $this->formatarFuncionarioComRelacionamentos($funcionario);
            }
            
            return [
                'success' => true,
                'data' => $funcionariosFormatados,
                'total' => count($funcionariosFormatados)
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao listar funcionários completos: ' . $e->getMessage()
            ];
        }
    }
    
    // 14. Contar total de funcionários
    public function contarFuncionarios($filtros = []) {
        try {
            $total = $this->funcionarioDAO->contarTotal($filtros);
            
            return [
                'success' => true,
                'data' => [
                    'total' => $total
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao contar funcionários: ' . $e->getMessage()
            ];
        }
    }
    
    // 15. Métodos auxiliares
    
    private function formatarFuncionario($funcionario) {
        // Converter para objeto Funcionarios para usar os métodos de formatação
        $funcionarioObj = Funcionarios::criarDeBanco($funcionario);
        
        return [
            'id_funcionario' => $funcionarioObj->getIdFuncionario(),
            'nome_funcionario' => $funcionarioObj->getNomeFuncionario(),
            'login_rede' => $funcionarioObj->getLoginRede(),
            'nascimento_funcionario' => $funcionarioObj->getNascimentoFuncionario(),
            'cpf_funcionario' => $funcionarioObj->getCpfFormatado(),
            'cpf_original' => $funcionarioObj->getCpfFuncionario(),
            'telefone_funcionario' => $funcionarioObj->getTelefoneFuncionario(),
            'telefone_formatado' => $funcionarioObj->getTelefoneFormatado(),
            'data_admissao' => $funcionarioObj->getDataAdmissao(),
            'salario' => $funcionarioObj->getSalario(),
            'salario_formatado' => $funcionarioObj->getSalarioFormatado(),
            'cargo' => $funcionarioObj->getCargo(),
            'endereco_funcionario' => $funcionarioObj->getEnderecoFuncionario(),
            'email_funcionario' => $funcionarioObj->getEmailFuncionario(),
            'turno' => $funcionarioObj->getTurno(),
            'id_modalidade' => $funcionarioObj->getIdModalidade(),
            'criado_em' => $funcionarioObj->getCriadoEm(),
            'atualizado_em' => $funcionarioObj->getAtualizadoEm(),
            'idade' => $funcionarioObj->getIdade(),
            'tempo_empresa' => $funcionarioObj->getTempoEmpresa()
        ];
    }
    
    private function formatarFuncionarioComRelacionamentos($dados) {
        $funcionarioFormatado = $this->formatarFuncionario($dados);
        
        // Adicionar dados dos relacionamentos
        $funcionarioFormatado['nome_modalidade'] = $dados['NOME_MODALIDADE'] ?? null;
        $funcionarioFormatado['descricao_modalidade'] = $dados['DESCRICAO_MODALIDADE'] ?? null;
        
        return $funcionarioFormatado;
    }
    
    private function aplicarFiltros($funcionarios, $filtros) {
        return array_filter($funcionarios, function($funcionario) use ($filtros) {
            foreach ($filtros as $campo => $valor) {
                if (!empty($valor)) {
                    $campo_upper = strtoupper($campo);
                    
                    // Mapear nomes dos campos
                    $mapa_campos = [
                        'nome' => 'NOME_FUNCIONARIO',
                        'cargo' => 'CARGO',
                        'turno' => 'TURNO',
                        'id_modalidade' => 'ID_MODALIDADE'
                    ];
                    
                    $campo_banco = $mapa_campos[$campo] ?? $campo_upper;
                    
                    if (isset($funcionario[$campo_banco])) {
                        if ($campo === 'nome' || $campo === 'cargo') {
                            // Busca parcial para nome e cargo
                            if (stripos($funcionario[$campo_banco], $valor) === false) {
                                return false;
                            }
                        } elseif ($campo === 'turno') {
                            // Comparação exata para turno
                            if (strtoupper($funcionario[$campo_banco]) !== strtoupper($valor)) {
                                return false;
                            }
                        } elseif ($funcionario[$campo_banco] != $valor) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });
    }
    
    public function validarDadosFuncionario($dados, $operacao = 'criar') {
        $erros = [];
        
        // Campos obrigatórios para criação
        if ($operacao === 'criar') {
            $campos_obrigatorios = [
                'nome_funcionario',
                'login_rede',
                'nascimento_funcionario',
                'cpf_funcionario',
                'data_admissao',
                'salario',
                'cargo',
                'email_funcionario'
                // 'senha_funcionario' é opcional conforme sua estrutura
            ];
            
            foreach ($campos_obrigatorios as $campo) {
                if (empty($dados[$campo])) {
                    $erros[] = "Campo obrigatório faltando: {$campo}";
                }
            }
        }
        
        // Validação de formato de data
        if (isset($dados['nascimento_funcionario']) && !empty($dados['nascimento_funcionario'])) {
            $data = DateTime::createFromFormat('Y-m-d', $dados['nascimento_funcionario']);
            if (!$data) {
                $erros[] = "Formato de data de nascimento inválido. Use YYYY-MM-DD";
            }
        }
        
        if (isset($dados['data_admissao']) && !empty($dados['data_admissao'])) {
            $data = DateTime::createFromFormat('Y-m-d', $dados['data_admissao']);
            if (!$data) {
                $erros[] = "Formato de data de admissão inválido. Use YYYY-MM-DD";
            }
        }
        
        // Validação de CPF (formato básico)
        if (isset($dados['cpf_funcionario']) && !empty($dados['cpf_funcionario'])) {
            $cpf = preg_replace('/[^0-9]/', '', $dados['cpf_funcionario']);
            if (strlen($cpf) != 11) {
                $erros[] = "CPF inválido (deve ter 11 dígitos)";
            }
        }
        
        // Validação de email
        if (isset($dados['email_funcionario']) && !empty($dados['email_funcionario'])) {
            if (!filter_var($dados['email_funcionario'], FILTER_VALIDATE_EMAIL)) {
                $erros[] = "Email inválido";
            }
        }
        
        // Validação de salário
        if (isset($dados['salario']) && !empty($dados['salario'])) {
            if (!is_numeric($dados['salario']) || $dados['salario'] < 0) {
                $erros[] = "Salário inválido (deve ser um número positivo)";
            }
        }
        
        // Validação de turno
        if (isset($dados['turno']) && !empty($dados['turno'])) {
            $turnos_validos = ['MANHA', 'TARDE', 'NOITE', 'ROTATIVO'];
            if (!in_array(strtoupper($dados['turno']), $turnos_validos)) {
                $erros[] = "Turno inválido. Valores aceitos: " . implode(', ', $turnos_validos);
            }
        }
        
        // Validação de telefone (opcional)
        if (isset($dados['telefone_funcionario']) && !empty($dados['telefone_funcionario'])) {
            $telefone = preg_replace('/[^0-9]/', '', $dados['telefone_funcionario']);
            if (strlen($telefone) < 10 || strlen($telefone) > 11) {
                $erros[] = "Telefone inválido";
            }
        }
        
        return $erros;
    }
}
?>