import React from 'react';
import { ImageOff } from 'lucide-react';

const Galeria = () => {
  // Sin fotos reales todavía — se añadirán desde el panel admin
  const images = [];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <h1 class="text-4xl font-extrabold text-white font-heading">
          GALERÍA DE MOMENTOS MARCIALES
        </h1>
        <p class="text-sm text-gray-300">
          Imágenes destacadas de nuestras clases, seminarios internacionales, pesajes y finales de campeonato.
        </p>
      </div>

      {images.length === 0 ? (
        <div class="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div class="w-20 h-20 rounded-2xl bg-[#0B1550]/10 border border-[#C9A227]/30 flex items-center justify-center">
            <ImageOff size={36} class="text-[#C9A227]/60" />
          </div>
          <div class="space-y-1">
            <p class="font-heading font-bold text-white text-lg tracking-widest uppercase">
              Galería en construcción
            </p>
            <p class="text-sm text-gray-400 max-w-xs">
              Pronto encontrarás aquí fotos de nuestros entrenamientos, competencias y graduaciones.
            </p>
          </div>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div key={idx} class="group relative rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-xl bg-slate-950 aspect-video">
              <img src={img.url} alt={img.title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-sm font-bold text-white font-heading">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Galeria;
