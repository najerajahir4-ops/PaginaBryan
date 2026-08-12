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

  const renderParagraph = (text, index) => {
    const trimmed = text.trim();
    if (!trimmed) return <div key={index} className="h-4"></div>;

    const isNegativeBullet = trimmed.startsWith('❌') || trimmed.startsWith('🚫');
    const isPositiveBullet = trimmed.startsWith('✅') || trimmed.startsWith('✔️');
    const isWarningBullet = trimmed.startsWith('⚠️');

    // Extraer emoji/icono inicial si existe
    const iconMatch = trimmed.match(/^([^\w\s"'(¿¡A-Za-z0-9]+)\s*(.*)/);
    const hasIcon = iconMatch !== null;
    const icon = hasIcon ? iconMatch[1] : '';
    const restOfText = hasIcon ? iconMatch[2] : trimmed;

    if (isNegativeBullet) {
      return (
        <div key={index} className="flex items-start gap-3 py-2.5 px-4 bg-red-950/30 border-l-4 border-red-500 rounded-r-lg my-2 shadow-sm">
          <span className="text-red-400 mt-0.5">{icon}</span>
          <span className="text-red-100">{restOfText}</span>
        </div>
      );
    }
    
    if (isPositiveBullet) {
      return (
        <div key={index} className="flex items-start gap-3 py-2.5 px-4 bg-emerald-950/30 border-l-4 border-emerald-500 rounded-r-lg my-2 shadow-sm">
          <span className="text-emerald-400 mt-0.5">{icon}</span>
          <span className="text-emerald-100">{restOfText}</span>
        </div>
      );
    }

    if (isWarningBullet) {
      return (
        <div key={index} className="flex items-start gap-3 py-3 px-4 bg-amber-950/30 border border-amber-500/40 rounded-lg my-4 shadow-sm">
          <span className="text-amber-400 mt-0.5">{icon}</span>
          <span className="text-amber-100 font-medium">{restOfText}</span>
        </div>
      );
    }

    // Formato clave-valor (ej: "Niños ➝ 7 años")
    if (trimmed.includes('➝') || trimmed.includes('->')) {
      const separator = trimmed.includes('➝') ? '➝' : '->';
      const parts = trimmed.split(separator);
      if (parts.length === 2 && parts[0].length < 40) {
        return (
          <div key={index} className="flex flex-wrap items-center gap-3 py-2 border-b border-white/5">
            <strong className="text-white bg-white/10 px-3 py-1 rounded-md text-sm shadow-sm">{parts[0].trim()}</strong>
            <span className="text-dorado-campeon text-sm">➔</span>
            <span className="text-gray-300">{parts[1].trim()}</span>
          </div>
        );
      }
    }

    // Detección de títulos (Preguntas o TODO MAYÚSCULAS)
    const isQuestion = trimmed.startsWith('¿') && trimmed.endsWith('?');
    const hasLetters = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmed);
    const isUppercase = hasLetters && trimmed.toUpperCase() === trimmed;
    const isShort = trimmed.length <= 60;

    if (isShort && (isQuestion || isUppercase)) {
      return (
        <h3 key={index} className="text-2xl sm:text-3xl font-bold text-dorado-campeon mt-10 mb-4 font-heading flex items-center gap-2 border-b border-dorado-campeon/20 pb-2">
          {trimmed}
        </h3>
      );
    }

    // Items de lista con icono/emoji (ej: "🥊 Guantes")
    if (hasIcon) {
      return (
        <div key={index} className="flex items-start gap-3 py-1.5 my-1">
          <span className="text-xl leading-none">{icon}</span>
          <span className="text-gray-200 text-base">{restOfText}</span>
        </div>
      );
    }

    // Subtítulos (texto corto sin puntuación)
    const isShortAndNoPunctuation = isShort && !/[.,;:]/.test(trimmed) && trimmed.split(' ').length <= 4 && hasLetters;
    if (isShortAndNoPunctuation) {
      return (
        <strong key={index} className="block text-white text-lg font-heading tracking-wide mt-6 mb-2">
          {trimmed}
        </strong>
      );
    }

    // Párrafo normal
    return (
      <p key={index} className="text-gray-300 leading-relaxed text-base md:text-lg mb-4">
        {trimmed}
      </p>
    );
  };

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
      <div class="bg-carbon border border-dorado-campeon/20 p-6 sm:p-10 rounded-2xl shadow-2xl">
        {content.cuerpo.split('\n').map(renderParagraph)}
      </div>

    </div>
  );
};

export default ContenidoDetalle;
