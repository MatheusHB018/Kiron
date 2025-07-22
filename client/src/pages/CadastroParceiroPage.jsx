import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaSave,
  FaArrowLeft,
  FaSpinner,
  FaBuilding,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaInfoCircle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css'; // Pode reutilizar os estilos

function CadastroParceiroPage() {
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    inscricao_estadual: '',
    responsavel: '',
    observacoes: '',
    tipo: '',
    telefone: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const navigate = useNavigate();
  const numeroRef = useRef(null); // Para focar no campo 'número' após buscar o CEP

  // Função para máscara de CNPJ
  function maskCNPJ(value) {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  }

  // Função para máscara de telefone (celular ou fixo)
  function maskTelefone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
      // Fixo: (00) 0000-0000
      return value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').slice(0, 14);
    } else {
      // Celular: (00) 00000-0000
      return value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
    }
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cnpj') value = maskCNPJ(value);
    if (name === 'telefone') value = maskTelefone(value);
    setForm({ ...form, [name]: value });
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setForm({ ...form, cep });

    if (cep.length === 8) {
      setIsCepLoading(true);
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (data.erro) {
          Swal.fire('CEP não encontrado', 'Por favor, verifique o CEP digitado e tente novamente.', 'warning');
          setForm(prev => ({ ...prev, logradouro: '', bairro: '', cidade: '', estado: '' }));
        } else {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
          numeroRef.current.focus(); // Move o foco para o campo do número
        }
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível buscar o CEP. Verifique sua conexão e tente novamente.', 'error');
      } finally {
        setIsCepLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.cnpj || !form.tipo) {
      Swal.fire('Atenção', 'Os campos Nome, CNPJ e Tipo são obrigatórios.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      // Usando axios para a requisição POST
      await axios.post('http://localhost:3001/parceiros', form);
      Swal.fire({
        title: 'Sucesso!',
        text: 'Empresa parceira cadastrada com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => {
        navigate('/parceiros');
      });
    } catch (err) {
      Swal.fire('Erro!', err.response?.data?.error || 'Ocorreu um erro ao cadastrar a empresa.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaPlus className="icon" />
          <h1>Cadastro de Empresa Parceira</h1>
        </div>
      </div>
      <Link to="/parceiros" className="back-link">
        <FaArrowLeft /> Voltar para a lista
      </Link>

      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {/* Seção de Informações da Empresa */}
          <div className="form-section">
            <h3>Informações da Empresa</h3>
          </div>
          <div className="form-grid two-columns">
            <div className="form-group span-2">
              <label htmlFor="nome">Nome / Razão Social</label>
              <div className="input-with-icon">
                <FaBuilding className="input-icon" />
                <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: Farmácia Central" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                required
                maxLength="18"
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="form-group">
              <label htmlFor="inscricao_estadual">Inscrição Estadual</label>
              <input type="text" id="inscricao_estadual" name="inscricao_estadual" value={form.inscricao_estadual} onChange={handleChange} placeholder="Apenas números (se aplicável)" />
            </div>
            <div className="form-group">
              <label htmlFor="responsavel">Responsável</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input type="text" id="responsavel" name="responsavel" value={form.responsavel} onChange={handleChange} placeholder="Nome do contato principal" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Parceiro</label>
              <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required>
                <option value="">Selecione o tipo</option>
                <option value="empresa_coleta">Empresa de Coleta</option>
                <option value="farmacia">Farmácia</option>
                <option value="ubs">UBS</option>
              </select>
            </div>
            <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="contato@empresa.com" />
                </div>
            </div>
             <div className="form-group span-2">
              <label htmlFor="observacoes">Observações</label>
              <div className="input-with-icon">
                <FaInfoCircle className="input-icon" />
                <input type="text" id="observacoes" name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Qualquer informação adicional relevante" />
              </div>
            </div>
          </div>

          {/* Seção de Endereço */}
          <div className="form-section">
            <h3>Endereço</h3>
          </div>
          <div className="form-grid three-columns">
            <div className="form-group">
              <label htmlFor="cep">CEP</label>
              <div className="input-with-icon">
                <input type="text" id="cep" name="cep" value={form.cep} onChange={handleCepChange} maxLength="9" placeholder="00000-000" />
                {isCepLoading && <FaSpinner className="spinner input-icon-right" />}
              </div>
            </div>
            <div className="form-group span-2">
              <label htmlFor="logradouro">Logradouro</label>
               <div className="input-with-icon">
                    <FaMapMarkerAlt className="input-icon" />
                    <input type="text" id="logradouro" name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Preenchido automaticamente" readOnly />
                </div>
            </div>
            <div className="form-group">
              <label htmlFor="numero">Número</label>
              <input type="text" id="numero" name="numero" ref={numeroRef} value={form.numero} onChange={handleChange} placeholder="Ex: 123" />
            </div>
            <div className="form-group">
              <label htmlFor="complemento">Complemento</label>
              <input type="text" id="complemento" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ex: Sala 10, Bloco B" />
            </div>
            <div className="form-group">
              <label htmlFor="bairro">Bairro</label>
              <input type="text" id="bairro" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Preenchido automaticamente" readOnly />
            </div>
             <div className="form-group">
              <label htmlFor="cidade">Cidade</label>
              <input type="text" id="cidade" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Preenchido automaticamente" readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <input type="text" id="estado" name="estado" value={form.estado} onChange={handleChange} maxLength="2" placeholder="UF" readOnly />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting || isCepLoading}>
              {isSubmitting ? <><FaSpinner className="spinner" /> Salvando...</> : <><FaSave /> Cadastrar Parceiro</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroParceiroPage;