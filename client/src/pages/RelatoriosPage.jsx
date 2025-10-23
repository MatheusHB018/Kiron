import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../services/api';
import '../../public/css/RelatoriosPage.css';
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
    entregas_status: null,
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
          fetch(`${API_URL}/entregas`),
          fetch(`${API_URL}/relatorios/entregas-por-mes`),
          fetch(`${API_URL}/relatorios/grupo-residuos-cadastrados`)
        ]);

        const jsonResponses = await Promise.all(responses.map(r => r.json()));

        // Processar dados das entregas para o gráfico de status
        const entregas = jsonResponses[1];
        const statusCounts = {
          'Devolvido': 0,
          'Aguardando Devolução': 0,
          'Entregue': 0,
          'Vencido': 0
        };

        console.log('Dados das entregas:', entregas); // Debug

        // Processar entregas
        entregas.forEach(entrega => {
          console.log('Processando entrega:', entrega); // Debug
          
          if (entrega.status === 'Devolvido') {
            statusCounts['Devolvido']++;
          } else if (entrega.status === 'Entregue') {
            statusCounts['Entregue']++;
          } else if (entrega.status === 'Aguardando Devolução') {
            // Verificar se está vencido
            const dataAtual = new Date();
            const dataDevolucao = new Date(entrega.data_prevista_devolucao);
            
            console.log('Data atual:', dataAtual); // Debug
            console.log('Data devolução:', dataDevolucao); // Debug
            console.log('Está vencido?', dataAtual > dataDevolucao); // Debug
            
            if (dataAtual > dataDevolucao) {
              statusCounts['Vencido']++;
              console.log('Entrega vencida encontrada!', entrega); // Debug
            } else {
              statusCounts['Aguardando Devolução']++;
            }
          } else {
            // Capturar outros status que possam existir
            console.log('Status não mapeado:', entrega.status); // Debug
            if (entrega.status && entrega.status.toLowerCase().includes('vencid')) {
              statusCounts['Vencido']++;
            }
          }
        });

        console.log('Status counts:', statusCounts); // Debug

        const statusData = {
          labels: Object.keys(statusCounts),
          values: Object.values(statusCounts)
        };

        setData({
          residuos: jsonResponses[0],
          entregas_status: statusData,
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
                    backgroundColor: [
                      '#4bc0c0', // Azul água
                      '#ff6b9d', // Rosa
                      '#45b7d1', // Azul
                      '#f9ca24', // Amarelo
                      '#6c5ce7', // Roxo
                      '#fd79a8', // Rosa claro
                      '#e17055', // Laranja
                      '#00b894', // Verde
                      '#0984e3', // Azul escuro
                      '#a29bfe', // Lilás
                      '#fdcb6e', // Amarelo claro
                      '#ff7675', // Vermelho claro
                      '#74b9ff', // Azul médio
                      '#55a3ff', // Azul claro
                      '#26de81', // Verde claro
                      '#fc5c65'  // Vermelho
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed.y || 0;
                          return `${label}: ${value} entregas`;
                        }
                      }
                    }
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      grid: {
                        color: '#e9ecef'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  animation: { duration: 0 } // Remove animações para impressão
                }}
              />
            ) : <p>Sem dados disponíveis</p>}
          </div>
        </div>

        {/* Gráfico 2 */}
        <div className="chart-card">
          <h2>Status das Entregas</h2>
          <div className="chart-container">
            {data.entregas_status ? (
              <Pie
                data={{
                  labels: data.entregas_status.labels,
                  datasets: [{
                    data: data.entregas_status.values,
                    backgroundColor: [
                      '#28a745', // Verde para Devolvido
                      '#ffc107', // Amarelo para Aguardando Devolução
                      '#17a2b8', // Azul para Entregue
                      '#dc3545'  // Vermelho para Vencido
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { duration: 0 },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
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
                    backgroundColor: [
                      '#ff6b6b', // Vermelho
                      '#4ecdc4', // Verde água
                      '#45b7d1', // Azul
                      '#f9ca24', // Amarelo
                      '#6c5ce7', // Roxo
                      '#fd79a8', // Rosa
                      '#e17055', // Laranja
                      '#00b894', // Verde
                      '#0984e3', // Azul escuro
                      '#a29bfe', // Lilás
                      '#fdcb6e', // Amarelo claro
                      '#fd79a8'  // Rosa claro
                    ],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { duration: 0 },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed.x || 0;
                          return `${label}: ${value} tipos cadastrados`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: { 
                      beginAtZero: true,
                      grid: {
                        color: '#e9ecef'
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  }
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