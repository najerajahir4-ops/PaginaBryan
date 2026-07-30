import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../services/api';
import { Search, User, ChevronRight, AlertCircle, Loader } from 'lucide-react';

const PerfilesAdmin = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/students');
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.nombres.toLowerCase().includes(search.toLowerCase()) ||
    s.apellidos.toLowerCase().includes(search.toLowerCase()) ||
    s.cedula.includes(search)
  );

  return (
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <User class="text-dorado-campeon" size={28} />
            Perfiles de Estudiantes
          </h2>
          <p class="text-gray-400 text-sm">Selecciona un estudiante para ver su perfil completo y su galería de progreso.</p>
        </div>
      </div>

      <div class="bg-[#111114] border border-white/10 p-4 rounded-sm">
        <div class="relative max-w-md">
          <Search class="w-4 h-4 text-dorado-campeon absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            class="w-full bg-[#1C1C21] border border-white/10 rounded-sm pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-dorado-campeon"
          />
        </div>
      </div>

      {loading ? (
        <div class="flex justify-center items-center py-20">
          <Loader class="animate-spin text-dorado-campeon" size={40} />
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.length === 0 ? (
            <div class="col-span-full py-12 text-center text-gray-400 flex flex-col items-center">
              <AlertCircle size={40} class="mb-4 text-gray-500" />
              <p>No se encontraron estudiantes con esa búsqueda.</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <Link 
                key={student.id} 
                to={`/admin/perfiles/${student.id}`}
                class="bg-[#1C1C21] border border-white/5 rounded-lg overflow-hidden hover:border-dorado-campeon/50 transition-all hover:transform hover:-translate-y-1 group"
              >
                <div class="h-32 bg-carbon relative overflow-hidden flex justify-center items-center">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#1C1C21] to-transparent z-10"></div>
                  {student.foto ? (
                    <img src={student.foto} alt={student.nombres} class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <User size={60} class="text-gray-600 opacity-30" />
                  )}
                  <div class="absolute bottom-2 left-3 z-20">
                    <span class={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                      student.estado === 'ACTIVO' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {student.estado}
                    </span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="font-bold text-white uppercase text-sm truncate">{student.nombres} {student.apellidos}</h3>
                  <p class="text-[10px] text-gray-400 font-mono mt-1">C.I. {student.cedula}</p>
                  
                  <div class="mt-4 flex items-center justify-between text-[11px] border-t border-white/5 pt-3">
                    <div>
                      <span class="block text-gray-500 uppercase tracking-wider text-[9px]">Grado</span>
                      <span class="text-dorado-campeon font-bold">{student.grado.split(' / ')[0]}</span>
                    </div>
                    <ChevronRight size={16} class="text-gray-500 group-hover:text-dorado-campeon transition-colors" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PerfilesAdmin;
