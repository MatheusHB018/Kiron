// client/src/pages/CadastroEntregaPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBox, FaSave, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';

function CadastroEntregaPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id_paciente: '',
    id_residuo: '',
    quantidade: 1,
    data_prevista_devolucao: '',
    status: 'Aguardando Devolução', // Valor padrão
    observacoes: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [pacientesRes, residuosRes] = await Promise.all([
          fetch(`${API_URL}/pacientes`),
          fetch(`${API_URL}/residuos`)
        ]);
        const pacientesData = await pacientesRes.json();
        const residuosData = await residuosRes.json();
        setPacientes(pacientesData);
        setResiduos(residuosData);
      } catch (error) {
        Swal.fire('Erro!', 'Não foi possível carregar os dados necessários.', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_paciente || !form.id_residuo) {
        Swal.fire('Atenção!', 'Por favor, selecione um paciente e um material.', 'warning');
        return;
    }
    try {
      const response = await fetch(`${API_URL}/entregas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...form,
            // Envia null se a data não for preenchida
            data_prevista_devolucao: form.data_prevista_devolucao || null
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao registrar a entrega.');
      Swal.fire('Sucesso!', 'Entrega registrada com sucesso.', 'success');
      navigate('/entregas');
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-title">
          <FaBox className="icon" />
          <h1>Registrar Nova Entrega</h1>
        </div>
        <Link to="/entregas" className="btn btn-secondary">
          <FaArrowLeft /> Voltar
        </Link>
      </header>

      <div className="content-box form-container">
        {loading ? <p>Carregando...</p> : (
            <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                    <label htmlFor="id_paciente">Paciente</label>
                    <select id="id_paciente" name="id_paciente" value={form.id_paciente} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {pacientes.map(p => <option key={p.id_paciente} value={p.id_paciente}>{p.nome}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="id_residuo">Material Entregue</label>
                    <select id="id_residuo" name="id_residuo" value={form.id_residuo} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {residuos.map(r => <option key={r.id_residuo} value={r.id_residuo}>{r.nome}</option>)}
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
                    <input type="text" id="observacoes" name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Ex: Kit para 30 dias" />
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    <FaSave /> Salvar Entrega
                </button>
            </div>
            </form>
        )}
      </div>
    </div>
  );
}

export default CadastroEntregaPage;