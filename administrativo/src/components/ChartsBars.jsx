import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../data/inscricoes';

const chartSetting = {
  yAxis: [
    {
      label: 'Número de inscrições',
      labelStyle: {
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff', 
      },
      tickLabelStyle: {
        fontSize: 12,
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
      },
    },
  ],
  xAxis: [
    {
      scaleType: 'band',
      dataKey: 'month',
      labelStyle: {
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
      },
      tickLabelStyle: {
        fontSize: 12,
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
      },
    },
  ],
  height: 400,
  width: 700,
  margin: { left: 0 },
};

export default function VerticalBars() {
  return (
    
      <div className='chart-container-bar'>
        <h3>Alunos por Mês 2025</h3>
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ 
            dataKey: 'inscricoes', 
            label: 'Inscrições por mês',
            valueFormatter,
            color: '#f02e2e', // cor das barras
          }]}
          layout="vertical"
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: 14,
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff', // cor da legenda
              },
            },
          }}
                    sx={{
            // Força a cor da legenda
            '& .MuiChartsLegend-series text': {
              fill: '#ffffff !important',
              fontSize: '14px !important',
              fontFamily: 'Arial, sans-serif !important',
            },
            '& .MuiChartsLegend-root': {
              color: '#ffffff !important',
            },
          }}
          {...chartSetting}
        />
      </div>
    
  );
}