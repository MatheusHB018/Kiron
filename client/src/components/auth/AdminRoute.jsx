import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userType = localStorage.getItem('tipoUsuario');

  // A verificação é apenas se o tipo de usuário é 'admin'
  if (userType !== 'admin') {
    // Se não for admin, volta para a página de login
    return <Navigate to="/" />;
  }

  // Se for admin, permite o acesso
  return <Outlet />;
};

export default AdminRoute;