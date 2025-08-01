// client/src/pages/CadastroResiduoPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBoxOpen, FaSave, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

function CadastroResiduoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    grupo: '',
    risco_especifico: '',
    estado_fisico: '',
    acondicionamento: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/residuos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao cadastrar o tipo de resíduo.');
      Swal.fire('Sucesso!', 'Tipo de resíduo cadastrado com sucesso.', 'success');
      navigate('/residuos');
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaBoxOpen className="icon" />
          <h1>Novo Tipo de Resíduo</h1>
        </div>
        <Link to="/residuos" className="back-button">
          <FaArrowLeft /> Voltar para a Lista
        </Link>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Linha 1: Nome e Descrição */}
          <div className="form-grid two-columns">
            <div className="form-group">
              <label htmlFor="nome">Nome do Material/Resíduo</label>
              <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Agulha de Insulina, Curativo" required />
            </div>
             <div className="form-group">
              <label htmlFor="descricao">Descrição (Opcional)</label>
              <input type="text" id="descricao" name="descricao" value={form.descricao} onChange={handleChange} placeholder="Ex: Utilizado por paciente diabético" />
            </div>
          </div>
          
          {/* Linha 2: Classificações Técnicas */}
           <h4 className="form-section-title">Classificação Técnica</h4>
           <div className="form-grid four-columns">
             <div className="form-group">
                <label htmlFor="grupo">Grupo (ANVISA)</label>
                <select id="grupo" name="grupo" value={form.grupo} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="A - Infectante">Grupo A - Infectante</option>
                    <option value="B - Químico">Grupo B - Químico</option>
                    <option value="D - Comum">Grupo D - Comum</option>
                    <option value="E - Perfurocortante">Grupo E - Perfurocortante</option>
                </select>
             </div>
             <div className="form-group">
                <label htmlFor="risco_especifico">Risco Específico</label>
                <select id="risco_especifico" name="risco_especifico" value={form.risco_especifico} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="Biológico">Biológico</option>
                    <option value="Químico">Químico</option>
                    <option value="Perfurocortante">Perfurocortante</option>
                    <option value="Nenhum">Nenhum</option>
                </select>
             </div>
             <div className="form-group">
                <label htmlFor="estado_fisico">Estado Físico</label>
                <select id="estado_fisico" name="estado_fisico" value={form.estado_fisico} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="Sólido">Sólido</option>
                    <option value="Líquido">Líquido</option>
                    <option value="Semissólido">Semissólido</option>
                </select>
             </div>
              <div className="form-group">
                <label htmlFor="acondicionamento">Acondicionamento</label>
                 <select id="acondicionamento" name="acondicionamento" value={form.acondicionamento} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    <option value="Caixa para Perfurocortante (Descarpack)">Caixa para Perfurocortante (Descarpack)</option>
                    <option value="Saco Branco Leitoso">Saco Branco Leitoso</option>
                    <option value="Saco Vermelho">Saco Vermelho</option>
                    <option value="Galão Rígido">Galão Rígido</option>
                    <option value="Saco Preto">Saco Preto (Comum)</option>
                </select>
              </div>
           </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              <FaSave /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroResiduoPage;