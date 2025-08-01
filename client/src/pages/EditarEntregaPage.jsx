import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaBox, FaSave, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

function EditarEntregaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id_paciente: '',
    id_residuo: '',
    quantidade: 1,
    observacoes: ''
  });

  // Busca os dados da entrega específica E também as listas de pacientes/resíduos
  const fetchData = useCallback(async () => {
    try {
      const [entregaRes, pacientesRes, residuosRes] = await Promise.all([
        fetch(`${API_URL}/entregas/${id}`),
        fetch(`${API_URL}/pacientes`),
        fetch(`${API_URL}/residuos`)
      ]);

      if (!entregaRes.ok) throw new Error('Entrega não encontrada.');

      const entregaData = await entregaRes.json();
      const pacientesData = await pacientesRes.json();
      const residuosData = await residuosRes.json();

      setForm(entregaData);
      setPacientes(pacientesData);
      setResiduos(residuosData);
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error');
      navigate('/entregas');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/entregas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Falha ao atualizar a entrega.');
      Swal.fire('Sucesso!', 'Entrega atualizada com sucesso.', 'success');
      navigate('/entregas');
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error');
    }
  };

  if (loading) {
    return <div className="page-container"><p>Carregando dados da entrega...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaBox className="icon" />
          <h1>Editar Entrega</h1>
        </div>
        <Link to="/entregas" className="back-button">
          <FaArrowLeft /> Voltar para a Lista
        </Link>
      </div>
      <div className="content-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid two-columns">
            <div className="form-group">
              <label htmlFor="id_paciente">Paciente</label>
              <select id="id_paciente" name="id_paciente" value={form.id_paciente} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {pacientes.map(p => (
                  <option key={p.id_paciente} value={p.id_paciente}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_residuo">Material Entregue</label>
              <select id="id_residuo" name="id_residuo" value={form.id_residuo} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {residuos.map(r => (
                  <option key={r.id_residuo} value={r.id_residuo}>{r.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantidade">Quantidade</label>
              <input type="number" id="quantidade" name="quantidade" value={form.quantidade} onChange={handleChange} min="1" required />
            </div>
            <div className="form-group">
              <label htmlFor="observacoes">Observações (Opcional)</label>
              <input type="text" id="observacoes" name="observacoes" value={form.observacoes || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              <FaSave /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarEntregaPage;