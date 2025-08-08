// client/src/pages/EntregasPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/ListPage.css'; // Usando o CSS correto

function EntregasPage() {
  const navigate = useNavigate();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ... (O restante do código JavaScript continua o mesmo)
  const fetchEntregas = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_URL}/entregas`);
      if (searchTerm) {
        url.searchParams.append('busca', searchTerm);
      }
      const response = await fetch(url);
      const data = await response.json();
      setEntregas(data);
    } catch (error) {
      Swal.fire('Erro!', 'Não foi possível carregar o histórico de entregas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEntregas();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchEntregas]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "A exclusão não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/entregas/${id}`, { method: 'DELETE' });
          if (!response.ok) throw new Error('Falha ao excluir a entrega.');
          Swal.fire('Excluído!', 'A entrega foi excluída com sucesso.', 'success');
          fetchEntregas();
        } catch (error) {
          Swal.fire('Erro!', error.message, 'error');
        }
      }
    });
  };

  return (
    <div className="page-container">
      <div className="list-page-header">
        <div className="page-title">
          <FaBox className="icon" />
          <h1>Controle de Entregas</h1>
        </div>
        <Link to="/entregas/novo" className="btn btn-primary">
          <FaPlus /> Cadastrar Entrega
        </Link>
      </div>

      <div className="filter-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome do paciente ou do material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Material Entregue</th>
              <th>Quantidade</th>
              <th>Data da Entrega</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Carregando...</td></tr>
            ) : entregas.length > 0 ? (
              entregas.map((entrega) => (
                <tr key={entrega.id_entrega}>
                  <td>{entrega.paciente_nome}</td>
                  <td>{entrega.residuo_nome}</td>
                  <td>{entrega.quantidade}</td>
                  <td>{new Date(entrega.data_entrega).toLocaleString('pt-BR')}</td>
                  {/* ===== ÁREA CORRIGIDA ===== */}
                  <td className="actions-cell">
                    <button onClick={() => navigate(`/entregas/editar/${entrega.id_entrega}`)} className="btn-action btn-edit">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleDelete(entrega.id_entrega)} className="btn-action btn-delete">
                      <FaTrash /> Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma entrega encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EntregasPage;