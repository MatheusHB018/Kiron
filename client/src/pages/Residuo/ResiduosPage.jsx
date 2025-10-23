// client/src/pages/ResiduosPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaSearch, FaPrint } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../../../public/css/Page.css';
import '../../../public/css/ListPage.css';

function ResiduosPage() {
  const navigate = useNavigate();
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const paginatedResiduos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return residuos.slice(start, start + pageSize);
  }, [residuos, currentPage, pageSize]);

  const totalPages = Math.ceil(residuos.length / pageSize) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

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

  const handlePrint = async () => {
    if (loading) {
      Swal.fire('Aguarde', 'Os dados ainda estão sendo carregados', 'info');
      return;
    }

    if (residuos.length === 0) {
      Swal.fire('Sem dados', 'Não há resíduos para gerar o relatório', 'warning');
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
        Relatório de Tipos de Resíduos
      </h1>
      <p style="text-align: center; margin-bottom: 30px; font-family: Arial, sans-serif; color: #666;">
        Gerado em: ${new Date().toLocaleDateString('pt-BR')}
      </p>
      <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr>
            <th style="background-color: #f2f2f2; text-align: left;">Nome</th>
            <th style="background-color: #f2f2f2; text-align: left;">Descrição</th>
            <th style="background-color: #f2f2f2; text-align: left;">Grupo (ANVISA)</th>
            <th style="background-color: #f2f2f2; text-align: left;">Acondicionamento</th>
          </tr>
        </thead>
        <tbody>
          ${residuos.map(residuo => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${residuo.nome}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${residuo.descricao || '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${residuo.grupo || '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${residuo.acondicionamento || '-'}</td>
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
      pdf.save('relatorio_residuos.pdf');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      Swal.fire('Erro', 'Não foi possível gerar o PDF', 'error');
    } finally {
      document.body.removeChild(printDiv);
    }
  };

  return (
    <div className="page-container">
      <div className="list-page-header">
        <div className="page-title">
          <FaBoxOpen className="icon" />
          <h1>Tipos de Resíduos</h1>
        </div>
        <div>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ marginRight: '10px' }}>
            <FaPrint /> Imprimir PDF
          </button>
          <Link to="/residuos/novo" className="btn btn-primary">
            <FaPlus /> Cadastrar Novo Tipo de Resíduo
          </Link>
        </div>
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
            ) : paginatedResiduos.length > 0 ? (
              paginatedResiduos.map((residuo) => (
                <tr key={residuo.id_residuo}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{residuo.nome}</div>
                    {residuo.descricao && <small style={{ color: '#555' }}>{residuo.descricao}</small>}
                  </td>
                  <td>{residuo.grupo}</td>
                  <td>{residuo.acondicionamento}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => navigate(`/residuos/editar/${residuo.id_residuo}`)} 
                      className="btn-action btn-edit"
                    >
                      <FaEdit /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(residuo.id_residuo)} 
                      className="btn-action btn-delete"
                    >
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
            <span style={{ marginLeft: 8, fontSize: '0.8rem' }}>Total: {residuos.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResiduosPage;