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
      className="bg-carbon overflow-hidden flex flex-col relative group border border-transparent hover:border-dorado-campeon/20 transition-all duration-300 shadow-[0_0_15px_rgba(227,178,60,0.05)] hover:shadow-[0_0_25px_rgba(227,178,60,0.15)] hover:-translate-y-1"
    >
      {/* Handle de Arrastre */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-30 p-2 bg-carbon border border-dorado-campeon text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon cursor-grab active:cursor-grabbing shadow-[0_0_10px_rgba(227,178,60,0.3)]"
          title="Arrastra para reordenar"
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Photo & Badges */}
      <div className="relative h-72 overflow-hidden bg-[#0A0B0E] border border-white/5 border-b-0">
        {item.imagenUrl || item.student.foto ? (
          <img
            src={item.imagenUrl || item.student.foto}
            alt={`${item.student.nombres} ${item.student.apellidos}`}
            className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
            <div className="w-20 h-20 bg-tatami-blanco/5 border border-white/10 flex items-center justify-center mb-2">
              <Trophy size={32} className="text-tatami-blanco" />
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-0 left-0 w-full flex">
          <span className="flex-1 py-1 text-center text-[10px] font-heading uppercase bg-rojo-impacto text-tatami-blanco tracking-widest border-b border-rojo-impacto/50">
            {item.disciplina}
          </span>
          <span className="flex-1 py-1 text-center text-[10px] font-heading uppercase bg-[#0A0B0E] text-dorado-campeon tracking-widest border-b border-dorado-campeon/30">
            {item.categoria}
          </span>
        </div>
      </div>

      {/* Card Details & Anchor */}
      <div className="bg-carbon border border-white/5 border-t-0 flex flex-col relative z-10">
        
        <div className="p-6 pb-8 text-center relative z-10 bg-[#0A0B0E]">
          <h3 className="text-2xl font-heading text-tatami-blanco tracking-wide uppercase leading-none mb-2 line-clamp-1">
            {item.student.nombres} {item.student.apellidos}
          </h3>
          <div className="text-sm text-dorado-campeon/85 font-body font-bold uppercase tabular-nums tracking-widest">
            {item.student.grado}
          </div>
          <div className="text-[10px] text-tatami-blanco/40 mt-1 uppercase font-body tracking-widest">
            {item.student.club ? item.student.club.nombre : 'INDEPENDIENTE'}
          </div>
          
          {/* Logros (Separador y texto minimalista) */}
          <div className="mt-5 pt-4 border-t border-dorado-campeon/20">
            <div className="flex items-center justify-center gap-2 text-[10px] font-body font-bold text-rojo-impacto uppercase tracking-[0.2em] mb-2">
              <Star size={12} className="fill-current" />
              LOGROS DESTACADOS
            </div>
            <p className="text-xs font-body text-tatami-blanco/70 leading-relaxed italic line-clamp-2">
              "{item.logros}"
            </p>
          </div>
        </div>

        {/* Línea de Anclaje de Cinturón */}
        <div className="relative z-20">
          <div 
            className="h-[6px] w-full"
            style={{ backgroundColor: belt.backgroundColor }}
          ></div>
          {belt.isBlackBelt && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E3B23C] opacity-100 z-20"></div>
          )}
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
        <div className="inline-block border border-dorado-campeon/30 px-4 py-1.5 bg-dorado-campeon/5">
          <span className="text-xs font-body font-bold text-dorado-campeon tracking-[0.2em] uppercase">
            CUADRO DE HONOR Y ATLETAS DE ÉLITE
          </span>
        </div>
        <h1 className="text-5xl font-heading text-tatami-blanco uppercase tracking-tight">
          ALUMNOS <span className="text-rojo-impacto drop-shadow-[0_0_15px_rgba(214,40,57,0.3)]">DESTACADOS</span>
        </h1>
        <p className="text-sm font-body text-tatami-blanco/70 uppercase tracking-widest max-w-xl mx-auto">
          Reconocimiento oficial a nuestros competidores con logros destacados.
        </p>
      </div>

      {/* Filters Bar - Registro Oficial */}
      <div className="bg-carbon border-y border-dorado-campeon/20 py-4 px-2 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex items-center gap-3 text-dorado-campeon/70 font-body font-bold text-xs uppercase tracking-widest px-4">
          <Filter size={16} />
          FILTROS DEL CUADRO:
        </div>

        <div className="flex flex-1 gap-4 px-4 md:px-0">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            disabled={isEditMode}
            className="bg-transparent border-none text-sm text-tatami-blanco focus:outline-none focus:ring-0 font-body uppercase tracking-wider cursor-pointer appearance-none md:border-l md:border-dorado-campeon/20 md:pl-4 flex-1 disabled:opacity-50"
          >
            <option value="" className="bg-carbon">TODAS LAS CATEGORÍAS</option>
            <option value="INFANTIL" className="bg-carbon">INFANTIL</option>
            <option value="JUVENIL" className="bg-carbon">JUVENIL</option>
            <option value="ADULTO" className="bg-carbon">ADULTO</option>
          </select>

          <select
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            disabled={isEditMode}
            className="bg-transparent border-none text-sm text-tatami-blanco focus:outline-none focus:ring-0 font-body uppercase tracking-wider cursor-pointer appearance-none md:border-l md:border-dorado-campeon/20 md:pl-4 flex-1 disabled:opacity-50"
          >
            <option value="" className="bg-carbon">TODAS LAS DISCIPLINAS</option>
            <option value="TAEKWONDO" className="bg-carbon">TAEKWONDO</option>
            <option value="KICKBOXING" className="bg-carbon">KICKBOXING</option>
          </select>
        </div>
      </div>

      {/* Reorder instructions */}
      {isEditMode && (
        <div className="bg-dorado-campeon/10 border border-dorado-campeon/40 p-4 flex items-center justify-center text-xs text-dorado-campeon font-bold uppercase tracking-[0.1em] text-center max-w-4xl mx-auto">
          <span>Modo Edición Activo: Arrastra las placas de honor para reordenarlas en el registro.</span>
        </div>
      )}

      {/* Grid of Featured Students */}
      {loading ? (
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-none h-10 w-10 border-t-2 border-b-2 border-dorado-campeon"></div>
        </div>
      ) : featured.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center">
          <Trophy size={40} className="text-dorado-campeon/30 mb-4" />
          <p className="font-heading text-tatami-blanco text-xl tracking-widest uppercase mb-2">Sin Registros</p>
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

export default AlumnosDestacados;
