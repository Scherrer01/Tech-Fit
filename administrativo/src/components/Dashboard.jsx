import "../Dashboard.css"
import Card from "./Card";

function Dashboard() {
  return (
    <main className="dashboard">
        <Card></Card>
      <section className="charts">
        <div className="chart-container">
          <h3>Matrículas por Mês</h3>
          <canvas id="barChart"></canvas>
        </div>
        <div className="chart-container">
          <h3>Relação de Alunos</h3>
          <canvas id="pieChart"></canvas>
        </div>
      </section>

      <section className="professores">
        <h3>Professores</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Área</th>
              <th>Sala</th>
              <th>RA</th>
              <th>Turno</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Luís Fernando</td>
              <td>Musculação</td>
              <td>10</td>
              <td>1098</td>
              <td>Manhã</td>
            </tr>
            <tr>
              <td>Cibelly Ferreira</td>
              <td>Crossfit</td>
              <td>09</td>
              <td>4576</td>
              <td>Manhã</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Dashboard;
