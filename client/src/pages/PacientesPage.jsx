// client/src/pages/PacientesPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaHandshake, FaPlus, FaSearch, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import { API_URL } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './styles/Page.css';
import './styles/ListPage.css';

function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`${API_URL}/pacientes`);
        if (!response.ok) throw new Error('Erro ao carregar pacientes');
        const data = await response.json();
        setPacientes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    const digitsOnly = telefone.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
      return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        const response = await fetch(`${API_URL}/pacientes/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao excluir paciente');
        setPacientes(pacientes.filter(paciente => paciente.id_paciente !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePrint = async () => {
    if (loading) {
      Swal.fire('Aguarde', 'Os dados ainda estão sendo carregados', 'info');
      return;
    }

    if (filteredPacientes.length === 0) {
      Swal.fire('Sem dados', 'Não há pacientes para gerar o relatório', 'warning');
      return;
    }

    const printDiv = document.createElement('div');
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    printDiv.style.width = '794px';
    printDiv.style.padding = '20px';
    printDiv.style.backgroundColor = 'white';

    printDiv.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 20px; font-family: Arial, sans-serif; color: #333;">
        Relatório de Pacientes
      </h1>
      <p style="text-align: center; margin-bottom: 30px; font-family: Arial, sans-serif; color: #666;">
        Gerado em: ${new Date().toLocaleDateString('pt-BR')}
      </p>
      <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr>
            <th  style="background-color: #f2f2f2; left;">Nome</th>
            <th  style="background-color: #f2f2f2; left;">CPF</th>
            <th  style="background-color: #f2f2f2;left;">Telefone</th>
            <th  style="background-color: #f2f2f2;text-align: left;">Email</th>
            <th  style="background-color: #f2f2f2; text-align: left;">Cidade</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPacientes.map(paciente => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${paciente.nome}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${formatarCPF(paciente.cpf)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${formatarTelefone(paciente.telefone)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${paciente.email || '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${paciente.cidade || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.body.appendChild(printDiv);

    try {
      const canvas = await html2canvas(printDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
      pdf.save('relatorio_pacientes.pdf');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      Swal.fire('Erro', 'Não foi possível gerar o PDF', 'error');
    } finally {
      document.body.removeChild(printDiv);
    }
  };

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf?.includes(searchTerm)
  );

  const paginatedPacientes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPacientes.slice(start, start + pageSize);
  }, [filteredPacientes, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPacientes.length / pageSize) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  if (loading) return <div className="page-container"><h2>Carregando...</h2></div>;
  if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;

  return (
    <div className="page-container">
      <div className="list-page-header">
        <div className="page-title">
          <FaHandshake className="icon" />
          <h1>Gestão de Pacientes</h1>
        </div>
        <div>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ marginRight: '10px' }}>
            <FaPrint /> Imprimir PDF
          </button>
          <Link to="/cadastro-paciente" className="btn btn-primary">
            <FaPlus /> Cadastrar Paciente
          </Link>
        </div>
      </div>

      <div className="filter-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
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
              <th>CPF</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPacientes.length > 0 ? (
              paginatedPacientes.map((paciente) => (
                <tr key={paciente.id_paciente}>
                  <td>{paciente.nome}</td>
                  <td>{formatarCPF(paciente.cpf)}</td>
                  <td>{formatarTelefone(paciente.telefone)}</td>
                  <td>{paciente.email || '-'}</td>
                  <td>{paciente.cidade || '-'}</td>
                  <td className="actions-cell">
                    <Link
                      to={`/editar-paciente/${paciente.id_paciente}`}
                      className="btn-action btn-edit"
                      style={{ textDecoration: 'none' }}
                    >
                      <FaEdit /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(paciente.id_paciente)}
                      className="btn-action btn-delete"
                    >
                      <FaTrash /> Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  Nenhum paciente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination-container">
          <div className="pagination-buttons">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }).slice(0, 10).map((_, i) => {
              const page = i + 1;
              return (
                <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)} 
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              );
            })}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem' }}>Itens por página: </label>
            <select 
              value={pageSize} 
              onChange={e => setPageSize(Number(e.target.value))} 
              className="page-size-select"
            >
              {[5, 10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
            </select>
            <span style={{ marginLeft: 8, fontSize: '0.8rem' }}>Total: {filteredPacientes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PacientesPage;