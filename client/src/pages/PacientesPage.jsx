// client/src/pages/PacientesPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// AQUI: Adicionado o FaUsers que estava faltando
import { FaUsers, FaPlus, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import './styles/Page.css'; // Estilos gerais da página
import './styles/PacientesPage.css'; // Estilos específicos para esta página

// Dados de exemplo (mock) que seriam substituídos por uma chamada de API
const mockPacientes = [
  { id: 1, nome: 'Ana Carolina Silva', cpf: '123.456.789-00', telefone: '(11) 98765-4321', status: 'Ativo' },
  { id: 2, nome: 'Bruno Medeiros Costa', cpf: '234.567.890-11', telefone: '(21) 91234-5678', status: 'Ativo' },
  { id: 3, nome: 'Carlos de Andrade Dias', cpf: '345.678.901-22', telefone: '(31) 95678-1234', status: 'Inativo' },
  { id: 4, nome: 'Daniela Fernandes Souza', cpf: '456.789.012-33', telefone: '(41) 98765-1234', status: 'Ativo' },
  { id: 5, nome: 'Eduarda Martins Lima', cpf: '567.890.123-44', telefone: '(51) 91234-8765', status: 'Ativo' },
];

function PacientesPage() {
  const [pacientes, setPacientes] = useState(mockPacientes);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Navega para a página de detalhes que criamos anteriormente
  const handleVerDetalhes = (id) => {
    navigate(`/pacientes/${id}`);
  };

  // Filtra os pacientes com base no termo de busca (nome ou CPF)
  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm)
  );

  return (
    <div className="page-container">
      {/* Cabeçalho com título e botão de adicionar */}
      <div className="page-header">
        <div className="page-title">
          <FaUsers className="icon" />
          <h1>Gestão de Pacientes</h1>
        </div>
        <button className="add-button">
          <FaPlus />
          Cadastrar Paciente
        </button>
      </div>

      {/* Container de Filtros e Busca */}
      <div className="filter-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de Pacientes */}
      <div className="table-container">
        <table className="pacientes-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPacientes.map((paciente) => (
              <tr key={paciente.id}>
                <td>{paciente.nome}</td>
                <td>{paciente.cpf}</td>
                <td>{paciente.telefone}</td>
                <td>
                  <span className={`status status-${paciente.status.toLowerCase()}`}>
                    {paciente.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-button view" title="Ver Detalhes" onClick={() => handleVerDetalhes(paciente.id)}>
                    <FaEye />
                  </button>
                  <button className="action-button edit" title="Editar Paciente">
                    <FaEdit />
                  </button>
                  <button className="action-button delete" title="Excluir Paciente">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PacientesPage;