// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUser, FaLock, FaArrowRight, FaKey, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

import '../../public/css/LoginPage.css';
import '../../public/css/ForgotPassword.css';
import Logo from '../../public/Logo.png';
import { login } from '../services/api';
import ForgotPasswordFlow from '../components/auth/ForgotPasswordFlow'; // Importa o novo componente

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [lembrarMe, setLembrarMe] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false); // Estado para controlar o modal
    const navigate = useNavigate();

    useEffect(() => {
        const emailSalvo = localStorage.getItem('lembrarEmail');
        if (emailSalvo) {
            setEmail(emailSalvo);
            setLembrarMe(true);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (lembrarMe) {
            localStorage.setItem('lembrarEmail', email);
        } else {
            localStorage.removeItem('lembrarEmail');
        }
        try {
            const result = await login(email, password, lembrarMe);
            if (result && result.user && result.token) {
                localStorage.setItem('tipoUsuario', result.user.tipo);
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userId', result.user.id_usuario);
                navigate('/dashboard');
            } else {
                throw new Error('Resposta inválida do servidor.');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Falha no Login',
                text: err.message || 'Email ou senha inválidos.',
                confirmButtonColor: '#00A99D',
            });
        }
    };

    return (
        <>
            <main className="login-page">
                <div className="login-container">
                    {/* ... (código do logo e título) ... */}
                    <div className="logo-container">
                      <img src={Logo} alt="Logotipo da Kiron" className="logo" />
                    </div>
                    <h1 className="login-title">Bem-vindo ao Kiron</h1>
                    
                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        {/* ... (código dos inputs de email e senha) ... */}
                        <div className="form-group">
                          <label htmlFor="email"><FaUser aria-hidden="true" /> Usuário ou e-mail</label>
                          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu usuário ou e-mail" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><FaLock aria-hidden="true" /> Senha</label>
                            <div className="password-wrapper">
                                <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" required />
                                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                            </div>
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="lembrar-me" checked={lembrarMe} onChange={(e) => setLembrarMe(e.target.checked)} />
                                <label htmlFor="lembrar-me">Lembrar-me</label>
                            </div>
                            {/* Este link agora é um botão para abrir o modal */}
                            <button type="button" className="forgot-password-link" onClick={() => setShowForgotPassword(true)}>
                                <FaKey aria-hidden="true" /> Esqueci minha senha
                            </button>
                        </div>
                        
                        <button type="submit" className="login-button">
                            Entrar <FaArrowRight aria-hidden="true" />
                        </button>
                    </form>
                </div>
            </main>

            {/* Renderização condicional do Modal */}
            {showForgotPassword && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal-button" onClick={() => setShowForgotPassword(false)}>
                            <FaTimes />
                        </button>
                        <ForgotPasswordFlow closeModal={() => setShowForgotPassword(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginPage;