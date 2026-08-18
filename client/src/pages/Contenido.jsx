import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, Video, Edit3, Check, GripVertical, Loader } from 'lucide-react';

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
      className="border-precision bg-white dark:bg-[#0A0B0E] flex flex-col justify-between transition-transform hover:-translate-y-2 hover:border-carbon dark:border-white/20 relative group overflow-hidden"
    >
      {/* Handle de Arrastre */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-30 p-2 bg-white dark:bg-[#0A0B0E] border-precision text-carbon dark:text-white hover:bg-carbon hover:text-blanco-absoluto cursor-grab active:cursor-grabbing transition-colors"
          title="Arrastra para reordenar"
        >
          <GripVertical size={20} />
        </div>
      )}

      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden bg-gris-claro border-b-2 border-carbon dark:border-white/20">
        {item.imagenUrl ? (
          <img
            src={item.imagenUrl}
            alt={item.titulo}
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 group-hover:scale-105 transition-transform">
            <div className="w-20 h-20 border-4 border-carbon dark:border-white/20 flex items-center justify-center bg-white dark:bg-[#0A0B0E]">
              <FileText size={40} className="text-carbon dark:text-white" />
            </div>
          </div>
        )}
        
        <div className="absolute top-0 left-0 w-full flex">
          <span className="px-4 py-2 text-xs font-title uppercase bg-carbon text-blanco-absoluto tracking-widest border-r-2 border-b-2 border-carbon dark:border-white/20">
            {item.categoria}
          </span>
          {item.videoUrl && (
            <span className="px-4 py-2 text-xs font-title uppercase bg-rojo-impacto text-blanco-absoluto border-b-2 border-l-2 border-carbon dark:border-white/20 tracking-widest flex items-center justify-center gap-2 ml-auto">
              <Video size={14} />
              VIDEO
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between bg-white dark:bg-[#0A0B0E] relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-title text-carbon dark:text-white/60 uppercase tracking-widest">
            <Calendar size={14} className="text-rojo-impacto" />
            {item.fechaPublicacion}
          </div>
          <h3 className="text-2xl font-title text-carbon dark:text-white uppercase tracking-wide leading-tight group-hover:text-rojo-impacto transition-colors line-clamp-2">
            {item.titulo}
          </h3>
          <p className="text-base font-body text-carbon dark:text-white/80 line-clamp-3 leading-relaxed">
            {item.resumen}
          </p>
        </div>

        <div className="pt-4 border-t-2 border-carbon dark:border-white/20 text-center mt-auto">
          <Link
            to={isEditMode ? '#' : `/contenido/${item.id}`}
            className={`inline-flex items-center justify-center font-title text-sm text-rojo-impacto hover:text-carbon dark:text-white tracking-widest uppercase transition-colors ${isEditMode ? 'pointer-events-none opacity-50' : ''}`}
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
    <div className="bg-white dark:bg-[#0A0B0E] w-full min-h-screen pb-24">
      
      {/* HEADER NORMALIZADO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-16 pb-8 mb-12 border-b border-gray-200 dark:border-white/10">
        <h1 className="text-4xl sm:text-5xl font-bold font-body normal-case tracking-normal text-carbon dark:text-white m-0 p-0 break-words mix-blend-multiply">
          Biblioteca <span className="text-rojo-impacto">Marcial</span>
        </h1>
        <p className="font-body text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl leading-relaxed">
          Artículos técnicos, novedades del reglamento y consejos de combate.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Category Pills & Controls */}
        <div className="border-b border-gray-200 dark:border-white/10 pb-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCat('')}
              disabled={isEditMode}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
                selectedCat === ''
                  ? 'bg-rojo-impacto text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                disabled={isEditMode}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 capitalize ${
                  selectedCat === cat
                    ? 'bg-rojo-impacto text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Informative message for admin if filters are active */}
          {isAuthenticated && !canEdit && (
            <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium">
              Selecciona "Todos" para reordenar
            </span>
          )}
        </div>

        {/* Reorder instructions in edit mode */}
        {isEditMode && (
          <div className="mb-10 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 text-sm font-medium text-center shadow-sm">
            Modo Edición: Arrastra las publicaciones para cambiar su orden.
          </div>
        )}

        {/* Grid of Content Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader className="animate-spin text-red-600" size={48} strokeWidth={3} />
          </div>
        ) : contents.length === 0 ? (
          <div className="py-16 text-center border border-gray-200 dark:border-white/10 rounded-xl bg-white flex flex-col items-center justify-center p-6 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-gray-400 dark:text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Sin Publicaciones</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No hay contenido en esta categoría por ahora.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
            className={`fixed bottom-8 right-8 z-50 p-4 border-precision transition-all duration-300 hover:-translate-y-1 hover:border-carbon dark:border-white/20 ${
              isEditMode
                ? 'bg-rojo-impacto text-blanco-absoluto'
                : 'bg-white dark:bg-[#0A0B0E] text-carbon dark:text-white'
            }`}
            title={isEditMode ? 'Guardar Cambios' : 'Modo Edición'}
          >
            {isEditMode ? <Check size={32} strokeWidth={3} /> : <Edit3 size={32} strokeWidth={3} />}
          </button>
        )}

        {/* Toast Notification */}
        {toast.message && (
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 border-precision flex items-center justify-center font-title text-lg uppercase tracking-widest bg-white dark:bg-[#0A0B0E] ${
            toast.type === 'success'
              ? 'border-carbon dark:border-white/20 text-carbon dark:text-white'
              : 'border-rojo-impacto text-rojo-impacto'
          }`}>
            <span>{toast.message}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Contenido;

