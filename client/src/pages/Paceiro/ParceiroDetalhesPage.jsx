import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaInfoCircle, FaIdCard } from 'react-icons/fa';
import axios from 'axios';
import '../../../public/css/Page.css';
import '../../../public/css/Detalhes.css'; 

export default function ParceiroDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parceiro, setParceiro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/parceiros/${id}`)
      .then(res => setParceiro(res.data))
      .catch(() => navigate('/parceiros'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Função para exibir o tipo de forma amigável
  function formatPartnerType(type) {
    switch (type) {
      case 'empresa_coleta': return 'Empresa de Coleta';
      case 'farmacia': return 'Farmácia';
      case 'ubs': return 'UBS';
      default: return type;
    }
  }

  if (loading) return <div className="page-container"><h2>Carregando...</h2></div>;
  if (!parceiro) return null;

  return (
    <div className="page-container parceiro-detalhes">
      <div className="page-header">
        <div className="page-title">
          <FaBuilding className="icon" />
          <h1>Detalhes do Parceiro</h1>
        </div>
      </div>
      
      <Link to="/parceiros" className="back-link">
        <FaArrowLeft /> Voltar para a lista
      </Link>

      <div className="card parceiro-card">
        <div className="card-header">
          <FaBuilding className="icon-lg" />
          <h2>{parceiro.nome}</h2>
          <span className="tipo">{formatPartnerType(parceiro.tipo)}</span>
        </div>
        <div className="card-body">
          {/* Grupo de Contato */}
          <div className="info-group">
            <span><FaUser className="info-icon" /><strong className="info-label">Responsável:</strong> {parceiro.responsavel || '-'}</span>
            <span><FaEnvelope className="info-icon" /><strong className="info-label">Email:</strong> {parceiro.email || '-'}</span>
            <span><FaPhone className="info-icon" /><strong className="info-label">Telefone:</strong> {parceiro.telefone || '-'}</span>
          </div>
          
          {/* Grupo Fiscal */}
          <div className="info-group">
            <span><FaIdCard className="info-icon" /><strong className="info-label">CNPJ:</strong> {parceiro.cnpj}</span>
            <span><strong className="info-label">Inscrição Estadual:</strong> {parceiro.inscricao_estadual || '-'}</span>
          </div>

          {/* Grupo de Endereço */}
          <div className="info-group">
            <span><FaMapMarkerAlt className="info-icon" /><strong className="info-label">Endereço:</strong> {`${parceiro.logradouro}, ${parceiro.numero} ${parceiro.complemento ? `- ${parceiro.complemento}` : ''}`}</span>
            <span><strong className="info-label">Bairro:</strong> {parceiro.bairro}</span>
            <span><strong className="info-label">Cidade/UF:</strong> {`${parceiro.cidade} - ${parceiro.estado}`}</span>
            <span><strong className="info-label">CEP:</strong> {parceiro.cep}</span>
          </div>

          {/* Grupo de Observações */}
          <div className="info-group">
            <span><FaInfoCircle className="info-icon" /><strong className="info-label">Observações:</strong> {parceiro.observacoes || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}