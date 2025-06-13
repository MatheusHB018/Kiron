// src/components/layout/Header.jsx
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';

function Header() {
  const [tipoUsuario, setTipoUsuario] = useState('');
  useEffect(() => {
    setTipoUsuario(localStorage.getItem('tipoUsuario'));
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/dashboard">MedResiduos</Link>
      </div>
      <nav className="header-nav">
        <ul>
          {tipoUsuario === 'admin' && (
            <li>
              <NavLink to="/cadastrar-usuario">Usuários</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/pacientes">Pacientes</NavLink>
          </li>
          <li>
            <NavLink to="/agendamento">Agendamentos</NavLink>
          </li>
          <li>
            <NavLink to="/">Sair</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;