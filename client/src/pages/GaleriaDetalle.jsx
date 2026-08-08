import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, ImageOff, ArrowLeft, Calendar } from 'lucide-react';
import API from '../services/api';

const GaleriaDetalle = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await API.get(`/students/${id}`);
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div class="flex justify-center items-center py-32 min-h-screen">
        <Loader class="animate-spin text-[#C9A227]" size={50} />
      </div>
    );
  }

  if (!student) {
    return (
      <div class="flex flex-col items-center justify-center py-32 text-center min-h-screen">
        <h2 class="text-2xl font-bold text-white mb-2">Estudiante no encontrado</h2>
        <Link to="/galeria" class="text-dorado-campeon hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Volver a la galería
        </Link>
      </div>
    );
  }

  const images = student.gallery || [];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Header Profile */}
      <div class="relative bg-[#111114] border border-white/10 rounded-2xl p-6 md:p-10 overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-dorado-campeon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div class="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-[#1C1C21] shadow-xl bg-carbon">
            {student.foto ? (
              <img src={student.foto} alt={student.nombres} class="w-full h-full object-cover" />
            ) : (
              <div class="w-full h-full flex items-center justify-center">
                <ImageOff size={40} class="text-gray-600 opacity-50" />
              </div>
            )}
          </div>
          
          <div class="text-center md:text-left flex-1">
            <Link to="/galeria" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} /> Volver a perfiles
            </Link>
            
            <h1 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-2">
              {student.nombres} <span class="text-dorado-campeon">{student.apellidos}</span>
            </h1>
            
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <div class="bg-[#1C1C21] px-4 py-2 rounded-lg border border-white/5">
                <span class="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Grado</span>
                <span class="text-white font-bold text-sm">{student.grado}</span>
              </div>
              
              <div class="bg-[#1C1C21] px-4 py-2 rounded-lg border border-white/5">
                <span class="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Modalidad</span>
                <span class="text-white font-bold text-sm">{student.modalidad || 'TAEKWONDO'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div class="space-y-6 pt-4">
        <h2 class="text-2xl font-bold text-white uppercase flex items-center gap-2">
          Álbum de Fotos <span class="text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">{images.length} fotos</span>
        </h2>
        
        {images.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-20 bg-[#111114]/50 border border-white/5 rounded-2xl text-center">
            <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <ImageOff size={28} class="text-gray-500" />
            </div>
            <h3 class="text-white font-bold mb-1">Sin fotos todavía</h3>
            <p class="text-sm text-gray-400 max-w-md">
              El álbum personal de este estudiante aún no tiene fotos publicadas.
            </p>
          </div>
        ) : (
          <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-20">
            {images.map((img) => (
              <div key={img.id} class="break-inside-avoid group relative rounded-2xl overflow-hidden border border-[#C9A227]/10 shadow-xl bg-carbon">
                <img src={img.url} alt={img.descripcion || 'Foto del estudiante'} class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                
                <div class="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  {img.descripcion && (
                    <h3 class="text-white font-bold text-sm leading-tight drop-shadow-md mb-2">{img.descripcion}</h3>
                  )}
                  <div class="flex items-center text-[10px] text-gray-300 gap-1.5 font-mono">
                    <Calendar size={12} class="text-dorado-campeon" />
                    {new Date(img.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default GaleriaDetalle;
