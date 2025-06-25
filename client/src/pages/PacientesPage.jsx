import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye } from 'react-icons/fa';
import './styles/ListPage.css'; // Importa nosso novo CSS padrão

const mockPacientes = [
    { id: 1, nome: 'Ana Carolina Silva', cpf: '123.456.789-00', telefone: '(11) 98765-4321', status: 'Ativo' },
    { id: 2, nome: 'Bruno Medeiros Costa', cpf: '234.567.890-11', telefone: '(21) 91234-5678', status: 'Ativo' },
    { id: 3, nome: 'Carlos de Andrade Dias', cpf: '345.678.901-22', telefone: '(31) 95678-1234', status: 'Inativo' },
];

function PacientesPage() {
    const [pacientes, setPacientes] = useState(mockPacientes);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleVerDetalhes = (id) => navigate(`/pacientes/${id}`);

    const filteredPacientes = pacientes.filter(paciente =>
        paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.cpf.includes(searchTerm)
    );

    return (
        <div className="page-container">
            <div className="list-page-header">
                <h1>Gestão de Pacientes</h1>
                <Link to="/cadastro-paciente" className="add-button">
                    <FaPlus />
                    Cadastrar Paciente
                </Link>
            </div>

            <div className="filter-container">
                <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CPF..."
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
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPacientes.map((paciente) => (
                            <tr key={paciente.id}>
                                <td>{paciente.nome}</td>
                                <td>{paciente.cpf}</td>
                                <td>{paciente.telefone}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleVerDetalhes(paciente.id)} className="btn-details">
                                        <FaEye />
                                        Ver Detalhes
                                    </button>
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