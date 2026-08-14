import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext';

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
    return `flex items-center gap-3 py-3 px-4 transition-all uppercase tracking-widest font-body text-xs font-semibold border-l-4 ${
      isActive 
        ? 'border-dorado-campeon bg-dorado-campeon/10 text-dorado-campeon' 
        : 'border-transparent text-gray-400 hover:text-tatami-blanco hover:bg-white/5'
    }`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Topbar (only visible on mobile to open sidebar) */}
      <div className="lg:hidden bg-[#0A0B0E] border-b border-dorado-campeon/30 p-4 flex items-center justify-between sticky top-0 z-40">
        <span className="font-body font-bold text-dorado-campeon text-lg flex items-center gap-2 tracking-widest uppercase">
          <span className="w-3 h-3 bg-rojo-impacto"></span>
          PANEL ADMIN
        </span>
        <button onClick={() => setMobileOpen(true)} className="text-white p-1">
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0B0E] border-r border-dorado-campeon/20 shadow-[5px_0_15px_rgba(0,0,0,0.5)] transform transition-transform duration-300 flex flex-col justify-between ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top Section: Logo & Nav */}
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between lg:justify-center">
            <Link to="/admin/estudiantes" onClick={() => setMobileOpen(false)} className="font-body font-bold text-dorado-campeon text-xl flex items-center gap-2 tracking-widest uppercase text-center w-full justify-center">
              <span className="w-4 h-4 bg-rojo-impacto shadow-[0_0_10px_rgba(214,40,57,0.5)]"></span>
              PANEL ADMIN
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          {/* Main Navigation Links */}
          <nav className="py-4 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setMobileOpen(false)}
                className={getLinkClass(link.path)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section: User Info & Logout */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <Link 
            to="/" 
            onClick={() => setMobileOpen(false)} 
            className="block text-center text-[10px] text-gray-500 hover:text-dorado-campeon font-body uppercase tracking-widest underline"
          >
            Ver Web Pública
          </Link>
          
          <div className="flex items-center justify-center gap-2 bg-carbon p-3 border border-white/5 text-[10px] font-body font-semibold text-tatami-blanco/80 uppercase tracking-widest">
            <User size={14} className="text-dorado-campeon" />
            {user?.usuario}
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-rojo-impacto hover:bg-white hover:text-rojo-impacto text-tatami-blanco font-body text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(214,40,57,0.3)] flex items-center justify-center"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </aside>
    </>
  );
};

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-carbon text-tatami-blanco flex flex-col lg:flex-row">
    <AdminSidebar />
    {/* Contenedor principal que deja margen izquierdo equivalente al ancho del sidebar en lg */}
    <div className="flex-grow lg:ml-64 w-full relative min-w-0">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  </div>
);

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
