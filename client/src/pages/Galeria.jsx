import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, AlertCircle, Loader, Filter } from 'lucide-react';
import API from '../services/api';
import { getBeltStyle } from '../utils/belt-colors';

const Galeria = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nombres.toLowerCase().includes(search.toLowerCase()) ||
                          s.apellidos.toLowerCase().includes(search.toLowerCase()) ||
                          s.cedula.includes(search);
    const matchesRank = rankFilter === '' || (s.grado && s.grado.toLowerCase().includes(rankFilter.toLowerCase()));
    
    return matchesSearch && matchesRank;
  });

  // Mock de rangos para el filtro (podría extraerse de la DB o constantes)
  const availableRanks = ['Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Morado', 'Marrón', 'Rojo', 'Negro', 'Dan', 'Poom'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-heading text-tatami-blanco uppercase tracking-tight">
          SALÓN DE CAMPEONES
        </h1>
        <p className="text-base font-body text-tatami-blanco/70 max-w-xl mx-auto">
          El registro oficial de nuestros artistas marciales. Disciplina, enfoque y legado, forjados en el tatami.
        </p>
      </div>

      {/* Panel de Filtros - Registro Oficial */}
      <div className="bg-carbon border-y border-dorado-campeon/20 py-4 px-2 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex items-center gap-3 md:border-r border-dorado-campeon/20 pr-6 flex-1">
          <Search className="w-5 h-5 text-dorado-campeon/50" />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-sm text-tatami-blanco placeholder:text-tatami-blanco/30 focus:outline-none focus:ring-0 font-body"
          />
        </div>
        
        <div className="flex items-center gap-4 flex-1 md:flex-none">
          <Filter className="w-4 h-4 text-dorado-campeon/50 hidden md:block" />
          <select 
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="bg-transparent border-none text-sm text-tatami-blanco focus:outline-none focus:ring-0 font-body uppercase tracking-wider cursor-pointer appearance-none flex-1"
          >
            <option value="" className="bg-carbon text-tatami-blanco">TODOS LOS RANGOS</option>
            {availableRanks.map(r => (
              <option key={r} value={r} className="bg-carbon text-tatami-blanco">{r.toUpperCase()}</option>
            ))}
          </select>

          {/* Placeholder para filtro de Categoría */}
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none text-sm text-tatami-blanco focus:outline-none focus:ring-0 font-body uppercase tracking-wider cursor-pointer appearance-none md:border-l md:border-dorado-campeon/20 md:pl-4 flex-1"
          >
            <option value="" className="bg-carbon text-tatami-blanco">CATEGORÍA</option>
            <option value="infantil" className="bg-carbon text-tatami-blanco">INFANTIL</option>
            <option value="juvenil" className="bg-carbon text-tatami-blanco">JUVENIL</option>
            <option value="adulto" className="bg-carbon text-tatami-blanco">ADULTO</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader className="animate-spin text-dorado-campeon" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-24">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-24 text-center flex flex-col items-center">
              <AlertCircle size={40} className="text-dorado-campeon/40 mb-4" />
              <p className="font-heading text-tatami-blanco text-xl tracking-widest uppercase mb-2">
                Sin registros
              </p>
              <p className="text-sm font-body text-tatami-blanco/50">
                No se encontraron estudiantes con esos criterios.
              </p>
            </div>
          ) : (
            <>
              {/* Placa General */}
              {search === '' && rankFilter === '' && categoryFilter === '' && (
                <Link 
                  to={`/galeria/generales`}
                  className="group bg-carbon flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_0_15px_rgba(227,178,60,0.08)] hover:shadow-[0_0_25px_rgba(227,178,60,0.12)] border border-transparent hover:border-dorado-campeon/20"
                >
                  <div className="h-64 relative bg-[#0A0B0E] flex flex-col items-center justify-center border border-white/5 border-b-0 p-6 text-center">
                    <div className="w-16 h-16 rounded-none border border-dorado-campeon/30 flex items-center justify-center mb-4 group-hover:border-dorado-campeon transition-all">
                       <span className="text-dorado-campeon text-2xl">🏆</span>
                    </div>
                    <p className="font-heading text-tatami-blanco text-2xl uppercase tracking-widest leading-none mb-2">
                      FOTOS GENERALES
                    </p>
                    <p className="font-body font-bold text-sm uppercase tracking-widest text-dorado-campeon/85">
                      Álbum Oficial
                    </p>
                  </div>
                  
                  {/* Línea base dorada (Mapeo a cinturón campeón) */}
                  <div className="relative">
                    <div className="h-2 w-full bg-dorado-campeon"></div>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center bg-carbon border border-white/5 border-t-0">
                     <span className="font-body text-[10px] text-dorado-campeon/50 uppercase tracking-widest">Acceso Público</span>
                     <ChevronRight className="w-4 h-4 text-dorado-campeon/50 group-hover:text-dorado-campeon transition-colors" />
                  </div>
                </Link>
              )}

              {/* Placas de Estudiantes (Muro de Honor) */}
              {filteredStudents.map((student) => {
                const belt = getBeltStyle(student.grado || '');
                return (
                  <Link 
                    key={student.id} 
                    to={`/galeria/${student.id}`}
                    className="group bg-carbon flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-[0_0_15px_rgba(227,178,60,0.08)] hover:shadow-[0_0_25px_rgba(227,178,60,0.12)] border border-transparent hover:border-dorado-campeon/20"
                  >
                    <div className="h-72 relative bg-[#0A0B0E] border border-white/5 border-b-0 overflow-hidden">
                      {student.foto ? (
                        <img 
                          src={student.foto} 
                          alt={student.nombres} 
                          className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center opacity-30 group-hover:opacity-60 transition-opacity">
                          <div className="w-20 h-20 bg-tatami-blanco/5 rounded-none border border-white/10 flex items-center justify-center">
                            <span className="font-heading text-4xl text-tatami-blanco">
                              {student.nombres?.charAt(0)}{student.apellidos?.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* INFO Y ANCLAJE DE RANGO */}
                    <div className="bg-carbon border border-white/5 border-t-0 relative">
                      <div className="p-5 pb-6 text-center z-10 relative">
                        {/* Nombre: Anton, mayor peso, blanco puro */}
                        <p className="font-heading text-tatami-blanco text-2xl uppercase leading-none tracking-wide mb-2 line-clamp-1">
                          {student.nombres} {student.apellidos}
                        </p>
                        
                        {/* Rango: Manrope bold, dorado 85%, tabular */}
                        <p className="font-body font-bold text-dorado-campeon/85 text-sm uppercase tracking-widest tabular-nums">
                          {student.grado || 'Sin Grado'}
                        </p>

                        {/* Secondary metadata */}
                        <p className="font-body text-[10px] text-dorado-campeon/50 uppercase tracking-widest mt-3">
                          Ver Registro Completo
                        </p>
                      </div>
                      
                      {/* Línea de Anclaje de Cinturón */}
                      <div className="relative">
                        <div 
                          className="h-[6px] w-full"
                          style={{ backgroundColor: belt.backgroundColor }}
                        ></div>
                        {belt.isBlackBelt && (
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E3B23C] opacity-100 z-20"></div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Galeria;
