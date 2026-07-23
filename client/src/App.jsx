import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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

// Admin Header Navigation Bar
const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header class="bg-[#060D33] border-b-2 border-dojang-gold sticky top-0 z-40 shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <Link to="/admin/estudiantes" class="font-heading font-extrabold text-dojang-gold text-lg flex items-center gap-2 tracking-widest uppercase">
            <span class="w-3 h-3 rounded-sm bg-dojang-red"></span>
            PANEL ADMIN
          </Link>
          <nav class="hidden md:flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
            <Link to="/admin/estudiantes" class="text-gray-300 hover:text-dojang-gold transition-colors py-1">Fichas & Pagos</Link>
            <Link to="/admin/asistencia" class="text-gray-300 hover:text-dojang-gold transition-colors py-1">Asistencia</Link>
            <Link to="/admin/contenido" class="text-gray-300 hover:text-dojang-gold transition-colors py-1">Contenido</Link>
            <Link to="/admin/alumnos-destacados" class="text-gray-300 hover:text-dojang-gold transition-colors py-1">Destacados</Link>
            <Link to="/admin/modulos" class="text-gray-300 hover:text-dojang-gold transition-colors py-1">Configuración</Link>
          </nav>
        </div>

        <div class="flex items-center gap-4 text-xs">
          <Link to="/" class="text-gray-400 hover:text-dojang-gold underline font-bold tracking-wider uppercase hidden sm:block">Ver Web Pública</Link>
          <span class="text-white font-bold bg-[#111114] px-3 py-1 rounded-sm border border-white/10 uppercase tracking-widest">{user?.usuario}</span>
          <button
            onClick={handleLogout}
            class="px-3 py-1.5 bg-dojang-red hover:bg-dojang-redHover text-white rounded-sm font-bold tracking-widest uppercase shadow-lg transition-colors border border-dojang-red"
          >
            Salir
          </button>
        </div>
      </div>
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
      </Routes>
    </>
  );
}

export default App;
