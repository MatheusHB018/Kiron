// src/components/auth/ForgotPasswordFlow.jsx
import React, { useState } from 'react';
import { FaEnvelope, FaKey, FaLock, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { requestPasswordReset, validateResetCode, resetPassword } from '../../services/api';
import '../../pages/styles/ForgotPassword.css';

function ForgotPasswordFlow({ closeModal }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ... (suas funções handleRequestCode, handleValidateCode, etc. continuam iguais)
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await requestPasswordReset(email);
            Swal.fire('Verifique seu Email', result.message, 'info');
            setStep(2);
        } catch (err) {
            Swal.fire('Erro', err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleValidateCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await validateResetCode(email, code);
            Swal.fire('Sucesso', 'Código validado! Agora crie sua nova senha.', 'success');
            setStep(3);
        } catch (err) {
            Swal.fire('Erro', err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            Swal.fire('Atenção', 'As senhas não coincidem.', 'warning');
            return;
        }
        setIsLoading(true);
        try {
            await resetPassword(email, code, newPassword);
            Swal.fire('Sucesso!', 'Sua senha foi redefinida. Você já pode fazer o login.', 'success');
            closeModal();
        } catch (err) {
            Swal.fire('Erro', err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="forgot-password-flow">
            {step === 1 && (
                <form onSubmit={handleRequestCode}>
                    <h2>Esqueceu sua Senha?</h2>
                    <p>Digite seu email para receber um código de redefinição.</p>
                    <div className="form-group">
                        <label htmlFor="reset-email">Email</label>
                        <div className="input-with-icon">
                            <FaEnvelope className="input-icon" />
                            <input type="email" id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    {/* BOTÃO ATUALIZADO */}
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <><FaSpinner className="spinner" /> Enviando...</> : 'Enviar Código'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleValidateCode}>
                    <h2>Verifique seu Código</h2>
                    <p>Enviamos um código para <strong>{email}</strong>. Por favor, insira-o abaixo.</p>
                     <div className="form-group">
                        <label htmlFor="reset-code">Código de 6 dígitos</label>
                        <div className="input-with-icon">
                            <FaKey className="input-icon" />
                            <input type="text" id="reset-code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength="6" />
                        </div>
                    </div>
                     {/* BOTÃO ATUALIZADO */}
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <><FaSpinner className="spinner" /> Validando...</> : 'Validar Código'}
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleResetPassword}>
                    <h2>Crie sua Nova Senha</h2>
                    <p>Escolha uma nova senha segura para sua conta.</p>
                    <div className="form-group">
                        <label htmlFor="new-password">Nova Senha</label>
                        <div className="input-with-icon">
                            <FaLock className="input-icon" />
                            <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                    </div>
                     <div className="form-group">
                        <label htmlFor="confirm-password">Confirmar Nova Senha</label>
                        <div className="input-with-icon">
                            <FaLock className="input-icon" />
                            <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                    </div>
                     {/* BOTÃO ATUALIZADO */}
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <><FaSpinner className="spinner" /> Redefinindo...</> : 'Redefinir Senha'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ForgotPasswordFlow;