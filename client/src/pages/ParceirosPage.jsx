// client/src/pages/ParceirosPage.jsx
import { FaHandshake } from 'react-icons/fa';
import './styles/Page.css';

function ParceirosPage() {
  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaHandshake className="icon" />
          <h1>Gestão de Parceiros</h1>
        </div>
      </div>
      <p>
        Gerencie as informações e o status das empresas parceiras e pontos de coleta.
      </p>
    </div>
  );
}

export default ParceirosPage;