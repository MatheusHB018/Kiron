// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe o novo Layout e as páginas
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CadastroUsuarioPage from './pages/CadastroProfissionalPage.jsx';

// Lembre-se de criar e importar as outras páginas depois
// import PacientesPage from './pages/Pacientes/PacientesPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login (sem Header e Footer) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas que USAM o layout principal (com Header e Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cadastrar-usuario" element={<CadastroUsuarioPage />} />
          {/*
            Adicione aqui as outras páginas que devem ter cabeçalho e rodapé.
            Exemplo:
            <Route path="/pacientes" element={<PacientesPage />} />
          */}
        </Route>

        {/* Você pode adicionar uma rota para "Página não encontrada" aqui depois */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;