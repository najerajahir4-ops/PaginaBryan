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

// Admin Header Navigation Bar
const AdminNavbar = () => {
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
    return `transition-colors py-1 border-b-2 ${isActive ? 'text-dorado-campeon border-dorado-campeon' : 'text-gray-300 border-transparent hover:text-dorado-campeon hover:border-dorado-campeon/50'}`;
  };

  const getMobileLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `block py-1 border-l-2 pl-2 ${isActive ? 'text-dorado-campeon border-dorado-campeon font-extrabold bg-white/5' : 'text-gray-300 border-transparent hover:text-dorado-campeon hover:border-dorado-campeon/50'}`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header class="bg-[#060D33] border-b-2 border-dorado-campeon sticky top-0 z-40 shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <Link to="/admin/estudiantes" class="font-heading font-extrabold text-dorado-campeon text-lg flex items-center gap-2 tracking-widest uppercase">
            <span class="w-3 h-3 rounded-sm bg-rojo-impacto"></span>
            PANEL ADMIN
          </Link>
          <nav class="hidden md:flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} class={getLinkClass(link.path)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div class="flex items-center gap-3 sm:gap-5 text-xs">
          <Link to="/" class="text-gray-400 hover:text-dorado-campeon underline font-bold tracking-wider uppercase hidden sm:block">Ver Web Pública</Link>
          <div class="flex items-center gap-1.5 text-gray-300 px-2 uppercase tracking-widest text-[10px] sm:text-xs">
            <User size={14} class="opacity-70" />
            <span>{user?.usuario}</span>
          </div>
          <button
            onClick={handleLogout}
            class="px-4 py-1.5 bg-rojo-impacto hover:bg-red-700 text-tatami-blanco font-display text-sm tracking-widest uppercase clip-button shadow-lg transition-colors"
          >
            Salir
          </button>
          
          {/* Mobile Admin Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            class="md:hidden text-white hover:text-dorado-campeon p-2 ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile admin nav dropdown */}
      {mobileOpen && (
        <div class="md:hidden bg-[#060D33] border-b border-dorado-campeon px-4 py-3 space-y-3 font-heading text-xs font-bold tracking-widest uppercase shadow-xl animate-fade-in">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setMobileOpen(false)} 
                class={getMobileLinkClass(link.path)}
              >
                {link.label}
              </Link>
            ))}
          <div class="border-t border-white/10 pt-2">
            <Link to="/" onClick={() => setMobileOpen(false)} class="block text-gray-400 hover:text-dorado-campeon underline py-1">Ver Web Pública</Link>
          </div>
        </div>
      )}
    </header>
  );
};

const PublicLayout = ({ children }) => (
  <div class="min-h-screen flex flex-col justify-between">
    <Navbar />
    <main class="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div class="min-h-screen bg-[#0B1550] text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0B1550] via-[#060D33] to-[#111114]">
    <AdminNavbar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
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
      </Routes>
    </>
  );
}

export default App;
