import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Star, Filter, Edit3, Check, GripVertical } from 'lucide-react';

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      class="bg-carbon overflow-hidden flex flex-col relative group clip-card border border-dorado-campeon/30 hover:border-dorado-campeon transition-colors duration-300"
    >
      {/* Handle de Arrastre */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          class="absolute top-3 right-3 z-30 p-2 bg-carbon border border-dorado-campeon text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon rounded-sm cursor-grab active:cursor-grabbing shadow-lg"
          title="Arrastra para reordenar"
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Photo & Badges */}
      <div class="relative h-64 overflow-hidden bg-black">
        {item.student.foto ? (
          <img
            src={item.student.foto}
            alt={`${item.student.nombres} ${item.student.apellidos}`}
            class="w-full h-full object-cover"
          />
        ) : (
          <div class="w-full h-full bg-carbon/90 border border-white/5 flex flex-col items-center justify-center space-y-2">
            <Trophy size={48} class="text-[#C9A227]/40" />
            <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sin foto de perfil</span>
          </div>
        )}
        
        <div class="absolute top-3 left-3 flex flex-wrap gap-2">
          <span class="px-3 py-1 text-[10px] font-display uppercase bg-rojo-impacto text-tatami-blanco tracking-widest clip-button">
            {item.disciplina}
          </span>
          <span class="px-3 py-1 text-[10px] font-display uppercase bg-dorado-campeon text-carbon tracking-widest clip-button">
            {item.categoria}
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div class="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold text-tatami-blanco font-display tracking-widest uppercase group-hover:text-dorado-campeon transition-colors">
            {item.student.nombres} {item.student.apellidos}
          </h3>
          <div class="text-xs text-dorado-campeon font-body mt-1 uppercase font-bold">
            {item.student.grado}
          </div>
          <div class="text-xs text-tatami-blanco/50 mt-0.5 uppercase font-body">
            Club: {item.student.club ? item.student.club.nombre : 'Independiente'}
          </div>
        </div>

        {/* Logros */}
        <div class="bg-black/30 p-4 border-l-4 border-rojo-impacto space-y-2">
          <div class="flex items-center gap-2 text-xs font-display text-rojo-impacto uppercase tracking-widest">
            <Star size={14} class="fill-current" />
            Logros Destacados:
          </div>
          <p class="text-sm font-body text-tatami-blanco/90 leading-relaxed italic">
            "{item.logros}"
          </p>
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
        distance: 8, // Drag starts only after moving 8px, avoids accidental clicks
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

    // Update state immediately for optimal visual feedback
    setFeatured(reordered);

    try {
      // Send PATCH to persist new order
      const ids = reordered.map(item => item.id);
      await API.patch('/featured-students/reorder', { ids });
      showToast('Orden guardado con éxito');
    } catch (err) {
      console.error('Error al reordenar:', err);
      showToast('Error al guardar el nuevo orden', 'error');
      // Rollback to original order on error
      fetchFeatured();
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 relative">
      
      {/* Asymmetric Header */}
      <div class="border-l-4 border-[#C9A227] pl-6 space-y-2">
        <div class="text-xs font-heading font-bold text-[#C9A227] tracking-widest uppercase">
          [ CUADRO DE HONOR Y ATLETAS DE ÉLITE ]
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white font-heading tracking-wider">
          ALUMNOS DESTACADOS
        </h1>
        <p class="text-xs sm:text-sm text-gray-300 max-w-2xl">
          Reconocimiento oficial a nuestros competidores con logros destacados en torneos de Taekwondo y Kickboxing.
        </p>
      </div>

      {/* Filters Bar */}
      <div class="bg-[#111114] border border-[#C9A227]/30 p-4 rounded-sm flex flex-wrap gap-4 items-center justify-between shadow-xl">
        <div class="flex items-center gap-2 text-[#C9A227] font-heading font-bold text-xs uppercase tracking-widest">
          <Filter size={16} />
          Filtrar Cuadro de Honor:
        </div>

        <div class="flex flex-wrap gap-4">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            disabled={isEditMode}
            class="bg-[#0B1550] border border-[#C9A227]/40 rounded-sm px-4 py-2 text-xs font-semibold text-[#F5F2E9] focus:outline-none focus:border-[#C9A227] disabled:opacity-50"
          >
            <option value="">Todas las Categorías</option>
            <option value="INFANTIL">Infantil</option>
            <option value="JUVENIL">Juvenil</option>
            <option value="ADULTO">Adulto</option>
          </select>

          <select
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            disabled={isEditMode}
            class="bg-[#0B1550] border border-[#C9A227]/40 rounded-sm px-4 py-2 text-xs font-semibold text-[#F5F2E9] focus:outline-none focus:border-[#C9A227] disabled:opacity-50"
          >
            <option value="">Todas las Disciplinas</option>
            <option value="TAEKWONDO">Taekwondo</option>
            <option value="KICKBOXING">Kickboxing</option>
          </select>
        </div>
      </div>

      {/* Reorder instructions in edit mode */}
      {isEditMode && (
        <div class="bg-[#0B1550]/40 border border-[#C9A227]/40 p-4 rounded-sm flex items-center justify-between text-xs text-[#C9A227] font-bold uppercase tracking-wider">
          <span>Modo Edición Activo: Arrastra las tarjetas desde el icono superior derecho (☰) para reordenar la galería.</span>
        </div>
      )}

      {/* Grid of Featured Students */}
      {loading ? (
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]"></div>
        </div>
      ) : featured.length === 0 ? (
        <div class="text-left py-12 bg-[#111114] rounded-sm border border-[#C9A227]/30 p-6">
          <p class="text-gray-400 text-xs">No se encontraron alumnos destacados con los filtros seleccionados.</p>
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item) => (
            <SortableFeaturedCard
              key={item.id}
              item={item}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}

      {/* Floating Action Admin Button (Lápiz) */}
      {isAuthenticated && (
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

export default AlumnosDestacados;
