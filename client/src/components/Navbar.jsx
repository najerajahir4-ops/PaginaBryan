import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Menu, 
  X, 
  Home, 
  Info, 
  Trophy, 
  FileText, 
  PlaySquare, 
  Phone, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const links = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Institución', path: '/quienes-somos', icon: Info },
    { name: 'Honor', path: '/alumnos-destacados', icon: Trophy },
    { name: 'Contenido', path: '/contenido', icon: FileText },
    { name: 'Multimedia', path: '/galeria', icon: PlaySquare },
    { name: 'Contactos', path: '/contactos', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-xl">
      {/* Top Section: Logo & Actions */}
      <div className="bg-carbon border-b border-white/5 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-12 sm:h-14">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Najera's Team Logo" 
                className="w-full h-full object-contain filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-heading text-lg sm:text-xl tracking-tight text-tatami-blanco group-hover:text-dorado-campeon transition-colors leading-none">
                Najera's <span className="text-dorado-campeon">Team</span>
              </span>
              <span className="font-body text-[8px] sm:text-[9px] tracking-wider font-medium text-dorado-campeon/60 uppercase leading-tight mt-0.5">
                Taekwondo Olímpico
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Socials */}
            <div className="flex items-center gap-4 text-tatami-blanco/50">
              <a href="#" className="hover:text-dorado-campeon transition-colors"><Facebook size={16} /></a>
              <a href="#" className="hover:text-dorado-campeon transition-colors"><Instagram size={16} /></a>
              <a href="#" className="hover:text-dorado-campeon transition-colors"><FaTiktok size={14} /></a>
            </div>

            <div className="w-[1px] h-6 bg-white/10"></div>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <Link
                  to="/admin/estudiantes"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-body font-bold text-xs hover:bg-dorado-campeon transition-colors shadow-sm"
                >
                  <ShieldAlert size={14} />
                  Panel Admin
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs font-body font-bold text-tatami-blanco hover:text-rojo-impacto transition-colors"
                >
                  <LogOut size={14} />
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-xs font-body font-bold text-tatami-blanco/60 hover:text-dorado-campeon transition-colors"
              >
                Área Técnica
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-tatami-blanco/70 hover:text-dorado-campeon transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom Section: Nav Links */}
      <div className="hidden lg:block bg-carbon/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center py-1">
            {links.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 mx-1 ${
                    active
                      ? 'bg-dorado-campeon/10 text-dorado-campeon'
                      : 'text-tatami-blanco/70 hover:bg-white/[0.04] hover:text-tatami-blanco'
                  }`}
                >
                  <Icon size={16} className={`transition-colors duration-300 ${active ? 'text-dorado-campeon' : 'text-tatami-blanco/40 group-hover:text-tatami-blanco/80'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-carbon/95 backdrop-blur-xl border-b border-white/5 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px] opacity-100 visible py-2 shadow-2xl' : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-4 space-y-1">
          {links.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-dorado-campeon/10 text-dorado-campeon'
                    : 'text-tatami-blanco/70 hover:bg-white/[0.04] hover:text-tatami-blanco'
                }`}
              >
                <Icon size={18} className={active ? 'text-dorado-campeon' : 'text-tatami-blanco/40'} />
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-tatami-blanco/50">
              <a href="#" className="hover:text-dorado-campeon"><Facebook size={18} /></a>
              <a href="#" className="hover:text-dorado-campeon"><Instagram size={18} /></a>
              <a href="#" className="hover:text-dorado-campeon"><FaTiktok size={16} /></a>
            </div>
            {isAuthenticated ? (
               <button onClick={logout} className="text-xs font-bold uppercase text-tatami-blanco hover:text-rojo-impacto flex items-center gap-2">
                 <LogOut size={14} /> Salir
               </button>
            ) : (
               <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="text-xs font-bold uppercase text-tatami-blanco/60 hover:text-dorado-campeon">
                 Área Técnica
               </Link>
            )}
          </div>
          {isAuthenticated && (
             <div className="pb-4 pt-4">
                <Link to="/admin/estudiantes" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-black rounded-full font-bold text-sm">
                   <ShieldAlert size={16} /> Panel Admin
                </Link>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
