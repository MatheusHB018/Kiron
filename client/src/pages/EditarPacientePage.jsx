// client/src/pages/EditarPacientePage.jsx
import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaUserEdit, FaArrowLeft, FaSpinner, FaSave, FaUser, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { InputMask } from '@react-input/mask'; // ATUALIZADO: Importar da nova biblioteca
import { API_URL } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

function EditarPacientePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '', cpf: '', data_nascimento: '', telefone: '', email: '',
        cep: '', logradouro: '', numero: '', complemento: '',
        bairro: '', cidade: '', estado: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const numeroRef = useRef(null);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await fetch(`${API_URL}/pacientes/${id}`);
                if (!response.ok) throw new Error('Paciente não encontrado');
                const data = await response.json();
                
                const formattedDate = data.data_nascimento ? new Date(data.data_nascimento).toISOString().split('T')[0] : '';

                setFormData({
                    nome: data.nome || '', cpf: data.cpf || '', 
                    data_nascimento: formattedDate,
                    telefone: data.telefone || '', email: data.email || '', 
                    cep: data.cep || '', logradouro: data.logradouro || '',
                    numero: data.numero || '', complemento: data.complemento || '', 
                    bairro: data.bairro || '', cidade: data.cidade || '', 
                    estado: data.estado || ''
                });
            } catch (error) {
                Swal.fire('Erro', error.message, 'error').then(() => navigate('/pacientes'));
            } finally {
                setLoading(false);
            }
        };
        fetchPaciente();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCepChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, cep: e.target.value }));
        if (cep.length === 8) {
            setIsCepLoading(true);
            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev, logradouro: data.logradouro, bairro: data.bairro,
                        cidade: data.localidade, estado: data.uf
                    }));
                    numeroRef.current.focus();
                } else {
                    Swal.fire('CEP não encontrado', 'Por favor, verifique o CEP.', 'warning');
                }
            } catch (error) {
                Swal.fire('Erro', 'Não foi possível buscar o CEP.', 'error');
            } finally {
                setIsCepLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const dataToSend = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''),
            telefone: formData.telefone.replace(/\D/g, ''),
            cep: formData.cep.replace(/\D/g, ''),
            data_nascimento: formData.data_nascimento || null
        };
        try {
            const response = await fetch(`${API_URL}/pacientes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Falha ao atualizar');
            Swal.fire('Sucesso!', 'Paciente atualizado com sucesso.', 'success')
              .then(() => navigate('/pacientes'));
        } catch (err) {
            Swal.fire('Erro!', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="page-container"><h2>Carregando...</h2></div>;

    return (
        <div className="page-container">
            <div className="page-header-container">
                <div className="page-title"><FaUserEdit className="icon" /><h1>Editar Paciente</h1></div>
            </div>
            <Link to="/pacientes" className="back-link"><FaArrowLeft /> Voltar para a lista</Link>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-section"><h3>Informações Pessoais</h3></div>
                    <div className="form-grid">
                        <div className="form-group"><label>Nome Completo</label><div className="input-with-icon"><FaUser className="input-icon" /><input type="text" name="nome" placeholder="Digite o nome completo" value={formData.nome} onChange={handleChange} required /></div></div>
                        {/* ATUALIZADO: Usando o novo InputMask */}
                        <div className="form-group"><label>CPF</label><div className="input-with-icon"><FaIdCard className="input-icon" /><InputMask mask="___.___.___-__" replacement={{ _: /\d/ }} name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required className="form-group-input"/></div></div>
                        <div className="form-group"><label>Data de Nascimento</label><div className="input-with-icon"><FaCalendarAlt className="input-icon" /><input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} /></div></div>
                        {/* ATUALIZADO: Usando o novo InputMask */}
                        <div className="form-group"><label>Telefone</label><div className="input-with-icon"><FaPhone className="input-icon" /><InputMask mask="(__) _____-____" replacement={{ _: /\d/ }} name="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} className="form-group-input"/></div></div>
                        <div className="form-group span-2"><label>Email</label><div className="input-with-icon"><FaEnvelope className="input-icon" /><input type="email" name="email" placeholder="exemplo@email.com" value={formData.email} onChange={handleChange} /></div></div>
                    </div>

                    <div className="form-section"><h3>Endereço</h3></div>
                     <div className="form-grid three-columns">
                        {/* ATUALIZADO: Usando o novo InputMask */}
                        <div className="form-group"><label>CEP</label><div className="input-with-icon"><InputMask mask="_____-___" replacement={{ _: /\d/ }} name="cep" placeholder="00000-000" value={formData.cep} onChange={handleCepChange} className="form-group-input" />{isCepLoading && <FaSpinner className="spinner input-icon-right" />}</div></div>
                        <div className="form-group span-2"><label>Logradouro</label><div className="input-with-icon"><FaMapMarkerAlt className="input-icon" /><input type="text" name="logradouro" placeholder="Avenida, Rua..." value={formData.logradouro} readOnly /></div></div>
                        <div className="form-group"><label>Número</label><input type="text" name="numero" placeholder="Ex: 123" ref={numeroRef} value={formData.numero} onChange={handleChange} /></div>
                        <div className="form-group"><label>Complemento</label><input type="text" name="complemento" placeholder="Apto, Bloco..." value={formData.complemento} onChange={handleChange} /></div>
                        <div className="form-group"><label>Bairro</label><input type="text" name="bairro" placeholder="Seu bairro" value={formData.bairro} readOnly /></div>
                        <div className="form-group"><label>Cidade</label><input type="text" name="cidade" placeholder="Sua cidade" value={formData.cidade} readOnly /></div>
                        <div className="form-group"><label>Estado</label><input type="text" name="estado" placeholder="UF" value={formData.estado} maxLength="2" readOnly /></div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-button" disabled={isSubmitting || isCepLoading}>{isSubmitting ? <><FaSpinner className="spinner" /> Salvando...</> : <><FaSave /> Salvar Alterações</>}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarPacientePage;