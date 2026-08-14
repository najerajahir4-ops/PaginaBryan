import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, Video, Edit3, Check, GripVertical } from 'lucide-react';

// Dnd-kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Wrapper sortable component
const SortableContentCard = ({ item, isEditMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="bg-[#0A0B0E] border border-white/5 flex flex-col justify-between shadow-[0_0_15px_rgba(227,178,60,0.05)] hover:shadow-[0_0_25px_rgba(227,178,60,0.15)] hover:border-dorado-campeon/30 transition-all duration-300 relative group overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-dorado-campeon/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
      
      {/* Handle de Arrastre */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-30 p-2 bg-carbon border border-dorado-campeon/50 text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon cursor-grab active:cursor-grabbing shadow-[0_0_10px_rgba(227,178,60,0.3)] transition-colors"
          title="Arrastra para reordenar"
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden bg-carbon border-b border-white/5">
        {item.imagenUrl ? (
          <img
            src={item.imagenUrl}
            alt={item.titulo}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-tatami-blanco/5 border border-white/10 flex items-center justify-center">
              <FileText size={32} className="text-tatami-blanco/50" />
            </div>
            <span className="text-[10px] text-tatami-blanco/40 font-heading uppercase tracking-widest">Sin Imagen</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-transparent opacity-80"></div>
        
        <div className="absolute top-0 left-0 w-full flex">
          <span className="px-4 py-1.5 text-[10px] font-heading font-extrabold uppercase bg-rojo-impacto text-tatami-blanco tracking-widest border-b border-rojo-impacto/50 flex-1 text-center">
            {item.categoria}
          </span>
          {item.videoUrl && (
            <span className="px-4 py-1.5 text-[10px] font-heading font-extrabold uppercase bg-dorado-campeon/10 text-dorado-campeon border-b border-dorado-campeon/30 tracking-widest flex items-center justify-center gap-2 backdrop-blur-sm flex-1 text-center">
              <Video size={12} />
              VIDEO
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 flex-grow flex flex-col justify-between bg-[#0A0B0E] relative z-10">
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] font-body text-dorado-campeon/60 uppercase tracking-widest font-bold">
            <Calendar size={12} className="text-dorado-campeon" />
            {item.fechaPublicacion}
          </div>
          <h3 className="text-xl font-heading text-tatami-blanco uppercase tracking-wide leading-tight group-hover:text-dorado-campeon transition-colors line-clamp-2">
            {item.titulo}
          </h3>
          <div className="w-8 h-[1px] bg-dorado-campeon/30 mx-auto"></div>
          <p className="text-sm font-body text-tatami-blanco/60 line-clamp-3 leading-relaxed">
            {item.resumen}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5 text-center mt-auto">
          <Link
            to={isEditMode ? '#' : `/contenido/${item.id}`}
            className={`inline-flex items-center justify-center gap-2 font-heading text-xs text-rojo-impacto hover:text-tatami-blanco tracking-widest uppercase transition-colors ${isEditMode ? 'pointer-events-none opacity-50' : ''}`}
          >
            LEER PUBLICACIÓN COMPLETA
          </Link>
        </div>
      </div>
    </article>
  );
};

const Contenido = () => {
  const { isAuthenticated } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const categories = ['TECNICA', 'REGLAMENTO', 'NUTRICION', 'NOTICIAS', 'ENTREVISTAS'];

  // Dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchContent();
  }, [selectedCat]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCat) params.categoria = selectedCat;
      const res = await API.get('/content', { params });
      setContents(res.data);
    } catch (err) {
      console.error('Error al cargar contenido:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = contents.findIndex(item => item.id === active.id);
    const newIndex = contents.findIndex(item => item.id === over.id);
    const reordered = arrayMove(contents, oldIndex, newIndex);

    setContents(reordered);

    try {
      const ids = reordered.map(item => item.id);
      await API.patch('/content/reorder', { ids });
      showToast('Orden guardado con éxito');
    } catch (err) {
      console.error('Error al reordenar:', err);
      showToast('Error al guardar el nuevo orden', 'error');
      fetchContent();
    }
  };

  // Reordering is only allowed when no category filter is active to prevent order inconsistencies
  const canEdit = !selectedCat;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 relative animate-fade-in">
      
      {/* Header Ledger */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-dorado-campeon/30 px-4 py-1.5 bg-dorado-campeon/5">
          <FileText size={14} className="text-dorado-campeon" />
          <span className="text-xs font-body font-bold text-dorado-campeon tracking-[0.2em] uppercase">
            CENTRO DE RECURSOS TÉCNICOS
          </span>
        </div>
        <h1 className="text-5xl font-heading text-tatami-blanco uppercase tracking-tight">
          BIBLIOTECA <span className="text-dorado-campeon">MARCIAL</span>
        </h1>
        <p className="text-sm font-body text-tatami-blanco/70 uppercase tracking-widest max-w-xl mx-auto">
          Artículos técnicos, novedades del reglamento WAKO/WT y consejos de combate.
        </p>
      </div>

      {/* Category Pills & Controls */}
      <div className="bg-carbon border-y border-dorado-campeon/20 py-4 px-2 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap border border-dorado-campeon/30 p-1 bg-[#0A0B0E] w-full md:w-auto">
          <button
            onClick={() => setSelectedCat('')}
            disabled={isEditMode}
            className={`px-4 py-2 font-heading text-[10px] tracking-widest uppercase transition-colors flex-1 md:flex-none disabled:opacity-50 ${
              selectedCat === ''
                ? 'bg-dorado-campeon text-carbon'
                : 'text-tatami-blanco/50 hover:text-tatami-blanco bg-transparent'
            }`}
          >
            TODOS
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              disabled={isEditMode}
              className={`px-4 py-2 font-heading text-[10px] tracking-widest uppercase transition-colors flex-1 md:flex-none disabled:opacity-50 ${
                selectedCat === cat
                  ? 'bg-dorado-campeon text-carbon'
                  : 'text-tatami-blanco/50 hover:text-tatami-blanco bg-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Informative message for admin if filters are active */}
        {isAuthenticated && !canEdit && (
          <span className="text-[10px] text-rojo-impacto font-heading uppercase tracking-widest border border-rojo-impacto/50 px-3 py-1 bg-rojo-impacto/10">
            SELECCIONA "TODOS" PARA REORDENAR
          </span>
        )}
      </div>

      {/* Reorder instructions in edit mode */}
      {isEditMode && (
        <div className="bg-dorado-campeon/10 border border-dorado-campeon/40 p-4 flex items-center justify-center text-xs text-dorado-campeon font-bold uppercase tracking-[0.1em] text-center max-w-5xl mx-auto">
          <span>Modo Edición Activo: Arrastra las publicaciones para cambiar su orden de aparición.</span>
        </div>
      )}

      {/* Grid of Content Cards */}
      {loading ? (
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-none h-10 w-10 border-t-2 border-b-2 border-dorado-campeon"></div>
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center">
          <FileText size={40} className="text-dorado-campeon/30 mb-4" />
          <h3 className="font-heading text-tatami-blanco text-xl tracking-widest uppercase mb-2">Sin Publicaciones</h3>
          <p className="text-sm font-body text-tatami-blanco/50">No hay contenido en esta categoría por ahora.</p>
        </div>
      ) : isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={contents.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contents.map((item) => (
                <SortableContentCard
                  key={item.id}
                  item={item}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {contents.map((item) => (
            <SortableContentCard
              key={item.id}
              item={item}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}

      {/* Floating Action Admin Button (Lápiz) */}
      {isAuthenticated && canEdit && (
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`fixed bottom-8 right-8 z-50 p-4 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
            isEditMode
              ? 'bg-dorado-campeon text-carbon border border-dorado-campeon hover:bg-white hover:border-white'
              : 'bg-carbon text-dorado-campeon border border-dorado-campeon/50 hover:bg-dorado-campeon/10 hover:border-dorado-campeon'
          }`}
          title={isEditMode ? 'Guardar Cambios' : 'Modo Edición'}
        >
          {isEditMode ? <Check size={24} strokeWidth={3} /> : <Edit3 size={24} />}
        </button>
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 border shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-xs font-heading uppercase tracking-widest ${
          toast.type === 'success'
            ? 'bg-[#0A0B0E] border-emerald-500/50 text-emerald-500'
            : 'bg-[#0A0B0E] border-rojo-impacto/50 text-rojo-impacto'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
};

export default Contenido;
