import "../style/Dashboard.css"
import Card from "./Card";
import Charts from "./ChartsBars";
import ChartsPie from "./ChartsPie"

function Dashboard() {
  return (
    <main className="dashboard">
        <Card></Card>
        <section className="charts"> 
      
        <Charts></Charts>
        <ChartsPie></ChartsPie>
        </section>
    </main>
  );
}

export default Dashboard;
