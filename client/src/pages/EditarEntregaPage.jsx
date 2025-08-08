// client/src/pages/EditarEntregaPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaBox, FaSave, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';

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
    data_prevista_devolucao: '',
    status: '',
    observacoes: ''
  });

  // Função para formatar a data para o input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Converte a data (que pode vir com fuso horário) para o formato YYYY-MM-DD
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
      
      // Formata a data antes de colocar no estado
      setForm({
        ...entregaData,
        data_prevista_devolucao: formatDateForInput(entregaData.data_prevista_devolucao),
      });

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
        body: JSON.stringify({
            ...form,
            data_prevista_devolucao: form.data_prevista_devolucao || null
        }),
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
      <header className="page-header">
        <div className="page-title">
          <FaBox className="icon" />
          <h1>Editar Entrega</h1>
        </div>
        <Link to="/entregas" className="btn btn-secondary">
          <FaArrowLeft /> Voltar
        </Link>
      </header>
      <div className="content-box form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
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
                <label htmlFor="data_prevista_devolucao">Data Prevista para Devolução</label>
                <input type="date" id="data_prevista_devolucao" name="data_prevista_devolucao" value={form.data_prevista_devolucao} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={form.status} onChange={handleChange} required>
                    <option value="Aguardando Devolução">Aguardando Devolução</option>
                    <option value="Devolvido">Devolvido</option>
                    <option value="Vencido">Vencido</option>
                    <option value="Entregue">Entregue (sem devolução)</option>
                </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="observacoes">Observações (Opcional)</label>
              <input type="text" id="observacoes" name="observacoes" value={form.observacoes || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <FaSave /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarEntregaPage;