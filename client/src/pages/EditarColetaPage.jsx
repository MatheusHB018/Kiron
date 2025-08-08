import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaSave, FaCalendarCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';


function EditarColetaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ id_paciente: '', id_parceiro: '', data_agendada: '', status: '' });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [parceiros, setParceiros] = useState([]);

  useEffect(() => {
    // Buscar dados da coleta
    fetch(`${API_URL}/coletas/${id}`)
      .then(res => res.json())
      .then(data => {
        // Corrige a data/hora para o formato local do input datetime-local
        let dataLocal = '';
        if (data.data_agendada) {
          const d = new Date(data.data_agendada);
          // Ajusta para o fuso local e formata para yyyy-MM-ddTHH:mm
          const pad = n => n.toString().padStart(2, '0');
          dataLocal = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
        setForm({
          id_paciente: data.id_paciente || '',
          id_parceiro: data.id_parceiro || '',
          data_agendada: dataLocal,
          status: data.status || ''
        });
        setOriginalData(data);
      })
      .catch(() => {
        Swal.fire('Erro!', 'Não foi possível carregar os dados da coleta.', 'error')
          .then(() => navigate('/painel-coletas'));
      });
    // Buscar pacientes e parceiros
    fetch(`${API_URL}/pacientes`)
      .then(res => res.json())
      .then(data => setPacientes(data));
    fetch(`${API_URL}/parceiros`)
      .then(res => res.json())
      .then(data => setParceiros(data));
    setLoading(false);
  }, [id, navigate]);

  const isDirty = JSON.stringify(form) !== JSON.stringify({
    id_paciente: originalData?.id_paciente || '',
    id_parceiro: originalData?.id_parceiro || '',
    data_agendada: originalData?.data_agendada ? originalData.data_agendada.slice(0, 16) : '',
    status: originalData?.status || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) {
      Swal.fire('Nenhuma alteração', 'Nenhum dado foi modificado.', 'info');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/coletas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Erro ao atualizar coleta');
      Swal.fire({
        title: 'Sucesso!',
        text: 'Coleta atualizada com sucesso.',
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

  if (loading) return <div className="page-container"><h2>A carregar...</h2></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <FaEdit className="icon" />
          <h1>Editar Coleta</h1>
        </div>
      </div>
      <Link to="/painel-coletas" className="back-link">
        <FaArrowLeft /> Voltar para o painel
      </Link>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section"><h3>Dados da Coleta</h3></div>
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
            <div className="form-group span-2">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} required>
                <option value="agendada">Agendada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? <><FaSave /> Salvando...</> : <><FaSave /> Salvar Alterações</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarColetaPage;
