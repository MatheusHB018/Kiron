// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts e Componentes
import MainLayout from './components/layout/MainLayout.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx'; // Verifique se esta linha está correta

// Páginas
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PacientesPage from './pages/PacientesPage.jsx';
import PacienteDetalhesPage from './pages/PacienteDetalhesPage.jsx';
import MateriaisPage from './pages/MateriaisPage.jsx';
import PainelColetasPage from './pages/PainelColetasPage.jsx';
import RelatoriosPage from './pages/RelatoriosPage.jsx';
import ParceirosPage from './pages/ParceirosPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import ListarUsuarioPage from './pages/ListarUsuarioPage.jsx';
import CadastroPacientePage from './pages/CadastroPacientePage.jsx';
import EditarPacientePage from './pages/EditarPacientePage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          {/* Rotas para todos os usuários logados */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/cadastro-paciente" element={<CadastroPacientePage />} />
          <Route path="/editar-paciente/:id" element={<EditarPacientePage />} />
          <Route path="/pacientes/:id" element={<PacienteDetalhesPage />} />
          <Route path="/materiais" element={<MateriaisPage />} />
          <Route path="/painel-coletas" element={<PainelColetasPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />

          {/* Rota exclusiva para Administradores */}
          <Route element={<AdminRoute />}>
            <Route path="/listar-usuarios" element={<ListarUsuarioPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;