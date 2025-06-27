import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUserPlus, FaSave } from 'react-icons/fa';
import { cadastrarPaciente } from '../services/api'; // Precisaremos criar esta função na API
import './styles/Page.css';
import './styles/CadastroForm.css'; // Usaremos um CSS de formulário genérico

function CadastroPacientePage() {
  const [paciente, setPaciente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
    data_nascimento: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

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
    setSucesso('');

    // Validação simples
    for (const key in paciente) {
      if (paciente[key] === '') {
        setErro(`O campo ${key.replace('_', ' ')} é obrigatório.`);
        return;
      }
    }

    try {
      const response = await cadastrarPaciente(paciente);
      Swal.fire({
        title: 'Sucesso!',
        text: response.message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/pacientes'), 2000);
    } catch (err) {
      setErro(err.message || 'Ocorreu um erro ao cadastrar o paciente.');
      Swal.fire('Erro!', erro, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaUserPlus className="icon" />
          <h1>Cadastro de Paciente</h1>
        </div>
      </div>
      <p>Preencha os dados abaixo para adicionar um novo paciente ao sistema.</p>

      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {erro && <div className="form-message error">{erro}</div>}
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" value={paciente.nome} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" name="cpf" value={paciente.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
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
              <input type="tel" id="telefone" name="telefone" value={paciente.telefone} onChange={handleChange} placeholder="(00) 90000-0000" required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="endereco">Endereço Completo</label>
              <input type="text" id="endereco" name="endereco" value={paciente.endereco} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              <FaSave />
              Cadastrar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroPacientePage;