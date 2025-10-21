// src/components/ThemeToggle.jsx
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css'; // Vamos criar este CSS para estilizar o botão

const ThemeToggle = () => {
  // 1. Define o estado inicial lendo do localStorage ou 'light' como padrão
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Se não houver tema salvo, usa a preferência do sistema
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme;
  });

  // 2. Cria um useEffect para aplicar o tema no <html> e salvar no localStorage
  useEffect(() => {
    // Aplica o atributo no <html>
    document.documentElement.setAttribute('data-theme', theme);
    
    // Salva a preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Roda sempre que o 'theme' mudar

  // 3. Função para trocar o tema
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 4. Renderiza o botão
  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
    </button>
  );
};

export default ThemeToggle;