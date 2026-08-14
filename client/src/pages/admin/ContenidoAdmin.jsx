import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Modal from '../../components/Modal';
import { FileText, Plus, Edit, Trash2, Video, Calendar, Camera, Loader } from 'lucide-react';

const ContenidoAdmin = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    categoria: 'TECNICA',
    resumen: '',
    cuerpo: '',
    imagenUrl: '',
    videoUrl: '',
    fechaPublicacion: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/content');
      setContents(res.data);
    } catch (err) {
      console.error('Error al cargar contenido:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (content = null) => {
    if (content) {
      setSelectedContent(content);
      setCoverFile(null);
      setCoverPreview(content.imagenUrl || '');
      setForm({
        titulo: content.titulo,
        categoria: content.categoria,
        resumen: content.resumen,
        cuerpo: content.cuerpo,
        imagenUrl: content.imagenUrl || '',
        videoUrl: content.videoUrl || '',
        fechaPublicacion: content.fechaPublicacion,
      });
    } else {
      setSelectedContent(null);
      setCoverFile(null);
      setCoverPreview('');
      setForm({
        titulo: '',
        categoria: 'TECNICA',
        resumen: '',
        cuerpo: '',
        imagenUrl: '',
        videoUrl: '',
        fechaPublicacion: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let finalImageUrl = form.imagenUrl;

      if (coverFile) {
        const formData = new FormData();
        formData.append('image', coverFile);
        const uploadRes = await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalImageUrl = uploadRes.data.url;
      }

      const dataToSave = { ...form, imagenUrl: finalImageUrl };

      if (selectedContent) {
        await API.put(`/content/${selectedContent.id}`, dataToSave);
      } else {
        await API.post('/content', dataToSave);
      }
      setIsModalOpen(false);
      fetchContents();
    } catch (err) {
      console.error(err);
      alert('Error al guardar publicación.');
    } finally {
      setUploading(false);
    }
  };

  const handleInsertTemplate = () => {
    const template = `# TÍTULO PRINCIPAL
*Un subtítulo o breve descripción en cursiva*

---

## 🛡️ Sección 1: Conceptos Claves
Escribe aquí una breve introducción.

### Punto Importante
- **Elemento 1** ➝ Explicación
- **Elemento 2** ➝ Explicación

---

## 🎯 Sección 2: Reglas o Pasos
1. Primer paso importante.
2. Segundo paso importante.

> "Una cita importante o nota a destacar va aquí."

---

## ⚠️ Notas Finales
- Recuerda siempre usar los símbolos correspondientes.
`;
    setForm(prev => ({ ...prev, cuerpo: prev.cuerpo ? prev.cuerpo + '\n\n' + template : template }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      try {
        await API.delete(`/content/${id}`);
        fetchContents();
      } catch (err) {
        alert('Error al eliminar publicación.');
      }
    }
  };

  return (
    <div class="space-y-8">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dorado-campeon pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-body tracking-tight uppercase">
            Gestión de Contenido & Recursos
          </h1>
          <p className="text-xs text-dorado-campeon font-bold tracking-widest uppercase mt-1">
            Publica y edita artículos técnicos, novedades del reglamento, entrevistas y nutrición.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          class="px-5 py-2.5 bg-rojo-impacto hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-rojo-impacto/30 inline-flex items-center gap-2"
        >
          <Plus size={16} />
          NUEVA PUBLICACIÓN
        </button>
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rojo-impacto"></div>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((item) => (
            <div key={item.id} class="bg-carbon/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between p-5 space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="px-2.5 py-1 rounded-full font-extrabold uppercase bg-rojo-impacto text-white">
                    {item.categoria}
                  </span>
                  <span class="text-gray-400">{item.fechaPublicacion}</span>
                </div>
                <h3 class="text-base font-bold text-white font-heading">{item.titulo}</h3>
                <p class="text-xs text-gray-300 line-clamp-2">{item.resumen}</p>
              </div>

              <div class="pt-4 border-t border-white/10 flex justify-between items-center">
                {item.videoUrl && (
                  <span class="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                    <Video size={12} /> Con Video
                  </span>
                )}
                <div class="flex gap-2 ml-auto">
                  <button
                    onClick={() => handleOpenModal(item)}
                    class="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    class="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal CRUD Contenido */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContent ? 'Editar Publicación' : 'Nueva Publicación'}
      >
        <form onSubmit={handleSave} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Título</label>
            <input
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              class="w-full bg-carbon border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                class="w-full bg-carbon border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              >
                <option value="TECNICA">Técnica</option>
                <option value="REGLAMENTO">Reglamento</option>
                <option value="NUTRICION">Nutrición Deportiva</option>
                <option value="NOTICIAS">Noticias</option>
                <option value="ENTREVISTAS">Entrevistas</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Fecha Publicación</label>
              <input
                type="date"
                required
                value={form.fechaPublicacion}
                onChange={(e) => setForm({ ...form, fechaPublicacion: e.target.value })}
                class="w-full bg-carbon border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Resumen Corto</label>
            <input
              type="text"
              required
              value={form.resumen}
              onChange={(e) => setForm({ ...form, resumen: e.target.value })}
              class="w-full bg-carbon border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div>
            <div class="flex justify-between items-end mb-1">
              <label class="block text-xs font-bold text-gray-300 uppercase">Cuerpo / Contenido Completo</label>
              <button 
                type="button"
                onClick={handleInsertTemplate}
                class="text-[10px] font-bold uppercase tracking-wider bg-dorado-campeon/10 text-dorado-campeon border border-dorado-campeon/30 px-3 py-1 rounded hover:bg-dorado-campeon hover:text-black transition-colors"
              >
                + Insertar Plantilla Base
              </button>
            </div>
            <textarea
              rows="5"
              required
              value={form.cuerpo}
              onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
              class="w-full bg-carbon border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Imagen de Portada</label>
              <div class="relative border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-rojo-impacto/50 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {!coverPreview ? (
                  <>
                    <Camera class="mx-auto text-gray-500 mb-1" size={24} />
                    <span class="text-[10px] text-gray-400">Click o arrastra foto</span>
                  </>
                ) : (
                  <div class="h-20 w-full rounded overflow-hidden relative">
                    <img src={coverPreview} alt="Preview" class="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">URL Video Embebido (opcional)</label>
              <input
                type="text"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                class="w-full bg-carbon border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            class="w-full py-3 bg-rojo-impacto text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <><Loader size={16} class="animate-spin" /> Guardando...</> : 'Guardar Publicación'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default ContenidoAdmin;
