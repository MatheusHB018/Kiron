// src/pages/PerfilPage.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaUserCircle, FaSave, FaSpinner, FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt, FaUser, FaEnvelope } from 'react-icons/fa';
import { getMeuPerfil, updateMeuPerfil, updateMinhaSenha } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

function PerfilPage() {
    const [formData, setFormData] = useState({
        nome: '', email: '', cep: '', logradouro: '', numero: '',
        complemento: '', bairro: '', cidade: '', uf: ''
    });
    const [passwordData, setPasswordData] = useState({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
    
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        getMeuPerfil()
            .then(data => {
                const initialData = {
                    nome: data.nome || '', email: data.email || '', cep: data.cep || '',
                    logradouro: data.logradouro || '', numero: data.numero || '',
                    complemento: data.complemento || '', bairro: data.bairro || '',
                    cidade: data.cidade || '', uf: data.uf || ''
                };
                setFormData(initialData);
            })
            .catch(() => Swal.fire('Erro!', 'Não foi possível carregar seus dados.', 'error'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevState => ({ ...prevState, [name]: value }));
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
                logradouro: data.logradouro, bairro: data.bairro,
                cidade: data.localidade, uf: data.uf
            }));
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível buscar o CEP.', 'error');
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateMeuPerfil(formData);
            Swal.fire('Sucesso!', 'Seus dados foram atualizados.', 'success');
        } catch (err) {
            Swal.fire('Erro!', err.message || 'Não foi possível atualizar seus dados.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.novaSenha !== passwordData.confirmarNovaSenha) {
            Swal.fire('Atenção', 'As novas senhas não coincidem.', 'warning');
            return;
        }
        if (passwordData.novaSenha.length < 6) {
            Swal.fire('Atenção', 'A nova senha deve ter no mínimo 6 caracteres.', 'warning');
            return;
        }
        setIsSubmitting(true);
        try {
            await updateMinhaSenha(passwordData);
            Swal.fire('Sucesso!', 'Sua senha foi alterada! Você será desconectado por segurança.', 'success')
              .then(() => {
                  localStorage.clear();
                  // CORREÇÃO APLICADA AQUI:
                  window.location.href = '/'; 
              });
        } catch (err) {
            Swal.fire('Erro!', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="page-container"><h2>A carregar perfil...</h2></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header"><div className="page-title"><FaUserCircle className="icon" /><h1>Meu Perfil</h1></div></div>

            {/* Formulário de Dados Pessoais */}
            <div className="form-container" style={{ marginBottom: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: 0 }}>Meus Dados</h3>
                <form onSubmit={handleProfileSubmit}>
                    <div className="form-grid">
                        <div className="form-group"><label htmlFor="nome">Nome Completo</label><div className="input-with-icon"><FaUser className="input-icon" /><input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} /></div></div>
                        <div className="form-group"><label htmlFor="email">Email</label><div className="input-with-icon"><FaEnvelope className="input-icon" /><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} /></div></div>
                    </div>
                    <h4 style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', color: '#555' }}>Endereço</h4>
                    <div className="form-grid">
                        <div className="form-group"><label htmlFor="cep">CEP</label><div className="input-with-icon"><FaMapMarkerAlt className="input-icon" /><input type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="Digite e aguarde" maxLength="9" /></div></div>
                        <div className="form-group"><label htmlFor="logradouro">Logradouro</label><input type="text" id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} readOnly /></div>
                        <div className="form-group"><label htmlFor="numero">Número</label><input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="complemento">Complemento</label><input type="text" id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="bairro">Bairro</label><input type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} readOnly /></div>
                        <div className="form-group"><label htmlFor="cidade">Cidade</label><input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} readOnly /></div>
                        <div className="form-group"><label htmlFor="uf">UF</label><input type="text" id="uf" name="uf" value={formData.uf} onChange={handleChange} maxLength="2" readOnly /></div>
                    </div>
                    <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? <FaSpinner className="spinner" /> : <FaSave />} Salvar Dados</button></div>
                </form>
            </div>

            {/* Formulário de Alteração de Senha */}
            <div className="form-container">
                 <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: 0 }}>Alterar Senha</h3>
                <form onSubmit={handlePasswordSubmit}>
                   <div className="form-group"><label htmlFor="senhaAtual">Senha Atual</label><div className="password-input-wrapper"><input type={showPasswords ? 'text' : 'password'} id="senhaAtual" name="senhaAtual" value={passwordData.senhaAtual} onChange={handlePasswordChange} required /><button type="button" className="password-toggle-button" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <FaEyeSlash /> : <FaEye />}</button></div></div>
                   <div className="form-group"><label htmlFor="novaSenha">Nova Senha</label><div className="password-input-wrapper"><input type={showPasswords ? 'text' : 'password'} id="novaSenha" name="novaSenha" value={passwordData.novaSenha} onChange={handlePasswordChange} required /><button type="button" className="password-toggle-button" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <FaEyeSlash /> : <FaEye />}</button></div></div>
                   <div className="form-group"><label htmlFor="confirmarNovaSenha">Confirmar Nova Senha</label><div className="password-input-wrapper"><input type={showPasswords ? 'text' : 'password'} id="confirmarNovaSenha" name="confirmarNovaSenha" value={passwordData.confirmarNovaSenha} onChange={handlePasswordChange} required /><button type="button" className="password-toggle-button" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <FaEyeSlash /> : <FaEye />}</button></div></div>
                   <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? <FaSpinner className="spinner" /> : <FaLock />} Alterar Senha</button></div>
                </form>
            </div>
        </div>
    );
}

export default PerfilPage;