import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUserEdit, FaSave } from 'react-icons/fa';
import { getPacienteById, updatePaciente } from '../services/api';
import './styles/Page.css';
import './styles/CadastroForm.css'; // Reutilizando o mesmo estilo

function EditarPacientePage() {
  const [paciente, setPaciente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
    data_nascimento: ''
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const data = await getPacienteById(id);
        setPaciente(data);
      } catch (err) {
        setErro('Não foi possível carregar os dados do paciente.');
        Swal.fire('Erro!', err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await updatePaciente(id, paciente);
      Swal.fire({
        title: 'Sucesso!',
        text: response.message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/pacientes'), 2000);
    } catch (err) {
      setErro(err.message || 'Ocorreu um erro ao atualizar o paciente.');
      Swal.fire('Erro!', erro, 'error');
    }
  };

  if (loading) {
    return <div className="page-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaUserEdit className="icon" />
          <h1>Editar Paciente</h1>
        </div>
      </div>
      <p>Atualize os dados do paciente abaixo.</p>

      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {erro && <div className="form-message error">{erro}</div>}
          {/* O formulário é idêntico ao de cadastro */}
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" value={paciente.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" name="cpf" value={paciente.cpf} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <input type="date" id="data_nascimento" name="data_nascimento" value={paciente.data_nascimento} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={paciente.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input type="tel" id="telefone" name="telefone" value={paciente.telefone} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="endereco">Endereço Completo</label>
              <input type="text" id="endereco" name="endereco" value={paciente.endereco} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              <FaSave />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarPacientePage;