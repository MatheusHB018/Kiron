import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarCheck } from 'react-icons/fa';
import { API_URL } from '../services/api';
import '../../public/css/Page.css';

function DetalhesColetaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coleta, setColeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/coletas/${id}`)
      .then(res => res.json())
      .then(data => setColeta(data))
      .catch(() => navigate('/painel-coletas'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="page-container"><h2>Carregando...</h2></div>;
  if (!coleta) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <FaCalendarCheck className="icon" />
          <h1>Detalhes da Coleta</h1>
        </div>
      </div>
      <Link to="/painel-coletas" className="back-link">
        <FaArrowLeft /> Voltar para o painel
      </Link>
      <div className="card">
        <div className="card-header">
          <h2>Coleta #{coleta.id_agenda}</h2>
          <span className="tipo">Status: {coleta.status}</span>
        </div>
        <div className="card-body">
          <div className="info-group">
            <span><strong>ID do Paciente:</strong> {coleta.id_paciente}</span>
            <span><strong>ID do Parceiro:</strong> {coleta.id_parceiro}</span>
            <span><strong>Data Agendada:</strong> {new Date(coleta.data_agendada).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesColetaPage;
