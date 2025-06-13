// src/components/layout/Header.jsx
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/dashboard">MedResiduos</Link>
      </div>
      <nav className="header-nav">
        <ul>
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