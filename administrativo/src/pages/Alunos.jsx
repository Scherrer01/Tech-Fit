import Button from "../components/Button"
import Aside from "../components/Aside"
import Inputs from "../components/Inputs"

function Alunos (){
    return(
        <main>
        <Aside/>
        <Button>Cadastrar Alunos</Button>
        <Button>Editar Alunos</Button>
        <Button>Deletar Alunos</Button>
        <table>
            <thead>
                <tr>
                    <th>ID:</th>
                    <th>Nome:</th>
                    <th>Endereço:</th>
                    <th>Telefone:</th>
                    <th>CPF:</th>
                    <th>Status Aluno:</th>
                    <th>Pesquisar</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Henrique Delgado</td>
                    <td>Rua J, 156</td>
                    <td>(19) 98788-0809</td>
                    <td>476.908.109-90</td>
                    <td>ATIVO</td>
                    <td><Inputs/> </td>
                </tr>
            </tbody>
        </table>
        </main>
        
    )
}

export default Alunos 