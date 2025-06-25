// client/src/pages/PainelColetasPage.jsx
import { FaCalendarCheck } from 'react-icons/fa';
import './styles/Page.css';

function PainelColetasPage() {
  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaCalendarCheck className="icon" />
          <h1>Painel de Coletas</h1>
        </div>
      </div>
      <p>
        Monitore o status das coletas agendadas, visualize o histórico e gerencie as operações com empresas parceiras.
      </p>
    </div>
  );
}

export default PainelColetasPage;