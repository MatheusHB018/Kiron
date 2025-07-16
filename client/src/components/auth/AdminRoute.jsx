// src/components/auth/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('tipoUsuario');

    // 1. O usuário está logado? Se não, vai para a página de login.
    if (!token) {
        return <Navigate to="/login" />;
    }

    // 2. O usuário é admin? Se não, vai para o dashboard (ou uma página de "acesso negado").
    if (userType !== 'admin') {
        // Redireciona para o dashboard, pois ele não tem permissão.
        return <Navigate to="/dashboard" />;
    }

    // 3. Se passou pelas duas verificações, permite o acesso.
    return <Outlet />;
};

export default AdminRoute;