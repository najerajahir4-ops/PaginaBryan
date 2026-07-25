import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Menu, X, LogIn } from 'lucide-react';
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
    <header class="sticky top-0 z-50 bg-carbon border-b border-dorado-campeon/40 shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Emblem */}
        <Link to="/" class="flex items-center gap-2.5 flex-shrink-0 group">
          <div class="w-9 h-9 rounded-full border-2 border-dorado-campeon p-0.5 bg-carbon group-hover:scale-105 transition-transform flex-shrink-0">
            <img src="/logo.png" alt="Najera's Team Logo" class="w-full h-full object-contain rounded-full" />
          </div>
          <div class="flex flex-col">
            <span class="font-display font-bold text-base tracking-wider text-tatami-blanco group-hover:text-dorado-campeon transition-colors leading-tight">
              NAJERA'S <span class="text-dorado-campeon">TEAM</span>
            </span>
            <span class="text-[8px] tracking-widest uppercase font-semibold text-tatami-blanco/70 leading-none">
              CENTRAL • FORMANDO CAMPEONES
            </span>
          </div>
        </Link>

        {/* Desktop Links (Clean Single Line Navigation) */}
        <nav class="hidden lg:flex items-center gap-3 xl:gap-5 flex-shrink-0">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              class={`font-display text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors py-1 relative impact-flash ${
                isActive(link.path)
                  ? 'text-dorado-campeon'
                  : 'text-tatami-blanco/85 hover:text-tatami-blanco'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span class="absolute -bottom-1 left-0 w-full h-[2px] bg-dorado-campeon"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Social Icons & Admin Button */}
        <div class="hidden md:flex items-center gap-3 flex-shrink-0">
          <div class="flex items-center gap-1.5 border-r border-dorado-campeon/30 pr-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              class="w-7 h-7 rounded-sm bg-carbon border border-dorado-campeon/30 flex items-center justify-center text-tatami-blanco hover:text-dorado-campeon hover:border-dorado-campeon transition-colors impact-flash"
              title="Facebook"
            >
              <Facebook size={13} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              class="w-7 h-7 rounded-sm bg-carbon border border-dorado-campeon/30 flex items-center justify-center text-tatami-blanco hover:text-dorado-campeon hover:border-dorado-campeon transition-colors impact-flash"
              title="Instagram"
            >
              <Instagram size={13} />
            </a>
          </div>

          {isAuthenticated ? (
            <div class="flex items-center gap-2">
              <Link
                to="/admin/estudiantes"
                class="px-3.5 py-1.5 font-display text-xs font-bold tracking-wider bg-carbon border border-dorado-campeon text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon rounded-sm transition-colors uppercase whitespace-nowrap clip-button"
              >
                PANEL ADMIN
              </Link>
              <button
                onClick={logout}
                class="px-2.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-rose-400"
              >
                Salir
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          class="lg:hidden text-tatami-blanco hover:text-dorado-campeon p-2"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div class="lg:hidden bg-carbon border-b border-dorado-campeon/40 px-4 pt-3 pb-5 space-y-2.5">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              class={`block py-1.5 font-display text-xs font-bold tracking-wider uppercase ${
                isActive(link.path) ? 'text-dorado-campeon' : 'text-tatami-blanco'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div class="pt-3 border-t border-dorado-campeon/30 flex items-center justify-between">
            <div class="flex gap-2">
              <a href="#" class="text-tatami-blanco hover:text-dorado-campeon"><Facebook size={16} /></a>
              <a href="#" class="text-tatami-blanco hover:text-dorado-campeon"><Instagram size={16} /></a>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                class="px-3.5 py-1.5 font-display text-xs font-bold bg-rojo-impacto text-tatami-blanco rounded-sm clip-button"
              >
                SALIR
              </button>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
