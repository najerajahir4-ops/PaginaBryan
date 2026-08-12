import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';

const ContenidoDetalle = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/content/${id}`);
      setContent(res.data);
    } catch (err) {
      console.error('Error al cargar detalle:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rojo-impacto"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div class="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 class="text-2xl font-bold text-white">Publicación no encontrada</h2>
        <Link to="/contenido" class="inline-flex items-center gap-2 text-rojo-impacto hover:underline">
          <ArrowLeft size={16} /> Volver a contenidos
        </Link>
      </div>
    );
  }

  return (
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link to="/contenido" class="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-rojo-impacto transition-colors">
        <ArrowLeft size={16} />
        VOLVER A CONTENIDOS
      </Link>

      {/* Header Info */}
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-rojo-impacto text-white">
            {content.categoria}
          </span>
          <span class="text-xs text-carbon/60 flex items-center gap-1">
            <Calendar size={14} />
            {content.fechaPublicacion}
          </span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-extrabold text-white font-heading leading-tight">
          {content.titulo}
        </h1>

        <p class="text-base text-dorado-campeon/70 font-medium italic border-l-4 border-dorado-campeon pl-4 py-1">
          {content.resumen}
        </p>
      </div>

      {/* Featured Cover Image */}
      {content.imagenUrl && (
        <div class="flex justify-center">
          <img 
            src={content.imagenUrl} 
            alt={content.titulo} 
            class="w-full max-w-3xl h-auto rounded-2xl shadow-2xl border border-dorado-campeon/20" 
          />
        </div>
      )}

      {/* Embedded Video (If present) */}
      {content.videoUrl && (
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-white font-heading">Video Explicativo:</h3>
          <div class="aspect-video rounded-2xl overflow-hidden border border-dorado-campeon/20 shadow-xl bg-black">
            <iframe
              src={content.videoUrl}
              title={content.titulo}
              class="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Article Body */}
      <div class="prose prose-invert max-w-none text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 bg-carbon border border-dorado-campeon/20 p-6 sm:p-10 rounded-2xl">
        {content.cuerpo.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

    </div>
  );
};

export default ContenidoDetalle;
