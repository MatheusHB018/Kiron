// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts e Componentes
import MainLayout from './components/layout/MainLayout.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import CadastroParceiroPage from './pages/CadastroParceiroPage.jsx';
import EditarParceiroPage from './pages/EditarParceiroPage.jsx';
import ParceiroDetalhesPage from './pages/ParceiroDetalhesPage.jsx';

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
import CadastroProfissionalPage from './pages/CadastroProfissionalPage.jsx';
import EditarUsuarioPage from './pages/EditarUsuarioPage.jsx';
import CadastroPacientePage from './pages/CadastroPacientePage.jsx'; // Importar
import EditarPacientePage from './pages/EditarPacientePage.jsx';   // Importar


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          {/* Rotas para todos os usuários logados */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/pacientes/:id" element={<PacienteDetalhesPage />} />
          <Route path="/cadastro-paciente" element={<CadastroPacientePage />} /> {/* Adicionar */}
          <Route path="/editar-paciente/:id" element={<EditarPacientePage />} /> {/* Adicionar */}
          <Route path="/materiais" element={<MateriaisPage />} />
          <Route path="/painel-coletas" element={<PainelColetasPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/cadastro-parceiro" element={<CadastroParceiroPage />} />
          <Route path="/editar-parceiro/:id" element={<EditarParceiroPage />} />
          <Route path="/detalhes-parceiro/:id" element={<ParceiroDetalhesPage />} />
          <Route path="/perfil" element={<PerfilPage />} />

          {/* Rota exclusiva para Administradores */}
          <Route element={<AdminRoute />}>
            <Route path="/cadastro-profissional" element={<CadastroProfissionalPage />} />
            <Route path="/listar-usuarios" element={<ListarUsuarioPage />} />
            <Route path="/editar-usuario/:id" element={<EditarUsuarioPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;