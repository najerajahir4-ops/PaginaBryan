import React, { useState, useEffect } from 'react';
import { ImageOff, Loader } from 'lucide-react';
import API from '../services/api';

const Galeria = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await API.get('/students/gallery/all');
        setImages(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <h1 class="text-4xl font-extrabold text-white font-heading uppercase tracking-tight">
          GALERÍA DE MOMENTOS MARCIALES
        </h1>
        <p class="text-sm text-gray-300">
          Imágenes destacadas de nuestras clases, seminarios internacionales, pesajes, exámenes y finales de campeonato de todos nuestros estudiantes.
        </p>
      </div>

      {loading ? (
        <div class="flex justify-center items-center py-32">
          <Loader class="animate-spin text-[#C9A227]" size={50} />
        </div>
      ) : images.length === 0 ? (
        <div class="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div class="w-20 h-20 rounded-2xl bg-[#0B1550]/10 border border-[#C9A227]/30 flex items-center justify-center">
            <ImageOff size={36} class="text-[#C9A227]/60" />
          </div>
          <div class="space-y-1">
            <p class="font-heading font-bold text-white text-lg tracking-widest uppercase">
              Galería en construcción
            </p>
            <p class="text-sm text-gray-400 max-w-xs">
              Aún no hay fotos en los perfiles de los estudiantes. Las fotos subidas a sus galerías de progreso aparecerán automáticamente aquí.
            </p>
          </div>
        </div>
      ) : (
        <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-20">
          {images.map((img) => (
            <div key={img.id} class="break-inside-avoid group relative rounded-2xl overflow-hidden border border-[#C9A227]/20 shadow-xl bg-carbon">
              <img src={img.url} alt={img.descripcion || 'Momento marcial'} class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
              
              <div class="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                {img.descripcion && (
                  <h3 class="text-white font-black text-sm uppercase tracking-wide leading-tight drop-shadow-md mb-1">{img.descripcion}</h3>
                )}
                <div class="flex items-center justify-between mt-2 border-t border-white/20 pt-2">
                  <div>
                    <p class="text-dorado-campeon font-bold text-[10px] tracking-widest uppercase">{img.student?.nombres} {img.student?.apellidos}</p>
                    <p class="text-gray-300 text-[9px] uppercase tracking-wider">{img.student?.grado?.split(' / ')[0]}</p>
                  </div>
                  <span class="text-[9px] text-gray-400 font-mono bg-black/40 px-2 py-1 rounded-sm">
                    {new Date(img.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Galeria;
