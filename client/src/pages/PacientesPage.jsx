// src/pages/PacientesPage.jsx
import './styles/Page.css'; // Importando o estilo padrão

function PacientesPage() {
  return (
    <div className="page-container">
      <h1>Gestão de Pacientes</h1>
      <p>
        Aqui você poderá cadastrar, visualizar, editar e remover os dados dos pacientes em tratamento.
      </p>
      {/* Futuramente, aqui ficará a tabela de pacientes, botões de ação, etc. */}
    </div>
  );
}

export default PacientesPage;