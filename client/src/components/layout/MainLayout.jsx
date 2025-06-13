// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css'; // Vamos criar este arquivo de estilo

function MainLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet /> {/* As páginas (como Dashboard) serão renderizadas aqui */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;