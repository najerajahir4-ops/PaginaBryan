import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="bg-carbon text-tatami-blanco pt-8 pb-8 border-t border-dorado-campeon/40">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full border-2 border-dorado-campeon p-0.5 bg-carbon">
              <img src="/logo.png" alt="Najera's Team Logo" class="w-full h-full object-contain rounded-full" />
            </div>
            <div class="flex flex-col">
              <span class="font-display font-bold text-lg text-tatami-blanco tracking-wider">
                NAJERA'S <span class="text-dorado-campeon">TEAM</span>
              </span>
              <span class="text-[9px] text-dorado-campeon font-bold uppercase tracking-widest">
                Formando Campeones
              </span>
            </div>
          </div>
          <p class="text-xs leading-relaxed text-tatami-blanco/70">
            Najera's Team Central - Formativo Especializado. Formación integral en Taekwondo Olímpico y Kickboxing de alto rendimiento con metodología pedagógica.
          </p>
          <div class="flex gap-3 pt-2">
            <a href="#" class="w-8 h-8 rounded-sm bg-carbon border border-dorado-campeon/40 flex items-center justify-center text-tatami-blanco hover:border-dorado-campeon hover:text-dorado-campeon transition-colors impact-flash">
              <Facebook size={15} />
            </a>
            <a href="#" class="w-8 h-8 rounded-sm bg-carbon border border-dorado-campeon/40 flex items-center justify-center text-tatami-blanco hover:border-dorado-campeon hover:text-dorado-campeon transition-colors impact-flash">
              <Instagram size={15} />
            </a>
          </div>
        </div>

        {/* Operating Hours Table */}
        <div class="space-y-4">
          <h4 class="font-display font-bold text-tatami-blanco text-base tracking-widest uppercase border-b border-dorado-campeon pb-1.5 inline-block">
            Horarios dojang
          </h4>
          <table class="w-full text-xs text-tatami-blanco/80 border-collapse">
            <tbody>
              <tr class="border-b border-white/5 py-1.5 flex justify-between">
                <td class="font-semibold text-gray-400">Lunes - Viernes:</td>
                <td class="text-dorado-campeon font-bold">06:00 - 21:30</td>
              </tr>
              <tr class="border-b border-white/5 py-1.5 flex justify-between">
                <td class="font-semibold text-gray-400">Sábados:</td>
                <td class="text-dorado-campeon font-bold">08:00 - 14:00</td>
              </tr>
              <tr class="py-1.5 flex justify-between">
                <td class="font-semibold text-gray-400">Domingos:</td>
                <td class="text-rojo-impacto font-bold">Entrenamiento Élite</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Links */}
        <div class="space-y-4">
          <h4 class="font-display font-bold text-tatami-blanco text-base tracking-widest uppercase border-b border-dorado-campeon pb-1.5 inline-block">
            Navegación
          </h4>
          <ul class="space-y-1 text-xs font-semibold">
            <li><Link to="/" class="block py-1.5 hover:text-dorado-campeon transition-colors">➔ INICIO</Link></li>
            <li><Link to="/quienes-somos" class="block py-1.5 hover:text-dorado-campeon transition-colors">➔ QUIÉNES SOMOS</Link></li>
            <li><Link to="/alumnos-destacados" class="block py-1.5 hover:text-dorado-campeon transition-colors">➔ ALUMNOS DESTACADOS</Link></li>
            <li><Link to="/contenido" class="block py-1.5 hover:text-dorado-campeon transition-colors">➔ CONTENIDO & BLOG</Link></li>
            <li><Link to="/contactos" class="block py-1.5 hover:text-dorado-campeon transition-colors">➔ CONTACTOS</Link></li>
            <li><Link to="/admin/login" class="block py-1.5 hover:text-dorado-campeon transition-colors">➔ ÁREA TÉCNICA</Link></li>
          </ul>
        </div>

        {/* Location Contact */}
        <div class="space-y-4">
          <h4 class="font-display font-bold text-tatami-blanco text-base tracking-widest uppercase border-b border-dorado-campeon pb-1.5 inline-block">
            Sede Central
          </h4>
          <ul class="space-y-3 text-xs text-tatami-blanco/80">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-dorado-campeon flex-shrink-0 mt-0.5" />
              <span>Santo Domingo, Ecuador (Sector Bombolí)</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-dorado-campeon flex-shrink-0" />
              <span>+593 98 324 4247</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-dorado-campeon flex-shrink-0" />
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
