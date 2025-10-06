// client/src/components/layout/Header.jsx
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaCalendarCheck,
  FaChartBar,
  FaHandshake,
  FaSignOutAlt,
  FaUserPlus,
  FaUserCircle
} from 'react-icons/fa';
import './Header.css';

function Header() {
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('tipoUsuario');
    setTipoUsuario(userType);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você será desconectado do sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00A99D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, desejo sair!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('tipoUsuario');
        localStorage.removeItem('token');
        console.log('Usuário deslogado');
        navigate('/');
      }
    });
  };

  return (
    <header className="header-container">
      <NavLink to="/dashboard" className="header-logo-link">
        <div className="header-logo">
          <img src="/logotipo.png" alt="Kiron Logo" />
          <span>Kiron</span>
        </div>
      </NavLink>

      <nav className="header-nav">
        <NavLink to="/dashboard"><FaTachometerAlt /> <span>Dashboard</span></NavLink>
        <NavLink to="/pacientes"><FaUsers /> <span>Pacientes</span></NavLink>
        <NavLink to="/entregas"><FaBoxOpen /> <span>Entregas</span></NavLink>
        <NavLink to="/residuos"><FaBoxOpen /> <span>Resíduos</span></NavLink>
        <NavLink to="/painel-coletas"><FaCalendarCheck /> <span>Coletas</span></NavLink>
        <NavLink to="/parceiros"><FaHandshake /> <span>Parceiros</span></NavLink>
        <NavLink to="/relatorios"><FaChartBar /> <span>Relatórios</span></NavLink>
        
        {tipoUsuario === 'admin' && (
          <NavLink to="/listar-usuarios">
            <FaUserPlus /> <span>Usuários</span>
          </NavLink>
        )}
      </nav>

      <div className="header-user-actions">
        <NavLink to="/perfil" className="header-nav-profile-link" title="Meu Perfil">
          <FaUserCircle /> <span>Perfil</span>
        </NavLink>
        <button onClick={handleLogout} className="logout-button" title="Sair do sistema">
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}

export default Header;