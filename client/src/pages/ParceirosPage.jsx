import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaHandshake, FaPlus, FaSearch, FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/ListPage.css'; // Reutilizando o mesmo CSS

function ParceirosPage() {
  const navigate = useNavigate();
  const [parceiros, setParceiros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });

  useEffect(() => {
    fetchParceiros();
  }, []);

  const fetchParceiros = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/parceiros`);
      if (!res.ok) throw new Error('Erro ao buscar parceiros');
      const data = await res.json();
      setParceiros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Esta ação e todos os dados de coleta associados serão apagados permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/parceiros/${id}`, { method: 'DELETE' });
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Erro ao excluir parceiro');
          }
          fetchParceiros();
          Swal.fire('Apagado!', 'O parceiro foi removido.', 'success');
        } catch (err) {
          Swal.fire('Erro!', err.message, 'error');
        }
      }
    });
  };

  const formatPartnerType = (type) => {
    switch (type) {
      case 'empresa_coleta': return 'Empresa de Coleta';
      case 'farmacia': return 'Farmácia';
      case 'ubs': return 'UBS';
      default: return type;
    }
  };
  
  const processedParceiros = useMemo(() => {
    let sortableItems = [...parceiros];

    // Ordenação
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    // Busca (Filtro CORRIGIDO)
    if (!searchTerm) return sortableItems;
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return sortableItems.filter(p =>
      (p.nome && p.nome.toLowerCase().startsWith(lowerCaseSearchTerm)) ||
      (p.cnpj && p.cnpj.replace(/[^\d]/g, '').includes(lowerCaseSearchTerm)) || // Permite buscar CNPJ com ou sem formatação
      (p.cidade && p.cidade.toLowerCase().startsWith(lowerCaseSearchTerm))
    );
  }, [parceiros, sortConfig, searchTerm]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return null;
    return sortConfig.direction === 'ascending' ? <FaArrowUp className="sort-icon" /> : <FaArrowDown className="sort-icon" />;
  };

  if (loading) return <div className="page-container"><h2>A carregar...</h2></div>;
  if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;

  return (
    <div className="page-container">
      <div className="list-page-header">
        <div className="page-title">
          <FaHandshake className="icon" />
          <h1>Gestão de Parceiros</h1>
        </div>
        <Link to="/cadastro-parceiro" className="add-button">
          <FaPlus /> Cadastrar Parceiro
        </Link>
      </div>

      <div className="filter-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ ou cidade..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}><button type="button" onClick={() => requestSort('nome')} className="sortable-header">Nome {getSortIcon('nome')}</button></th>
              <th style={{ width: '20%' }}><button type="button" onClick={() => requestSort('cnpj')} className="sortable-header">CNPJ {getSortIcon('cnpj')}</button></th>
              <th style={{ width: '20%' }}><button type="button" onClick={() => requestSort('cidade')} className="sortable-header">Cidade {getSortIcon('cidade')}</button></th>
              <th style={{ width: '15%' }}><button type="button" onClick={() => requestSort('tipo')} className="sortable-header">Tipo {getSortIcon('tipo')}</button></th>
              <th style={{ width: '15%' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processedParceiros.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum parceiro encontrado.</td></tr>
            ) : (
              processedParceiros.map(parceiro => (
                <tr key={parceiro.id_parceiro}>
                  <td>{parceiro.nome}</td>
                  <td>{parceiro.cnpj}</td>
                  <td>{parceiro.cidade || 'N/A'}</td>
                  <td>{formatPartnerType(parceiro.tipo)}</td>
                  <td className="actions-cell">
                    <button onClick={() => navigate(`/editar-parceiro/${parceiro.id_parceiro}`)} className="btn-action btn-edit">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleDelete(parceiro.id_parceiro)} className="btn-action btn-delete">
                      <FaTrash /> Excluir
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

export default ParceirosPage;