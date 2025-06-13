// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe o novo Layout e as páginas
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CadastroUsuarioPage from './pages/CadastroProfissionalPage.jsx';
import PacientesPage from './pages/PacientesPage.jsx';
import MateriaisPage from './pages/MateriaisPage.jsx';
import AgendamentoPage from './pages/AgendamentoPage.jsx';
import RelatoriosPage from './pages/RelatoriosPage.jsx';
import ParceirosPage from './pages/ParceirosPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login (sem Header e Footer) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas que USAM o layout principal (com Header e Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cadastrar-usuario" element={<CadastroUsuarioPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/materiais" element={<MateriaisPage />} />
          <Route path="/agendamento" element={<AgendamentoPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;