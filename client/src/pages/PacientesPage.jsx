// client/src/pages/PacientesPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUsers, FaPlus, FaSearch, FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/ListPage.css';

function PacientesPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });

  useEffect(() => {
    fetchPacientes();
  }, []);

  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    const digitsOnly = cpf.replace(/\D/g, '');
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    const digitsOnly = telefone.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
      return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (digitsOnly.length === 10) {
      return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  const fetchPacientes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/pacientes`);
      if (!res.ok) throw new Error('Erro ao buscar pacientes');
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "O paciente e todos os seus dados associados serão apagados permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error((await res.json()).error || 'Erro ao excluir');
          fetchPacientes();
          Swal.fire('Apagado!', 'O paciente foi removido.', 'success');
        } catch (err) {
          Swal.fire('Erro!', err.message, 'error');
        }
      }
    });
  };

  const processedPacientes = useMemo(() => {
    let sortableItems = [...pacientes];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    if (!searchTerm) return sortableItems;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // LÓGICA DE FILTRO ATUALIZADA: Busca apenas pelo início do nome
    return sortableItems.filter(p =>
      p.nome && p.nome.toLowerCase().startsWith(lowerCaseSearchTerm)
    );
  }, [pacientes, searchTerm, sortConfig]);

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

  if (loading) return <div className="page-container"><h2>Carregando...</h2></div>;
  if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;

  return (
    <div className="page-container">
        <div className="list-page-header">
            <div className="page-title">
                <FaUsers className="icon" />
                <h1>Gestão de Pacientes</h1>
            </div>
            <Link to="/cadastro-paciente" className="btn btn-primary">
                <FaPlus /> Cadastrar Paciente
            </Link>
        </div>

        <div className="filter-container">
            <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nome..." // Placeholder atualizado
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
                        <th><button type="button" onClick={() => requestSort('nome')} className="sortable-header">Nome {getSortIcon('nome')}</button></th>
                        <th><button type="button" onClick={() => requestSort('cpf')} className="sortable-header">CPF {getSortIcon('cpf')}</button></th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {processedPacientes.map((paciente) => (
                        <tr key={paciente.id_paciente}>
                            <td>{paciente.nome}</td>
                            <td>{formatarCPF(paciente.cpf)}</td>
                            <td>{formatarTelefone(paciente.telefone)}</td>
                            <td className="actions-cell">
                                <button onClick={() => navigate(`/pacientes/${paciente.id_paciente}`)} className="btn-action btn-details"><FaSearch /> Detalhes</button>
                                <button onClick={() => navigate(`/editar-paciente/${paciente.id_paciente}`)} className="btn-action btn-edit"><FaEdit /> Editar</button>
                                <button onClick={() => handleDelete(paciente.id_paciente)} className="btn-action btn-delete"><FaTrash /> Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default PacientesPage;