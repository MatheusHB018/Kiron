// client/src/pages/CadastroProfissionalPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave } from 'react-icons/fa';
import { cadastrarUsuario } from '../services/api';
import './styles/Page.css';
import './styles/CadastroProfissionalPage.css'; // Importa o novo CSS

function CadastroProfissionalPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('comum'); // Padrão 'comum'
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Por favor, tente novamente.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      await cadastrarUsuario(nome, email, senha, tipoUsuario);
      setSucesso('Usuário cadastrado com sucesso! Redirecionando...');
      // Limpa o formulário
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setTipoUsuario('comum');

      setTimeout(() => {
        navigate('/pacientes'); // Redireciona para uma página de lista relevante
      }, 2000);
    } catch (err) {
      setErro(err.message || 'Ocorreu um erro ao cadastrar o usuário.');
    }
  };

  return (
    <div className="page-container">
      {/* Mantém o cabeçalho padrão da página */}
      <div className="page-header-container">
        <div className="page-title">
          <FaUserPlus className="icon" />
          <h1>Cadastro de Usuários</h1>
        </div>
      </div>
      <p>Adicione novos profissionais ou administradores ao sistema preenchendo o formulário abaixo.</p>

      {/* Container do formulário com a nova classe */}
      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {erro && <div className="form-message error">{erro}</div>}
            {sucesso && <div className="form-message success">{sucesso}</div>}

            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha (mínimo 6 caracteres)</label>
              <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <input type="password" id="confirmarSenha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
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
            <button type="submit" className="submit-button">
              <FaSave />
              Cadastrar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroProfissionalPage;