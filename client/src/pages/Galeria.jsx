import React from 'react';
import { Camera } from 'lucide-react';

const Galeria = () => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80', title: 'Entrenamiento de Pateo Alto' },
    { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', title: 'Sparring y Combate Kickboxing' },
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', title: 'Atleta Destacada en Podio' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', title: 'Seminario Técnico de Cinturones Negros' },
    { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', title: 'Examen de Grado KUP' },
    { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', title: 'Acondicionamiento Físico de Combate' },
  ];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div class="text-center space-y-3 max-w-3xl mx-auto">


        <h1 class="text-4xl font-extrabold text-[#0B1550] font-heading">
          GALERÍA DE MOMENTOS MARCIALES
        </h1>
        <p class="text-sm text-[#111114]/80">
          Imágenes destacadas de nuestras clases, seminarios internacionales, pesajes y finales de campeonato.
        </p>
      </div>

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

    </div>
  );
};

export default Galeria;
