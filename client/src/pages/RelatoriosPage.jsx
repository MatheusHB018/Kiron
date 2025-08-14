import React, { useEffect, useState, useRef } from 'react';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaPrint } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function RelatoriosPage() {
  const [data, setData] = useState({
    residuos: null,
    grupo: null,
    entregas: null,
    cadastrados: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch(`${API_URL}/relatorios/residuos-quantidade`),
          fetch(`${API_URL}/relatorios/grupo-residuos`),
          fetch(`${API_URL}/relatorios/entregas-por-mes`),
          fetch(`${API_URL}/relatorios/grupo-residuos-cadastrados`)
        ]);

        const jsonResponses = await Promise.all(responses.map(r => r.json()));

        setData({
          residuos: jsonResponses[0],
          grupo: jsonResponses[1],
          entregas: jsonResponses[2],
          cadastrados: jsonResponses[3]
        });
      } catch (err) {
        setError('Erro ao carregar dados dos relatórios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = async () => {
    const input = contentRef.current;
    const pdf = new jsPDF('p', 'pt', 'a4');
    
    // Configurações para melhor qualidade
    const options = {
      scale: 2,
      quality: 1,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    };

    // Ajustes temporários para impressão
    const originalStyles = {
      display: input.style.display,
      flexDirection: input.style.flexDirection,
      flexWrap: input.style.flexWrap,
      gap: input.style.gap
    };

    input.style.display = 'block';
    input.style.flexDirection = 'column';
    input.style.flexWrap = 'nowrap';
    input.style.gap = '20px';

    try {
      const canvas = await html2canvas(input, options);
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calcula dimensões mantendo proporção
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Adiciona cabeçalho
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('Relatório de Estatísticas', 40, 30);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString()}`, 40, 50);

      // Adiciona conteúdo
      pdf.addImage(imgData, 'PNG', 20, 70, pdfWidth, pdfHeight);
      
      pdf.save('relatorio_estatisticas.pdf');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setError('Falha ao gerar o PDF');
    } finally {
      // Restaura estilos originais
      input.style.display = originalStyles.display;
      input.style.flexDirection = originalStyles.flexDirection;
      input.style.flexWrap = originalStyles.flexWrap;
      input.style.gap = originalStyles.gap;
    }
  };

  if (loading) return <div className="loading">Carregando dados...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="relatorios-container">
      <div className="header">
        <h1>Relatórios Estatísticos</h1>
        <button onClick={handlePrint} className="print-btn">
          <FaPrint /> Exportar PDF
        </button>
      </div>

      <div className="charts-grid" ref={contentRef}>
        {/* Gráfico 1 */}
        <div className="chart-card">
          <h2>Resíduos Entregues</h2>
          <div className="chart-container">
            {data.residuos ? (
              <Bar
                data={{
                  labels: data.residuos.labels,
                  datasets: [{
                    label: 'Quantidade',
                    data: data.residuos.values,
                    backgroundColor: '#4bc0c0'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                  animation: { duration: 0 } // Remove animações para impressão
                }}
              />
            ) : <p>Sem dados disponíveis</p>}
          </div>
        </div>

        {/* Gráfico 2 */}
        <div className="chart-card">
          <h2>Distribuição por Grupo</h2>
          <div className="chart-container">
            {data.grupo ? (
              <Pie
                data={{
                  labels: data.grupo.labels,
                  datasets: [{
                    data: data.grupo.values,
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { duration: 0 }
                }}
              />
            ) : <p>Sem dados disponíveis</p>}
          </div>
        </div>

        {/* Gráfico 3 */}
        <div className="chart-card">
          <h2>Resíduos Cadastrados</h2>
          <div className="chart-container">
            {data.cadastrados ? (
              <Bar
                data={{
                  labels: data.cadastrados.labels,
                  datasets: [{
                    label: 'Tipos',
                    data: data.cadastrados.values,
                    backgroundColor: '#ff9f40'
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { duration: 0 }
                }}
              />
            ) : <p>Sem dados disponíveis</p>}
          </div>
        </div>

        {/* Gráfico 4 */}
        <div className="chart-card">
          <h2>Entregas por Mês</h2>
          <div className="chart-container">
            {data.entregas ? (
              <Bar
                data={{
                  labels: data.entregas.labels,
                  datasets: [{
                    label: 'Entregas',
                    data: data.entregas.values,
                    backgroundColor: '#9966ff'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { duration: 0 }
                }}
              />
            ) : <p>Sem dados disponíveis</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelatoriosPage;