import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  // Recupera o tipo do usuário do localStorage
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const navigate = useNavigate();

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Bem-vindo à Home do MedResiduos!</h1>
      <p>Você está logado com sucesso.</p>
    </main>
  );
}

export default HomePage;
