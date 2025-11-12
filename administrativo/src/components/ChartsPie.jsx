import { PieChart } from '@mui/x-charts/PieChart';
import { modalidades, valueFormatter } from '../data/dados';

export default function PieActiveArc() {
  return (
    <div className="chart-container-pie">
      <div>
        <h3 className='piechart-title'>Modalidades mais praticadas</h3>
        <PieChart
          series={[
            {
              data: modalidades,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              valueFormatter,
            },
              
          ]}
          height={300}
          width={400}
          slotProps={{
            legend: {
              labelStyle: {
                fill: '#ffffff',
                fontSize: 14,
                fontFamily: 'Arial, sans-serif',
              },
            },
          }}
          sx={{
            // Força a cor da legenda
            '& .MuiChartsLegend-series text': {
              fill: '#ffffff !important',
            },
            '& .MuiChartsLegend-root': {
              color: '#ffffff !important',
            },
          }}
        />
      </div>
    </div>
  );
}
