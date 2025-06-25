// client/src/pages/RelatoriosPage.jsx
import { FaChartBar } from 'react-icons/fa';
import './styles/Page.css';

function RelatoriosPage() {
  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaChartBar className="icon" />
          <h1>Relatórios e Análises</h1>
        </div>
      </div>
      <p>
        Gere relatórios de impacto ESG, visualize dados de coletas e acompanhe os principais indicadores.
      </p>
    </div>
  );
}

export default RelatoriosPage;