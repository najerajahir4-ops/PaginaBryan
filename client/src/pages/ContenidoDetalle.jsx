import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Calendar, ArrowLeft } from 'lucide-react';
import ContentCard from '../components/ContentCard';

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
      <div className="min-h-[60vh] flex items-center justify-center bg-carbon">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-dorado-campeon"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-6">
        <h2 className="text-3xl font-heading text-tatami-blanco uppercase tracking-widest">REGISTRO NO ENCONTRADO</h2>
        <div className="w-16 h-[1px] bg-dorado-campeon/50 mx-auto"></div>
        <Link 
          to="/contenido" 
          className="inline-flex items-center gap-2 text-dorado-campeon font-heading uppercase text-sm tracking-widest hover:text-tatami-blanco transition-colors"
        >
          <ArrowLeft size={16} /> VOLVER A LA BIBLIOTECA
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <Link 
        to="/contenido" 
        className="inline-flex items-center gap-2 px-4 py-2 bg-carbon border border-white/5 hover:border-dorado-campeon text-xs font-heading text-tatami-blanco/60 hover:text-dorado-campeon uppercase tracking-widest transition-all"
      >
        <ArrowLeft size={14} />
        VOLVER A LA BIBLIOTECA
      </Link>

      {/* Header Info */}
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="px-4 py-1.5 border border-rojo-impacto/50 text-[10px] font-heading font-extrabold uppercase bg-rojo-impacto/10 text-rojo-impacto tracking-widest">
            {content.categoria}
          </span>
          <span className="text-[10px] font-body font-bold uppercase tracking-widest text-tatami-blanco/40 flex items-center gap-2">
            <Calendar size={12} className="text-dorado-campeon" />
            PUBLICADO: {content.fechaPublicacion}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading text-tatami-blanco leading-none tracking-tight uppercase">
          {content.titulo}
        </h1>

        <div className="w-24 h-[2px] bg-dorado-campeon/50 mx-auto"></div>

        <p className="text-sm sm:text-base font-body text-dorado-campeon/80 max-w-2xl mx-auto italic leading-relaxed px-4">
          "{content.resumen}"
        </p>
      </div>

      {/* Featured Cover Image */}
      {content.imagenUrl && (
        <div className="flex justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(227,178,60,0.15)_0%,_transparent_70%)] pointer-events-none"></div>
          <img 
            src={content.imagenUrl} 
            alt={content.titulo} 
            className="w-full max-w-4xl h-auto border border-white/10 shadow-[0_0_30px_rgba(227,178,60,0.1)] relative z-10" 
          />
        </div>
      )}

      {/* Embedded Video (If present) */}
      {content.videoUrl && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <h3 className="text-xl font-heading text-tatami-blanco tracking-widest uppercase border-l-4 border-dorado-campeon pl-3">
            MATERIAL AUDIOVISUAL
          </h3>
          <div className="aspect-video overflow-hidden border border-dorado-campeon/30 shadow-[0_0_20px_rgba(227,178,60,0.15)] bg-black">
            <iframe
              src={content.videoUrl}
              title={content.titulo}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Article Body using ContentCard */}
      <div className="max-w-4xl mx-auto bg-[#0A0B0E] border border-white/5 p-6 sm:p-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <ContentCard rawText={content.cuerpo} />
      </div>

    </div>
  );
};

export default ContenidoDetalle;
