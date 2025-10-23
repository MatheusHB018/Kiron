// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts e Componentes
import MainLayout from './components/layout/MainLayout.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import ParceiroDetalhesPage from './pages/Paceiro/ParceiroDetalhesPage.jsx';

// Cadastros
import CadastroParceiroPage from './pages/Paceiro/CadastroParceiroPage.jsx';
import CadastroResiduoPage from './pages/Residuo/CadastroResiduoPage.jsx';
import CadastroColetaPage from './pages/Coleta/CadastroColetaPage.jsx';
import CadastroProfissionalPage from './pages/Profissional/CadastroProfissionalPage.jsx';
import CadastroPacientePage from './pages/Paciente/CadastroPacientePage.jsx'; 
import CadastroEntregaPage from './pages/Entrega/CadastroEntregaPage.jsx';

// Editar
import EditarParceiroPage from './pages/Paceiro/EditarParceiroPage.jsx';
import EditarResiduoPage from './pages/Residuo/EditarResiduoPage.jsx';
import EditarColetaPage from './pages/Coleta/EditarColetaPage.jsx';
import EditarUsuarioPage from './pages/Usuario/EditarUsuarioPage.jsx';
import EditarPacientePage from './pages/Paciente/EditarPacientePage.jsx';
import EditarEntregaPage from './pages/Entrega/EditarEntregaPage.jsx'; 

import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PacientesPage from './pages/Paciente/PacientesPage.jsx';
import PacienteDetalhesPage from './pages/Paciente/PacienteDetalhesPage.jsx';
import ResiduosPage from './pages/Residuo/ResiduosPage.jsx';
import PainelColetasPage from './pages/Coleta/PainelColetasPage.jsx';
import DetalhesColetaPage from './pages/Coleta/DetalhesColetaPage.jsx';
import RelatoriosPage from './pages/RelatoriosPage.jsx';
import ParceirosPage from './pages/Paceiro/ParceirosPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import ListarUsuarioPage from './pages/Usuario/ListarUsuarioPage.jsx';
import EntregasPage from './pages/Entrega/EntregasPage.jsx';


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
          <Route path="/cadastro-paciente" element={<CadastroPacientePage />} />
          <Route path="/editar-paciente/:id" element={<EditarPacientePage />} />
          <Route path="/residuos" element={<ResiduosPage />} />
          <Route path="/residuos/novo" element={<CadastroResiduoPage />} />
          <Route path="/residuos/editar/:id" element={<EditarResiduoPage />} />
          <Route path="/painel-coletas" element={<PainelColetasPage />} />
          <Route path="/agendar-coleta" element={<CadastroColetaPage />} />
          <Route path="/editar-coleta/:id" element={<EditarColetaPage />} />
          <Route path="/detalhes-coleta/:id" element={<DetalhesColetaPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/cadastro-parceiro" element={<CadastroParceiroPage />} />
          <Route path="/editar-parceiro/:id" element={<EditarParceiroPage />} />
          <Route path="/detalhes-parceiro/:id" element={<ParceiroDetalhesPage />} />
          <Route path="/perfil" element={<PerfilPage />} />

          {/* Rotas para entregas - CRUD COMPLETO */}
          <Route path="/entregas" element={<EntregasPage />} />
          <Route path="/entregas/novo" element={<CadastroEntregaPage />} />
          <Route path="/entregas/editar/:id" element={<EditarEntregaPage />} />

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