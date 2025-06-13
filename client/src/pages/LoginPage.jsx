// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/LoginPage.css';
import Logo from '/logotipo.png';
// ATUALIZADO: Importando os ícones de olho
import { FaUser, FaLock, FaArrowRight, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NOVO: Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      // Salva o tipo do usuário logado no localStorage
      if (result && result.user && result.user.tipo) {
        localStorage.setItem('tipoUsuario', result.user.tipo);
      } else {
        localStorage.removeItem('tipoUsuario');
      }
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  // NOVO: Função para alternar a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img src={Logo} alt="Logotipo da MedResiduos" className="logo" />
        </div>
        
        <h1 className="login-title">Bem-vindo ao MedResiduos</h1>
        
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">
              <FaUser aria-hidden="true" />
              Usuário ou e-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu usuário ou e-mail"
              required
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FaLock aria-hidden="true" />
              Senha
            </label>
            {/* NOVO: Wrapper para posicionar o ícone dentro do input */}
            <div className="password-wrapper">
              <input
                // ATUALIZADO: O tipo do input agora é dinâmico
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                aria-required="true"
              />
              {/* NOVO: Ícone de olho que alterna a visibilidade */}
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
              </span>
            </div>
          </div>
          <button type="submit" className="login-button">
            Entrar
            <FaArrowRight aria-hidden="true" />
          </button>
        </form>
        
        <div className="forgot-password">
          <a href="#">
            <FaKey aria-hidden="true" />
            Esqueci minha senha
          </a>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;