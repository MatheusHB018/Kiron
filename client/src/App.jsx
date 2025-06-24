// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe o Layout e as páginas existentes
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CadastroUsuarioPage from './pages/CadastroProfissionalPage.jsx';
import PacientesPage from './pages/PacientesPage.jsx';
import MateriaisPage from './pages/MateriaisPage.jsx';
import RelatoriosPage from './pages/RelatoriosPage.jsx';
import ParceirosPage from './pages/ParceirosPage.jsx';

// Importe as novas páginas
import PacienteDetalhesPage from './pages/PacienteDetalhesPage.jsx';
import PainelColetasPage from './pages/PainelColetasPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login não utiliza o layout principal */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas que utilizam o layout principal com Header e Footer */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cadastrar-usuario" element={<CadastroUsuarioPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/pacientes/:id" element={<PacienteDetalhesPage />} />
          <Route path="/materiais" element={<MateriaisPage />} />
          <Route path="/painel-coletas" element={<PainelColetasPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;