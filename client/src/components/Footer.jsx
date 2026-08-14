import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-carbon text-tatami-blanco pt-12 pb-8 border-t border-dorado-campeon/20 relative overflow-hidden">
      
      {/* Background glow for footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-dorado-campeon/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-none border border-dorado-campeon/30 p-1 bg-[#0A0B0E] transition-all duration-300 group-hover:border-dorado-campeon group-hover:shadow-[0_0_15px_rgba(227,178,60,0.2)]">
              <img src="/logo.png" alt="Najera's Team Logo" className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-heading text-2xl text-tatami-blanco tracking-widest leading-none mt-1 group-hover:text-dorado-campeon transition-colors">
                NAJERA'S <span className="text-dorado-campeon">TEAM</span>
              </span>
              <span className="font-body text-[10px] text-dorado-campeon/60 font-bold uppercase tracking-[0.2em] leading-tight">
                Formando Campeones
              </span>
            </div>
          </div>
          <p className="font-body text-sm leading-relaxed text-tatami-blanco/60">
            Registro Oficial y Formativo Especializado. Formación integral en Taekwondo Olímpico y Kickboxing de alto rendimiento con estricta disciplina marcial.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-10 h-10 bg-[#0A0B0E] border border-dorado-campeon/20 flex items-center justify-center text-tatami-blanco/60 hover:border-dorado-campeon hover:text-dorado-campeon transition-all hover:shadow-[0_0_15px_rgba(227,178,60,0.15)]">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#0A0B0E] border border-dorado-campeon/20 flex items-center justify-center text-tatami-blanco/60 hover:border-dorado-campeon hover:text-dorado-campeon transition-all hover:shadow-[0_0_15px_rgba(227,178,60,0.15)]">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-6">
          <h4 className="font-heading text-tatami-blanco text-xl tracking-widest uppercase">
            HORARIOS DOJANG
          </h4>
          <div className="h-[2px] w-12 bg-dorado-campeon/50"></div>
          
          <table className="w-full text-sm font-body border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 font-semibold text-tatami-blanco/50 uppercase tracking-wider text-xs">LUNES - VIERNES</td>
                <td className="py-3 text-dorado-campeon font-bold tabular-nums text-right">06:00 - 21:30</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 font-semibold text-tatami-blanco/50 uppercase tracking-wider text-xs">SÁBADOS</td>
                <td className="py-3 text-dorado-campeon font-bold tabular-nums text-right">08:00 - 14:00</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-tatami-blanco/50 uppercase tracking-wider text-xs">DOMINGOS</td>
                <td className="py-3 text-rojo-impacto font-bold uppercase tracking-wider text-xs text-right">ÉLITE</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="font-heading text-tatami-blanco text-xl tracking-widest uppercase">
            REGISTRO
          </h4>
          <div className="h-[2px] w-12 bg-dorado-campeon/50"></div>
          
          <ul className="space-y-3 font-body text-sm font-bold uppercase tracking-widest">
            <li><Link to="/" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/50">/</span> INICIO</Link></li>
            <li><Link to="/quienes-somos" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/50">/</span> MANIFIESTO</Link></li>
            <li><Link to="/alumnos-destacados" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/50">/</span> HONOR</Link></li>
            <li><Link to="/contactos" className="text-tatami-blanco/60 hover:text-dorado-campeon transition-colors flex items-center gap-2"><span className="text-dorado-campeon/50">/</span> CONTACTO</Link></li>
            <li><Link to="/admin/login" className="text-dorado-campeon/60 hover:text-dorado-campeon transition-colors flex items-center gap-2 mt-4"><span className="text-dorado-campeon/50">/</span> ÁREA TÉCNICA</Link></li>
          </ul>
        </div>

        {/* Location Contact */}
        <div className="space-y-6">
          <h4 className="font-heading text-tatami-blanco text-xl tracking-widest uppercase">
            SEDE CENTRAL
          </h4>
          <div className="h-[2px] w-12 bg-dorado-campeon/50"></div>
          
          <ul className="space-y-4 font-body text-sm text-tatami-blanco/70">
            <li className="flex items-start gap-3 p-3 bg-[#0A0B0E] border border-white/5">
              <MapPin className="w-5 h-5 text-dorado-campeon flex-shrink-0" />
              <span className="leading-tight">Santo Domingo, Ecuador<br/><span className="text-xs text-tatami-blanco/40 uppercase tracking-widest">Sector Bombolí</span></span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-[#0A0B0E] border border-white/5">
              <Phone className="w-5 h-5 text-dorado-campeon flex-shrink-0" />
              <span className="font-bold tracking-wider tabular-nums">+593 98 324 4247</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-[#0A0B0E] border border-white/5">
              <Mail className="w-5 h-5 text-dorado-campeon flex-shrink-0" />
              <span className="text-xs tracking-wider">contacto@najeras-team.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-dorado-campeon/10 flex flex-col md:flex-row items-center justify-between gap-4 font-body text-xs text-tatami-blanco/40 uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} NAJERA'S TEAM CENTRAL.</p>
        <p>SISTEMA DE GESTIÓN MARCIAL</p>
      </div>
    </footer>
  );
};

export default Footer;
