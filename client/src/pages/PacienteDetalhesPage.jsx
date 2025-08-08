// client/src/pages/PacienteDetalhesPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/Detalhes.css';

function PacienteDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/pacientes/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject('Paciente não encontrado'))
      .then(data => setPaciente(data))
      .catch(() => navigate('/pacientes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // --- NOVAS FUNÇÕES DE FORMATAÇÃO ---

  const formatarCPF = (cpf) => {
    if (!cpf) return '-';
    const digitsOnly = cpf.replace(/\D/g, '');
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '-';
    const digitsOnly = telefone.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
      return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (digitsOnly.length === 10) {
      return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone; // Retorna o original se não corresponder
  };

  const formatarCEP = (cep) => {
    if (!cep) return '-';
    const digitsOnly = cep.replace(/\D/g, '');
    return digitsOnly.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatarData = (data) => {
    if (!data) return '-';
    const dataObj = new Date(data);
    dataObj.setDate(dataObj.getDate() + 1);
    return new Intl.DateTimeFormat('pt-BR').format(dataObj);
  };

  if (loading) return <div className="page-container"><h2>Carregando...</h2></div>;
  if (!paciente) return null;

  const fullAddress = paciente.logradouro 
    ? `${paciente.logradouro}, ${paciente.numero || 'S/N'} ${paciente.complemento || ''} - ${paciente.bairro}, ${paciente.cidade} - ${paciente.estado}`
    : 'Endereço não cadastrado';

  return (
    <div className="page-container">
        <div className="page-header">
            <div className="page-title"><FaUser className="icon" /><h1>Detalhes do Paciente</h1></div>
        </div>
      
        <Link to="/pacientes" className="back-link"><FaArrowLeft /> Voltar para a lista</Link>

        <div className="card parceiro-card">
            <div className="card-header">
                <FaUser className="icon-lg" />
                <h2>{paciente.nome}</h2>
            </div>
            <div className="card-body">
                <div className="info-group">
                    {/* APLICANDO A FORMATAÇÃO */}
                    <span><FaIdCard className="info-icon" /><strong className="info-label">CPF:</strong> {formatarCPF(paciente.cpf)}</span>
                    <span><FaCalendarAlt className="info-icon" /><strong className="info-label">Nascimento:</strong> {formatarData(paciente.data_nascimento)}</span>
                    <span><FaEnvelope className="info-icon" /><strong className="info-label">Email:</strong> {paciente.email || '-'}</span>
                    {/* APLICANDO A FORMATAÇÃO */}
                    <span><FaPhone className="info-icon" /><strong className="info-label">Telefone:</strong> {formatarTelefone(paciente.telefone)}</span>
                </div>
                <div className="info-group">
                    <span><FaMapMarkerAlt className="info-icon" /><strong className="info-label">Endereço:</strong> {fullAddress}</span>
                    {/* APLICANDO A FORMATAÇÃO */}
                    {paciente.cep && <span><strong className="info-label">CEP:</strong> {formatarCEP(paciente.cep)}</span>}
                </div>
            </div>
        </div>
    </div>
  );
}

export default PacienteDetalhesPage;