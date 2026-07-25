import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, Video, ArrowRight, Edit3, Check, GripVertical } from 'lucide-react';

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
      class="bg-[#111114] border border-[#C9A227]/30 rounded-sm overflow-hidden flex flex-col justify-between shadow-xl relative"
    >
      {/* Handle de Arrastre */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          class="absolute top-3 right-3 z-30 p-2 bg-[#0B1550] border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B1550] rounded-sm cursor-grab active:cursor-grabbing shadow-lg"
          title="Arrastra para reordenar"
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Cover Image */}
      <div class="relative h-48 overflow-hidden bg-black">
        {item.imagenUrl ? (
          <img
            src={item.imagenUrl}
            alt={item.titulo}
            class="w-full h-full object-cover"
          />
        ) : (
          <div class="w-full h-full bg-carbon/90 border border-white/5 flex flex-col items-center justify-center space-y-2">
            <FileText size={48} class="text-[#C9A227]/40" />
            <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sin imagen de portada</span>
          </div>
        )}
        <div class="absolute top-3 left-3 flex gap-2">
          <span class="px-2.5 py-1 text-[10px] font-heading font-extrabold uppercase bg-[#8C1D1D] text-white tracking-widest">
            {item.categoria}
          </span>
          {item.videoUrl && (
            <span class="px-2.5 py-1 text-[10px] font-heading font-extrabold uppercase bg-[#0B1550] text-[#C9A227] border border-[#C9A227] tracking-widest flex items-center gap-1">
              <Video size={12} />
              VIDEO
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div class="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
            <Calendar size={12} class="text-[#C9A227]" />
            {item.fechaPublicacion}
          </div>
          <h3 class="text-base font-bold text-[#F5F2E9] font-heading tracking-wider line-clamp-2">
            {item.titulo}
          </h3>
          <p class="text-xs text-[#F5F2E9]/75 line-clamp-3 leading-relaxed">
            {item.resumen}
          </p>
        </div>

        <div class="pt-4 border-t border-white/10">
          <Link
            to={isEditMode ? '#' : `/contenido/${item.id}`}
            class={`inline-flex items-center gap-2 font-heading text-xs font-bold text-[#C9A227] hover:text-[#F5F2E9] tracking-widest uppercase transition-colors ${isEditMode ? 'pointer-events-none opacity-50' : ''}`}
          >
            LEER PUBLICACIÓN COMPLETA ➔
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 relative animate-fade-in">
      
      {/* Asymmetric Left-Aligned Header */}
      <div class="border-l-4 border-[#C9A227] pl-6 space-y-2">
        <div class="text-xs font-heading font-bold text-[#C9A227] tracking-widest uppercase">
          [ CENTRO DE RECURSOS TÉCNICOS ]
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-[#0B1550] font-heading tracking-wider">
          CONTENIDO & BIBLIOTECA MARCIAL
        </h1>
        <p class="text-xs sm:text-sm text-[#111114]/80 max-w-2xl">
          Artículos técnicos, novedades del reglamento WAKO/WT, consejos de nutrición y entrevistas de combate.
        </p>
      </div>

      {/* Category Pills */}
      <div class="flex flex-wrap gap-2 justify-between items-center pt-2">
        <div class="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCat('')}
            disabled={isEditMode}
            class={`px-4 py-2 font-heading text-xs font-bold tracking-widest uppercase transition-colors rounded-sm disabled:opacity-50 ${
              selectedCat === ''
                ? 'bg-[#8C1D1D] text-[#F5F2E9] border border-[#8C1D1D]'
                : 'bg-[#111114] text-[#F5F2E9]/80 hover:text-[#F5F2E9] border border-[#C9A227]/30'
            }`}
          >
            TODOS
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              disabled={isEditMode}
              class={`px-4 py-2 font-heading text-xs font-bold tracking-widest uppercase transition-colors rounded-sm disabled:opacity-50 ${
                selectedCat === cat
                  ? 'bg-[#8C1D1D] text-[#F5F2E9] border border-[#8C1D1D]'
                  : 'bg-[#111114] text-[#F5F2E9]/80 hover:text-[#F5F2E9] border border-[#C9A227]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Informative message for admin if filters are active */}
        {isAuthenticated && !canEdit && (
          <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            ⚠️ Selecciona "TODOS" para reordenar las publicaciones
          </span>
        )}
      </div>

      {/* Reorder instructions in edit mode */}
      {isEditMode && (
        <div class="bg-[#0B1550]/40 border border-[#C9A227]/40 p-4 rounded-sm flex items-center justify-between text-xs text-[#C9A227] font-bold uppercase tracking-wider">
          <span>Modo Edición Activo: Arrastra las publicaciones desde el icono superior derecho (☰) para cambiar su orden de aparición.</span>
        </div>
      )}

      {/* Grid of Content Cards */}
      {loading ? (
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]"></div>
        </div>
      ) : contents.length === 0 ? (
        <div class="text-left py-12 bg-[#111114] rounded-sm border border-[#C9A227]/30 p-6 space-y-2">
          <p class="text-gray-400 text-xs">No hay publicaciones disponibles en esta categoría.</p>
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          class={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border ${
            isEditMode
              ? 'bg-[#C9A227] border-[#C9A227] text-[#111114]'
              : 'bg-[#8C1D1D] border-[#8C1D1D] text-white hover:bg-[#6B1414]'
          }`}
          title={isEditMode ? 'Guardar Cambios' : 'Modo Edición'}
        >
          {isEditMode ? <Check size={22} class="stroke-[3]" /> : <Edit3 size={22} />}
        </button>
      )}

      {/* Floating Toast Notification */}
      {toast.message && (
        <div class={`fixed bottom-6 left-6 z-50 px-5 py-3 rounded-sm border shadow-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
          toast.type === 'success'
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
            : 'bg-rose-500/15 border-rose-500/50 text-rose-400'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
};

export default Contenido;
