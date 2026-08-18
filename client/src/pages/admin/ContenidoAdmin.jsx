import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import API from '../../services/api';
import Modal from '../../components/Modal';
import { FileText, Plus, Edit, Trash2, Video, Calendar, Camera, Loader, GripVertical } from 'lucide-react';
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ContenidoDetalle from '../ContenidoDetalle';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

const SortableBlock = ({ block, updateBlock, removeBlock }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-50 dark:bg-[#1C1C21] border border-carbon/20 dark:border-white/10 rounded-xl p-4 flex gap-4 relative group mb-4">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-carbon mt-2">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 space-y-3">
        {block.type === 'TEXT' && (
          <div>
            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Bloque de Texto Enriquecido</label>
            <div className="bg-white dark:bg-[#0A0B0E] text-carbon dark:text-white rounded-xl overflow-hidden [&_.ql-toolbar]:border-carbon/20 dark:[&_.ql-toolbar]:border-white/10 [&_.ql-container]:border-carbon/20 dark:[&_.ql-container]:border-white/10 [&_.ql-editor]:min-h-[150px]">
              <ReactQuill 
                theme="snow"
                modules={quillModules}
                value={block.content || ''} 
                onChange={(content) => updateBlock(block.id, { content })} 
              />
            </div>
          </div>
        )}

        {block.type === 'EVENT_INFO' && (
          <div>
            <label className="block text-[10px] font-bold text-rojo-impacto uppercase mb-2">Ficha de Evento Destacado</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Lugar (ej. Coliseo Principal)" value={block.lugar || ''} onChange={(e) => updateBlock(block.id, { lugar: e.target.value })} className="bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-carbon dark:text-white focus:outline-none focus:border-carbon dark:focus:border-white/20" />
              <input type="text" placeholder="Fecha (ej. Sábado 15 de Oct)" value={block.fecha || ''} onChange={(e) => updateBlock(block.id, { fecha: e.target.value })} className="bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-carbon dark:text-white focus:outline-none focus:border-carbon dark:focus:border-white/20" />
              <input type="text" placeholder="Requisito (ej. Dobok Oficial)" value={block.requisito || ''} onChange={(e) => updateBlock(block.id, { requisito: e.target.value })} className="bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-carbon dark:text-white focus:outline-none focus:border-carbon dark:focus:border-white/20" />
              <input type="text" placeholder="Costo (ej. Gratuito)" value={block.costo || ''} onChange={(e) => updateBlock(block.id, { costo: e.target.value })} className="bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-carbon dark:text-white focus:outline-none focus:border-carbon dark:focus:border-white/20" />
            </div>
            <textarea rows="2" placeholder="Descripción Adicional (opcional)..." value={block.description || ''} onChange={(e) => updateBlock(block.id, { description: e.target.value })} className="w-full mt-2 bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-carbon dark:text-white focus:outline-none focus:border-carbon dark:focus:border-white/20" />
          </div>
        )}

        {block.type === 'TWO_COLUMNS' && (
          <div>
            <label className="block text-[10px] font-bold text-dorado-campeon uppercase mb-2">Doble Columna (Texto Enriquecido)</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#0A0B0E] text-carbon dark:text-white rounded-xl overflow-hidden [&_.ql-toolbar]:border-carbon/20 dark:[&_.ql-toolbar]:border-white/10 [&_.ql-container]:border-carbon/20 dark:[&_.ql-container]:border-white/10 [&_.ql-editor]:min-h-[120px]">
                <ReactQuill theme="snow" modules={quillModules} value={block.leftCol || ''} onChange={(val) => updateBlock(block.id, { leftCol: val })} />
              </div>
              <div className="bg-white dark:bg-[#0A0B0E] text-carbon dark:text-white rounded-xl overflow-hidden [&_.ql-toolbar]:border-carbon/20 dark:[&_.ql-toolbar]:border-white/10 [&_.ql-container]:border-carbon/20 dark:[&_.ql-container]:border-white/10 [&_.ql-editor]:min-h-[120px]">
                <ReactQuill theme="snow" modules={quillModules} value={block.rightCol || ''} onChange={(val) => updateBlock(block.id, { rightCol: val })} />
              </div>
            </div>
          </div>
        )}

        {block.type === 'IMAGE' && (
          <div>
            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Bloque de Imagen</label>
            <div className="relative border-2 border-dashed border-carbon/30 dark:border-white/20 rounded-xl p-4 text-center hover:border-rojo-impacto/50 transition-colors bg-white dark:bg-[#0A0B0E]">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateBlock(block.id, { fileObj: file, previewUrl: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {!(block.previewUrl || block.url) ? (
                <div className="py-8 text-gray-400">
                  <Camera className="mx-auto mb-2" size={32} />
                  <span className="text-[10px]">Click o arrastra tu imagen aquí</span>
                </div>
              ) : (
                <div className="w-full rounded overflow-hidden relative group">
                  <img src={block.previewUrl || block.url} alt="Preview" className="w-full h-auto object-cover max-h-64" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-bold bg-carbon/80 px-3 py-1 rounded backdrop-blur">Cambiar Imagen</span>
                  </div>
                </div>
              )}
            </div>
            <input type="text" placeholder="Pie de foto (opcional)" value={block.caption || ''} onChange={(e) => updateBlock(block.id, { caption: e.target.value })} className="w-full mt-2 bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-carbon dark:text-white focus:outline-none focus:border-carbon dark:focus:border-white/20" />
          </div>
        )}
      </div>

      <button type="button" onClick={() => removeBlock(block.id)} className="text-gray-400 hover:text-red-500 self-start mt-2 transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const ContenidoAdmin = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const [blocks, setBlocks] = useState([]);
  const [isLivePreview, setIsLivePreview] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const [form, setForm] = useState({
    titulo: '',
    categoria: 'TECNICA',
    resumen: '',
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
        imagenUrl: content.imagenUrl || '',
        videoUrl: content.videoUrl || '',
        fechaPublicacion: content.fechaPublicacion,
      });

      // Parse blocks
      try {
        if (content.cuerpo && content.cuerpo.trim().startsWith('[')) {
          const parsed = JSON.parse(content.cuerpo);
          if (Array.isArray(parsed)) {
            setBlocks(parsed);
          } else {
            setBlocks([{ id: Date.now().toString(), type: 'TEXT', content: content.cuerpo }]);
          }
        } else {
          setBlocks([{ id: Date.now().toString(), type: 'TEXT', content: content.cuerpo || '' }]);
        }
      } catch (e) {
        setBlocks([{ id: Date.now().toString(), type: 'TEXT', content: content.cuerpo || '' }]);
      }
    } else {
      setSelectedContent(null);
      setCoverFile(null);
      setCoverPreview('');
      setForm({
        titulo: '',
        categoria: 'TECNICA',
        resumen: '',
        imagenUrl: '',
        videoUrl: '',
        fechaPublicacion: new Date().toISOString().split('T')[0],
      });
      setBlocks([]);
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

      // Procesar imágenes dentro de los bloques
      const blocksToSave = [...blocks];
      for (let i = 0; i < blocksToSave.length; i++) {
        const b = blocksToSave[i];
        if (b.type === 'IMAGE' && b.fileObj) {
          const blockFormData = new FormData();
          blockFormData.append('image', b.fileObj);
          const uploadRes = await API.post('/upload', blockFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          blocksToSave[i] = { ...b, url: uploadRes.data.url };
          delete blocksToSave[i].fileObj;
          delete blocksToSave[i].previewUrl;
        }
      }

      const dataToSave = { ...form, cuerpo: JSON.stringify(blocksToSave), imagenUrl: finalImageUrl };

      if (selectedContent) {
        await API.put(`/content/${selectedContent.id}`, dataToSave);
      } else {
        await API.post('/content', dataToSave);
      }
      setIsModalOpen(false);
      fetchContents();
      showToast('Publicación guardada exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar publicación', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddBlock = (type) => {
    const uniqueId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    const newBlock = { id: uniqueId, type };
    if (type === 'TEXT') newBlock.content = '';
    if (type === 'EVENT_INFO') {
      newBlock.lugar = ''; newBlock.fecha = ''; newBlock.requisito = ''; newBlock.costo = ''; newBlock.description = '';
    }
    if (type === 'TWO_COLUMNS') {
      newBlock.leftCol = ''; newBlock.rightCol = '';
    }
    if (type === 'IMAGE') {
      newBlock.url = ''; newBlock.previewUrl = ''; newBlock.fileObj = null; newBlock.caption = '';
    }
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex(b => b.id === active.id);
    const newIndex = blocks.findIndex(b => b.id === over.id);
    setBlocks(arrayMove(blocks, oldIndex, newIndex));
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const executeDelete = async () => {
    const id = deleteConfirm.id;
    if (!id) return;
    
    try {
      await API.delete(`/content/${id}`);
      fetchContents();
      showToast('Publicación eliminada correctamente', 'success');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (err) {
      showToast('Error al eliminar publicación', 'error');
    }
  };

  return (
    <div class="space-y-8">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-carbon dark:border-white/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-carbon dark:text-white font-body tracking-tight uppercase">
            Gestión de Contenido & Recursos
          </h1>
          <p className="text-xs text-carbon dark:text-white font-bold tracking-widest uppercase mt-1">
            Publica y edita artículos técnicos, novedades del reglamento, entrevistas y nutrición.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          class="px-5 py-2.5 bg-rojo-impacto hover:bg-carbon text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-rojo-impacto/30 inline-flex items-center gap-2"
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
            <div key={item.id} class="bg-white dark:bg-[#0A0B0E]/80 border border-carbon/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between p-5 space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="px-2.5 py-1 rounded-full font-extrabold uppercase bg-rojo-impacto text-white">
                    {item.categoria}
                  </span>
                  <span class="text-gray-600 dark:text-gray-400">{item.fechaPublicacion}</span>
                </div>
                <h3 class="text-base font-bold text-carbon dark:text-white font-body">{item.titulo}</h3>
                <p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{item.resumen}</p>
              </div>

              <div class="pt-4 border-t border-carbon/20 dark:border-white/10 flex justify-between items-center">
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
                    onClick={() => confirmDelete(item.id)}
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
        isFullScreen={isLivePreview}
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-carbon/10 dark:border-white/10">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-carbon dark:text-white">
            <input type="checkbox" checked={isLivePreview} onChange={(e) => setIsLivePreview(e.target.checked)} className="w-5 h-5 rounded text-rojo-impacto focus:ring-rojo-impacto bg-white dark:bg-[#0A0B0E] border-gray-300 dark:border-white/20" />
            Modo Pantalla Dividida (Vista Previa en Vivo)
          </label>
        </div>

        <div className="flex w-full h-[calc(100vh-140px)] relative">
          
          {/* LADO IZQUIERDO: FORMULARIO */}
          <div className={`${isPreviewFullscreen ? 'hidden' : (isLivePreview ? 'w-1/2 pr-6' : 'w-full max-w-4xl mx-auto')} space-y-6 overflow-y-auto custom-scrollbar pb-12 relative transition-all duration-300`}>
            <form onSubmit={handleSave} class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  class="w-full bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-carbon dark:text-white"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    class="w-full bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-carbon dark:text-white"
                  >
                    <option value="TECNICA">Técnica</option>
                    <option value="REGLAMENTO">Reglamento</option>
                    <option value="NUTRICION">Nutrición Deportiva</option>
                    <option value="NOTICIAS">Noticias</option>
                    <option value="ENTREVISTAS">Entrevistas</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Fecha Publicación</label>
                  <input
                    type="date"
                    required
                    value={form.fechaPublicacion}
                    onChange={(e) => setForm({ ...form, fechaPublicacion: e.target.value })}
                    class="w-full bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-carbon dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Resumen Corto</label>
                <input
                  type="text"
                  required
                  value={form.resumen}
                  onChange={(e) => setForm({ ...form, resumen: e.target.value })}
                  class="w-full bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-carbon dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Cuerpo / Contenido Completo (Bloques)</label>
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 mb-4">
                      {blocks.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl text-gray-400 text-xs">
                          No hay bloques. Comienza añadiendo uno abajo.
                        </div>
                      ) : (
                        blocks.map((block) => (
                          <SortableBlock key={block.id} block={block} updateBlock={updateBlock} removeBlock={removeBlock}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                                {block.content}
                            </ReactMarkdown>
                          </SortableBlock>
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" onClick={() => handleAddBlock('TEXT')} className="text-[9px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-carbon dark:text-white border border-carbon/20 dark:border-white/20 px-3 py-2 rounded hover:bg-carbon dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors flex items-center gap-1">
                    📝 Añadir Texto Enriquecido
                  </button>
                  <button type="button" onClick={() => handleAddBlock('TWO_COLUMNS')} className="text-[9px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-carbon dark:text-white border border-carbon/20 dark:border-white/20 px-3 py-2 rounded hover:bg-carbon dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors flex items-center gap-1">
                    ◫ Añadir 2 Columnas
                  </button>
                  <button type="button" onClick={() => handleAddBlock('IMAGE')} className="text-[9px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-carbon dark:text-white border border-carbon/20 dark:border-white/20 px-3 py-2 rounded hover:bg-carbon dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors flex items-center gap-1">
                    🖼️ Añadir Imagen
                  </button>
                  <button type="button" onClick={() => handleAddBlock('EVENT_INFO')} className="text-[9px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-carbon dark:text-white border border-carbon/20 dark:border-white/20 px-3 py-2 rounded hover:bg-carbon dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors flex items-center gap-1">
                    🗓️ Añadir Info de Evento
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Imagen de Portada</label>
                  <div class="relative border-2 border-dashed border-carbon/30 dark:border-white/20 rounded-xl p-4 text-center hover:border-rojo-impacto/50 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {!coverPreview ? (
                      <>
                        <Camera class="mx-auto text-gray-500 mb-1" size={24} />
                        <span class="text-[10px] text-gray-600 dark:text-gray-400">Click o arrastra foto</span>
                      </>
                    ) : (
                      <div class="h-20 w-full rounded overflow-hidden relative">
                        <img src={coverPreview} alt="Preview" class="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">URL Video Embebido (opcional)</label>
                  <input
                    type="text"
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    class="w-full bg-white dark:bg-[#0A0B0E] border border-carbon/20 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-carbon dark:text-white"
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
          </div>

          {/* LADO DERECHO: VISTA PREVIA EN VIVO */}
          {isLivePreview && (
            <div className={`${isPreviewFullscreen ? 'w-full border-l-0' : 'w-1/2'} overflow-y-auto bg-[#0A0B0E] rounded-xl relative shadow-inner custom-scrollbar border-l border-carbon/20 transition-all duration-300`}>
              <div className="sticky top-0 bg-[#0A0B0E]/90 backdrop-blur p-4 z-[60] border-b border-white/10 flex justify-between items-center shadow-xl">
                <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Simulación de Web Oficial
                </span>
                <button 
                  onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                >
                  {isPreviewFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
                </button>
              </div>
              
              {/* Contenedor que desactiva los clicks para evitar salir de la página por error */}
              <div className="w-full relative pointer-events-none">
                <Navbar />
                <ContenidoDetalle 
                  previewData={{
                    ...form,
                    cuerpo: JSON.stringify(blocks),
                    imagenUrl: coverPreview || form.imagenUrl,
                    autor: user?.usuario || 'Administración',
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Eliminar Publicación"
        message="¿Estás seguro de eliminar esta publicación? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default ContenidoAdmin;
