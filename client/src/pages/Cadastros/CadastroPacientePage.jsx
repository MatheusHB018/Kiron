// client/src/pages/CadastroPacientePage.jsx
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave, FaArrowLeft, FaSpinner, FaUser, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { InputMask } from '@react-input/mask'; // ATUALIZADO: Importar da nova biblioteca
import { API_URL } from '../../services/api';
import EntityFactory from '../../services/EntityFactory';
import '../styles/Page.css';
import '../styles/CadastroProfissionalPage.css';

function CadastroPacientePage() {
    const [formData, setFormData] = useState({
        nome: '', cpf: '', telefone: '', email: '', data_nascimento: '',
        cep: '', logradouro: '', numero: '', complemento: '',
        bairro: '', cidade: '', estado: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const navigate = useNavigate();
    const numeroRef = useRef(null);

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
                if (data.erro) {
                    Swal.fire('CEP não encontrado', 'Por favor, verifique o CEP.', 'warning');
                } else {
                    setFormData(prev => ({
                        ...prev, logradouro: data.logradouro, bairro: data.bairro,
                        cidade: data.localidade, estado: data.uf,
                    }));
                    numeroRef.current.focus();
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
        
        // Usar o Factory Method para criar o objeto padronizado
        const paciente = EntityFactory.create('paciente', {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''),
            telefone: formData.telefone.replace(/\D/g, ''),
            cep: formData.cep.replace(/\D/g, ''),
            data_nascimento: formData.data_nascimento || null
        });
        
        // Validar usando o factory
        const validacao = EntityFactory.validate('paciente', paciente);
        if (!validacao.isValid) {
            Swal.fire('Atenção!', validacao.errors.join(', '), 'warning');
            setIsSubmitting(false);
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/pacientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paciente)
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Falha ao cadastrar');
            Swal.fire({
                title: 'Sucesso!', text: 'Paciente cadastrado com sucesso.', icon: 'success',
                timer: 2000, showConfirmButton: false, timerProgressBar: true
            }).then(() => navigate('/pacientes'));
        } catch (err) {
            Swal.fire('Erro!', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-title"><FaUserPlus className="icon" /><h1>Cadastro de Paciente</h1></div>
            </div>
            <Link to="/pacientes" className="back-link"><FaArrowLeft /> Voltar para a lista</Link>

            <div className="form-container">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-section"><h3>Informações Pessoais</h3></div>
                    <div className="form-grid">
                        <div className="form-group"><label>Nome Completo</label><div className="input-with-icon"><FaUser className="input-icon" /><input type="text" name="nome" placeholder="Digite o nome completo" value={formData.nome} onChange={handleChange} required /></div></div>
                        {/* ATUALIZADO: Usando o novo InputMask */}
                        <div className="form-group"><label>CPF</label><div className="input-with-icon"><FaIdCard className="input-icon" /><InputMask mask="___.___.___-__" replacement={{ _: /\d/ }} name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required className="form-group-input" /></div></div>
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
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting || isCepLoading}>{isSubmitting ? <><FaSpinner className="spinner" /> Salvando...</> : <><FaSave /> Cadastrar Paciente</>}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CadastroPacientePage;