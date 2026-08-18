import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Calendar, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const ALLOWED_VIDEO_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com'
];

const validateSafeVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const trimmed = url.trim();
    if (!trimmed.startsWith('https://')) return null;
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;
    
    const host = parsed.hostname.toLowerCase();
    const isAllowed = ALLOWED_VIDEO_HOSTS.some(
      allowed => host === allowed || host.endsWith('.' + allowed)
    );
    return isAllowed ? parsed.href : null;
  } catch (e) {
    return null;
  }
};

const ContenidoDetalle = ({ previewData }) => {
  const { id } = useParams();
  const [content, setContent] = useState(previewData || null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setContent(previewData);
      setLoading(false);
    } else {
      fetchDetail();
    }
  }, [id, previewData]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const [resContent, resAll] = await Promise.all([
        API.get(`/content/${id}`),
        API.get('/content')
      ]);
      setContent(resContent.data);
      // Extraemos las entradas recientes (máx 10), excluyendo la actual
      const filtered = resAll.data.filter(c => String(c.id) !== String(id)).slice(0, 10);
      setRecentPosts(filtered);
    } catch (err) {
      console.error('Error al cargar detalle:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderCuerpo = () => {
    let blocks = [];
    let isBlocksFormat = false;

    try {
      if (content.cuerpo && content.cuerpo.trim().startsWith('[')) {
        blocks = JSON.parse(content.cuerpo);
        if (Array.isArray(blocks) && blocks.length > 0 && blocks[0].type) {
          isBlocksFormat = true;
        }
      }
    } catch (e) {
      isBlocksFormat = false;
    }

    if (!isBlocksFormat) {
      // Fallback a Markdown normal
      // SECURITY NOTE: El HTML enriquecido (incluyendo el generado por react-quill) 
      // pasa estrictamente por ReactMarkdown con rehypeRaw y rehypeSanitize.
      // Nunca se usa dangerouslySetInnerHTML, protegiendo contra ataques XSS.
      return (
        <div className="prose prose-carbon prose-lg max-w-none w-full bg-blanco-absoluto py-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {content.cuerpo}
          </ReactMarkdown>
        </div>
      );
    }

    // Renderizar por Bloques Visuales
    return (
      <div className="w-full bg-blanco-absoluto py-8 space-y-10">
        {blocks.map((block) => {
          if (block.type === 'TEXT') {
            return (
              <div key={block.id} className="prose prose-carbon prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>{block.content || ''}</ReactMarkdown>
              </div>
            );
          }
          if (block.type === 'EVENT_INFO') {
            return (
              <div key={block.id} className="bg-gris-claro border-l-4 border-rojo-impacto p-8 rounded-r-xl my-10">
                <h2 className="text-2xl !font-body !normal-case font-bold text-carbon !mt-0 !mb-2">Detalles del Evento</h2>
                <p className="text-carbon/60 mb-6">Información clave y requisitos obligatorios para asistir.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-carbon/80 text-base">
                  <div><strong className="text-carbon">Lugar:</strong> {block.lugar || 'Por definir'}</div>
                  <div><strong className="text-carbon">Fecha:</strong> {block.fecha || 'Por definir'}</div>
                  <div><strong className="text-carbon">Requisito:</strong> {block.requisito || 'Por definir'}</div>
                  <div><strong className="text-carbon">Costo:</strong> {block.costo || 'Por definir'}</div>
                </div>
                {block.description && (
                  <p className="mt-6 text-sm text-carbon/60 pt-4 border-t border-carbon/10">{block.description}</p>
                )}
              </div>
            );
          }
          if (block.type === 'TWO_COLUMNS') {
            return (
              <div key={block.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start my-10">
                <div className="bg-gris-claro/50 border border-carbon/5 p-6 rounded-xl prose prose-carbon prose-p:my-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>{block.leftCol || ''}</ReactMarkdown>
                </div>
                <div className="prose prose-carbon prose-p:my-2 p-6">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>{block.rightCol || ''}</ReactMarkdown>
                </div>
              </div>
            );
          }
          if (block.type === 'IMAGE') {
            const imgSrc = block.previewUrl || block.url;
            return (
              <div key={block.id} className="my-10">
                {imgSrc && (
                  <figure>
                    <img src={imgSrc} alt="Imagen del artículo" className="w-full h-auto rounded-2xl shadow-lg border border-carbon/5" />
                    {block.caption && <figcaption className="text-center text-sm text-carbon/50 mt-4">{block.caption}</figcaption>}
                  </figure>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-blanco-absoluto">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-rojo-impacto"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-6">
        <h2 className="text-3xl font-body font-bold text-carbon tracking-tight">Publicación no encontrada</h2>
        <div className="w-16 h-[2px] bg-carbon/10 mx-auto"></div>
        <Link 
          to="/contenido" 
          className="inline-flex items-center gap-2 text-rojo-impacto font-body font-semibold text-sm hover:text-rojo-impacto/80 transition-colors"
        >
          <ArrowLeft size={16} /> Volver a la Biblioteca
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-blanco-absoluto min-h-screen w-full font-body text-carbon">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      
        <Link 
          to="/contenido" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-gris-claro rounded-full text-xs font-semibold text-carbon/60 hover:text-carbon transition-colors"
        >
          <ArrowLeft size={14} />
          Volver a la Biblioteca
        </Link>

        {/* Header Info */}
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 bg-rojo-impacto/10 text-rojo-impacto text-[11px] font-bold uppercase tracking-wider rounded-md">
              {content.categoria}
            </span>
            <span className="text-[12px] font-medium text-carbon/50 flex items-center gap-1.5">
              👤 Por: {content.autor || 'Administración'}
            </span>
            <span className="text-[12px] font-medium text-carbon/50 flex items-center gap-1.5">
              <Calendar size={14} className="text-carbon/40" />
              {content.fechaPublicacion}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl !font-body !normal-case font-extrabold text-carbon leading-tight tracking-tight">
            {content.titulo}
          </h1>

          <p className="text-lg sm:text-xl font-light text-carbon/70 max-w-3xl leading-relaxed">
            {content.resumen}
          </p>
        </div>

        {/* Grid: Contenido Principal + Barra Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 sm:gap-16 w-full pt-8 border-t border-carbon/10">
          
          {/* Article Body (Image + Video + Blocks) */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Featured Cover Image */}
            {content.imagenUrl && (
              <div className="w-full">
                <img 
                  src={content.imagenUrl} 
                  alt={content.titulo} 
                  className="w-full h-[350px] sm:h-[450px] lg:h-[500px] object-cover rounded-2xl shadow-sm" 
                />
              </div>
            )}

            {/* Embedded Video (If present) */}
            {content.videoUrl && (
              <div className="space-y-4 w-full">
                <h3 className="text-xl font-bold text-carbon border-l-4 border-rojo-impacto pl-3">
                  Material Audiovisual
                </h3>
                {validateSafeVideoUrl(content.videoUrl) ? (
                  <div className="aspect-video overflow-hidden rounded-2xl shadow-sm bg-black">
                    <iframe
                      src={validateSafeVideoUrl(content.videoUrl)}
                      title={content.titulo}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                    ></iframe>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gray-100 dark:bg-carbon border border-carbon/10 text-center text-sm text-carbon/60 dark:text-white/60">
                    ⚠️ Video no disponible o enlace no permitido por políticas de seguridad.
                  </div>
                )}
              </div>
            )}

            {renderCuerpo()}
          </div>

          {/* Barra Lateral: Entradas Recientes */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <h3 className="text-base !font-body !normal-case font-semibold text-carbon border-b border-carbon/10 pb-3 mb-6">
                Más publicaciones
              </h3>
              {recentPosts.length > 0 ? (
                <ul className="space-y-6">
                  {recentPosts.map((post) => (
                    <li key={post.id} className="group">
                      <Link to={`/contenido/${post.id}`} className="block">
                        <span className="text-[11px] font-medium text-carbon/50 block mb-1.5">
                          {post.fechaPublicacion}
                        </span>
                        <h4 className="text-sm !font-body !normal-case font-semibold text-carbon/80 group-hover:text-rojo-impacto transition-colors line-clamp-3 leading-snug">
                          {post.titulo}
                        </h4>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-carbon/50 italic">No hay publicaciones recientes.</p>
              )}
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
};

export default ContenidoDetalle;
