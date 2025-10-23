import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaHandshake, FaPlus, FaSearch, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaPrint } from 'react-icons/fa';
import { API_URL } from '../../services/api';
import '../../../public/css/Page.css';
import '../../../public/css/ListPage.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ParceirosPage() {
  const navigate = useNavigate();
  const [parceiros, setParceiros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const tableRef = useRef(null);

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

  const formatPartnerType = (type) => {
    switch (type) {
      case 'empresa_coleta': return 'Empresa de Coleta';
      case 'farmacia': return 'Farmácia';
      case 'ubs': return 'UBS';
      default: return type;
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Você tem certeza?',
      text: "A exclusão não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/parceiros/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha ao excluir.');
        
        Swal.fire('Excluído!', 'O parceiro foi excluído com sucesso.', 'success');
        fetchParceiros();
      } catch (error) {
        Swal.fire('Erro!', error.message, 'error');
      }
    }
  };

  const processedParceiros = useMemo(() => {
    let sortableItems = [...parceiros];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    if (!searchTerm) return sortableItems;
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return sortableItems.filter(p =>
      (p.nome && p.nome.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (p.cnpj && p.cnpj.replace(/[^\d]/g, '').includes(lowerCaseSearchTerm)) ||
      (p.cidade && p.cidade.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [parceiros, sortConfig, searchTerm]);

  const handlePrint = async () => {
    if (loading) {
      Swal.fire('Aguarde', 'Os dados ainda estão sendo carregados', 'info');
      return;
    }

    if (processedParceiros.length === 0) {
      Swal.fire('Sem dados', 'Não há parceiros para gerar o relatório', 'warning');
      return;
    }

    const printDiv = document.createElement('div');
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    printDiv.style.width = '794px';
    printDiv.style.padding = '20px';
    printDiv.style.backgroundColor = 'white';

    printDiv.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 20px;">Relatório de Parceiros</h1>
      <p style="text-align: center; margin-bottom: 30px;">Gerado em: ${new Date().toLocaleDateString()}</p>
      <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="background-color: #f2f2f2;">Nome</th>
            <th style="background-color: #f2f2f2;">CNPJ</th>
            <th style="background-color: #f2f2f2;">Cidade</th>
            <th style="background-color: #f2f2f2;">Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${processedParceiros.map(parceiro => `
            <tr>
              <td>${parceiro.nome}</td>
              <td>${parceiro.cnpj}</td>
              <td>${parceiro.cidade || 'N/A'}</td>
              <td>${formatPartnerType(parceiro.tipo)}</td>
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
      pdf.save('relatorio_parceiros.pdf');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      Swal.fire('Erro', 'Não foi possível gerar o PDF', 'error');
    } finally {
      document.body.removeChild(printDiv);
    }
  };

  const totalPages = Math.ceil(processedParceiros.length / pageSize);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedParceiros.slice(start, start + pageSize);
  }, [processedParceiros, currentPage, pageSize]);

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
          <FaHandshake className="icon" />
          <h1>Gestão de Parceiros</h1>
        </div>
        <div>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ marginRight: '10px' }}>
            <FaPrint /> Imprimir PDF
          </button>
          <Link to="/cadastro-parceiro" className="btn btn-primary">
            <FaPlus /> Cadastrar Parceiro
          </Link>
        </div>
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

      <div className="table-container" ref={tableRef}>
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <button type="button" onClick={() => requestSort('nome')} className="sortable-header">
                  Nome {getSortIcon('nome')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('cnpj')} className="sortable-header">
                  CNPJ {getSortIcon('cnpj')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('cidade')} className="sortable-header">
                  Cidade {getSortIcon('cidade')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('tipo')} className="sortable-header">
                  Tipo {getSortIcon('tipo')}
                </button>
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum parceiro encontrado</td>
              </tr>
            ) : (
              pageItems.map(parceiro => (
                <tr key={parceiro.id_parceiro}>
                  <td>{parceiro.nome}</td>
                  <td>{parceiro.cnpj}</td>
                  <td>{parceiro.cidade || 'N/A'}</td>
                  <td>{formatPartnerType(parceiro.tipo)}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => navigate(`/detalhes-parceiro/${parceiro.id_parceiro}`)}
                      className="btn-action btn-details"
                    >
                      <FaSearch /> Detalhes
                    </button>
                    <button
                      onClick={() => navigate(`/editar-parceiro/${parceiro.id_parceiro}`)}
                      className="btn-action btn-edit"
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(parceiro.id_parceiro)}
                      className="btn-action btn-delete"
                    >
                      <FaTrash /> Excluir
                    </button>
                  </td>
                </tr>
              ))
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
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span style={{ marginLeft: 8, fontSize: '0.8rem' }}>Total: {processedParceiros.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParceirosPage;