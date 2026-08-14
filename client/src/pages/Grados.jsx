import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Award, ShieldAlert, Edit2, Search, Trophy } from 'lucide-react';
import { getBeltStyle } from '../utils/belt-colors';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header Ledger */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-dorado-campeon/30 px-4 py-1.5 bg-dorado-campeon/5">
          <Award size={14} className="text-dorado-campeon" />
          <span className="text-xs font-body font-bold text-dorado-campeon tracking-[0.2em] uppercase">
            REGISTRO OFICIAL
          </span>
        </div>
        <h1 className="text-5xl font-heading text-tatami-blanco uppercase tracking-tight">
          GRADOS Y <span className="text-dorado-campeon">CINTURONES</span>
        </h1>
        <p className="text-sm font-body text-tatami-blanco/70 uppercase tracking-widest max-w-xl mx-auto">
          Listado de alumnos activos acreditados en sus respectivos cinturones.
        </p>
      </div>

      {/* Controls: Tab selector + Search */}
      <div className="bg-carbon border-y border-dorado-campeon/20 py-4 px-2 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Tab filters */}
        <div className="flex border border-dorado-campeon/30 p-1 w-full md:w-auto bg-[#0A0B0E]">
          {['TODOS', 'TAEKWONDO', 'KICKBOXING'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 text-[10px] font-heading tracking-widest uppercase transition-all flex-1 md:flex-none ${
                activeFilter === filter
                  ? 'bg-dorado-campeon text-carbon'
                  : 'text-tatami-blanco/50 hover:text-tatami-blanco bg-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search size={16} className="text-dorado-campeon/50 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar alumno o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0A0B0E] border border-white/5 pl-10 pr-4 py-2.5 text-xs text-tatami-blanco font-body uppercase tracking-wider placeholder-tatami-blanco/30 focus:outline-none focus:border-dorado-campeon/50 transition-colors"
          />
        </div>
      </div>

      {/* Admin Quick Alert */}
      {isAuthenticated && (
        <div className="bg-dorado-campeon/10 border border-dorado-campeon/40 p-4 flex items-center justify-center text-xs text-dorado-campeon font-bold uppercase tracking-[0.1em] text-center max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>Modo Administrador: Puedes editar fotos y grados directamente desde las placas</span>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-none h-10 w-10 border-t-2 border-b-2 border-dorado-campeon"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center">
          <Award size={40} className="text-dorado-campeon/30 mb-4" />
          <h3 className="font-heading text-tatami-blanco text-xl tracking-widest uppercase mb-2">Sin Registros</h3>
          <p className="text-sm font-body text-tatami-blanco/50">No hay alumnos con la disciplina o búsqueda seleccionada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-12">
          {filteredStudents.map(student => {
            // Determine primary belt style for the anchor line
            let primaryBeltStr = student.grado;
            if (student.modalidad === 'AMBAS' && student.grado) {
              primaryBeltStr = student.grado.split(' / ')[0]; // Use TKD belt for line
            }
            const belt = getBeltStyle(primaryBeltStr || '');

            return (
              <div
                key={student.id}
                className="bg-[#0A0B0E] flex flex-col border border-white/5 hover:border-dorado-campeon/30 transition-all duration-300 group shadow-[0_0_15px_rgba(227,178,60,0.05)] hover:shadow-[0_0_25px_rgba(227,178,60,0.15)] hover:-translate-y-1 relative"
                style={{ minHeight: '340px' }}
              >
                
                {/* Photo Area */}
                <div className="h-64 bg-[#0A0B0E] relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  {student.foto ? (
                    <img
                      src={student.foto}
                      alt={`${student.nombres} ${student.apellidos}`}
                      className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback avatar */}
                  <div className={`w-full h-full flex flex-col items-center justify-center ${student.foto ? 'hidden' : 'flex'}`}>
                    <div className="w-16 h-16 bg-tatami-blanco/5 border border-white/10 flex items-center justify-center mb-2">
                      <Trophy size={24} className="text-tatami-blanco/40" />
                    </div>
                    <span className="text-[9px] text-tatami-blanco/30 uppercase tracking-widest font-heading">Sin Foto</span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-transparent opacity-80"></div>

                  {/* Discipline Tag */}
                  <span className="absolute top-0 left-0 w-full py-1 text-center text-[10px] font-heading uppercase bg-dorado-campeon/10 text-dorado-campeon tracking-widest border-b border-dorado-campeon/30 backdrop-blur-sm">
                    {student.modalidad === 'AMBAS' ? 'TKD & KB' : student.modalidad}
                  </span>

                  {/* Admin Quick Action Button Over Photo */}
                  {isAuthenticated && (
                    <button
                      onClick={() => handleOpenEditModal(student)}
                      className="absolute bottom-3 right-3 w-8 h-8 bg-carbon border border-dorado-campeon/50 text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon shadow-[0_0_15px_rgba(227,178,60,0.3)] transition-colors flex items-center justify-center z-20"
                      title="Editar Grado & Foto"
                    >
                      <Edit2 size={14} className="stroke-[2.5]" />
                    </button>
                  )}
                </div>

                {/* Text Info */}
                <div className="p-5 pb-6 flex-grow flex flex-col items-center text-center bg-[#0A0B0E] relative z-10">
                  <h3 className="text-xl font-heading text-tatami-blanco uppercase tracking-wide line-clamp-1 mb-1 group-hover:text-dorado-campeon transition-colors">
                    {student.nombres} {student.apellidos}
                  </h3>
                  <span className="text-[10px] text-tatami-blanco/40 font-body uppercase tracking-widest mb-3">
                    C.I. {student.cedula}
                  </span>

                  {/* Grados textuales (Minimalistas) */}
                  {student.modalidad === 'AMBAS' ? (
                    <div className="flex flex-col gap-1 w-full mt-auto">
                      {(student.grado || '').split(' / ').map((grade, index) => (
                        <div key={index} className="text-[10px] font-body font-bold uppercase tracking-widest text-tatami-blanco/80 bg-carbon border border-white/5 py-1.5 w-full">
                          <span className="text-dorado-campeon/70 mr-1">{index === 0 ? 'TKD:' : 'KB:'}</span>
                          {grade}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] font-body font-bold uppercase tracking-widest text-tatami-blanco/80 bg-carbon border border-white/5 py-1.5 w-full mt-auto">
                      {student.grado || 'NO ASIGNADO'}
                    </div>
                  )}
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
            );
          })}
        </div>
      )}

      {/* ADMIN FAST EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ACTUALIZAR REGISTRO"
      >
        {selectedStudent && (
          <form onSubmit={handleSave} className="space-y-6 font-body text-xs bg-[#0A0B0E] p-1">
            <div className="border border-white/10 p-4 flex flex-col items-center gap-3 bg-carbon text-center">
              <div className="w-12 h-12 bg-[#0A0B0E] border border-dorado-campeon/50 flex items-center justify-center font-heading text-lg text-dorado-campeon uppercase">
                {selectedStudent.nombres[0]}{selectedStudent.apellidos[0]}
              </div>
              <div>
                <h4 className="font-heading text-tatami-blanco text-lg uppercase tracking-wide">{selectedStudent.nombres} {selectedStudent.apellidos}</h4>
                <p className="text-[10px] text-tatami-blanco/50 uppercase tracking-widest">Modalidad: <strong className="text-dorado-campeon">{selectedStudent.modalidad}</strong></p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-tatami-blanco/60 uppercase tracking-widest">Foto Oficial</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, image/webp" 
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="block w-full text-xs text-tatami-blanco/50 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-heading file:tracking-widest file:uppercase file:bg-dorado-campeon file:text-carbon hover:file:bg-[#b08d20] transition-all disabled:opacity-50 cursor-pointer"
              />
              {uploadingImage && <p className="text-[10px] text-dorado-campeon mt-1 animate-pulse">Sincronizando imagen...</p>}
              
              <div className="flex items-center gap-4 my-4">
                <div className="h-[1px] bg-white/10 flex-1"></div>
                <div className="text-[9px] text-tatami-blanco/30 uppercase tracking-widest">O PEGAR URL</div>
                <div className="h-[1px] bg-white/10 flex-1"></div>
              </div>
              
              <input
                type="text"
                value={formFoto}
                onChange={(e) => setFormFoto(e.target.value)}
                placeholder="https://..."
                className="w-full bg-carbon border border-white/10 px-4 py-2 text-xs text-tatami-blanco focus:outline-none focus:border-dorado-campeon font-body placeholder-tatami-blanco/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-tatami-blanco/60 uppercase tracking-widest mb-2">Asignación de Grado</label>
              {selectedStudent.modalidad === 'AMBAS' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-dorado-campeon/70 uppercase mb-1 tracking-widest">Taekwondo</label>
                    <select
                      value={formGradoTKD}
                      onChange={(e) => setFormGradoTKD(e.target.value)}
                      required
                      className="w-full bg-carbon border border-white/10 px-4 py-2 text-xs text-tatami-blanco uppercase font-bold focus:outline-none focus:border-dorado-campeon appearance-none"
                    >
                      {TAEKWONDO_BELTS.map(belt => (
                        <option key={belt} value={belt} className="bg-carbon">{belt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-dorado-campeon/70 uppercase mb-1 tracking-widest">Kickboxing</label>
                    <select
                      value={formGradoKB}
                      onChange={(e) => setFormGradoKB(e.target.value)}
                      required
                      className="w-full bg-carbon border border-white/10 px-4 py-2 text-xs text-tatami-blanco uppercase font-bold focus:outline-none focus:border-dorado-campeon appearance-none"
                    >
                      {KICKBOXING_BELTS.map(belt => (
                        <option key={belt} value={belt} className="bg-carbon">{belt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <select
                  value={formGrado}
                  onChange={(e) => setFormGrado(e.target.value)}
                  required
                  className="w-full bg-carbon border border-white/10 px-4 py-2 text-xs text-tatami-blanco uppercase font-bold focus:outline-none focus:border-dorado-campeon appearance-none"
                >
                  {selectedStudent.modalidad === 'TAEKWONDO'
                    ? TAEKWONDO_BELTS.map(belt => (
                        <option key={belt} value={belt} className="bg-carbon">{belt}</option>
                      ))
                    : KICKBOXING_BELTS.map(belt => (
                        <option key={belt} value={belt} className="bg-carbon">{belt}</option>
                      ))
                  }
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-rojo-impacto text-tatami-blanco font-heading text-sm tracking-widest uppercase hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {saving ? 'PROCESANDO...' : 'CONFIRMAR REGISTRO'}
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default Grados;
