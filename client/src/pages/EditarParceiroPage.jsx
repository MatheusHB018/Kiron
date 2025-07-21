// src/pages/EditarParceiroPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaSpinner, FaSave, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './styles/Page.css';

function EditarParceiroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', cnpj: '', tipo: '', endereco: '', telefone: '', email: '' });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/parceiros/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          nome: data.nome || '',
          cnpj: data.cnpj || '',
          tipo: data.tipo || '',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          email: data.email || ''
        });
        setOriginal({
          nome: data.nome || '',
          cnpj: data.cnpj || '',
          tipo: data.tipo || '',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          email: data.email || ''
        });
      })
      .catch(() => Swal.fire('Erro!', 'Não foi possível carregar os dados do parceiro.', 'error').then(() => navigate('/parceiros')))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(original);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/parceiros/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao editar parceiro');
      }
      Swal.fire({
        title: 'Sucesso!',
        text: 'Parceiro atualizado com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => navigate('/parceiros'));
    } catch (err) {
      Swal.fire('Erro!', err.message || 'Não foi possível atualizar o parceiro.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="page-container"><h2>A carregar...</h2></div>;

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaEdit className="icon" />
          <h1>Editar Parceiro</h1>
        </div>
      </div>
      <Link to="/parceiros" className="back-link">
        <FaArrowLeft /> Voltar para a lista
      </Link>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <div className="input-with-icon"><FaBuilding className="input-icon" /><input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} required /></div>
            </div>
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input type="text" id="cnpj" name="cnpj" value={form.cnpj} onChange={handleChange} required maxLength="18" />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo</label>
              <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="empresa_coleta">Empresa de Coleta</option>
                <option value="farmacia">Farmácia</option>
                <option value="ubs">UBS</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="endereco">Endereço</label>
              <div className="input-with-icon"><FaMapMarkerAlt className="input-icon" /><input type="text" id="endereco" name="endereco" value={form.endereco} onChange={handleChange} /></div>
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <div className="input-with-icon"><FaPhone className="input-icon" /><input type="text" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} /></div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon"><FaEnvelope className="input-icon" /><input type="email" id="email" name="email" value={form.email} onChange={handleChange} /></div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting || !isDirty}>{isSubmitting ? <><FaSpinner className="spinner" /> A guardar...</> : <><FaSave /> Salvar Alterações</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarParceiroPage;
