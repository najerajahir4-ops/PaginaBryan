import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="bg-[#111114] text-[#F5F2E9] pt-8 pb-8 border-t border-[#C9A227]/40">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full border-2 border-[#C9A227] p-0.5 bg-[#0B1550]">
              <img src="/logo.png" alt="Najera's Team Logo" class="w-full h-full object-contain rounded-full" />
            </div>
            <div class="flex flex-col">
              <span class="font-heading font-bold text-lg text-[#F5F2E9] tracking-wider">
                NAJERA'S <span class="text-[#C9A227]">TEAM</span>
              </span>
              <span class="text-[9px] text-[#C9A227] font-bold uppercase tracking-widest">
                Formando Campeones
              </span>
            </div>
          </div>
          <p class="text-xs leading-relaxed text-[#F5F2E9]/70">
            Najera's Team Central - Formativo Especializado. Formación integral en Taekwondo Olímpico y Kickboxing de alto rendimiento con metodología pedagógica.
          </p>
          <div class="flex gap-3 pt-2">
            <a href="#" class="w-8 h-8 rounded-sm bg-[#0B1550] border border-[#C9A227]/40 flex items-center justify-center text-[#F5F2E9] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors">
              <Facebook size={15} />
            </a>
            <a href="#" class="w-8 h-8 rounded-sm bg-[#0B1550] border border-[#C9A227]/40 flex items-center justify-center text-[#F5F2E9] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors">
              <Instagram size={15} />
            </a>
          </div>
        </div>

        {/* Operating Hours Table */}
        <div class="space-y-4">
          <h4 class="font-heading font-bold text-[#F5F2E9] text-base tracking-widest uppercase border-b border-[#C9A227] pb-1.5 inline-block">
            Horarios dojang
          </h4>
          <table class="w-full text-xs text-[#F5F2E9]/80 border-collapse">
            <tbody>
              <tr class="border-b border-white/5 py-1.5 flex justify-between">
                <td class="font-semibold text-gray-400">Lunes - Viernes:</td>
                <td class="text-[#C9A227] font-bold">06:00 - 21:30</td>
              </tr>
              <tr class="border-b border-white/5 py-1.5 flex justify-between">
                <td class="font-semibold text-gray-400">Sábados:</td>
                <td class="text-[#C9A227] font-bold">08:00 - 14:00</td>
              </tr>
              <tr class="py-1.5 flex justify-between">
                <td class="font-semibold text-gray-400">Domingos:</td>
                <td class="text-[#8C1D1D] font-bold">Entrenamiento Élite</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Links */}
        <div class="space-y-4">
          <h4 class="font-heading font-bold text-[#F5F2E9] text-base tracking-widest uppercase border-b border-[#C9A227] pb-1.5 inline-block">
            Navegación
          </h4>
          <ul class="space-y-2 text-xs font-semibold">
            <li><Link to="/" class="hover:text-[#C9A227] transition-colors">➔ INICIO</Link></li>
            <li><Link to="/quienes-somos" class="hover:text-[#C9A227] transition-colors">➔ QUIÉNES SOMOS</Link></li>
            <li><Link to="/alumnos-destacados" class="hover:text-[#C9A227] transition-colors">➔ ALUMNOS DESTACADOS</Link></li>
            <li><Link to="/contenido" class="hover:text-[#C9A227] transition-colors">➔ CONTENIDO & BLOG</Link></li>
            <li><Link to="/contactos" class="hover:text-[#C9A227] transition-colors">➔ CONTACTOS</Link></li>
            <li><Link to="/admin/login" class="hover:text-[#C9A227] transition-colors">➔ ÁREA TÉCNICA</Link></li>
          </ul>
        </div>

        {/* Location Contact */}
        <div class="space-y-4">
          <h4 class="font-heading font-bold text-[#F5F2E9] text-base tracking-widest uppercase border-b border-[#C9A227] pb-1.5 inline-block">
            Sede Central
          </h4>
          <ul class="space-y-3 text-xs text-[#F5F2E9]/80">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <span>Av. Marcial 456, Villa Deportiva, Ciudad Central</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-[#C9A227] flex-shrink-0" />
              <span>+52 (55) 1234-5678</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-[#C9A227] flex-shrink-0" />
              <span>contacto@najeras-team.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Najera's Team Central. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
