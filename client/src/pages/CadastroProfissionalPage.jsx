import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave, FaEye, FaEyeSlash, FaArrowLeft, FaSpinner, FaUser, FaEnvelope } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { cadastrarUsuario } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css';

function CadastroProfissionalPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('comum');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar o carregamento
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      Swal.fire('Atenção', 'As senhas não coincidem. Por favor, tente novamente.', 'warning');
      return;
    }
    if (senha.length < 6) {
      Swal.fire('Atenção', 'A senha deve ter no mínimo 6 caracteres.', 'warning');
      return;
    }

    setIsSubmitting(true); // Ativa o carregamento

    try {
      await cadastrarUsuario(nome, email, senha, tipoUsuario);
      Swal.fire({
        title: 'Sucesso!',
        text: 'Usuário cadastrado com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => {
        navigate('/listar-usuarios');
      });
    } catch (err) {
      Swal.fire({
        title: 'Erro!',
        text: err.message || 'Ocorreu um erro ao cadastrar o usuário.',
        icon: 'error'
      });
    } finally {
      setIsSubmitting(false); // Desativa o carregamento no final
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-container">
        <div className="page-title">
          <FaUserPlus className="icon" />
          <h1>Cadastro de Usuários</h1>
        </div>
      </div>
      <Link to="/listar-usuarios" className="back-link">
        <FaArrowLeft />
        Voltar para a lista
      </Link>
      <p>Adicione novos profissionais ou administradores ao sistema preenchendo o formulário abaixo.</p>

      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* CAMPO DE NOME COM ÍCONE */}
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Digite o nome completo"
                />
              </div>
            </div>

            {/* CAMPO DE EMAIL COM ÍCONE */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha (mínimo 6 caracteres)</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="Digite a senha"
                />
                <button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  placeholder="Confirme a senha"
                />
                <button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="tipoUsuario">Tipo de Usuário</label>
              <select id="tipoUsuario" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                <option value="comum">Profissional Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner" />
                  A guardar...
                </>
              ) : (
                <>
                  <FaSave />
                  Cadastrar Usuário
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroProfissionalPage;