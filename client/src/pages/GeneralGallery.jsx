import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, ImageOff, ArrowLeft, Calendar } from 'lucide-react';
import API from '../services/api';

const GeneralGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await API.get('/general-photos');
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching general photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div class="flex justify-center items-center py-32 min-h-screen">
        <Loader class="animate-spin text-[#C9A227]" size={50} />
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Header Profile */}
      <div class="relative bg-[#111114] border border-white/10 rounded-2xl p-6 md:p-10 overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-dorado-campeon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div class="text-center md:text-left flex-1">
            <Link to="/galeria" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} /> Volver a perfiles
            </Link>
            
            <h1 class="text-3xl md:text-5xl font-body font-bold text-white uppercase leading-none mb-2">
              FOTOS <span class="text-dorado-campeon">GENERALES</span>
            </h1>
            <p class="text-gray-300">Álbum del Dojang, seminarios, torneos y momentos especiales de todo el equipo.</p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div class="space-y-6 pt-4">
        <h2 class="text-2xl font-bold text-white uppercase flex items-center gap-2">
          Álbum Público <span class="text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">{photos.length} fotos</span>
        </h2>
        
        {photos.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-20 bg-[#111114]/50 border border-white/5 rounded-2xl text-center">
            <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <ImageOff size={28} class="text-gray-500" />
            </div>
            <h3 class="text-white font-bold mb-1">Sin fotos todavía</h3>
            <p class="text-sm text-gray-400 max-w-md">
              El álbum general aún no tiene fotos publicadas.
            </p>
          </div>
        ) : (
          <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-20">
            {photos.map((img) => (
              <div key={img.id} class="break-inside-avoid group relative rounded-2xl overflow-hidden border border-[#C9A227]/10 shadow-xl bg-carbon">
                <img src={img.url} alt={img.descripcion || 'Foto del evento'} class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                
                <div class="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  {img.descripcion && (
                    <h3 class="text-white font-bold text-sm leading-tight drop-shadow-md mb-2">{img.descripcion}</h3>
                  )}
                  <div class="flex items-center text-[10px] text-gray-300 gap-1.5 font-mono">
                    <Calendar size={12} class="text-dorado-campeon" />
                    {new Date(img.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default GeneralGallery;
