import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

import { API_URL, deleteUsuario } from '../services/api'; 
import './styles/ListPage.css'; // Importa nosso novo CSS padrão

const ListarUsuarioPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/usuarios`)
            .then(response => { if (!response.ok) throw new Error('Erro na rede'); return response.json(); })
            .then(data => setUsuarios(data))
            .catch(err => {
                console.error("Falha ao buscar usuários:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (userId) => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Esta ação não poderá ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUsuario(userId)
                    .then(() => {
                        setUsuarios(currentUsers => currentUsers.filter(user => user.id_usuario !== userId));
                        Swal.fire('Deletado!', 'O usuário foi removido.', 'success');
                    })
                    .catch(err => Swal.fire('Erro!', 'Não foi possível remover o usuário.', 'error'));
            }
        });
    };

    const filteredUsuarios = usuarios.filter(u =>
        u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="page-container">Carregando...</div>;
    if (error) return <div className="page-container">Erro ao carregar: {error}</div>;

    return (
        <div className="page-container">
            <div className="list-page-header">
                <h1>Gerenciamento de Usuários</h1>
                <Link to="/cadastro-profissional" className="add-button">
                    <FaPlus />
                    Cadastrar Usuário
                </Link>
            </div>

            <div className="filter-container">
                <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
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
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map(usuario => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.nome}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.tipo}</td>
                                <td className="actions-cell">
                                    <button onClick={() => Swal.fire('Em breve!', 'A edição será implementada.', 'info')} className="btn-action btn-edit">
                                        <FaEdit />
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(usuario.id_usuario)} className="btn-action btn-delete">
                                        <FaTrash />
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListarUsuarioPage;