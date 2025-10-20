// src/pages/EditarUsuarioPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaUserEdit, FaArrowLeft, FaSpinner, FaSave, FaUser, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getUsuarioById, updateUsuario } from '../../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

const areObjectsEqual = (objA, objB) => JSON.stringify(objA) === JSON.stringify(objB);

function EditarUsuarioPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nome: '', email: '', tipo: 'comum', cep: '', logradouro: '', 
        numero: '', complemento: '', bairro: '', cidade: '', uf: ''
    });
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isDirty = !areObjectsEqual(formData, originalData);

    useEffect(() => {
        getUsuarioById(id)
            .then(data => {
                // Garante que todos os campos, mesmo nulos, estejam no estado inicial
                const initialData = {
                    nome: data.nome || '', email: data.email || '', tipo: data.tipo || 'comum',
                    cep: data.cep || '', logradouro: data.logradouro || '', numero: data.numero || '',
                    complemento: data.complemento || '', bairro: data.bairro || '', 
                    cidade: data.cidade || '', uf: data.uf || ''
                };
                setFormData(initialData);
                setOriginalData(initialData);
            })
            .catch(() => Swal.fire('Erro!', 'Não foi possível carregar os dados do usuário.', 'error').then(() => navigate('/listar-usuarios')))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    // Lógica para avisar sobre alterações não salvas
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) event.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                Swal.fire('Erro', 'CEP não encontrado.', 'error');
                return;
            }
            setFormData(prevState => ({
                ...prevState,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                uf: data.uf
            }));
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível buscar o CEP.', 'error');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isDirty) return;
        setIsSubmitting(true);
        try {
            await updateUsuario(id, formData);
            setOriginalData(formData);
            Swal.fire({
                title: 'Sucesso!', text: 'Usuário atualizado com sucesso.', icon: 'success',
                timer: 2000, showConfirmButton: false, timerProgressBar: true
            }).then(() => navigate('/listar-usuarios'));
        } catch (err) {
            Swal.fire('Erro!', err.message || 'Não foi possível atualizar o usuário.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="page-container"><h2>A carregar...</h2></div>;

    return (
        <div className="page-container">
            <div className="page-header"><div className="page-title"><FaUserEdit className="icon" /><h1>Editar Usuário</h1></div></div>
            <Link to="/listar-usuarios" className="back-link"><FaArrowLeft /> Voltar para a lista</Link>
            
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group"><label htmlFor="nome">Nome Completo</label><div className="input-with-icon"><FaUser className="input-icon" /><input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required /></div></div>
                        <div className="form-group"><label htmlFor="email">Email</label><div className="input-with-icon"><FaEnvelope className="input-icon" /><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div></div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}><label htmlFor="tipo">Tipo de Usuário</label><select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}><option value="comum">Profissional Comum</option><option value="admin">Administrador</option></select></div>
                    </div>

                    <h3 style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1.5rem' }}>Endereço</h3>
                    <div className="form-grid">
                        <div className="form-group"><label htmlFor="cep">CEP</label><div className="input-with-icon"><FaMapMarkerAlt className="input-icon" /><input type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="Digite o CEP e aguarde" maxLength="9" /></div></div>
                        <div className="form-group"><label htmlFor="logradouro">Logradouro</label><input type="text" id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} readOnly /></div>
                        <div className="form-group"><label htmlFor="numero">Número</label><input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="complemento">Complemento</label><input type="text" id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="bairro">Bairro</label><input type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} readOnly /></div>
                        <div className="form-group"><label htmlFor="cidade">Cidade</label><input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} readOnly /></div>
                        <div className="form-group"><label htmlFor="uf">UF</label><input type="text" id="uf" name="uf" value={formData.uf} onChange={handleChange} maxLength="2" readOnly /></div>
                    </div>

                    <p className="form-note">A senha não pode ser alterada nesta tela.</p>
                    <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={isSubmitting || !isDirty}>{isSubmitting ? <><FaSpinner className="spinner" /> A guardar...</> : <><FaSave /> Salvar Alterações</>}</button></div>
                </form>
            </div>
        </div>
    );
}

export default EditarUsuarioPage;