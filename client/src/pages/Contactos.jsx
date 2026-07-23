import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, Send, CheckCircle2 } from 'lucide-react';

const Contactos = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });

  const contacts = [
    {
      nombre: 'Mtro. Bryan Nájera',
      cargo: 'Director General & Head Coach',
      ciudad: 'Ciudad de México, MX',
      telefono: '+52 (55) 1234-5678',
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generar mensaje personalizado de WhatsApp sin emojis para evitar problemas de compatibilidad
    const message = `*Nueva Consulta - Najera's Team Central*\n\n` +
      `- *Nombre:* ${formData.nombre}\n` +
      `- *Email:* ${formData.email}\n` +
      `- *Teléfono:* ${formData.telefono}\n` +
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
      <div class="border-l-4 border-[#C9A227] pl-6 space-y-2">
        <div class="text-xs font-heading font-bold text-[#C9A227] tracking-widest uppercase">
          [ COMUNICACIÓN DIRECTA • SEDE CENTRAL ]
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-[#0B1550] font-heading tracking-wider">
          CONTACTOS & ADMISIONES
        </h1>
        <p class="text-xs sm:text-sm text-[#111114]/80 max-w-2xl">
          Atención directa con la dirección técnica de Najera's Team Central para información de entrenamientos, torneos o seminarios.
        </p>
      </div>

      {/* Tarjeta de Responsable */}
      <div class="flex justify-center w-full">
        {contacts.map((c, idx) => (
          <div key={idx} class="w-full max-w-md bg-[#111114] border border-[#C9A227]/30 p-6 rounded-sm space-y-4 shadow-xl">
            <div class="w-10 h-10 rounded-sm bg-[#0B1550] border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#F5F2E9] font-heading tracking-wider">{c.nombre}</h3>
              <p class="text-xs text-[#C9A227] font-semibold mt-0.5">{c.cargo}</p>
            </div>
            <div class="space-y-1.5 text-xs text-[#F5F2E9]/80 border-t border-white/10 pt-3">
              <div class="flex items-center gap-2">
                <MapPin size={14} class="text-[#C9A227] flex-shrink-0" />
                <span>{c.ciudad}</span>
              </div>
              <div class="flex items-center gap-2">
                <Phone size={14} class="text-[#C9A227] flex-shrink-0" />
                <span>{c.telefono}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario + Mapa Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Formulario */}
        <div class="lg:col-span-6 bg-[#111114] border-2 border-[#C9A227]/40 p-8 rounded-sm shadow-2xl space-y-6">
          <div class="border-b border-[#C9A227]/30 pb-3">
            <h3 class="text-2xl font-bold text-[#F5F2E9] font-heading tracking-wider">Envíanos un Mensaje</h3>
            <p class="text-xs text-gray-400 mt-1">Atención pedagógica y técnica especializada.</p>
          </div>

          {submitted ? (
            <div class="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-sm text-center space-y-3">
              <CheckCircle2 class="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 class="text-lg font-bold text-white font-heading">¡Mensaje Enviado con Éxito!</h4>
              <p class="text-xs text-gray-300">Un responsable de Najera's Team se comunicará contigo a la brevedad.</p>
              <button
                onClick={() => setSubmitted(false)}
                class="px-4 py-2 bg-[#8C1D1D] text-white text-xs font-bold font-heading uppercase tracking-widest rounded-sm"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  class="w-full bg-[#0B1550] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    class="w-full bg-[#0B1550] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Teléfono</label>
                  <input
                    type="tel"
                    required
                    placeholder="5512345678"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    class="w-full bg-[#0B1550] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Título / Asunto</label>
                <input
                  type="text"
                  required
                  placeholder="Inscripción a torneo / Informes de clase"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  class="w-full bg-[#0B1550] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Mensaje</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Escribe aquí tu consulta..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  class="w-full bg-[#0B1550] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full py-3.5 bg-[#8C1D1D] hover:bg-[#6B1414] text-[#F5F2E9] font-heading text-xs font-bold tracking-widest uppercase rounded-sm transition-colors shadow flex items-center justify-center gap-2"
              >
                <Send size={15} />
                ENVIAR MENSAJE
              </button>
            </form>
          )}
        </div>

        {/* Mapa Embebido */}
        <div class="lg:col-span-6 space-y-4">
          <h3 class="text-2xl font-bold text-[#0B1550] font-heading tracking-wider border-l-4 border-[#C9A227] pl-3">Ubicación Central del Dojang</h3>
          <div class="rounded-sm overflow-hidden border border-[#C9A227]/40 shadow-2xl h-[420px] bg-black">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-99.18%2C19.38%2C-99.12%2C19.44&amp;layer=mapnik"
              class="w-full h-full border-0 filter grayscale invert contrast-125"
              title="Mapa Ubicación Najeras Team"
            ></iframe>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Contactos;
