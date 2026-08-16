import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Modal from '../../components/Modal';
import { Layers, Plus, Edit, Trash2, Users, Award, History, GitMerge, CreditCard, FileCheck } from 'lucide-react';

const ModulosAdmin = () => {
  const [clubs, setClubs] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubForm, setClubForm] = useState({ nombre: '', descripcion: '' });

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedModuleItem, setSelectedModuleItem] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    modulo: 'GRADOS',
    titulo: '',
    descripcion: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resClubs, resModules] = await Promise.all([
        API.get('/clubs'),
        API.get('/clubs/modules'),
      ]);
      setClubs(resClubs.data);
      setModules(resModules.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Club Handlers
  const handleOpenClubModal = (club = null) => {
    if (club) {
      setSelectedClub(club);
      setClubForm({ nombre: club.nombre, descripcion: club.descripcion });
    } else {
      setSelectedClub(null);
      setClubForm({ nombre: '', descripcion: '' });
    }
    setIsClubModalOpen(true);
  };

  const handleSaveClub = async (e) => {
    e.preventDefault();
    try {
      if (selectedClub) {
        await API.put(`/clubs/${selectedClub.id}`, clubForm);
      } else {
        await API.post('/clubs', clubForm);
      }
      setIsClubModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error al guardar club.');
    }
  };

  const handleDeleteClub = async (id) => {
    if (window.confirm('¿Eliminar este club?')) {
      try {
        await API.delete(`/clubs/${id}`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar club.');
      }
    }
  };

  // Module Handlers
  const handleOpenModuleModal = (item = null) => {
    if (item) {
      setSelectedModuleItem(item);
      setModuleForm({
        modulo: item.modulo,
        titulo: item.titulo,
        descripcion: item.descripcion,
      });
    } else {
      setSelectedModuleItem(null);
      setModuleForm({
        modulo: 'GRADOS',
        titulo: '',
        descripcion: '',
      });
    }
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      if (selectedModuleItem) {
        await API.put(`/clubs/modules/${selectedModuleItem.id}`, moduleForm);
      } else {
        await API.post('/clubs/modules', moduleForm);
      }
      setIsModuleModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error al guardar elemento del módulo.');
    }
  };

  const handleDeleteModule = async (id) => {
    if (window.confirm('¿Eliminar elemento?')) {
      try {
        await API.delete(`/clubs/modules/${id}`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar.');
      }
    }
  };

  return (
    <div class="space-y-12">
      
      {/* SECTION 1: CLUBES */}
      <div class="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-red-600 dark:border-dorado-campeon pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-body tracking-tight flex items-center gap-2">
              <Users className="text-rojo-impacto" /> Gestor de Clubes Afiliados
            </h2>
            <p className="text-sm text-red-600 dark:text-dorado-campeon font-medium tracking-wide uppercase mt-1">Registra los Do-Jangs y clubes pertenecientes a la red.</p>
          </div>
          <button
            onClick={() => handleOpenClubModal()}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/20 transition-all text-sm font-medium rounded-xl shadow-sm"
          >
            + NUEVO CLUB
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((c) => (
            <div key={c.id} class="bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 backdrop-blur-sm p-6 rounded-2xl space-y-3 relative shadow-xl">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white font-body font-bold tracking-normal">{c.nombre}</h3>
              <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{c.descripcion}</p>
              <div class="pt-3 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-xs">
                <span class="text-red-600 dark:text-dorado-campeon font-bold">{c._count?.students || 0} Alumnos Inscritos</span>
                <div class="flex gap-2">
                  <button onClick={() => handleOpenClubModal(c)} class="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteClub(c.id)} class="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MÓDULOS (GRADOS, HISTORIAL, LLAVES, CARNETS, DIPLOMAS) */}
      <div class="space-y-8">
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight font-body font-bold tracking-normal flex items-center gap-2">
              <Layers class="text-red-600 dark:text-dorado-campeon" /> Módulos Informativos (Grados, Llaves, Carnets, Diplomas)
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Configura la información visible en las 9 tarjetas de acceso rápido públicas.</p>
          </div>
          <button
            onClick={() => handleOpenModuleModal()}
            class="px-4 py-2 bg-white dark:bg-[#15171C] border border-dorado-campeon text-red-600 dark:text-dorado-campeon hover:bg-dorado-campeon hover:text-carbon text-xs font-bold rounded-xl transition-colors"
          >
            + NUEVO ELEMENTO DE MÓDULO
          </button>
        </div>

        <div class="bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
          <table class="w-full text-left text-xs border-collapse border-spacing-y-2">
            <thead class="bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 font-body font-bold tracking-normal uppercase text-[13px] tracking-wide font-semibold text-gray-500 dark:text-gray-400">
              <tr>
                <th class="px-6 py-5 font-semibold">Módulo</th>
                <th class="px-6 py-5 font-semibold">Título</th>
                <th class="px-6 py-5 font-semibold">Descripción</th>
                <th class="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-white/10 text-gray-200">
              {modules.map((m) => (
                <tr key={m.id} class="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td class="px-6 py-5 text-sm">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rojo-impacto text-gray-900 dark:text-white">
                      {m.modulo}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-sm font-bold text-gray-900 dark:text-white">{m.titulo}</td>
                  <td class="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">{m.descripcion}</td>
                  <td class="px-6 py-5 text-sm text-center space-x-2">
                    <button onClick={() => handleOpenModuleModal(m)} class="p-2 bg-amber-500/20 text-amber-400 rounded-lg"><Edit size={14} /></button>
                    <button onClick={() => handleDeleteModule(m.id)} class="p-2 bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Clubes */}
      <Modal isOpen={isClubModalOpen} onClose={() => setIsClubModalOpen(false)} title="Gestionar Club Afiliado">
        <form onSubmit={handleSaveClub} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Nombre del Club</label>
            <input
              type="text"
              required
              value={clubForm.nombre}
              onChange={(e) => setClubForm({ ...clubForm, nombre: e.target.value })}
              class="w-full bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Descripción / Sede</label>
            <textarea
              rows="3"
              value={clubForm.descripcion}
              onChange={(e) => setClubForm({ ...clubForm, descripcion: e.target.value })}
              class="w-full bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white"
            ></textarea>
          </div>
          <button type="submit" class="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-gray-900 dark:text-white font-medium hover:from-red-500 hover:to-red-400 shadow-md transition-all text-xs uppercase rounded-xl">
            Guardar Club
          </button>
        </form>
      </Modal>

      {/* Modal Módulos */}
      <Modal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} title="Gestionar Módulo Informativo">
        <form onSubmit={handleSaveModule} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Sección de Destino</label>
            <select
              value={moduleForm.modulo}
              onChange={(e) => setModuleForm({ ...moduleForm, modulo: e.target.value })}
              class="w-full bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white"
            >
              <option value="GRADOS">Grados (Kup y Dan)</option>
              <option value="HISTORIAL">Historial de Combates</option>
              <option value="LLAVES">Llaves y Brackets</option>
              <option value="CARNETS">Carnets Digitales</option>
              <option value="DIPLOMAS">Diplomas Certificados</option>
              <option value="ESTADISTICAS">Estadísticas Generales</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Título Informativo</label>
            <input
              type="text"
              required
              value={moduleForm.titulo}
              onChange={(e) => setModuleForm({ ...moduleForm, titulo: e.target.value })}
              class="w-full bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Descripción</label>
            <textarea
              rows="3"
              value={moduleForm.descripcion}
              onChange={(e) => setModuleForm({ ...moduleForm, descripcion: e.target.value })}
              class="w-full bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white"
            ></textarea>
          </div>
          <button type="submit" class="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-gray-900 dark:text-white font-medium hover:from-red-500 hover:to-red-400 shadow-md transition-all text-xs uppercase rounded-xl">
            Guardar Elemento
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default ModulosAdmin;
