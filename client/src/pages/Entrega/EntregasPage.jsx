// client/src/pages/EntregasPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../../public/css/Page.css';
import { API_URL } from '../../services/api';
import EntityFactory from '../../services/EntityFactory';

function EntregasPage() {
  const navigate = useNavigate();
  const [entregas, setEntregas] = useState([]);
  const [entregasComMetodos, setEntregasComMetodos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [residuos, setResiduos] = useState([]);

  // Buscar entregas, pacientes e resíduos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [entregasRes, pacientesRes, residuosRes] = await Promise.all([
          fetch(`${API_URL}/entregas`),
          fetch(`${API_URL}/pacientes`),
          fetch(`${API_URL}/residuos`)
        ]);
        
        const [entregasData, pacientesData, residuosData] = await Promise.all([
          entregasRes.json(),
          pacientesRes.json(),
          residuosRes.json()
        ]);
        
        setEntregas(entregasData);
        setPacientes(pacientesData);
        setResiduos(residuosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire('Erro!', 'Não foi possível carregar os dados.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Processar entregas com Factory Method e verificar notificações
  useEffect(() => {
    if (entregas.length > 0) {
      // Criar objetos com métodos utilitários
      const entregasProcessadas = EntityFactory.createMany('entrega', entregas);
      setEntregasComMetodos(entregasProcessadas);

      // Verificar entregas vencidas e próximas ao vencimento
      const entregasVencidas = entregasProcessadas.filter(e => 
        e.status === 'Aguardando Devolução' && e.isVencido()
      );
      
      setNotificacoes(entregasVencidas);
    }
  }, [entregas]);

  // Marcar entrega como devolvida
  const handleMarcarDevolvida = async (id_entrega) => {
    setLoading(true);
    try {
      // Primeiro, buscar os dados atuais da entrega
      const getResponse = await fetch(`${API_URL}/entregas/${id_entrega}`);
      if (!getResponse.ok) throw new Error('Falha ao buscar dados da entrega.');
      
      const entregaAtual = await getResponse.json();
      
      // Agora atualizar com todos os campos obrigatórios mais o novo status
      const res = await fetch(`${API_URL}/entregas/${id_entrega}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_paciente: entregaAtual.id_paciente,
          id_residuo: entregaAtual.id_residuo,
          quantidade: entregaAtual.quantidade,
          observacoes: entregaAtual.observacoes,
          data_prevista_devolucao: entregaAtual.data_prevista_devolucao,
          status: 'Devolvido'
        })
      });
      
      if (res.ok) {
        // Atualizar o estado local imediatamente
        setEntregas(entregas.map(e => e.id_entrega === id_entrega ? { ...e, status: 'Devolvido' } : e));
        
        // Buscar dados atualizados do servidor
        const response = await fetch(`${API_URL}/entregas`);
        const data = await response.json();
        setEntregas(data);
        
        Swal.fire('Sucesso!', 'Material marcado como devolvido.', 'success');
      } else {
        throw new Error('Falha ao atualizar status da entrega.');
      }
    } catch (error) {
      Swal.fire('Erro!', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirEntrega = async (id_entrega) => {
    const result = await Swal.fire({
      title: 'Excluir entrega?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/entregas/${id_entrega}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      setEntregas(entregas.filter(e => e.id_entrega !== id_entrega));
      Swal.fire('Excluída!', 'Entrega removida.', 'success');
    } catch (e) {
      Swal.fire('Erro', e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper para buscar nome do paciente/resíduo
  const getPacienteNome = (id) => {
    const p = pacientes.find(x => x.id_paciente === id);
    return p ? p.nome : id;
  };
  const getResiduoNome = (id) => {
    const r = residuos.find(x => x.id_residuo === id);
    return r ? r.nome : id;
  };

  // Separar entregas aguardando devolução e já devolvidas/vencidas
  const entregasAguardando = entregas.filter(e => e.status === 'Aguardando Devolução');
  const entregasFinalizadas = entregas.filter(e => e.status !== 'Aguardando Devolução');

  return (
    <div className="page-container">
      <div className="list-page-header">
        <div className="page-title">
          <FaBox className="icon" />
          <h1>Painel de Entregas</h1>
        </div>
        <Link to="/entregas/novo" className="btn btn-primary">
          + Cadastrar Entrega
        </Link>
      </div>

      {/* Notificações */}
      {notificacoes.length > 0 && (
        <div className="notificacao-alerta">
          <strong>Atenção:</strong> Existem entregas com materiais vencidos e não devolvidos!
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {notificacoes.map(n => {
            const entregaComMetodos = EntityFactory.create('entrega', n);
            
            return (
              <li key={n.id_entrega} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 500 }}>
                  Material entregue em {entregaComMetodos.getDataEntregaFormatada()}, devolução prevista para {entregaComMetodos.getDataDevolucaoFormatada()}<br />
                  Paciente: <span style={{ color:  '#006f40'  }}>{getPacienteNome(n.id_paciente)}</span> | Material: <span style={{ color: '#c00' }}>{getResiduoNome(n.id_residuo)}</span>
                </span>
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: 'Marcar como devolvido?',
                      text: 'Deseja realmente marcar este material como devolvido?',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#43ea7c',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Sim, devolvido',
                      cancelButtonText: 'Cancelar',
                      customClass: {
                        confirmButton: 'swal2-confirm btn-confirm',
                        cancelButton: 'swal2-cancel',
                      }
                    });
                    if (result.isConfirmed) {
                      handleMarcarDevolvida(n.id_entrega);
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
                  Marcar como devolvido
                </button>
                <button
                  onClick={async () => {
                    const { value: customMsg } = await Swal.fire({
                      title: 'Enviar mensagem WhatsApp',
                      input: 'textarea',
                      inputLabel: 'Mensagem (deixe em branco para padrão)',
                      inputPlaceholder: 'Escreva uma mensagem opcional...',
                      showCancelButton: true,
                      confirmButtonText: 'Enviar',
                      cancelButtonText: 'Cancelar'
                    });
                    if (customMsg !== undefined) {
                      try {
                        const resp = await fetch(`${API_URL}/whatsapp/entregas/${n.id_entrega}/send`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ mensagem: customMsg })
                        });
                        const data = await resp.json();
                        if (!resp.ok) throw new Error(data.error || 'Falha ao enviar WhatsApp');
                        Swal.fire('Ok', data.message, 'success');
                      } catch (err) {
                        Swal.fire('Erro', err.message, 'error');
                      }
                    }
                  }}
                  disabled={loading}
                  style={{
                    marginLeft: 8,
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37,211,102,0.3)',
                  }}
                >
                  WhatsApp
                </button>
              </li>
            );
          })}
          </ul>
        </div>
      )}

      {/* Listagem de entregas aguardando devolução */}
      <h3>Materiais aguardando devolução</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Material</th>
              <th>Quantidade</th>
              <th>Data Entrega</th>
              <th>Data Devolução</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {entregasAguardando.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>Nenhum material aguardando devolução.</td></tr>
            ) : (
              entregasAguardando.map(e => {
                const entregaComMetodos = EntityFactory.create('entrega', e);
                const isVencida = entregaComMetodos.isVencido();
                
                return (
                  <tr key={e.id_entrega} className={isVencida ? 'tr-vencida' : ''}>
                    <td>{e.id_entrega}</td>
                    <td>{getPacienteNome(e.id_paciente)}</td>
                    <td>{getResiduoNome(e.id_residuo)}</td>
                    <td>{e.quantidade}</td>
                    <td>{entregaComMetodos.getDataEntregaFormatada()}</td>
                    <td>{entregaComMetodos.getDataDevolucaoFormatada()}</td>
                    <td>
                      <span style={{ color: entregaComMetodos.getStatusColor() }}>
                        {e.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => navigate(`/entregas/editar/${e.id_entrega}`)} className="btn-action btn-edit" style={{ marginRight: 6 }}>
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluirEntrega(e.id_entrega)}
                        disabled={loading}
                        className="btn-action"
                        style={{
                          marginRight: 6,
                          background: '#ff4d4f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Excluir
                      </button>
                      <button
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Marcar como devolvido?',
                            text: 'Deseja realmente marcar este material como devolvido?',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#43ea7c',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sim, devolvido',
                            cancelButtonText: 'Cancelar',
                            customClass: {
                              confirmButton: 'swal2-confirm btn-confirm',
                              cancelButton: 'swal2-cancel',
                            }
                          });
                          if (result.isConfirmed) {
                            handleMarcarDevolvida(e.id_entrega);
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
                        Marcar devolvido
                      </button>
                      <button
                        onClick={async () => {
                          const { value: customMsg } = await Swal.fire({
                            title: 'Enviar mensagem WhatsApp',
                            input: 'textarea',
                            inputLabel: 'Mensagem (deixe em branco para padrão)',
                            inputPlaceholder: 'Escreva uma mensagem opcional...',
                            showCancelButton: true,
                            confirmButtonText: 'Enviar',
                            cancelButtonText: 'Cancelar'
                          });
                          if (customMsg !== undefined) {
                            try {
                              const resp = await fetch(`${API_URL}/whatsapp/entregas/${e.id_entrega}/send`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ mensagem: customMsg })
                              });
                              const data = await resp.json();
                              if (!resp.ok) throw new Error(data.error || 'Falha ao enviar WhatsApp');
                              Swal.fire('Ok', data.message, 'success');
                            } catch (err) {
                              Swal.fire('Erro', err.message, 'error');
                            }
                          }
                        }}
                        disabled={loading}
                        className="btn-action"
                        style={{
                          marginLeft: 6,
                          background: '#25D366',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 16px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(37,211,102,0.3)'
                        }}
                      >
                        WhatsApp
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Histórico de entregas finalizadas */}
      <h3 style={{ marginTop: '32px' }}>Histórico de entregas finalizadas</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Material</th>
              <th>Quantidade</th>
              <th>Data Entrega</th>
              <th>Data Devolução</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {entregasFinalizadas.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>Nenhuma entrega finalizada.</td></tr>
            ) : (
              entregasFinalizadas.map(e => {
                const entregaComMetodos = EntityFactory.create('entrega', e);
                
                return (
                  <tr key={e.id_entrega}>
                    <td>{e.id_entrega}</td>
                    <td>{getPacienteNome(e.id_paciente)}</td>
                    <td>{getResiduoNome(e.id_residuo)}</td>
                    <td>{e.quantidade}</td>
                    <td>{entregaComMetodos.getDataEntregaFormatada()}</td>
                    <td>{entregaComMetodos.getDataDevolucaoFormatada()}</td>
                    <td>
                      <span style={{ color: entregaComMetodos.getStatusColor() }}>
                        {e.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => navigate(`/entregas/editar/${e.id_entrega}`)} className="btn-action btn-edit" style={{ marginRight: 6 }}>
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluirEntrega(e.id_entrega)}
                        disabled={loading}
                        className="btn-action"
                        style={{
                          marginRight: 6,
                          background: '#ff4d4f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EntregasPage;