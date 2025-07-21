// src/pages/CadastroParceiroPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaSave, FaArrowLeft, FaSpinner, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

function CadastroParceiroPage() {
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    tipo: '',
    endereco: '',
    telefone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.cnpj || !form.tipo) {
      Swal.fire('Atenção', 'Preencha os campos obrigatórios.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/parceiros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao cadastrar parceiro');
      }
      Swal.fire({
        title: 'Sucesso!',
        text: 'Parceiro cadastrado com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => {
        navigate('/parceiros');
      });
    } catch (err) {
      Swal.fire('Erro!', err.message || 'Ocorreu um erro ao cadastrar o parceiro.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaPlus className="icon" />
          <h1>Cadastro de Parceiro</h1>
        </div>
      </div>
      <Link to="/parceiros" className="back-link">
        <FaArrowLeft /> Voltar para a lista
      </Link>
      <p>Adicione uma nova empresa parceira ou ponto de coleta preenchendo o formulário abaixo.</p>

      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <div className="input-with-icon">
                <FaBuilding className="input-icon" />
                <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome da empresa" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input type="text" id="cnpj" name="cnpj" value={form.cnpj} onChange={handleChange} required placeholder="CNPJ" maxLength="18" />
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
              <div className="input-with-icon">
                <FaMapMarkerAlt className="input-icon" />
                <input type="text" id="endereco" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço completo" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <div className="input-with-icon">
                <FaPhone className="input-icon" />
                <input type="text" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? <><FaSpinner className="spinner" /> A guardar...</> : <><FaSave /> Cadastrar Parceiro</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroParceiroPage;
