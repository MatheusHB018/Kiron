import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FaEdit,
  FaArrowLeft,
  FaSpinner,
  FaSave,
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
import './styles/CadastroProfissionalPage.css'; // Reutilizando estilos

function EditarParceiroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', cnpj: '', inscricao_estadual: '', responsavel: '', observacoes: '',
    tipo: '', telefone: '', email: '', cep: '', logradouro: '', numero: '',
    complemento: '', bairro: '', cidade: '', estado: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const numeroRef = useRef(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/parceiros/${id}`);
        const initialData = {
          nome: data.nome || '',
          cnpj: data.cnpj || '',
          inscricao_estadual: data.inscricao_estadual || '',
          responsavel: data.responsavel || '',
          observacoes: data.observacoes || '',
          tipo: data.tipo || '',
          telefone: data.telefone || '',
          email: data.email || '',
          cep: data.cep || '',
          logradouro: data.logradouro || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || ''
        };
        setForm(initialData);
        setOriginalData(initialData);
      } catch (err) {
        Swal.fire('Erro!', 'Não foi possível carregar os dados do parceiro.', 'error')
          .then(() => navigate('/parceiros'));
      } finally {
        setLoading(false);
      }
    };
    fetchPartnerData();
  }, [id, navigate]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(originalData);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setForm({ ...form, cep });

    if (cep.length === 8) {
      setIsCepLoading(true);
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (data.erro) {
          Swal.fire('CEP não encontrado', 'Por favor, verifique o CEP.', 'warning');
        } else {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
          numeroRef.current.focus();
        }
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível buscar o CEP.', 'error');
      } finally {
        setIsCepLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) {
        Swal.fire('Nenhuma alteração', 'Nenhum dado foi modificado.', 'info');
        return;
    }
    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:3001/parceiros/${id}`, form);
      Swal.fire({
        title: 'Sucesso!',
        text: 'Parceiro atualizado com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => navigate('/parceiros'));
    } catch (err) {
      Swal.fire('Erro!', err.response?.data?.error || 'Não foi possível atualizar o parceiro.', 'error');
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
          <h1>Editar Parceiro</h1>
        </div>
      </div>
      <Link to="/parceiros" className="back-link">
        <FaArrowLeft /> Voltar para a lista
      </Link>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Seção de Informações da Empresa */}
          <div className="form-section"><h3>Informações da Empresa</h3></div>
          <div className="form-grid two-columns">
            <div className="form-group span-2"><label htmlFor="nome">Nome / Razão Social</label><div className="input-with-icon"><FaBuilding className="input-icon" /><input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: Farmácia Central" /></div></div>
            <div className="form-group"><label htmlFor="cnpj">CNPJ</label><input type="text" id="cnpj" name="cnpj" value={form.cnpj} onChange={handleChange} required maxLength="18" placeholder="00.000.000/0000-00" /></div>
            <div className="form-group"><label htmlFor="inscricao_estadual">Inscrição Estadual</label><input type="text" id="inscricao_estadual" name="inscricao_estadual" value={form.inscricao_estadual} onChange={handleChange} placeholder="Apenas números (se aplicável)" /></div>
            <div className="form-group"><label htmlFor="responsavel">Responsável</label><div className="input-with-icon"><FaUser className="input-icon" /><input type="text" id="responsavel" name="responsavel" value={form.responsavel} onChange={handleChange} placeholder="Nome do contato principal" /></div></div>
            <div className="form-group"><label htmlFor="tipo">Tipo de Parceiro</label><select id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required><option value="">Selecione o tipo</option><option value="empresa_coleta">Empresa de Coleta</option><option value="farmacia">Farmácia</option><option value="ubs">UBS</option></select></div>
            <div className="form-group"><label htmlFor="telefone">Telefone</label><div className="input-with-icon"><FaPhone className="input-icon" /><input type="text" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" /></div></div>
            <div className="form-group"><label htmlFor="email">Email</label><div className="input-with-icon"><FaEnvelope className="input-icon" /><input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="contato@empresa.com" /></div></div>
            <div className="form-group span-2"><label htmlFor="observacoes">Observações</label><div className="input-with-icon"><FaInfoCircle className="input-icon" /><input type="text" id="observacoes" name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Qualquer informação adicional relevante" /></div></div>
          </div>

          {/* Seção de Endereço */}
          <div className="form-section"><h3>Endereço</h3></div>
          <div className="form-grid three-columns">
            <div className="form-group">
              <label htmlFor="cep">CEP</label>
              <div className="input-with-icon">
                <input type="text" id="cep" name="cep" value={form.cep} onChange={handleCepChange} maxLength="9" placeholder="00000-000" />
                {/* AQUI ESTAVA O ERRO -> Adicionei as chaves {} em volta da condição */}
                {isCepLoading && <FaSpinner className="spinner input-icon-right" />}
              </div>
            </div>
            <div className="form-group span-2"><label htmlFor="logradouro">Logradouro</label><div className="input-with-icon"><FaMapMarkerAlt className="input-icon" /><input type="text" id="logradouro" name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Preenchido automaticamente" readOnly /></div></div>
            <div className="form-group"><label htmlFor="numero">Número</label><input type="text" id="numero" name="numero" ref={numeroRef} value={form.numero} onChange={handleChange} placeholder="Ex: 123" /></div>
            <div className="form-group"><label htmlFor="complemento">Complemento</label><input type="text" id="complemento" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ex: Sala 10, Bloco B" /></div>
            <div className="form-group"><label htmlFor="bairro">Bairro</label><input type="text" id="bairro" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Preenchido automaticamente" readOnly /></div>
            <div className="form-group"><label htmlFor="cidade">Cidade</label><input type="text" id="cidade" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Preenchido automaticamente" readOnly /></div>
            <div className="form-group"><label htmlFor="estado">Estado</label><input type="text" id="estado" name="estado" value={form.estado} onChange={handleChange} maxLength="2" placeholder="UF" readOnly /></div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || isCepLoading || !isDirty}>
              {isSubmitting ? <><FaSpinner className="spinner" /> Salvando...</> : <><FaSave /> Salvar Alterações</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarParceiroPage;