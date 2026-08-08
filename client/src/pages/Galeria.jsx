import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import API from '../services/api';

const Galeria = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await API.get('/students');
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.nombres.toLowerCase().includes(search.toLowerCase()) ||
    s.apellidos.toLowerCase().includes(search.toLowerCase()) ||
    s.cedula.includes(search)
  );

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <h1 class="text-4xl font-extrabold text-white font-heading uppercase tracking-tight">
          GALERÍA DE ESTUDIANTES
        </h1>
        <p class="text-sm text-gray-300">
          Encuentra tu perfil y revive tus mejores momentos marciales.
        </p>
      </div>

      <div class="bg-[#111114]/50 border border-white/10 p-4 rounded-xl max-w-2xl mx-auto backdrop-blur-md">
        <div class="relative w-full">
          <Search class="w-5 h-5 text-dorado-campeon absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            class="w-full bg-[#1C1C21] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-dorado-campeon/50 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div class="flex justify-center items-center py-32">
          <Loader class="animate-spin text-[#C9A227]" size={50} />
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredStudents.length === 0 ? (
            <div class="col-span-full py-24 text-center text-gray-400 flex flex-col items-center">
              <div class="w-20 h-20 rounded-2xl bg-[#0B1550]/10 border border-[#C9A227]/30 flex items-center justify-center mb-6">
                <AlertCircle size={36} class="text-[#C9A227]/60" />
              </div>
              <p class="font-heading font-bold text-white text-lg tracking-widest uppercase mb-1">
                No hay resultados
              </p>
              <p class="text-sm text-gray-400 max-w-xs">
                No se encontraron estudiantes con esa búsqueda.
              </p>
            </div>
          ) : (
            <>
              {/* Tarjeta de Fotos Generales */}
              {search === '' && (
                <Link 
                  to={`/galeria/generales`}
                  class="bg-[#1C1C21] border border-dorado-campeon/30 rounded-2xl overflow-hidden hover:border-dorado-campeon transition-all duration-300 hover:-translate-y-2 group shadow-xl shadow-dorado-campeon/5"
                >
                  <div class="h-48 bg-gradient-to-br from-[#0B1550] to-carbon relative overflow-hidden flex justify-center items-center">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#1C1C21] to-transparent z-10"></div>
                    <User size={80} class="text-dorado-campeon opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <div class="p-5">
                    <p class="font-body font-bold text-dorado-campeon uppercase text-base leading-tight drop-shadow-md mb-1">FOTOS GENERALES</p>
                    <p class="text-[11px] text-gray-400 font-mono">Álbum del Dojang</p>
                    
                    <div class="mt-5 flex items-center justify-between text-xs border-t border-white/5 pt-4">
                      <div>
                        <span class="block text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Acceso</span>
                        <span class="text-white font-bold">Público</span>
                      </div>
                      <div class="w-8 h-8 rounded-full bg-dorado-campeon/10 flex items-center justify-center group-hover:bg-dorado-campeon/20 transition-colors">
                        <ChevronRight size={18} class="text-dorado-campeon" />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Tarjetas de Estudiantes */}
              {filteredStudents.map((student) => (
                <Link 
                  key={student.id} 
                  to={`/galeria/${student.id}`}
                  class="bg-[#1C1C21] border border-white/5 rounded-2xl overflow-hidden hover:border-dorado-campeon/50 transition-all duration-300 hover:-translate-y-2 group shadow-xl hover:shadow-dorado-campeon/10"
                >
                  <div class="h-48 bg-carbon relative overflow-hidden flex justify-center items-center">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#1C1C21] to-transparent z-10"></div>
                    {student.foto ? (
                      <img src={student.foto} alt={student.nombres} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <User size={80} class="text-gray-600 opacity-30 group-hover:opacity-50 transition-opacity" />
                    )}
                  </div>
                  <div class="p-5">
                    <p class="font-body font-bold text-white uppercase text-base leading-tight drop-shadow-md mb-1 line-clamp-2">{student.nombres} {student.apellidos}</p>
                    
                    <div class="mt-5 flex items-center justify-between text-xs border-t border-white/5 pt-4">
                      <div>
                        <span class="block text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">Grado</span>
                        <span class="text-dorado-campeon font-bold">{student.grado?.split(' / ')[0]}</span>
                      </div>
                      <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-dorado-campeon/10 transition-colors">
                        <ChevronRight size={18} class="text-gray-500 group-hover:text-dorado-campeon transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default Galeria;
