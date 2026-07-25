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
    
    // Generar mensaje personalizado de WhatsApp sin emojis para evitar problemas de compatibilidad
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Asymmetric Header */}
      <div class="border-l-8 border-dorado-campeon pl-6 space-y-2">
        <div class="text-sm font-display font-bold text-dorado-campeon tracking-widest uppercase">
          [ COMUNICACIÓN DIRECTA • SEDE CENTRAL ]
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-tatami-blanco font-display tracking-wider uppercase">
          CONTACTOS & ADMISIONES
        </h1>
        <p class="text-sm text-tatami-blanco/80 max-w-2xl font-body">
          Atención directa con la dirección técnica de Najera's Team Central para información de entrenamientos, torneos o seminarios.
        </p>
      </div>

      {/* Tarjeta de Responsable */}
      <div id="contact-cards-section" class="flex justify-center w-full scroll-mt-20">
        {contacts.map((c, idx) => (
          <div
            key={idx}
            class={`w-full max-w-md bg-black/40 border-2 p-6 space-y-4 shadow-xl hover:border-dorado-campeon hover:-translate-y-1 transition-all duration-300 transform ${
              shouldPulse ? 'animate-glow-pulse-gold border-dorado-campeon' : 'border-dorado-campeon/30'
            }`}
          >
            <div class="text-dorado-campeon flex items-center">
              <User size={32} />
            </div>
            <div>
              <h3 class="text-xl font-bold text-tatami-blanco font-display tracking-wider uppercase">{c.nombre}</h3>
              <p class="text-xs text-dorado-campeon font-body font-bold mt-0.5 uppercase">{c.cargo}</p>
            </div>
            <div class="space-y-1.5 text-xs text-tatami-blanco/80 border-t border-white/10 pt-3 font-body">
              <div class="flex items-center gap-2">
                <MapPin size={14} class="text-dorado-campeon flex-shrink-0" />
                <span>{c.ciudad}</span>
              </div>
              <div class="flex items-center gap-2">
                <Phone size={14} class="text-dorado-campeon flex-shrink-0" />
                <span>{c.telefono}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario + Mapa Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Formulario */}
        <div class="lg:col-span-6 bg-black/40 border-2 border-dorado-campeon/40 p-8 shadow-2xl space-y-6">
          <div class="border-b border-dorado-campeon/30 pb-3">
            <h3 class="text-3xl font-bold text-tatami-blanco font-display tracking-wider uppercase">Envíanos un Mensaje</h3>
            <p class="text-sm text-tatami-blanco/60 font-body mt-1">Atención pedagógica y técnica especializada.</p>
          </div>

          {submitted ? (
            <div class="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-sm text-center space-y-3">
              <CheckCircle2 class="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 class="text-lg font-bold text-white font-display uppercase tracking-widest">¡Mensaje Enviado con Éxito!</h4>
              <p class="text-sm font-body text-gray-300">Un responsable de Najera's Team se comunicará contigo a la brevedad.</p>
              <button
                onClick={() => setSubmitted(false)}
                class="px-4 py-2 bg-rojo-impacto text-white text-xs font-bold font-display uppercase tracking-widest clip-button impact-flash"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-tatami-blanco/70 font-display uppercase tracking-widest mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  class="w-full bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dorado-campeon transition-colors"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-tatami-blanco/70 font-display uppercase tracking-widest mb-1">Título / Asunto</label>
                <input
                  type="text"
                  required
                  placeholder="Inscripción a torneo / Informes de clase"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  class="w-full bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dorado-campeon transition-colors"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-tatami-blanco/70 font-display uppercase tracking-widest mb-1">Mensaje</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Escribe aquí tu consulta..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  class="w-full bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-dorado-campeon transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full py-3.5 bg-rojo-impacto text-tatami-blanco font-display text-sm font-bold tracking-widest uppercase clip-button hover:bg-white hover:text-rojo-impacto transition-colors impact-flash flex items-center justify-center gap-2"
              >
                <Send size={15} />
                ENVIAR MENSAJE
              </button>
            </form>
          )}
        </div>

        {/* Mapa Embebido */}
        <div class="lg:col-span-6 space-y-4">
          <div class="flex items-center justify-between border-l-8 border-dorado-campeon pl-3">
            <h3 class="text-3xl font-bold text-tatami-blanco font-display tracking-wider uppercase">Ubicación</h3>
            <a
              href="https://www.google.com/maps/search/?api=1&query=-0.249442,-79.187382"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs font-bold text-rojo-impacto hover:underline flex items-center gap-1 font-display uppercase tracking-widest"
            >
              Abrir Mapa ↗
            </a>
          </div>
          <p class="text-sm font-body text-carbon/70">
            Sector Bombolí, Santo Domingo, Ecuador (Plus Code: QR27+62H • Coordenadas: 0°14'58.0"S 79°11'14.6"W)
          </p>
          <div class="clip-card overflow-hidden border-2 border-carbon shadow-xl h-[380px] bg-carbon/5">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-79.192382%2C-0.254442%2C-79.182382%2C-0.244442&amp;layer=mapnik&amp;marker=-0.249442%2C-79.187382"
              class="w-full h-full border-0 grayscale opacity-80 mix-blend-multiply"
              title="Mapa Ubicación Najeras Team Santo Domingo"
            ></iframe>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Contactos;
