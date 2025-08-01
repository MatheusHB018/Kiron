import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/ListPage.css';

function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar os dados da API, agora com filtro de busca
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

  // Efeito que chama a busca com debounce (espera o usuário parar de digitar)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEntregas();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchEntregas]);

  // Função para excluir uma entrega
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "A exclusão não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/entregas/${id}`, { method: 'DELETE' });
          if (!response.ok) throw new Error('Falha ao excluir a entrega.');
          Swal.fire('Excluído!', 'A entrega foi excluída com sucesso.', 'success');
          fetchEntregas(); // Atualiza a lista
        } catch (error) {
          Swal.fire('Erro!', error.message, 'error');
        }
      }
    });
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaBox className="icon" />
          <h1>Controle de Entregas</h1>
        </div>
        <Link to="/entregas/novo" className="new-button">
          <FaPlus /> Registrar Entrega
        </Link>
      </div>

      <div className="content-container">
        {/* Barra de Busca */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome do paciente ou do material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Tabela de Dados */}
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
                    <td className="actions-cell">
                      <Link to={`/entregas/editar/${entrega.id_entrega}`} className="action-button edit">
                        <FaEdit /> Editar
                      </Link>
                      <button onClick={() => handleDelete(entrega.id_entrega)} className="action-button delete">
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
    </div>
  );
}

export default EntregasPage;