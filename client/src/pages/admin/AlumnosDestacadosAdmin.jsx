import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Modal from '../../components/Modal';
import { Trophy, Plus, Edit, Trash2 } from 'lucide-react';

const AlumnosDestacadosAdmin = () => {
  const [featured, setFeatured] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [form, setForm] = useState({
    studentId: '',
    logros: '',
    categoria: 'JUVENIL',
    disciplina: 'TAEKWONDO',
  });

  useEffect(() => {
    fetchFeatured();
    fetchStudents();
  }, []);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await API.get('/featured-students');
      setFeatured(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setForm({
        studentId: item.studentId,
        logros: item.logros,
        categoria: item.categoria,
        disciplina: item.disciplina,
      });
    } else {
      setSelectedItem(null);
      setForm({
        studentId: '',
        logros: '',
        categoria: 'JUVENIL',
        disciplina: 'TAEKWONDO',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await API.put(`/featured-students/${selectedItem.id}`, form);
      } else {
        await API.post('/featured-students', form);
      }
      setIsModalOpen(false);
      fetchFeatured();
    } catch (err) {
      alert('Error al guardar alumno destacado.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar alumno del cuadro de honor?')) {
      try {
        await API.delete(`/featured-students/${id}`);
        fetchFeatured();
      } catch (err) {
        alert('Error al eliminar.');
      }
    }
  };

  return (
    <div class="space-y-8">
      
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white font-heading">
            Gestión de Alumnos Destacados
          </h1>
          <p class="text-xs text-gray-400 mt-1">
            Asigna reconocimientos y logros competitivos a los alumnos destacados de la academia.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          class="px-5 py-2.5 bg-dojang-red hover:bg-dojang-crimson text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-dojang-red/30 inline-flex items-center gap-2"
        >
          <Plus size={16} />
          NUEVO RECONOCIMIENTO
        </button>
      </div>

      <div class="bg-dojang-navyDark/70 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-dojang-dark/80 text-gray-300 font-heading uppercase text-[11px]">
            <tr>
              <th class="p-4">Estudiante</th>
              <th class="p-4">Disciplina / Categoría</th>
              <th class="p-4">Logros Destacados</th>
              <th class="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-gray-200">
            {loading ? (
              <tr><td colSpan="4" class="text-center py-8">Cargando...</td></tr>
            ) : (
              featured.map((item) => (
                <tr key={item.id} class="hover:bg-white/5">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      {item.student?.foto ? (
                        <img
                          src={item.student.foto}
                          alt={`${item.student.nombres} ${item.student.apellidos}`}
                          class="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
                        />
                      ) : (
                        <div class="w-8 h-8 rounded-full bg-dojang-navy border border-dojang-gold/30 flex items-center justify-center text-[10px] font-bold text-dojang-gold uppercase flex-shrink-0">
                          {item.student?.nombres?.[0] || ''}
                          {item.student?.apellidos?.[0] || ''}
                        </div>
                      )}
                      <span class="font-bold text-white block">
                        {item.student ? `${item.student.nombres} ${item.student.apellidos}` : 'Sin alumno'}
                      </span>
                    </div>
                  </td>
                  <td class="p-4 font-semibold text-dojang-gold">{item.disciplina} ({item.categoria})</td>
                  <td class="p-4 italic">"{item.logros}"</td>
                  <td class="p-4 text-center space-x-2">
                    <button onClick={() => handleOpenModal(item)} class="p-2 bg-amber-500/20 text-amber-400 rounded-lg"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} class="p-2 bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Gestionar Alumno Destacado">
        <form onSubmit={handleSave} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Seleccionar Estudiante</label>
            <select
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
              class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            >
              <option value="">-- Selecciona un estudiante --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.nombres} {s.apellidos} - ({s.cedula})</option>
              ))}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Disciplina</label>
              <select
                value={form.disciplina}
                onChange={(e) => setForm({ ...form, disciplina: e.target.value })}
                class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              >
                <option value="TAEKWONDO">Taekwondo</option>
                <option value="KICKBOXING">Kickboxing</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              >
                <option value="INFANTIL">Infantil</option>
                <option value="JUVENIL">Juvenil</option>
                <option value="ADULTO">Adulto</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Logros Obtenidos</label>
            <textarea
              rows="3"
              required
              value={form.logros}
              onChange={(e) => setForm({ ...form, logros: e.target.value })}
              placeholder="Ej. Medalla de Oro Torneo Abierto Nacional 2025"
              class="w-full bg-dojang-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            ></textarea>
          </div>

          <button type="submit" class="w-full py-3 bg-dojang-red text-white font-bold text-xs uppercase rounded-xl">
            Guardar Reconocimiento
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default AlumnosDestacadosAdmin;
