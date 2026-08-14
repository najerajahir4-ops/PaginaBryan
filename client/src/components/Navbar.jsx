import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const links = [
    { name: 'INICIO', path: '/' },
    { name: 'QUIÉNES SOMOS', path: '/quienes-somos' },
    { name: 'ALUMNOS DESTACADOS', path: '/alumnos-destacados' },
    { name: 'CONTENIDO', path: '/contenido' },
    { name: 'GALERÍA', path: '/galeria' },
    { name: 'CONTACTOS', path: '/contactos' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-carbon border-b border-dorado-campeon/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Emblem */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img src="/logo.png" alt="Najera's Team Logo" className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 drop-shadow-[0_0_8px_rgba(227,178,60,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(227,178,60,0.6)]" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-heading text-xl tracking-widest text-tatami-blanco group-hover:text-dorado-campeon transition-colors leading-none mt-1">
              NAJERA'S <span className="text-dorado-campeon">TEAM</span>
            </span>
            <span className="font-body text-[9px] tracking-[0.2em] uppercase font-bold text-dorado-campeon/60 leading-tight">
              REGISTRO OFICIAL
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-heading text-sm tracking-wider uppercase whitespace-nowrap transition-all px-4 py-5 border-b-2 ${
                isActive(link.path)
                  ? 'border-dorado-campeon text-dorado-campeon bg-dorado-campeon/5'
                  : 'border-transparent text-tatami-blanco/70 hover:text-tatami-blanco hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Social Icons & Admin Button */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 border-r border-dorado-campeon/20 pr-4 py-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 bg-[#0A0B0E] border border-dorado-campeon/20 flex items-center justify-center text-tatami-blanco/70 hover:text-dorado-campeon hover:border-dorado-campeon hover:shadow-[0_0_10px_rgba(227,178,60,0.2)] transition-all"
              title="Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 bg-[#0A0B0E] border border-dorado-campeon/20 flex items-center justify-center text-tatami-blanco/70 hover:text-dorado-campeon hover:border-dorado-campeon hover:shadow-[0_0_10px_rgba(227,178,60,0.2)] transition-all"
              title="Instagram"
            >
              <Instagram size={14} />
            </a>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/admin/estudiantes"
                className="px-4 py-2 font-heading text-xs tracking-widest bg-carbon border border-dorado-campeon text-dorado-campeon hover:bg-dorado-campeon/10 transition-colors uppercase whitespace-nowrap shadow-[0_0_10px_rgba(227,178,60,0.1)] hover:shadow-[0_0_20px_rgba(227,178,60,0.2)]"
              >
                ÁREA TÉCNICA
              </Link>
              <button
                onClick={logout}
                className="font-body text-xs font-bold text-tatami-blanco/50 hover:text-rojo-impacto uppercase tracking-wider transition-colors"
              >
                Salir
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-tatami-blanco hover:text-dorado-campeon p-2 transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-carbon border-b border-dorado-campeon/20 px-4 py-4 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 font-heading text-lg tracking-widest uppercase border-b border-white/5 ${
                isActive(link.path) ? 'text-dorado-campeon border-dorado-campeon/30' : 'text-tatami-blanco/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-6 pb-2 flex items-center justify-between">
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-[#0A0B0E] border border-dorado-campeon/20 flex items-center justify-center text-tatami-blanco/70 hover:text-dorado-campeon"><Facebook size={16} /></a>
              <a href="#" className="w-10 h-10 bg-[#0A0B0E] border border-dorado-campeon/20 flex items-center justify-center text-tatami-blanco/70 hover:text-dorado-campeon"><Instagram size={16} /></a>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="px-4 py-2 font-heading text-sm tracking-widest bg-rojo-impacto text-tatami-blanco uppercase"
              >
                SALIR
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
