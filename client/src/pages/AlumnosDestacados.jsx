import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Star, Filter, Edit3, Check, GripVertical } from 'lucide-react';
import { getBeltStyle } from '../utils/belt-colors';

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
const SortableFeaturedCard = ({ item, isEditMode }) => {
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

  const belt = getBeltStyle(item.student.grado || '');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/[0.02] rounded-2xl overflow-hidden flex flex-col relative group border border-white/5 hover:border-dorado-campeon/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-dorado-campeon/10 hover:-translate-y-1.5 backdrop-blur-sm"
    >
      {/* Handle de Arrastre */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-30 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-dorado-campeon/50 text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon cursor-grab active:cursor-grabbing shadow-md transition-colors"
          title="Arrastra para reordenar"
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Photo & Badges */}
      <div className="relative h-72 overflow-hidden bg-white/[0.01]">
        {item.imagenUrl || item.student.foto ? (
          <img
            src={item.imagenUrl || item.student.foto}
            alt={`${item.student.nombres} ${item.student.apellidos}`}
            className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
            <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-2 shadow-inner">
              <Trophy size={32} className="text-tatami-blanco" />
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-transparent opacity-80"></div>
        
        <div className="absolute top-0 left-0 w-full flex">
          <span className="flex-1 py-1.5 text-center text-[10px] font-heading uppercase bg-rojo-impacto text-white tracking-widest border-b border-rojo-impacto/50">
            {item.disciplina}
          </span>
          <span className="flex-1 py-1.5 text-center text-[10px] font-heading uppercase bg-[#0A0B0E] text-dorado-campeon tracking-widest border-b border-dorado-campeon/20">
            {item.categoria}
          </span>
        </div>
      </div>

      {/* Card Details & Anchor */}
      <div className="flex flex-col relative z-10 flex-grow bg-gradient-to-b from-[#0A0B0E]/80 to-[#0A0B0E]">
        
        {/* Línea de Anclaje de Cinturón (Movida arriba del texto para mejor balance) */}
        <div className="relative z-20 w-full">
          <div 
            className="h-1.5 w-full shadow-sm"
            style={{ backgroundColor: belt.backgroundColor }}
          ></div>
          {belt.isBlackBelt && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E3B23C] opacity-100 z-20"></div>
          )}
        </div>

        <div className="p-6 pb-8 text-center relative z-10 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-heading text-tatami-blanco tracking-tight leading-tight mb-1 line-clamp-1 group-hover:text-dorado-campeon transition-colors">
              {item.student.nombres} {item.student.apellidos}
            </h3>
            <div className="text-sm text-dorado-campeon/90 font-body font-semibold uppercase tracking-wider">
              {item.student.grado}
            </div>
            <div className="text-xs text-tatami-blanco/50 mt-1 font-medium tracking-wide">
              {item.student.club ? item.student.club.nombre : 'Independiente'}
            </div>
          </div>
          
          {/* Logros */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-[10px] font-body font-bold text-rojo-impacto/90 uppercase tracking-widest mb-2">
              <Star size={12} className="fill-current" />
              Logros Destacados
            </div>
            <p className="text-sm font-body text-tatami-blanco/70 leading-relaxed italic line-clamp-2">
              "{item.logros}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlumnosDestacados = () => {
  const { isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [disciplina, setDisciplina] = useState('');
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchFeatured();
  }, [categoria, disciplina]);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoria) params.categoria = categoria;
      if (disciplina) params.disciplina = disciplina;
      const res = await API.get('/featured-students', { params });
      setFeatured(res.data);
    } catch (err) {
      console.error('Error al cargar alumnos destacados:', err);
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

    const oldIndex = featured.findIndex(item => item.id === active.id);
    const newIndex = featured.findIndex(item => item.id === over.id);
    const reordered = arrayMove(featured, oldIndex, newIndex);

    setFeatured(reordered);

    try {
      const ids = reordered.map(item => item.id);
      await API.patch('/featured-students/reorder', { ids });
      showToast('Orden guardado con éxito');
    } catch (err) {
      console.error('Error al reordenar:', err);
      showToast('Error al guardar el nuevo orden', 'error');
      fetchFeatured();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 relative">
      
      {/* Header Ledger */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="text-xs font-body font-bold text-dorado-campeon tracking-[0.2em] uppercase">
          CUADRO DE HONOR Y ATLETAS DE ÉLITE
        </div>
        <h1 className="text-5xl font-heading text-tatami-blanco tracking-tight">
          Alumnos <span className="text-rojo-impacto drop-shadow-sm">Destacados</span>
        </h1>
        <p className="text-base font-body text-tatami-blanco/70 tracking-wide max-w-xl mx-auto">
          Reconocimiento oficial a nuestros competidores con logros destacados.
        </p>
      </div>

      {/* Filters Bar - Registro Oficial */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-2 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 md:items-center justify-between shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3 text-dorado-campeon/80 font-body font-medium text-sm tracking-wide px-4">
          <Filter size={18} />
          Filtros del Cuadro
        </div>

        <div className="flex flex-1 gap-4 px-4 md:px-0">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            disabled={isEditMode}
            className="bg-transparent border-none text-sm text-tatami-blanco/90 focus:outline-none focus:ring-0 font-body tracking-wide cursor-pointer appearance-none md:border-l md:border-white/10 md:pl-4 flex-1 disabled:opacity-50"
          >
            <option value="" className="bg-[#111]">Todas las Categorías</option>
            <option value="INFANTIL" className="bg-[#111]">Infantil</option>
            <option value="JUVENIL" className="bg-[#111]">Juvenil</option>
            <option value="ADULTO" className="bg-[#111]">Adulto</option>
          </select>

          <select
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            disabled={isEditMode}
            className="bg-transparent border-none text-sm text-tatami-blanco/90 focus:outline-none focus:ring-0 font-body tracking-wide cursor-pointer appearance-none md:border-l md:border-white/10 md:pl-4 flex-1 disabled:opacity-50"
          >
            <option value="" className="bg-[#111]">Todas las Disciplinas</option>
            <option value="TAEKWONDO" className="bg-[#111]">Taekwondo</option>
            <option value="KICKBOXING" className="bg-[#111]">Kickboxing</option>
          </select>
        </div>
      </div>

      {/* Reorder instructions */}
      {isEditMode && (
        <div className="bg-dorado-campeon/10 border border-dorado-campeon/30 rounded-xl p-4 flex items-center justify-center text-sm text-dorado-campeon font-medium tracking-wide text-center max-w-4xl mx-auto shadow-sm">
          <span>Modo Edición Activo: Arrastra las placas de honor para reordenarlas en el registro.</span>
        </div>
      )}

      {/* Grid of Featured Students */}
      {loading ? (
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dorado-campeon"></div>
        </div>
      ) : featured.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center bg-white/[0.01] rounded-3xl border border-white/5 max-w-2xl mx-auto">
          <Trophy size={48} className="text-dorado-campeon/20 mb-4" />
          <p className="font-heading text-tatami-blanco/80 text-2xl tracking-wide mb-2">Sin Registros</p>
          <p className="text-sm font-body text-tatami-blanco/50">No hay placas de honor con los filtros aplicados.</p>
        </div>
      ) : isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={featured.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((item) => (
                <SortableFeaturedCard
                  key={item.id}
                  item={item}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {featured.map((item) => (
            <SortableFeaturedCard
              key={item.id}
              item={item}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}

      {/* Floating Action Admin Button */}
      {isAuthenticated && (
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full transition-all duration-300 shadow-xl ${
            isEditMode
              ? 'bg-dorado-campeon text-carbon hover:bg-[#E3B23C]/90 hover:scale-105 hover:shadow-dorado-campeon/30'
              : 'bg-white/10 text-dorado-campeon border border-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/20 hover:-translate-y-1'
          }`}
          title={isEditMode ? 'Guardar Cambios' : 'Modo Edición'}
        >
          {isEditMode ? <Check size={24} strokeWidth={3} /> : <Edit3 size={24} />}
        </button>
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center justify-center text-sm font-body font-medium tracking-wide backdrop-blur-md transition-all duration-300 ${
          toast.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            : 'bg-rojo-impacto/10 border border-rojo-impacto/30 text-rojo-impacto'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
};

export default AlumnosDestacados;
