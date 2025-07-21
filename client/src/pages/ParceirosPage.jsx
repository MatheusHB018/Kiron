// client/src/pages/ParceirosPage.jsx
import { FaHandshake, FaPlus } from 'react-icons/fa';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Page.css';

import { useState, useEffect } from 'react';
import { API_URL } from '../services/api';


function ParceirosPage() {
  const navigate = useNavigate();
  const [parceiros, setParceiros] = useState([]);
  const [form, setForm] = useState({ nome: '', cnpj: '', tipo: '', endereco: '', telefone: '', email: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Buscar parceiros ao carregar
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.cnpj || !form.tipo) return;
    setLoading(true);
    setError('');
    try {
      if (editId) {
        // Editar parceiro
        const res = await fetch(`${API_URL}/parceiros/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Erro ao editar parceiro');
        }
      } else {
        // Cadastrar novo parceiro
        const res = await fetch(`${API_URL}/parceiros`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Erro ao cadastrar parceiro');
        }
      }
      setForm({ nome: '', cnpj: '', tipo: '', endereco: '', telefone: '', email: '' });
      setEditId(null);
      fetchParceiros();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (parceiro) => {
    setForm({ ...parceiro });
    setEditId(parceiro.id_parceiro);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este parceiro?')) {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/parceiros/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Erro ao excluir parceiro');
        }
        if (editId === id) {
          setEditId(null);
          setForm({ nome: '', cnpj: '', tipo: '', endereco: '', telefone: '', email: '' });
        }
        fetchParceiros();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="list-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaHandshake className="icon" />
          <h1>Gestão de Parceiros</h1>
        </div>
        <Link
          to="/cadastro-parceiro"
          className="add-button"
        >
          <FaPlus />
          Cadastrar Parceiro
        </Link>
      </div>
      <p>
        Gerencie as informações e o status das empresas parceiras e pontos de coleta.
      </p>

      {/* O formulário agora está em uma página separada */}

      <div className="parceiros-list-section" style={{ marginTop: 32 }}>
        <h2>Parceiros Cadastrados</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Tipo</th>
                <th>Endereço</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {parceiros.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 16 }}>Nenhum parceiro cadastrado.</td></tr>
              ) : (
                parceiros.map(parceiro => (
                  <tr key={parceiro.id_parceiro}>
                    <td>{parceiro.nome}</td>
                    <td>{parceiro.cnpj}</td>
                    <td>{parceiro.tipo}</td>
                    <td>{parceiro.endereco}</td>
                    <td>{parceiro.telefone}</td>
                    <td>{parceiro.email}</td>
                    <td className="actions-cell">
                      <button onClick={() => navigate(`/editar-parceiro/${parceiro.id_parceiro}`)} className="btn-action btn-edit" style={{ marginRight: 8 }}>Editar</button>
                      <button onClick={() => handleDelete(parceiro.id_parceiro)} className="btn-action btn-delete">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ParceirosPage;