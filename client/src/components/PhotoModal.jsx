import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const PhotoModal = ({ photo, isOpen, onClose, onNext, onPrev, hasMultiple }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasMultiple) onNext();
      if (e.key === 'ArrowLeft' && hasMultiple) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasMultiple]);

  if (!isOpen || !photo) return null;

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      let filename = 'foto.jpg';
      if (photo.descripcion) {
        filename = `${photo.descripcion.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image', error);
      window.open(photo.url, '_blank');
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <button 
          onClick={handleDownload}
          className="text-white/70 hover:text-dorado-campeon transition-all bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5"
          title="Descargar Foto"
        >
          <Download size={24} />
        </button>
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-rojo-impacto transition-all bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5"
          title="Cerrar"
        >
          <X size={24} />
        </button>
      </div>

      {hasMultiple && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-dorado-campeon transition-all bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-full z-50 shadow-sm hover:shadow-md hover:scale-105"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-dorado-campeon transition-all bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-full z-50 shadow-sm hover:shadow-md hover:scale-105"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div 
        className="relative max-w-6xl w-full max-h-[85vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={photo.url} 
          alt={photo.descripcion || 'Foto expandida'} 
          className="max-w-full max-h-[80vh] object-contain shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10 transition-transform duration-500 hover:scale-[1.02]"
        />
        {photo.descripcion && (
          <div className="mt-6 text-center">
            <p className="text-white/90 text-lg font-body font-medium drop-shadow-sm">
              {photo.descripcion}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PhotoModal;
