// src/components/auth/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userType = localStorage.getItem('tipoUsuario');
  const token = localStorage.getItem('token'); 

  // Se não houver token, o usuário não está logado
  if (!token) {
    return <Navigate to="/" />;
  }

  // Se o usuário logado for admin, permite o acesso.
  // Senão, redireciona para o dashboard.
  return userType === 'admin' ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminRoute;