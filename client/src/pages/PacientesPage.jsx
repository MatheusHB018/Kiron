import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getPacientes, deletePaciente } from '../services/api';
import './styles/Page.css';
import './styles/Table.css'; // Usaremos um CSS de tabela genérico

function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const data = await getPacientes();
      setPacientes(data);
    } catch (err) {
      setError('Não foi possível carregar a lista de pacientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleEdit = (id) => {
    navigate(`/editar-paciente/${id}`);
  };

  const handleDelete = (id, nome) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: `Deseja realmente excluir o paciente "${nome}"? Esta ação não pode ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePaciente(id);
          Swal.fire('Excluído!', 'O paciente foi removido do sistema.', 'success');
          fetchPacientes(); // Atualiza a lista após a exclusão
        } catch (err) {
          Swal.fire('Erro!', err.message || 'Não foi possível excluir o paciente.', 'error');
        }
      }
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <FaUsers className="icon" />
          <h1>Gerenciamento de Pacientes</h1>
        </div>
        <button className="add-button" onClick={() => navigate('/cadastro-paciente')}>
          <FaPlus />
          Cadastrar Paciente
        </button>
      </div>
      <p>Visualize, edite e remova os pacientes cadastrados no sistema.</p>

      {loading && <p>Carregando pacientes...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length > 0 ? (
                pacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td data-label="Nome">{paciente.nome}</td>
                    <td data-label="CPF">{paciente.cpf}</td>
                    <td data-label="Telefone">{paciente.telefone}</td>
                    <td data-label="Email">{paciente.email}</td>
                    <td data-label="Ações">
                      <div className="action-buttons">
                        <button className="action-button edit" onClick={() => handleEdit(paciente.id)} title="Editar">
                          <FaEdit />
                        </button>
                        <button className="action-button delete" onClick={() => handleDelete(paciente.id, paciente.nome)} title="Excluir">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">Nenhum paciente cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PacientesPage;