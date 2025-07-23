// client/src/pages/PainelColetasPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './styles/Page.css';
import { API_URL } from '../services/api';

function PainelColetasPage() {
  const navigate = useNavigate();
  const [coletas, setColetas] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [parceiros, setParceiros] = useState([]);

  // Buscar coletas, pacientes e parceiros
  useEffect(() => {
    fetch(`${API_URL}/coletas`)
      .then(res => res.json())
      .then(data => setColetas(data));
    fetch(`${API_URL}/pacientes`)
      .then(res => res.json())
      .then(data => setPacientes(data));
    fetch(`${API_URL}/parceiros`)
      .then(res => res.json())
      .then(data => setParceiros(data));
  }, []);

  // Verificar notificações de coleta pendente
  useEffect(() => {
    const hoje = new Date();
    const notificas = coletas.filter(c => {
      const dataColeta = new Date(c.data_agendada);
      return c.status === 'agendada' && dataColeta < hoje;
    });
    setNotificacoes(notificas);
  }, [coletas]);

  // Confirmar coleta
  const handleConfirmar = async (id_agenda) => {
    setLoading(true);
    const res = await fetch(`${API_URL}/coletas/${id_agenda}/confirmar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      setColetas(coletas.map(c => c.id_agenda === id_agenda ? { ...c, status: 'realizada' } : c));
    }
    setLoading(false);
  };

  // Helper para buscar nome do paciente/parceiro
  const getPacienteNome = (id) => {
    const p = pacientes.find(x => x.id_paciente === id);
    return p ? p.nome : id;
  };
  const getParceiroNome = (id) => {
    const p = parceiros.find(x => x.id_parceiro === id);
    return p ? p.nome : id;
  };

  // Separar coletas agendadas e realizadas
  const coletasAgendadas = coletas.filter(c => c.status === 'agendada');
  const coletasRealizadas = coletas.filter(c => c.status === 'realizada');

  return (
    <div className="page-container">
      <div className="list-page-header">
        <div className="page-title">
          <FaCalendarCheck className="icon" />
          <h1>Painel de Coletas</h1>
        </div>
        <Link to="/agendar-coleta" className="add-button">
          + Agendar Coleta
        </Link>
      </div>

      {/* Notificações */}
      {notificacoes.length > 0 && (
        <div className="notificacao-alerta" style={{ color: 'red', margin: '10px 0', padding: '10px', borderRadius: '8px', background: '#fff0f0', border: '1px solid #ffb3b3' }}>
          <strong>Atenção:</strong> Existem coletas agendadas com data já passada e não confirmadas!
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {notificacoes.map(n => (
              <li key={n.id_agenda} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 500 }}>
                  Coleta agendada para {new Date(n.data_agendada).toLocaleString()}<br />
                  Paciente: <span style={{ color: '#c00' }}>{getPacienteNome(n.id_paciente)}</span> | Parceiro: <span style={{ color: '#c00' }}>{getParceiroNome(n.id_parceiro)}</span>
                </span>
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: 'Confirmar coleta?',
                      text: 'Deseja realmente confirmar esta coleta?',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#43ea7c',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Sim, confirmar',
                      cancelButtonText: 'Cancelar',
                      customClass: {
                        confirmButton: 'swal2-confirm btn-confirm',
                        cancelButton: 'swal2-cancel',
                      }
                    });
                    if (result.isConfirmed) {
                      handleConfirmar(n.id_agenda);
                    }
                  }}
                  disabled={loading}
                  style={{
                    marginLeft: 12,
                    background: 'linear-gradient(90deg,#ff6b6b,#ffb347)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(255,107,107,0.15)',
                    transition: 'background 0.2s',
                  }}
                >
                  Confirmar coleta
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* O formulário foi removido. Use o botão acima para agendar nova coleta. */}

      {/* Listagem de coletas agendadas */}
      <h3>Coletas agendadas</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Parceiro</th>
              <th>Data Agendada</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {coletasAgendadas.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma coleta agendada.</td></tr>
            ) : (
              coletasAgendadas.map(c => (
                <tr key={c.id_agenda} style={{ background: c.status === 'agendada' && new Date(c.data_agendada) < new Date() ? '#ffe5e5' : 'inherit' }}>
                  <td>{c.id_agenda}</td>
                  <td>{getPacienteNome(c.id_paciente)}</td>
                  <td>{getParceiroNome(c.id_parceiro)}</td>
                  <td>{new Date(c.data_agendada).toLocaleString()}</td>
                  <td>{c.status}</td>
                  <td className="actions-cell">
                    <button onClick={() => navigate(`/editar-coleta/${c.id_agenda}`)} className="btn-action btn-edit" style={{ marginRight: 6 }}>
                      Editar
                    </button>
                    {c.status === 'agendada' && (
                      <button
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Confirmar coleta?',
                            text: 'Deseja realmente confirmar esta coleta?',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#43ea7c',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sim, confirmar',
                            cancelButtonText: 'Cancelar',
                            customClass: {
                              confirmButton: 'swal2-confirm btn-confirm',
                              cancelButton: 'swal2-cancel',
                            }
                          });
                          if (result.isConfirmed) {
                            handleConfirmar(c.id_agenda);
                          }
                        }}
                        disabled={loading}
                        className="btn-action btn-confirm"
                        style={{
                          background: 'linear-gradient(90deg,#43ea7c,#2ecc40)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 16px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(67,234,124,0.15)',
                          transition: 'background 0.2s',
                        }}
                      >
                        Confirmar coleta
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Histórico de coletas realizadas */}
      <h3 style={{ marginTop: '32px' }}>Histórico de coletas realizadas</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Parceiro</th>
              <th>Data Agendada</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {coletasRealizadas.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma coleta realizada.</td></tr>
            ) : (
              coletasRealizadas.map(c => (
                <tr key={c.id_agenda}>
                  <td>{c.id_agenda}</td>
                  <td>{getPacienteNome(c.id_paciente)}</td>
                  <td>{getParceiroNome(c.id_parceiro)}</td>
                  <td>{new Date(c.data_agendada).toLocaleString()}</td>
                  <td>{c.status}</td>
                  <td className="actions-cell">
                    <button onClick={() => navigate(`/editar-coleta/${c.id_agenda}`)} className="btn-action btn-edit" style={{ marginRight: 6 }}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PainelColetasPage;