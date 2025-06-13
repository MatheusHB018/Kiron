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
  FaUserPlus // Ícone para o cadastro de usuários
} from 'react-icons/fa';
import './Header.css'; // Apenas uma importação do CSS

function Header() {
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const navigate = useNavigate();

  // Pega o tipo de usuário do localStorage quando o componente carrega
  useEffect(() => {
    const userType = localStorage.getItem('tipoUsuario');
    setTipoUsuario(userType);
  }, []);

  // Função de logout com SweetAlert e limpeza do localStorage
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
        // Limpa os dados do usuário do localStorage para um logout completo
        localStorage.removeItem('tipoUsuario');
        localStorage.removeItem('token'); // Assumindo que você também armazena um token

        console.log('Usuário deslogado');
        navigate('/');
      }
    });
  };

  return (
    <header className="header-container">
      <NavLink to="/dashboard" className="header-logo-link">
        <div className="header-logo">
          <img src="/logotipo.png" alt="MedResíduos Logo" />
          <span>MedResíduos</span>
        </div>
      </NavLink>

      <nav className="header-nav">
        <NavLink to="/dashboard"><FaTachometerAlt /> <span>Dashboard</span></NavLink>
        <NavLink to="/pacientes"><FaUsers /> <span>Pacientes</span></NavLink>
        <NavLink to="/agendamento"><FaCalendarCheck /> <span>Coletas</span></NavLink>
        
        {/* Link condicional para administradores */}
        {tipoUsuario === 'admin' && (
          <NavLink to="/cadastrar-usuario">
            <FaUserPlus /> <span>Usuários</span>
          </NavLink>
        )}
        
        {/* Adicionei de volta os links que faltavam */}
        <NavLink to="/relatorios"><FaChartBar /> <span>Relatórios</span></NavLink>
        <NavLink to="/parceiros"><FaHandshake /> <span>Parceiros</span></NavLink>
      </nav>

      <div className="header-user-actions">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}

export default Header;