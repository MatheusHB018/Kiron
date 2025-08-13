import React, { useEffect, useState } from 'react';
import { API_URL } from '../services/api';
import './styles/RelatoriosPage.css';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function RelatoriosPage() {
  const [residuosData, setResiduosData] = useState(null);
  const [grupoData, setGrupoData] = useState(null);
  const [entregasPorMes, setEntregasPorMes] = useState(null);
  const [grupoCadastradoData, setGrupoCadastradoData] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [r1, r2, r3, r4] = await Promise.all([
          fetch(`${API_URL}/relatorios/residuos-quantidade`).then(r => r.json()),
          fetch(`${API_URL}/relatorios/grupo-residuos`).then(r => r.json()),
          fetch(`${API_URL}/relatorios/entregas-por-mes`).then(r => r.json()),
          fetch(`${API_URL}/relatorios/grupo-residuos-cadastrados`).then(r => r.json()),
        ]);
        setResiduosData(r1);
        setGrupoData(r2);
        setEntregasPorMes(r3);
        setGrupoCadastradoData(r4);
      } catch (e) {
        setErro('Falha ao carregar relatórios.');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return (
    <div className="relatorios-wrapper">
      <div className="relatorios-header">
        <h1>Relatórios</h1>
        {loading && <span className="info-inline">Carregando...</span>}
        {erro && <span className="erro-inline">{erro}</span>}
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h2>Resíduos entregues (quantidade)</h2>
          <div className="chart-inner">
            {residuosData && residuosData.labels?.length > 0 ? (
              <Bar
                data={{
                  labels: residuosData.labels,
                  datasets: [
                    {
                      label: 'Quantidade Entregue',
                      data: residuosData.values,
                      backgroundColor: '#4bc0c0'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } }
                }}
              />
            ) : (
              <p className="placeholder">Sem dados</p>
            )}
          </div>
        </div>
        <div className="chart-card">
          <h2>Distribuição por grupo (entregas)</h2>
          <div className="chart-inner">
            {grupoData && grupoData.labels?.length > 0 ? (
              <Pie
                data={{
                  labels: grupoData.labels,
                  datasets: [
                    {
                      label: 'Grupo',
                      data: grupoData.values,
                      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']
                    }
                  ]
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            ) : (
              <p className="placeholder">Sem dados</p>
            )}
          </div>
        </div>
        <div className="chart-card">
          <h2>Resíduos cadastrados por grupo</h2>
          <div className="chart-inner">
            {grupoCadastradoData && grupoCadastradoData.labels?.length > 0 ? (
              <Bar
                data={{
                  labels: grupoCadastradoData.labels,
                  datasets: [
                    {
                      label: 'Tipos Cadastrados',
                      data: grupoCadastradoData.values,
                      backgroundColor: '#ff9f40'
                    }
                  ]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { x: { beginAtZero: true } }
                }}
              />
            ) : (
              <p className="placeholder">Sem dados</p>
            )}
          </div>
        </div>
        <div className="chart-card">
          <h2>Entregas por mês (12M)</h2>
          <div className="chart-inner">
            {entregasPorMes && entregasPorMes.labels?.length > 0 ? (
              <Bar
                data={{
                  labels: entregasPorMes.labels,
                  datasets: [
                    {
                      label: 'Entregas',
                      data: entregasPorMes.values,
                      backgroundColor: '#9966ff'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } }
                }}
              />
            ) : (
              <p className="placeholder">Sem dados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelatoriosPage;