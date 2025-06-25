// client/src/pages/PerfilPage.jsx
import { FaUserCircle } from 'react-icons/fa';
import './styles/Page.css';

function PerfilPage() {
  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaUserCircle className="icon" />
          <h1>Meu Perfil</h1>
        </div>
      </div>
      <p>
        Gerencie suas informações pessoais, altere sua senha e configure suas preferências de notificação.
      </p>
    </div>
  );
}

export default PerfilPage;