import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, User, Send, CheckCircle2 } from 'lucide-react';

const Contactos = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    asunto: '',
    mensaje: '',
  });
  const [shouldPulse, setShouldPulse] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const scrollTarget = (location.state && location.state.scrollTarget) || 
                         (location.search.includes('scroll=true') ? 'contact-cards-section' : null);
    if (scrollTarget) {
      const targetElement = document.getElementById(scrollTarget);
      if (targetElement) {
        setShouldPulse(true);
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);

        const timer = setTimeout(() => {
          setShouldPulse(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  const contacts = [
    {
      nombre: 'Mtro. Bryan Nájera',
      cargo: 'Director General & Head Coach',
      ciudad: 'Santo Domingo, Ecuador (Sector Bombolí)',
      telefono: '+593 98 324 4247',
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generar mensaje personalizado de WhatsApp sin emojis
    const message = `*Nueva Consulta - Najera's Team Central*\n\n` +
      `- *Nombre:* ${formData.nombre}\n` +
      `- *Asunto:* ${formData.asunto}\n\n` +
      `*Mensaje:* ${formData.mensaje}`;
      
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/593983244247?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header Ledger */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-block border border-dorado-campeon/30 px-4 py-1.5 bg-dorado-campeon/5">
          <span className="text-xs font-body font-bold text-dorado-campeon tracking-[0.2em] uppercase">
            COMUNICACIÓN DIRECTA • SEDE CENTRAL
          </span>
        </div>
        <h1 className="text-5xl font-heading text-tatami-blanco uppercase tracking-tight">
          CONTACTOS & <span className="text-dorado-campeon">ADMISIONES</span>
        </h1>
        <p className="text-sm font-body text-tatami-blanco/70 uppercase tracking-widest max-w-xl mx-auto">
          Atención directa con la dirección técnica de Najera's Team Central.
        </p>
      </div>

      {/* Tarjeta de Responsable */}
      <div id="contact-cards-section" className="flex justify-center w-full scroll-mt-24">
        {contacts.map((c, idx) => (
          <div
            key={idx}
            className={`w-full max-w-lg bg-[#0A0B0E] border p-8 space-y-6 transition-all duration-300 transform relative ${
              shouldPulse 
                ? 'border-dorado-campeon shadow-[0_0_40px_rgba(227,178,60,0.3)] animate-pulse' 
                : 'border-white/10 shadow-[0_0_20px_rgba(227,178,60,0.05)] hover:border-dorado-campeon/30'
            }`}
          >
            {/* Minimalist Top Edge */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-dorado-campeon/50"></div>

            <div className="text-dorado-campeon flex items-center justify-center w-16 h-16 bg-carbon border border-dorado-campeon/20 rounded-none mx-auto">
              <User size={32} />
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-heading text-tatami-blanco tracking-widest uppercase mb-1">{c.nombre}</h3>
              <p className="text-[10px] text-dorado-campeon font-body font-bold uppercase tracking-[0.2em]">{c.cargo}</p>
            </div>
            
            <div className="space-y-3 text-xs text-tatami-blanco/80 border-t border-white/5 pt-6 font-body uppercase tracking-widest">
              <div className="flex items-center gap-4 bg-carbon p-3 border border-white/5">
                <MapPin size={16} className="text-dorado-campeon flex-shrink-0" />
                <span className="leading-tight">{c.ciudad}</span>
              </div>
              <div className="flex items-center gap-4 bg-carbon p-3 border border-white/5">
                <Phone size={16} className="text-dorado-campeon flex-shrink-0" />
                <span className="font-bold tabular-nums">{c.telefono}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario + Mapa Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
        
        {/* Formulario */}
        <div className="lg:col-span-6 bg-[#0A0B0E] border border-white/5 p-8 sm:p-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div className="border-b border-dorado-campeon/30 pb-4 mb-8">
            <h3 className="text-3xl font-heading text-tatami-blanco tracking-widest uppercase">Mensaje Directo</h3>
            <p className="text-[10px] text-dorado-campeon/80 font-body uppercase tracking-[0.2em] mt-2">Atención pedagógica y técnica.</p>
          </div>

          {submitted ? (
            <div className="bg-[#0A0B0E] border border-emerald-500/30 p-8 text-center space-y-6 flex-grow flex flex-col justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h4 className="text-xl font-heading text-tatami-blanco uppercase tracking-widest">¡Envío Exitoso!</h4>
              <p className="text-xs font-body text-tatami-blanco/60 uppercase tracking-widest">Un responsable se comunicará contigo pronto.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-3 bg-transparent border border-rojo-impacto text-rojo-impacto text-xs font-bold font-heading uppercase tracking-widest hover:bg-rojo-impacto hover:text-tatami-blanco transition-all"
              >
                ENVIAR OTRO MENSAJE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
              <div className="space-y-6 flex-grow">
                <div>
                  <label className="block text-[10px] font-bold text-tatami-blanco/70 font-body uppercase tracking-widest mb-2">
                    NOMBRE Y APELLIDO
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-carbon border border-white/10 px-4 py-3 text-sm text-tatami-blanco focus:outline-none focus:border-dorado-campeon transition-colors font-body uppercase tracking-wider placeholder-tatami-blanco/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-tatami-blanco/70 font-body uppercase tracking-widest mb-2">
                    ASUNTO PRINCIPAL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Inscripción / Informes"
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    className="w-full bg-carbon border border-white/10 px-4 py-3 text-sm text-tatami-blanco focus:outline-none focus:border-dorado-campeon transition-colors font-body uppercase tracking-wider placeholder-tatami-blanco/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-tatami-blanco/70 font-body uppercase tracking-widest mb-2">
                    TU CONSULTA
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full bg-carbon border border-white/10 px-4 py-3 text-sm text-tatami-blanco focus:outline-none focus:border-dorado-campeon transition-colors font-body tracking-wider placeholder-tatami-blanco/20 resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-rojo-impacto text-tatami-blanco font-heading text-sm tracking-widest uppercase hover:bg-white hover:text-rojo-impacto transition-colors flex items-center justify-center gap-3 mt-4"
              >
                <Send size={16} />
                ENVIAR VÍA WHATSAPP
              </button>
            </form>
          )}
        </div>

        {/* Mapa Embebido */}
        <div className="lg:col-span-6 bg-[#0A0B0E] border border-white/5 p-8 sm:p-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-6">
          <div className="border-b border-dorado-campeon/30 pb-4 flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-heading text-tatami-blanco tracking-widest uppercase">UBICACIÓN</h3>
              <p className="text-[10px] text-dorado-campeon/80 font-body uppercase tracking-[0.2em] mt-2">Dojang Central Santo Domingo.</p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=-0.249442,-79.187382"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-heading font-bold text-rojo-impacto hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest border border-rojo-impacto/50 px-3 py-1.5"
            >
              ABRIR MAPA ↗
            </a>
          </div>
          
          <div className="bg-carbon p-4 border border-white/5 text-[10px] font-body text-tatami-blanco/60 uppercase tracking-widest leading-relaxed">
            Sector Bombolí, Santo Domingo, Ecuador <br/>
            Plus Code: QR27+62H • Coord: 0°14'58.0"S 79°11'14.6"W
          </div>

          <div className="flex-grow min-h-[300px] border border-white/10 bg-carbon overflow-hidden relative group">
            <div className="absolute inset-0 bg-dorado-campeon/5 pointer-events-none group-hover:bg-transparent transition-colors z-10"></div>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-79.192382%2C-0.254442%2C-79.182382%2C-0.244442&amp;layer=mapnik&amp;marker=-0.249442%2C-79.187382"
              className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80"
              title="Mapa Ubicación Najeras Team Santo Domingo"
            ></iframe>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Contactos;
