import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { User, ArrowLeft, Camera, Image as ImageIcon, Loader, Plus, Trash2, Calendar } from 'lucide-react';

const PerfilDetalleAdmin = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Gallery states
  const [showAddForm, setShowAddForm] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/students/${id}`);
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      alert('Error al cargar el perfil del estudiante.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoFile) return;

    try {
      setUploading(true);
      // 1. Subir imagen a Cloudinary
      const formData = new FormData();
      formData.append('image', photoFile);
      const uploadRes = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadRes.data.url;

      // 2. Guardar en la galería del estudiante
      await API.post(`/students/${id}/gallery`, {
        url: imageUrl,
        descripcion: photoDescription
      });

      // Reset y recargar
      setShowAddForm(false);
      setPhotoFile(null);
      setPhotoPreview('');
      setPhotoDescription('');
      fetchStudent();
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Ocurrió un error al subir la foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta foto de la galería?')) {
      try {
        await API.delete(`/students/gallery/${photoId}`);
        fetchStudent();
      } catch (error) {
        console.error('Error deleting photo:', error);
        alert('Ocurrió un error al eliminar la foto.');
      }
    }
  };

  if (loading) {
    return (
      <div class="flex justify-center items-center py-32">
        <Loader class="animate-spin text-dorado-campeon" size={50} />
      </div>
    );
  }

  if (!student) {
    return (
      <div class="text-center py-20 text-white">
        <p>Estudiante no encontrado.</p>
        <Link to="/admin/perfiles" class="text-dorado-campeon mt-4 inline-block hover:underline">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div class="space-y-6 pb-12">
      {/* HEADER */}
      <div class="flex items-center gap-4">
        <Link to="/admin/perfiles" class="p-2 bg-carbon border border-white/10 rounded-lg hover:border-dorado-campeon transition-colors">
          <ArrowLeft class="text-white" size={20} />
        </Link>
        <div>
          <h2 class="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Perfil del Estudiante
          </h2>
          <p class="text-gray-400 text-sm">Ficha técnica y progreso visual</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LADO IZQUIERDO: FICHA TÉCNICA */}
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-carbon border border-dorado-campeon/30 rounded-xl overflow-hidden relative shadow-[0_0_15px_rgba(201,162,39,0.1)]">
            <div class="h-24 bg-gradient-to-br from-[#1C1C21] to-[#0A0B0E] border-b border-white/5 relative">
               <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(201,162,39,0.8)_0%,_transparent_70%)]"></div>
            </div>
            
            <div class="px-6 pb-6 relative">
              <div class="flex justify-center -mt-12 mb-4">
                <div class="w-24 h-24 rounded-full border-4 border-carbon bg-[#1C1C21] overflow-hidden flex items-center justify-center shadow-lg relative z-10">
                  {student.foto ? (
                    <img src={student.foto} alt={student.nombres} class="w-full h-full object-cover" />
                  ) : (
                    <User size={40} class="text-gray-500" />
                  )}
                </div>
              </div>
              
              <div class="text-center">
                <p class="text-xl font-body font-bold text-white uppercase leading-tight">{student.nombres} <br/> {student.apellidos}</p>
                
                <div class="mt-3 inline-flex px-3 py-1 bg-dorado-campeon/10 border border-dorado-campeon/30 rounded-full text-dorado-campeon text-[10px] font-bold uppercase tracking-widest">
                  {student.grado}
                </div>
              </div>

              <div class="mt-8 space-y-4">
                <div class="bg-[#111114] p-3 rounded-lg border border-white/5">
                  <h4 class="text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Datos Personales</h4>
                  <div class="space-y-2 text-xs">
                    <div class="flex justify-between border-b border-white/5 pb-1">
                      <span class="text-gray-400">Edad:</span>
                      <span class="text-white font-mono">{student.edad} años</span>
                    </div>
                    <div class="flex justify-between border-b border-white/5 pb-1">
                      <span class="text-gray-400">Celular:</span>
                      <span class="text-white font-mono">{student.celular}</span>
                    </div>
                    <div class="flex justify-between border-b border-white/5 pb-1">
                      <span class="text-gray-400">Ingreso:</span>
                      <span class="text-white font-mono">{student.fechaIngreso}</span>
                    </div>
                    <div class="flex justify-between pb-1">
                      <span class="text-gray-400">Estado:</span>
                      <span class={`font-bold ${student.estado === 'ACTIVO' ? 'text-green-500' : 'text-red-500'}`}>
                        {student.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {student.alergias || student.enfermedades || student.lesiones ? (
                   <div class="bg-[#111114] p-3 rounded-lg border border-red-500/20">
                     <h4 class="text-[9px] text-red-400 uppercase tracking-widest mb-2 font-bold">Consideraciones Médicas</h4>
                     <ul class="text-xs text-gray-300 space-y-1">
                       {student.alergias && <li><span class="text-gray-500">Alergias:</span> {student.alergias}</li>}
                       {student.enfermedades && <li><span class="text-gray-500">Enfermedades:</span> {student.enfermedades}</li>}
                       {student.lesiones && <li><span class="text-gray-500">Lesiones:</span> {student.lesiones}</li>}
                     </ul>
                   </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: GALERÍA DE PROGRESO */}
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-carbon border border-white/10 rounded-xl p-6 shadow-xl">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <ImageIcon class="text-dorado-campeon" size={20} />
                  Galería de Progreso
                </h3>
                <p class="text-[11px] text-gray-400 mt-1">Registra la evolución visual del estudiante</p>
              </div>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                class="flex items-center gap-2 bg-dorado-campeon hover:bg-yellow-500 text-carbon font-bold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                {showAddForm ? 'Cancelar' : <><Plus size={16}/> Nueva Foto</>}
              </button>
            </div>

            {/* FORMULARIO DE SUBIDA */}
            {showAddForm && (
              <div class="bg-[#111114] p-5 rounded-lg border border-dorado-campeon/30 mb-8 animate-fade-in">
                <form onSubmit={handleUploadPhoto} class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Archivo */}
                    <div>
                      <label class="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Seleccionar Imagen</label>
                      <div class="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-dorado-campeon/50 transition-colors">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          required
                        />
                        <Camera class="mx-auto text-gray-500 mb-2" size={32} />
                        <span class="text-xs text-gray-400">Click o arrastra para subir foto</span>
                      </div>
                    </div>
                    
                    {/* Input Detalles */}
                    <div class="space-y-4">
                      <div>
                        <label class="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Título / Descripción (Ej: Cinta Amarilla)</label>
                        <input 
                          type="text" 
                          value={photoDescription}
                          onChange={(e) => setPhotoDescription(e.target.value)}
                          placeholder="Examen de ascenso, torneo, etc..."
                          class="w-full bg-[#1C1C21] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-dorado-campeon"
                          required
                        />
                      </div>
                      
                      {/* Preview mini */}
                      {photoPreview && (
                        <div class="h-24 w-full bg-[#1C1C21] rounded-lg overflow-hidden border border-white/10 relative">
                          <img src={photoPreview} alt="Preview" class="w-full h-full object-cover" />
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={uploading || !photoFile}
                        class="w-full bg-white text-carbon hover:bg-gray-200 font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {uploading ? <><Loader size={16} class="animate-spin"/> Subiendo...</> : 'Guardar en Galería'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* GRID DE GALERÍA */}
            {student.gallery && student.gallery.length > 0 ? (
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {student.gallery.map((photo) => (
                  <div key={photo.id} class="group relative rounded-xl overflow-hidden border border-white/10 bg-[#1C1C21] aspect-square">
                    <img 
                      src={photo.url} 
                      alt={photo.descripcion || 'Foto del estudiante'} 
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay info */}
                    <div class="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p class="text-dorado-campeon font-bold text-sm mb-1 line-clamp-2">{photo.descripcion}</p>
                      <div class="flex items-center gap-1 text-[10px] text-gray-300">
                        <Calendar size={10} />
                        {new Date(photo.createdAt).toLocaleDateString()}
                      </div>
                      
                      {/* Botón borrar */}
                      <button 
                        onClick={() => handleDeletePhoto(photo.id)}
                        class="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                        title="Eliminar foto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="text-center py-16 bg-[#111114] border border-white/5 rounded-lg border-dashed">
                <ImageIcon class="mx-auto text-gray-600 mb-3" size={40} />
                <p class="text-gray-400 text-sm">Este estudiante aún no tiene fotos en su galería de progreso.</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  class="mt-4 text-dorado-campeon text-xs font-bold hover:underline"
                >
                  Subir la primera foto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilDetalleAdmin;
