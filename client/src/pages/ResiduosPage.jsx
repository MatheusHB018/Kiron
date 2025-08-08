// client/src/pages/ResiduosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/ListPage.css';

function ResiduosPage() {
  const navigate = useNavigate(); // Adicionado para navegação
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ... (O restante do código JavaScript continua o mesmo)
  const fetchResiduos = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_URL}/residuos`);
      if (searchTerm) {
        url.searchParams.append('busca', searchTerm);
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setResiduos(data);
    } catch (error) {
      Swal.fire('Erro!', 'Não foi possível carregar os dados.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResiduos();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchResiduos]);

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
          const response = await fetch(`${API_URL}/residuos/${id}`, { method: 'DELETE' });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Falha ao excluir.');
          
          Swal.fire('Excluído!', 'O tipo de resíduo foi excluído com sucesso.', 'success');
          fetchResiduos();
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
          <FaBoxOpen className="icon" />
          <h1>Tipos de Resíduos</h1>
        </div>
        <Link to="/residuos/novo" className="btn btn-primary">
          <FaPlus /> Cadastrar Novo Tipo de Resíduo
        </Link>
      </div>

      <div className="filter-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome, grupo ou acondicionamento..."
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
              <th>Nome</th>
              <th>Grupo (ANVISA)</th>
              <th>Acondicionamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Carregando...</td></tr>
            ) : residuos.length > 0 ? (
              residuos.map((residuo) => (
                <tr key={residuo.id_residuo}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{residuo.nome}</div>
                    {residuo.descricao && <small style={{ color: '#555' }}>{residuo.descricao}</small>}
                  </td>
                  <td>{residuo.grupo}</td>
                  <td>{residuo.acondicionamento}</td>
                  {/* ===== ÁREA CORRIGIDA ===== */}
                  <td className="actions-cell">
                    <button onClick={() => navigate(`/residuos/editar/${residuo.id_residuo}`)} className="btn-action btn-edit">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleDelete(residuo.id_residuo)} className="btn-action btn-delete">
                      <FaTrash /> Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Nenhum resíduo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResiduosPage;