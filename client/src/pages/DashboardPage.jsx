// src/pages/DashboardPage.jsx
import { Link } from 'react-router-dom';
import './styles/DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1>Painel de Controle</h1>
      <div className="dashboard-cards">
        <Link to="/pacientes" className="card">
          <h2>Gestão de Pacientes</h2>
          <p>Cadastre e monitore os pacientes em tratamento domiciliar.</p>
        </Link>
        <Link to="/materiais" className="card">
          <h2>Controle de Materiais</h2>
          <p>Registre a retirada de insumos e gere históricos.</p>
        </Link>
        <Link to="/agendamento" className="card">
          <h2>Agendar Coleta</h2>
          <p>Agende a coleta de resíduos com empresas parceiras.</p>
        </Link>
        <Link to="/relatorios" className="card">
          <h2>Relatórios ESG</h2>
          <p>Gere relatórios de sustentabilidade e impacto.</p>
        </Link>
        <Link to="/parceiros" className="card">
          <h2>Rede de Parceiros</h2>
          <p>Gerencie farmácias, UBS e outros pontos de coleta.</p>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;