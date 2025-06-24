// src/pages/PacienteDetalhesPage.jsx
import './styles/Page.css';
import { useParams } from 'react-router-dom';

function PacienteDetalhesPage() {
  const { id } = useParams(); // Captura o ID do paciente da URL

  return (
    <div className="page-container">
      <h1>Detalhes do Paciente (ID: {id})</h1>
      <p>
        Esta página exibirá informações detalhadas sobre o paciente, seu histórico de retiradas de materiais e agendamentos de coleta.
      </p>
      {/* Componentes com as informações detalhadas do paciente serão renderizados aqui. */}
    </div>
  );
}

export default PacienteDetalhesPage;