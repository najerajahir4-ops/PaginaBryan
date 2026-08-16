import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-carbon text-tatami-blanco pt-12 pb-8 border-t border-dorado-campeon/10 relative overflow-hidden">
      
      {/* Background glow for footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-dorado-campeon/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl border border-dorado-campeon/20 p-1.5 bg-[#0A0B0E] transition-all duration-300 group-hover:border-dorado-campeon group-hover:shadow-lg group-hover:shadow-dorado-campeon/20 group-hover:-translate-y-1">
              <img src="/logo.png" alt="Najera's Team Logo" className="w-full h-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-heading text-2xl text-tatami-blanco tracking-tight leading-none mt-1 group-hover:text-dorado-campeon transition-colors">
                Najera's <span className="text-dorado-campeon">Team</span>
              </span>
              <span className="font-body text-[10px] text-dorado-campeon/70 font-medium uppercase tracking-wider leading-tight">
                Formando Campeones
              </span>
            </div>
          </div>
          <p className="font-body text-sm leading-relaxed text-tatami-blanco/60">
            Registro Oficial y Formativo Especializado. Formación integral en Taekwondo Olímpico y Kickboxing de alto rendimiento con estricta disciplina marcial.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-10 h-10 bg-[#0A0B0E] border border-white/5 rounded-full flex items-center justify-center text-tatami-blanco/60 hover:border-dorado-campeon/50 hover:text-dorado-campeon hover:-translate-y-1 transition-all duration-300 hover:shadow-md hover:shadow-dorado-campeon/10">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#0A0B0E] border border-white/5 rounded-full flex items-center justify-center text-tatami-blanco/60 hover:border-dorado-campeon/50 hover:text-dorado-campeon hover:-translate-y-1 transition-all duration-300 hover:shadow-md hover:shadow-dorado-campeon/10">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-6">
          <h4 className="font-heading text-tatami-blanco/90 text-lg tracking-wide">
            Horarios Dojang
          </h4>
          <div className="h-[2px] w-12 bg-dorado-campeon/40 rounded-full"></div>
          
          <table className="w-full text-sm font-body border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 font-medium text-tatami-blanco/60 text-sm">Lunes - Viernes</td>
                <td className="py-3 text-dorado-campeon font-medium tabular-nums text-right">06:00 - 21:30</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 font-medium text-tatami-blanco/60 text-sm">Sábados</td>
                <td className="py-3 text-dorado-campeon font-medium tabular-nums text-right">08:00 - 14:00</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-tatami-blanco/60 text-sm">Domingos</td>
                <td className="py-3 text-rojo-impacto font-medium text-sm text-right">Élite</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="font-heading text-tatami-blanco/90 text-lg tracking-wide">
            Registro
          </h4>
          <div className="h-[2px] w-12 bg-dorado-campeon/40 rounded-full"></div>
          
          <ul className="space-y-3 font-body text-sm font-medium">
            <li><Link to="/" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/40">•</span> Inicio</Link></li>
            <li><Link to="/quienes-somos" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/40">•</span> Manifiesto</Link></li>
            <li><Link to="/alumnos-destacados" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/40">•</span> Cuadro de Honor</Link></li>
            <li><Link to="/contactos" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/40">•</span> Contacto</Link></li>
            <li><Link to="/admin/login" className="text-dorado-campeon/70 hover:text-dorado-campeon transition-colors flex items-center gap-2 mt-4"><span className="text-dorado-campeon/40">•</span> Área Técnica</Link></li>
          </ul>
        </div>

        {/* Location Contact */}
        <div className="space-y-6">
          <h4 className="font-heading text-tatami-blanco/90 text-lg tracking-wide">
            Sede Central
          </h4>
          <div className="h-[2px] w-12 bg-dorado-campeon/40 rounded-full"></div>
          
          <ul className="space-y-4 font-body text-sm text-tatami-blanco/70">
            <li className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04]">
              <MapPin className="w-5 h-5 text-dorado-campeon flex-shrink-0" />
              <span className="leading-tight text-tatami-blanco/80">Santo Domingo, Ecuador<br/><span className="text-xs text-tatami-blanco/50">Sector Bombolí</span></span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04]">
              <Phone className="w-5 h-5 text-dorado-campeon flex-shrink-0" />
              <span className="font-medium tracking-wide tabular-nums text-tatami-blanco/80">+593 98 324 4247</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04]">
              <Mail className="w-5 h-5 text-dorado-campeon flex-shrink-0" />
              <span className="text-sm tracking-wide text-tatami-blanco/80">contacto@najeras-team.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-body text-xs text-tatami-blanco/40">
        <p>&copy; {new Date().getFullYear()} Najera's Team Central.</p>
        <p>Sistema de Gestión Marcial</p>
      </div>
    </footer>
  );
};

export default Footer;
