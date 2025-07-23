import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaSave, FaArrowLeft, FaCalendarCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';


function CadastroColetaPage() {
  const [form, setForm] = useState({ id_paciente: '', id_parceiro: '', data_agendada: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [parceiros, setParceiros] = useState([]);
  const navigate = useNavigate();

  // Buscar pacientes e parceiros ao carregar a página
  useEffect(() => {
    fetch(`${API_URL}/pacientes`)
      .then(res => res.json())
      .then(data => setPacientes(data));
    fetch(`${API_URL}/parceiros`)
      .then(res => res.json())
      .then(data => setParceiros(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/coletas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erro ao agendar coleta');
      Swal.fire({
        title: 'Sucesso!',
        text: 'Coleta agendada com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => navigate('/painel-coletas'));
    } catch (err) {
      Swal.fire('Erro!', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaPlus className="icon" />
          <h1>Agendar Nova Coleta</h1>
        </div>
      </div>
      <Link to="/painel-coletas" className="back-link">
        <FaArrowLeft /> Voltar para o painel
      </Link>
      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h3>Dados do Agendamento</h3>
          </div>
          <div className="form-grid two-columns">
            <div className="form-group">
              <label htmlFor="id_paciente">Paciente</label>
              <select id="id_paciente" name="id_paciente" value={form.id_paciente} onChange={handleChange} required>
                <option value="">Selecione o paciente</option>
                {pacientes.map(p => (
                  <option key={p.id_paciente} value={p.id_paciente}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_parceiro">Parceiro</label>
              <select id="id_parceiro" name="id_parceiro" value={form.id_parceiro} onChange={handleChange} required>
                <option value="">Selecione o parceiro</option>
                {parceiros.map(p => (
                  <option key={p.id_parceiro} value={p.id_parceiro}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group span-2">
              <label htmlFor="data_agendada">Data Agendada</label>
              <input type="datetime-local" id="data_agendada" name="data_agendada" value={form.data_agendada} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? <><FaSave /> Salvando...</> : <><FaSave /> Agendar Coleta</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroColetaPage;
