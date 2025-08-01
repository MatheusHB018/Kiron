import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/ListPage.css';

function ResiduosPage() {
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar os dados da API, com filtro
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

  // useEffect para controlar a busca com debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResiduos();
    }, 300); // Espera 300ms após o usuário parar de digitar

    return () => {
      clearTimeout(handler); // Limpa o timeout anterior
    };
  }, [searchTerm, fetchResiduos]);

  // Função para deletar um resíduo
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
          const response = await fetch(`${API_URL}/residuos/${id}`, { method: 'DELETE' });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Falha ao excluir.');
          
          Swal.fire('Excluído!', 'O tipo de resíduo foi excluído com sucesso.', 'success');
          fetchResiduos(); // Atualiza a lista após a exclusão
        } catch (error) {
          Swal.fire('Erro!', error.message, 'error');
        }
      }
    });
  };

  return (
    <div className="page-container">
      {/* Cabeçalho da Página */}
      <div className="page-header-container">
        <div className="page-title">
          <FaBoxOpen className="icon" />
          <h1>Tipos de Resíduos</h1>
        </div>
        <Link to="/residuos/novo" className="new-button">
          <FaPlus /> Novo Tipo de Resíduo
        </Link>
      </div>

      {/* Contêiner Principal (fundo branco) */}
      <div className="content-container">
        {/* Barra de Busca */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome, grupo ou acondicionamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabela de Dados */}
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
                    <td className="actions-cell">
                      <Link to={`/residuos/editar/${residuo.id_residuo}`} className="action-button edit">
                        <FaEdit /> Editar
                      </Link>
                      <button onClick={() => handleDelete(residuo.id_residuo)} className="action-button delete">
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
    </div>
  );
}

export default ResiduosPage;