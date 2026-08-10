import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Award, ShieldAlert, Edit2, CheckCircle, Search } from 'lucide-react';

const TAEKWONDO_BELTS = [
  "Cinturón Blanco",
  "Cinturón Blanco - Amarillo",
  "Cinturón Amarillo",
  "Cinturón Amarillo - Verde",
  "Cinturón Verde",
  "Cinturón Verde - Azul",
  "Cinturón Azul",
  "Cinturón Azul - Rojo",
  "Cinturón Rojo",
  "Cinturón Rojo - Negro",
];

const KICKBOXING_BELTS = [
  "Cinturón Blanco",
  "Cinturón Blanco - Amarillo",
  "Cinturón Amarillo",
  "Cinturón Naranjo",
  "Cinturón Verde",
  "Cinturón Azul",
  "Cinturón Violeta",
  "Cinturón Café o Marrón",
  "Cinturón Negro",
];

const getBeltColorClass = (beltName) => {
  if (!beltName) return 'bg-gray-400 text-carbon';
  const belt = beltName.toLowerCase();
  if (belt.includes('negro')) return 'bg-black text-dorado-campeon border-t-2 border-dorado-campeon';
  if (belt.includes('blanco')) return 'bg-white text-carbon';
  if (belt.includes('amarillo')) return 'bg-yellow-400 text-carbon';
  if (belt.includes('naranja')) return 'bg-orange-500 text-white';
  if (belt.includes('verde')) return 'bg-green-600 text-white';
  if (belt.includes('azul')) return 'bg-blue-600 text-white';
  if (belt.includes('rojo')) return 'bg-rojo-impacto text-white';
  if (belt.includes('violeta')) return 'bg-purple-600 text-white';
  if (belt.includes('café') || belt.includes('cafe')) return 'bg-amber-800 text-white';
  return 'bg-gray-400 text-carbon';
};

const Grados = () => {
  const { isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [search, setSearch] = useState('');

  // Modal states for Admin fast edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formFoto, setFormFoto] = useState('');
  const [formGrado, setFormGrado] = useState('');
  const [formGradoTKD, setFormGradoTKD] = useState('');
  const [formGradoKB, setFormGradoKB] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormFoto(res.data.url);
    } catch (err) {
      console.error(err);
      alert('Error al subir la foto');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/students');
      // Filtramos únicamente los estudiantes activos para el cuadro de grados público
      const activeStudents = res.data.filter(s => s.estado === 'ACTIVO');
      setStudents(activeStudents);
    } catch (err) {
      console.error('Error al cargar alumnos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setFormFoto(student.foto || '');
    setFormGrado(student.grado || '');

    let gTKD = 'Cinturón Blanco';
    let gKB = 'Cinturón Blanco';
    if (student.modalidad === 'AMBAS' && student.grado) {
      const gradeParts = student.grado.split(' / ');
      gTKD = gradeParts[0] || 'Cinturón Blanco';
      gKB = gradeParts[1] || 'Cinturón Blanco';
    } else if (student.modalidad === 'TAEKWONDO') {
      gTKD = student.grado || 'Cinturón Blanco';
    } else if (student.modalidad === 'KICKBOXING') {
      gKB = student.grado || 'Cinturón Blanco';
    }
    setFormGradoTKD(gTKD);
    setFormGradoKB(gKB);

    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const finalGrado = selectedStudent.modalidad === 'AMBAS'
      ? `${formGradoTKD} / ${formGradoKB}`
      : formGrado;

    try {
      setSaving(true);
      await API.put(`/students/${selectedStudent.id}`, {
        foto: formFoto,
        grado: finalGrado
      });

      // Actualizar estado local
      setStudents(prev => prev.map(s => {
        if (s.id === selectedStudent.id) {
          return { ...s, foto: formFoto, grado: finalGrado };
        }
        return s;
      }));

      setIsModalOpen(false);
      alert('Grado y foto del alumno actualizados correctamente.');
    } catch (err) {
      console.error('Error al guardar grado:', err);
      alert('Error al guardar cambios.');
    } finally {
      setSaving(false);
    }
  };

  // Filtrar estudiantes
  const filteredStudents = students.filter(student => {
    const matchesFilter = 
      activeFilter === 'TODOS' || 
      student.modalidad === activeFilter ||
      (student.modalidad === 'AMBAS' && (activeFilter === 'TAEKWONDO' || activeFilter === 'KICKBOXING'));
    
    const fullName = `${student.nombres} ${student.apellidos}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || (student.cedula && student.cedula.includes(search));

    return matchesFilter && matchesSearch;
  });

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
      
      {/* Header */}
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dorado-campeon/10 text-dorado-campeon border border-dorado-campeon/20 text-xs font-bold uppercase tracking-wider">
          <Award size={14} />
          Cuadro de Honor & Grados
        </div>
        <h1 class="text-4xl font-extrabold text-white font-heading tracking-widest uppercase">
          Grados y Cinturones Oficiales
        </h1>
        <p class="text-sm text-gray-300">
          Listado de alumnos activos acreditados en sus respectivos cinturones y disciplinas de combate.
        </p>
      </div>

      {/* Controls: Tab selector + Search */}
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-carbon/85 border border-white/10 p-4 rounded-xl shadow-xl">
        {/* Tab filters */}
        <div class="flex bg-carbon border border-dorado-campeon/30 p-1 w-full sm:w-auto">
          {['TODOS', 'TAEKWONDO', 'KICKBOXING'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              class={`px-5 py-2 text-xs font-display tracking-widest uppercase transition-all flex-grow sm:flex-grow-0 clip-button ${
                activeFilter === filter
                  ? 'bg-rojo-impacto text-tatami-blanco shadow-lg shadow-rojo-impacto/20'
                  : 'text-tatami-blanco/50 hover:text-tatami-blanco bg-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search */}
        <div class="relative w-full sm:max-w-xs">
          <Search size={16} class="text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            class="w-full bg-carbon border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-dorado-campeon"
          />
        </div>
      </div>

      {/* Admin Quick Alert */}
      {isAuthenticated && (
        <div class="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-sm flex items-center justify-between text-xs text-amber-300">
          <div class="flex items-center gap-2 font-bold uppercase tracking-wider">
            <ShieldAlert size={18} class="text-amber-400" />
            Modo Administrador Activo: Puedes editar fotos y grados directamente desde las tarjetas
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div class="flex flex-col items-center justify-center py-24 gap-4">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-dorado-campeon"></div>
          <p class="text-xs text-gray-400">Cargando galería de grados...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div class="text-center py-20 bg-carbon/30 border border-white/5 rounded-2xl space-y-4">
          <Award size={48} class="text-gray-600 mx-auto" />
          <h3 class="text-base font-bold text-white uppercase tracking-wider">No se encontraron alumnos</h3>
          <p class="text-xs text-gray-400 max-w-sm mx-auto">
            No hay alumnos registrados que coincidan con la disciplina o búsqueda seleccionada.
          </p>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              class="bg-carbon flex flex-col justify-between overflow-hidden relative group clip-card border-t border-r border-dorado-campeon/30 hover:border-dorado-campeon transition-colors duration-300"
              style={{ minHeight: '340px' }}
            >
              {/* Photo Area */}
              <div class="h-56 bg-carbon/50 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                {student.foto ? (
                  <img
                    src={student.foto}
                    alt={`${student.nombres} ${student.apellidos}`}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234A5568"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                    }}
                  />
                ) : (
                  <div class="flex flex-col items-center justify-center space-y-2 text-gray-600">
                    <Award size={48} class="text-gray-700 animate-pulse" />
                    <span class="text-[9px] uppercase tracking-wider">Sin Foto de Perfil</span>
                  </div>
                )}

                {/* Discipline Tag */}
                <span class={`absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-extrabold tracking-widest uppercase text-white shadow-md ${
                  student.modalidad === 'TAEKWONDO'
                    ? 'bg-blue-600 border border-blue-400/30'
                    : student.modalidad === 'KICKBOXING'
                    ? 'bg-red-600 border border-red-400/30'
                    : 'bg-purple-600 border border-purple-400/30'
                }`}>
                  {student.modalidad === 'AMBAS' ? 'TKD & KB' : student.modalidad}
                </span>

                {/* Admin Quick Action Button Over Photo */}
                {isAuthenticated && (
                  <button
                    onClick={() => handleOpenEditModal(student)}
                    class="absolute bottom-3 right-3 p-2 bg-dorado-campeon text-carbon hover:bg-white rounded-lg shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                    title="Editar Grado & Foto"
                  >
                    <Edit2 size={12} class="stroke-[3]" />
                  </button>
                )}
              </div>

              {/* Text Info */}
              <div class="p-4 flex-grow flex flex-col justify-between bg-carbon space-y-3">
                <div class="space-y-1">
                  <h3 class="text-lg font-display text-tatami-blanco uppercase tracking-widest line-clamp-1 group-hover:text-dorado-campeon transition-colors">
                    {student.nombres} {student.apellidos}
                  </h3>
                  <span class="text-[10px] text-tatami-blanco/50 font-body block uppercase">
                    C.I. {student.cedula}
                  </span>
                </div>

                {/* Real Belt Color Block */}
                {student.modalidad === 'AMBAS' ? (
                  <div class="flex flex-col sm:flex-row gap-2 w-full justify-center">
                    {(student.grado || '').split(' / ').map((grade, index) => (
                      <div key={index} class={`px-2 py-1.5 flex items-center justify-center gap-1 clip-button flex-1 ${getBeltColorClass(grade)}`}>
                        <Award size={10} class="flex-shrink-0" />
                        <span class="text-[10px] font-display uppercase tracking-widest line-clamp-1">
                          {index === 0 ? 'TKD: ' : 'KB: '}{grade}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class={`px-3 py-2 flex items-center justify-center gap-2 clip-button ${getBeltColorClass(student.grado)}`}>
                    <Award size={14} class="flex-shrink-0" />
                    <span class="text-xs font-display uppercase tracking-widest line-clamp-1">
                      {student.grado}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADMIN FAST EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Grado & Foto de Alumno"
      >
        {selectedStudent && (
          <form onSubmit={handleSave} class="space-y-4 font-sans text-xs">
            <div class="bg-carbon/40 border border-white/10 p-3 rounded-lg flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-carbon flex items-center justify-center font-bold text-dorado-campeon border border-dorado-campeon">
                {selectedStudent.nombres[0]}{selectedStudent.apellidos[0]}
              </div>
              <div>
                <h4 class="font-bold text-white text-sm uppercase">{selectedStudent.nombres} {selectedStudent.apellidos}</h4>
                <p class="text-[10px] text-gray-400">Modalidad registrada: <strong class="text-dorado-campeon">{selectedStudent.modalidad}</strong></p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] text-gray-400 uppercase mb-1">Subir Foto de Perfil</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, image/webp" 
                onChange={handleImageUpload}
                disabled={uploadingImage}
                class="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-dorado-campeon file:text-carbon hover:file:bg-[#b08d20] transition-all disabled:opacity-50 cursor-pointer"
              />
              {uploadingImage && <p class="text-[10px] text-amber-400 mt-1 animate-pulse">Subiendo imagen a la nube...</p>}
              
              <div class="text-center text-[10px] text-gray-500 my-2">O pega una URL directamente:</div>
              <input
                type="text"
                value={formFoto}
                onChange={(e) => setFormFoto(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                class="w-full bg-[#1C1C21] border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-dorado-campeon"
              />
            </div>

            <div>
              <label class="block text-[10px] text-gray-400 uppercase mb-1">Grado / Cinturón Actual</label>
              {selectedStudent.modalidad === 'AMBAS' ? (
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[9px] text-gray-500 uppercase mb-1">Cinturón Taekwondo</label>
                    <select
                      value={formGradoTKD}
                      onChange={(e) => setFormGradoTKD(e.target.value)}
                      required
                      class="w-full bg-[#1C1C21] border border-white/10 rounded-lg px-4 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-dorado-campeon"
                    >
                      {TAEKWONDO_BELTS.map(belt => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label class="block text-[9px] text-gray-500 uppercase mb-1">Cinturón Kickboxing</label>
                    <select
                      value={formGradoKB}
                      onChange={(e) => setFormGradoKB(e.target.value)}
                      required
                      class="w-full bg-[#1C1C21] border border-white/10 rounded-lg px-4 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-dorado-campeon"
                    >
                      {KICKBOXING_BELTS.map(belt => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <select
                  value={formGrado}
                  onChange={(e) => setFormGrado(e.target.value)}
                  required
                  class="w-full bg-[#1C1C21] border border-white/10 rounded-lg px-4 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-dorado-campeon"
                >
                  {selectedStudent.modalidad === 'TAEKWONDO'
                    ? TAEKWONDO_BELTS.map(belt => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))
                    : KICKBOXING_BELTS.map(belt => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))
                  }
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              class="w-full py-3 bg-rojo-impacto hover:bg-red-700 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'GUARDAR CAMBIOS'}
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default Grados;
