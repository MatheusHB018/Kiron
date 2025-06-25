// client/src/pages/MateriaisPage.jsx
import { FaBoxOpen } from 'react-icons/fa';
import './styles/Page.css';

function MateriaisPage() {
  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaBoxOpen className="icon" />
          <h1>Controle de Materiais</h1>
        </div>
      </div>
      <p>
        Registre a saída de materiais para pacientes e mantenha um histórico detalhado.
      </p>
    </div>
  );
}

export default MateriaisPage;