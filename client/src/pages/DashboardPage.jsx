// src/pages/DashboardPage.jsx
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaBoxOpen,
  FaCalendarAlt,
  FaChartPie,
  FaHandshake
} from 'react-icons/fa';
import './styles/DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Painel de Controle</h1>
        <p>Bem-vindo(a) ao MedResíduos! Selecione um módulo abaixo para começar.</p>
      </div>

      <div className="dashboard-cards">
        {/* Card de Pacientes */}
        <Link to="/pacientes" className="card card-pacientes">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h2>Gestão de Pacientes</h2>
            <p>Cadastre e monitore os pacientes em tratamento.</p>
          </div>
        </Link>

        {/* Card de Materiais */}
        <Link to="/materiais" className="card card-materiais">
           <div className="card-icon">
            <FaBoxOpen />
          </div>
          <div className="card-content">
            <h2>Controle de Materiais</h2>
            <p>Registre a retirada de insumos e gere históricos.</p>
          </div>
        </Link>

        {/* Card de Agendamento */}
        <Link to="/agendamento" className="card card-agendamento">
          <div className="card-icon">
            <FaCalendarAlt />
          </div>
          <div className="card-content">
            <h2>Agendar Coleta</h2>
            <p>Agende a coleta de resíduos com empresas parceiras.</p>
          </div>
        </Link>

        {/* Card de Relatórios */}
        <Link to="/relatorios" className="card card-relatorios">
          <div className="card-icon">
            <FaChartPie />
          </div>
          <div className="card-content">
            <h2>Relatórios ESG</h2>
            <p>Gere relatórios de sustentabilidade e impacto.</p>
          </div>
        </Link>

        {/* Card de Parceiros */}
        <Link to="/parceiros" className="card card-parceiros">
          <div className="card-icon">
            <FaHandshake />
          </div>
          <div className="card-content">
            <h2>Rede de Parceiros</h2>
            <p>Gerencie farmácias, UBS e outros pontos de coleta.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;