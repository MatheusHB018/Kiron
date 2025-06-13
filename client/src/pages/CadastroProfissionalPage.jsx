import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../services/api';

function CadastroUsuarioPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  // Exemplo: tipoUsuario vindo do localStorage ou contexto de autenticação
  const tipoUsuario = localStorage.getItem('tipoUsuario') || 'comum';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    try {
      await cadastrarUsuario(nome, email, senha, tipoUsuario);
      setSucesso('Usuário cadastrado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>Cadastrar Profissional</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required style={{ width: '100%' }} />
        </div>
        {erro && <div style={{ color: 'red', marginBottom: 8 }}>{erro}</div>}
        {sucesso && <div style={{ color: 'green', marginBottom: 8 }}>{sucesso}</div>}
        <button type="submit" style={{ width: '100%' }}>Cadastrar</button>
      </form>
    </main>
  );
}

export default CadastroUsuarioPage;
