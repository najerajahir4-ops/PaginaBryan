import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Public Pages
import Home from './pages/Home';
import QuienesSomos from './pages/QuienesSomos';
import AlumnosDestacados from './pages/AlumnosDestacados';
import Contenido from './pages/Contenido';
import ContenidoDetalle from './pages/ContenidoDetalle';
import Galeria from './pages/Galeria';
import GaleriaDetalle from './pages/GaleriaDetalle';
import GeneralGallery from './pages/GeneralGallery';
import Contactos from './pages/Contactos';
import AdminLogin from './pages/AdminLogin';
import Campeonatos from './pages/Campeonatos';
import Grados from './pages/Grados';

// Admin Pages
import EstudiantesAdmin from './pages/admin/EstudiantesAdmin';
import AsistenciaAdmin from './pages/admin/AsistenciaAdmin';
import ContenidoAdmin from './pages/admin/ContenidoAdmin';
import AlumnosDestacadosAdmin from './pages/admin/AlumnosDestacadosAdmin';
import ModulosAdmin from './pages/admin/ModulosAdmin';
import PerfilesAdmin from './pages/admin/PerfilesAdmin';
import PerfilDetalleAdmin from './pages/admin/PerfilDetalleAdmin';
import GeneralPhotosAdmin from './pages/admin/GeneralPhotosAdmin';

// Sidebar Navigation for Admin
const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/admin/estudiantes', label: 'Fichas & Pagos' },
    { path: '/admin/perfiles', label: 'Perfiles' },
    { path: '/admin/asistencia', label: 'Asistencia' },
    { path: '/admin/contenido', label: 'Contenido' },
    { path: '/admin/alumnos-destacados', label: 'Destacados' },
    { path: '/admin/modulos', label: 'Configuración' },
  ];

  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 py-3.5 px-6 transition-all duration-300 font-body text-sm font-medium border-l-4 group ${
      isActive 
        ? 'border-red-600 bg-red-50 text-red-600 dark:border-dorado-campeon dark:bg-transparent dark:bg-gradient-to-r dark:from-dorado-campeon/10 dark:to-transparent dark:text-dorado-campeon' 
        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 dark:hover:border-white/20'
    }`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Topbar (only visible on mobile to open sidebar) */}
      <div className="lg:hidden bg-white dark:bg-[#0A0B0E] border-b border-gray-200 dark:border-dorado-campeon/30 p-4 flex items-center justify-between sticky top-0 z-40">
        <span className="font-body font-bold text-gray-900 dark:text-dorado-campeon text-lg flex items-center gap-2 tracking-wide">
          <span className="w-3 h-3 rounded-full bg-red-600 dark:bg-rojo-impacto"></span>
          Panel Admin
        </span>
        <button onClick={() => setMobileOpen(true)} className="text-gray-600 dark:text-white p-1">
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden" 
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0A0B0E] border-r border-gray-200 dark:border-dorado-campeon/20 shadow-[5px_0_15px_rgba(0,0,0,0.05)] dark:shadow-[5px_0_15px_rgba(0,0,0,0.5)] transform transition-transform duration-300 flex flex-col justify-between ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top Section: Logo & Nav */}
        <div>
          {/* Logo / Header */}
          <div className="p-8 flex items-center justify-between lg:justify-center border-b border-gray-100 dark:border-white/5">
            <Link to="/admin/estudiantes" onClick={() => setMobileOpen(false)} className="font-body font-bold text-gray-900 dark:text-white text-xl flex items-center gap-3 tracking-tight text-center w-full justify-center group">
              <span className="w-3 h-3 rounded-full bg-red-600 dark:bg-dorado-campeon shadow-none dark:shadow-[0_0_10px_rgba(227,178,60,0.5)] group-hover:scale-125 transition-transform"></span>
              Panel Admin
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-800 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          {/* Main Navigation Links */}
          <nav className="py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setMobileOpen(false)}
                className={getLinkClass(link.path)}
              >
                <span className="transform transition-transform group-hover:translate-x-1">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section: User Info & Logout */}
        <div className="p-6 space-y-4 border-t border-gray-100 dark:border-white/5">
          
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-body font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {theme === 'light' ? (
              <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Modo Noche</>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Modo Claro</>
            )}
          </button>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs font-body font-medium text-gray-700 dark:text-gray-300">
              <User size={16} className="text-red-500 dark:text-dorado-campeon" />
              {user?.usuario}
            </div>
            <Link 
              to="/" 
              onClick={() => setMobileOpen(false)} 
              className="text-[10px] text-gray-400 hover:text-red-600 dark:hover:text-white font-body underline transition-colors"
            >
              Ver Web
            </Link>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 font-body text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-carbon text-tatami-blanco flex flex-col justify-between">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0A0B0E] text-gray-900 dark:text-tatami-blanco flex flex-col lg:flex-row font-body transition-colors duration-300">
    <AdminSidebar />
    {/* Contenedor principal que deja margen izquierdo equivalente al ancho del sidebar en lg */}
    <div className="flex-grow lg:ml-64 w-full relative min-w-0">
      <main className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-12 py-10 lg:py-16">{children}</main>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        {/* Rutas Públicas */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/quienes-somos" element={<PublicLayout><QuienesSomos /></PublicLayout>} />
      <Route path="/alumnos-destacados" element={<PublicLayout><AlumnosDestacados /></PublicLayout>} />
      <Route path="/campeonatos" element={<PublicLayout><Campeonatos /></PublicLayout>} />
      <Route path="/grados" element={<PublicLayout><Grados /></PublicLayout>} />
      <Route path="/contenido" element={<PublicLayout><Contenido /></PublicLayout>} />
      <Route path="/contenido/:id" element={<PublicLayout><ContenidoDetalle /></PublicLayout>} />
      <Route path="/galeria" element={<PublicLayout><Galeria /></PublicLayout>} />
      <Route path="/galeria/generales" element={<PublicLayout><GeneralGallery /></PublicLayout>} />
      <Route path="/galeria/:id" element={<PublicLayout><GaleriaDetalle /></PublicLayout>} />
      <Route path="/contactos" element={<PublicLayout><Contactos /></PublicLayout>} />
      <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />

      {/* Rutas de Administración Protegidas */}
      <Route
        path="/admin/estudiantes"
        element={<ProtectedRoute><AdminLayout><EstudiantesAdmin /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path="/admin/asistencia"
        element={<ProtectedRoute><AdminLayout><AsistenciaAdmin /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path="/admin/contenido"
        element={<ProtectedRoute><AdminLayout><ContenidoAdmin /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path="/admin/alumnos-destacados"
        element={<ProtectedRoute><AdminLayout><AlumnosDestacadosAdmin /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path="/admin/modulos"
        element={<ProtectedRoute><AdminLayout><ModulosAdmin /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path="/admin/perfiles"
        element={<ProtectedRoute><AdminLayout><PerfilesAdmin /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path="/admin/perfiles/:id"
        element={<ProtectedRoute><AdminLayout><PerfilDetalleAdmin /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path="/admin/perfiles/generales"
        element={<ProtectedRoute><AdminLayout><GeneralPhotosAdmin /></AdminLayout></ProtectedRoute>}
      />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
