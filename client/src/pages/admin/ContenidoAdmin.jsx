import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Modal from '../../components/Modal';
import { FileText, Plus, Edit, Trash2, Video, Calendar } from 'lucide-react';

const ContenidoAdmin = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedContent) {
        await API.put(`/content/${selectedContent.id}`, form);
      } else {
        await API.post('/content', form);
      }
      setIsModalOpen(false);
      fetchContents();
    } catch (err) {
      alert('Error al guardar publicación.');
    }
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
      
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white font-heading">
            Gestión de Contenido & Recursos
          </h1>
          <p class="text-xs text-gray-400 mt-1">
            Publica y edita artículos técnicos, novedades del reglamento, entrevistas y nutrición.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          class="px-5 py-2.5 bg-dojang-red hover:bg-dojang-crimson text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-dojang-red/30 inline-flex items-center gap-2"
        >
          <Plus size={16} />
          NUEVA PUBLICACIÓN
        </button>
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dojang-red"></div>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((item) => (
            <div key={item.id} class="bg-dojang-navy/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between p-5 space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="px-2.5 py-1 rounded-full font-extrabold uppercase bg-dojang-red text-white">
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
              class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
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
                class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
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
              class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Cuerpo / Contenido Completo</label>
            <textarea
              rows="5"
              required
              value={form.cuerpo}
              onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
              class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">URL Imagen de Portada</label>
              <input
                type="text"
                value={form.imagenUrl}
                onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                placeholder="https://..."
                class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">URL Video Embebido (opcional)</label>
              <input
                type="text"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-dojang-red text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-dojang-crimson"
          >
            Guardar Publicación
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default ContenidoAdmin;
