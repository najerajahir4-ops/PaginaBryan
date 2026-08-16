import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  Users,
  AlertTriangle,
  Award,
  History,
  FileSpreadsheet,
  CalendarDays,
  Eye,
  EyeOff
} from 'lucide-react';

const AsistenciaAdmin = () => {
  // Obtener fecha actual en formato local YYYY-MM-DD
  const getLocalToday = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
  };

  const [activeTab, setActiveTab] = useState('tomar'); // 'tomar', 'historial', 'reporte'
  
  // States para Tab 1: Registrar Asistencia
  const [fecha, setFecha] = useState(getLocalToday());
  const [students, setStudents] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    presentes: 0,
    ausentes: 0,
    tardes: 0,
    justificados: 0,
    sinRegistrar: 0
  });
  const [showStats, setShowStats] = useState(true);

  const [filtersOpen, setFiltersOpen] = useState(false);

  // States para Tab 2: Historial por Fecha
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // States para Tab 3: Reporte por Alumno
  const [reportList, setReportList] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

  // Filtros Compartidos
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedModalidad, setSelectedModalidad] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar lista de clubes al inicio
  useEffect(() => {
    fetchClubs();
  }, []);

  // Cargar datos según la pestaña activa
  useEffect(() => {
    if (activeTab === 'tomar') {
      fetchAttendance();
    } else if (activeTab === 'historial') {
      fetchHistory();
    } else if (activeTab === 'reporte') {
      fetchReport();
    }
  }, [activeTab, fecha, search, selectedClub, selectedModalidad]);

  // Recalcular estadísticas del día seleccionado cuando cambia la lista de estudiantes
  useEffect(() => {
    if (activeTab !== 'tomar') return;

    const total = students.length;
    let presentes = 0;
    let ausentes = 0;
    let tardes = 0;
    let justificados = 0;
    let sinRegistrar = 0;

    students.forEach((s) => {
      if (!s.attendance) {
        sinRegistrar++;
      } else {
        switch (s.attendance.estado) {
          case 'PRESENTE':
            presentes++;
            break;
          case 'AUSENTE':
            ausentes++;
            break;
          case 'TARDE':
            tardes++;
            break;
          case 'JUSTIFICADO':
            justificados++;
            break;
          default:
            sinRegistrar++;
        }
      }
    });

    setStats({ total, presentes, ausentes, tardes, justificados, sinRegistrar });
  }, [students, activeTab]);

  const fetchClubs = async () => {
    try {
      const res = await API.get('/clubs');
      setClubs(res.data);
    } catch (err) {
      console.error('Error al cargar clubes:', err);
    }
  };

  // Tab 1: Obtener lista de asistencia
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = { fecha };
      if (search) params.search = search;
      if (selectedClub) params.clubId = selectedClub;
      if (selectedModalidad) params.modalidad = selectedModalidad;

      const res = await API.get('/attendance', { params });
      setStudents(res.data);
    } catch (err) {
      console.error('Error al cargar asistencia:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tab 2: Obtener historial agrupado por fechas
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await API.get('/attendance/history');
      setHistoryList(res.data);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Tab 3: Obtener reporte acumulado por alumnos
  const fetchReport = async () => {
    try {
      setLoadingReport(true);
      const params = {};
      if (search) params.search = search;
      if (selectedClub) params.clubId = selectedClub;
      if (selectedModalidad) params.modalidad = selectedModalidad;

      const res = await API.get('/attendance/report', { params });
      setReportList(res.data);
    } catch (err) {
      console.error('Error al cargar reporte:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  // Guardar o cambiar asistencia (Autoguardado inmediato)
  const handleAttendanceChange = async (studentId, estadoNuevo) => {
    setUpdatingId(studentId);
    
    // Guardar estado original para reversión en caso de error
    const originalStudents = [...students];

    // Actualización optimista en el frontend
    setStudents(prev => 
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            attendance: s.attendance 
              ? { ...s.attendance, estado: estadoNuevo }
              : { estado: estadoNuevo }
          };
        }
        return s;
      })
    );

    try {
      await API.post('/attendance', {
        studentId,
        fecha,
        estado: estadoNuevo
      });
    } catch (err) {
      console.error('Error al guardar asistencia:', err);
      // Revertir en caso de fallo
      setStudents(originalStudents);
      alert('Error al guardar la asistencia. Intenta nuevamente.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Limpiar registro de asistencia para el estudiante
  const handleClearAttendance = async (studentId) => {
    setUpdatingId(studentId);
    const originalStudents = [...students];

    // Limpieza optimista en el frontend
    setStudents(prev => 
      prev.map(s => {
        if (s.id === studentId) {
          return { ...s, attendance: null };
        }
        return s;
      })
    );

    try {
      await API.delete(`/attendance`, {
        params: { studentId, fecha }
      });
    } catch (err) {
      console.error('Error al eliminar asistencia:', err);
      setStudents(originalStudents);
      alert('Error al eliminar el registro. Intenta nuevamente.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Marcar a todos los estudiantes listados como PRESENTE
  const handleMarkAllPresent = async () => {
    if (students.length === 0) return;
    
    const confirmAction = window.confirm(
      `¿Deseas marcar a los ${students.length} estudiantes listados como PRESENTES para el día ${fecha}?`
    );
    if (!confirmAction) return;

    try {
      setLoading(true);
      const records = students.map(s => ({
        studentId: s.id,
        estado: 'PRESENTE'
      }));

      await API.post('/attendance/bulk', {
        fecha,
        records
      });

      await fetchAttendance();
    } catch (err) {
      console.error('Error al registrar asistencias masivas:', err);
      alert('Error al registrar asistencias masivas.');
      setLoading(false);
    }
  };

  // Cargar fecha del historial para ver/editar asistencia
  const loadDateFromHistory = (fechaHistorica) => {
    setFecha(fechaHistorica);
    setActiveTab('tomar');
  };

  // Limpiar filtros rápidos
  const clearFilters = () => {
    setSearch('');
    setSelectedClub('');
    setSelectedModalidad('');
  };

  // Formatear fechas para mostrar en pantalla
  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div class="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-red-600 dark:border-dorado-campeon pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-body tracking-tight uppercase">
            Control de Asistencia
          </h1>
          <p className="text-sm text-red-600 dark:text-dorado-campeon font-medium tracking-wide uppercase mt-1">
            Supervisa la asistencia diaria, consulta el historial de clases y visualiza reportes acumulados.
          </p>
        </div>

        {activeTab === 'tomar' && (
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 px-3 py-1.5 rounded-lg shadow-inner">
              <Calendar size={16} class="text-red-600 dark:text-dorado-campeon" />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                class="bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none cursor-pointer border-none font-bold"
              />
            </div>

            <button
              onClick={handleMarkAllPresent}
              disabled={students.length === 0 || loading}
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-gray-900 dark:text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
            >
              <CheckCircle size={16} />
              MARCAR TODOS PRESENTES
            </button>
          </div>
        )}
      </div>

      {/* Navegación por Pestañas (Tabs) */}
      <div class="flex overflow-x-auto whitespace-nowrap border-b border-gray-200 dark:border-white/10 gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => { setActiveTab('tomar'); clearFilters(); }}
          class={`flex-shrink-0 px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'tomar'
              ? 'border-dorado-campeon text-red-600 dark:text-dorado-campeon'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'
          }`}
        >
          <CalendarDays size={16} />
          Registrar Día
        </button>
        <button
          onClick={() => { setActiveTab('historial'); clearFilters(); }}
          class={`flex-shrink-0 px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'historial'
              ? 'border-dorado-campeon text-red-600 dark:text-dorado-campeon'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'
          }`}
        >
          <History size={16} />
          Historial por Fechas
        </button>
        <button
          onClick={() => { setActiveTab('reporte'); clearFilters(); }}
          class={`flex-shrink-0 px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'reporte'
              ? 'border-dorado-campeon text-red-600 dark:text-dorado-campeon'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'
          }`}
        >
          <FileSpreadsheet size={16} />
          Reporte por Alumno
        </button>
      </div>

      {/* FILTROS (Se muestran para Registrar Día y Reporte por Alumno) */}
      {activeTab !== 'historial' && (
        <div class="bg-white dark:bg-[#15171C]/90 border border-gray-200 dark:border-white/10 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 shadow-xl">
          {/* Buscar */}
          <div class="relative flex items-center bg-white dark:bg-[#15171C] rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2">
            <Search size={16} class="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o cédula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              class="bg-transparent text-xs text-gray-900 dark:text-white placeholder-gray-500 w-full focus:outline-none"
            />
          </div>

          {/* BOTÓN DE FILTROS COLAPSABLES */}
          <div class="relative md:col-span-2">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              class="flex items-center gap-2 bg-white dark:bg-[#15171C] rounded-lg border border-gray-200 dark:border-white/10 px-4 py-2 text-xs text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors w-full md:w-auto"
            >
              <Filter size={16} class="text-red-600 dark:text-dorado-campeon" />
              <span class="font-bold uppercase tracking-wider">Filtros</span>
              {(selectedModalidad) && (
                <span class="ml-2 w-2 h-2 rounded-full bg-dorado-campeon"></span>
              )}
            </button>

            {filtersOpen && (
              <div class="absolute top-full left-0 mt-2 w-full md:w-80 bg-white dark:bg-[#1C1C21]/[0.02] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-xl shadow-2xl p-4 z-50 space-y-4">
                {/* Disciplina Dropdown */}
                <div class="space-y-1">
                  <label class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">Disciplina</label>
                  <select
                    value={selectedModalidad}
                    onChange={(e) => setSelectedModalidad(e.target.value)}
                    class="bg-white dark:bg-[#111114] text-xs text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg p-2 w-full focus:outline-none focus:border-dorado-campeon"
                  >
                    <option value="" class="bg-white dark:bg-[#111114]">Todas las Disciplinas</option>
                    <option value="TAEKWONDO" class="bg-white dark:bg-[#111114]">Taekwondo</option>
                    <option value="KICKBOXING" class="bg-white dark:bg-[#111114]">Kickboxing</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO DE PESTAÑAS */}

      {/* --- TAB 1: REGISTRAR ASISTENCIA --- */}
      {activeTab === 'tomar' && (
        <div class="space-y-8">
          {/* Header & Toggle de Estadísticas */}
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-2">
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 font-display tracking-wide">Resumen del Día</h3>
            <button
              onClick={() => setShowStats(!showStats)}
              class="text-[10px] text-red-600 dark:text-dorado-campeon hover:text-gray-900 dark:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wide bg-white dark:bg-[#15171C] border border-dorado-campeon/30 px-3 py-1.5 rounded-lg"
            >
              {showStats ? (
                <><EyeOff size={14} /> Ocultar</>
              ) : (
                <><Eye size={14} /> Mostrar</>
              )}
            </button>
          </div>

          {/* Panel de Estadísticas del día */}
          {showStats && (
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl text-center space-y-1">
              <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block">Presentes</span>
              <div class="text-2xl font-bold text-emerald-400 font-body font-bold tracking-normal">{stats.presentes}</div>
              <span class="text-[9px] text-emerald-500/80">Asistieron a clase</span>
            </div>

            <div class="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl text-center space-y-1">
              <span class="text-[10px] font-bold text-rose-400 uppercase tracking-wide block">Ausentes</span>
              <div class="text-2xl font-bold text-rose-400 font-body font-bold tracking-normal">{stats.ausentes}</div>
              <span class="text-[9px] text-rose-500/80">Falta sin justificar</span>
            </div>

            <div class="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl text-center space-y-1">
              <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">Tardes</span>
              <div class="text-2xl font-bold text-amber-400 font-body font-bold tracking-normal">{stats.tardes}</div>
              <span class="text-[9px] text-amber-500/80">Llegadas con retraso</span>
            </div>

            <div class="bg-blue-950/20 border border-blue-500/20 p-4 rounded-xl text-center space-y-1">
              <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wide block">Justificados</span>
              <div class="text-2xl font-bold text-blue-400 font-body font-bold tracking-normal">{stats.justificados}</div>
              <span class="text-[9px] text-blue-500/80">Faltas notificadas</span>
            </div>

            <div class="bg-white dark:bg-[#15171C]/50 border border-gray-200 dark:border-white/5 p-4 rounded-xl text-center space-y-1 col-span-2 md:col-span-1">
              <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block">Sin Registrar</span>
              <div class="text-2xl font-bold text-gray-900 dark:text-white font-body font-bold tracking-normal">{stats.sinRegistrar}</div>
              <span class="text-[9px] text-gray-500">Pendiente tomar lista</span>
            </div>
          </div>
          )}

          {/* Tabla de Estudiantes */}
          <div class="bg-white dark:bg-[#15171C]/70 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {loading ? (
              <div class="flex flex-col items-center justify-center py-20 gap-4">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 dark:border-dorado-campeon"></div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Cargando fichas de alumnos...</p>
              </div>
            ) : students.length === 0 ? (
              <div class="text-center py-16 px-4 space-y-3">
                <Users size={48} class="text-gray-600 mx-auto" />
                <h3 class="text-base font-body font-semibold text-gray-900 dark:text-white uppercase">No se encontraron estudiantes</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Asegúrate de tener estudiantes registrados en las fichas de alumnos.
                </p>
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse border-spacing-y-2">
                  <thead>
                    <tr class="bg-white dark:bg-[#15171C] border-b border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      <th class="py-4 px-6">Estudiante</th>
                      <th class="py-4 px-6 hidden sm:table-cell">Cédula</th>
                      <th class="py-4 px-6 hidden md:table-cell">Club / Sede</th>
                      <th class="py-4 px-6">Disciplina / Grado</th>
                      <th class="py-4 px-6 text-center">Estado de Asistencia</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-white/10 text-xs">
                    {students.map((student) => {
                      const currentEstado = student.attendance?.estado;
                      const isUpdating = updatingId === student.id;

                      return (
                        <tr key={student.id} class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                              {student.foto ? (
                                <img
                                  src={student.foto}
                                  alt={student.nombreCompleto}
                                  class="w-8 h-8 rounded-full object-cover border border-white/20"
                                />
                              ) : (
                                <div class="w-8 h-8 rounded-full bg-white dark:bg-[#15171C] border border-dorado-campeon/30 flex items-center justify-center text-[10px] font-bold text-red-600 dark:text-dorado-campeon uppercase">
                                  {student.nombres[0]}
                                  {student.apellidos[0]}
                                </div>
                              )}
                              <div>
                                <span class="font-bold text-gray-900 dark:text-white block">{student.nombreCompleto}</span>
                                <span class="text-[10px] text-gray-500 dark:text-gray-400 block sm:hidden">C.I: {student.cedula}</span>
                              </div>
                            </div>
                          </td>

                          <td class="py-4 px-6 text-gray-600 dark:text-gray-300 font-mono hidden sm:table-cell">
                            {student.cedula}
                          </td>

                          <td class="py-4 px-6 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                            {student.club?.nombre || 'Sin Club asignado'}
                          </td>

                          <td class="py-4 px-6">
                            <div class="space-y-0.5">
                              <span class={`inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                                student.modalidad === 'TAEKWONDO'
                                  ? 'bg-blue-900/30 text-blue-300 border border-blue-500/20'
                                  : 'bg-red-900/30 text-red-300 border border-red-500/20'
                              }`}>
                                {student.modalidad}
                              </span>
                              <span class="text-[10px] text-gray-500 dark:text-gray-400 block">{student.grado}</span>
                            </div>
                          </td>

                          <td class="py-4 px-6">
                            <div class="flex items-center justify-center gap-2">
                              {/* Presente */}
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'PRESENTE')}
                                disabled={isUpdating}
                                class={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wide transition-all flex items-center gap-1 ${
                                  currentEstado === 'PRESENTE'
                                    ? 'bg-emerald-600 border-emerald-500 text-gray-900 dark:text-white shadow-lg shadow-emerald-950/40'
                                    : 'bg-white dark:bg-[#15171C]/40 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-emerald-500/50 hover:text-emerald-400'
                                }`}
                              >
                                <CheckCircle size={12} />
                                <span class="hidden lg:inline">PRESENTE</span>
                                <span class="inline lg:hidden">P</span>
                              </button>

                              {/* Ausente */}
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'AUSENTE')}
                                disabled={isUpdating}
                                class={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wide transition-all flex items-center gap-1 ${
                                  currentEstado === 'AUSENTE'
                                    ? 'bg-rose-600 border-rose-500 text-gray-900 dark:text-white shadow-lg shadow-rose-950/40'
                                    : 'bg-white dark:bg-[#15171C]/40 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-rose-500/50 hover:text-rose-400'
                                }`}
                              >
                                <XCircle size={12} />
                                <span class="hidden lg:inline">AUSENTE</span>
                                <span class="inline lg:hidden">A</span>
                              </button>

                              {/* Tarde */}
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'TARDE')}
                                disabled={isUpdating}
                                class={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wide transition-all flex items-center gap-1 ${
                                  currentEstado === 'TARDE'
                                    ? 'bg-amber-600 border-amber-500 text-gray-900 dark:text-white shadow-lg shadow-amber-950/40'
                                    : 'bg-white dark:bg-[#15171C]/40 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-amber-500/50 hover:text-amber-400'
                                }`}
                              >
                                <Clock size={12} />
                                <span class="hidden lg:inline">TARDE</span>
                                <span class="inline lg:hidden">T</span>
                              </button>

                              {/* Justificado */}
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'JUSTIFICADO')}
                                disabled={isUpdating}
                                class={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold tracking-wide transition-all flex items-center gap-1 ${
                                  currentEstado === 'JUSTIFICADO'
                                    ? 'bg-blue-600 border-blue-500 text-gray-900 dark:text-white shadow-lg shadow-blue-950/40'
                                    : 'bg-white dark:bg-[#15171C]/40 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
                                }`}
                              >
                                <HelpCircle size={12} />
                                <span class="hidden lg:inline">JUSTIFICADO</span>
                                <span class="inline lg:hidden">J</span>
                              </button>

                              {/* Limpiar */}
                              {currentEstado && (
                                <button
                                  onClick={() => handleClearAttendance(student.id)}
                                  disabled={isUpdating}
                                  class="p-1.5 rounded-lg bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-rojo-impacto hover:text-gray-900 dark:text-white hover:border-rojo-impacto transition-all"
                                >
                                  <RotateCcw size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: HISTORIAL DE FECHAS --- */}
      {activeTab === 'historial' && (
        <div class="space-y-8">
          <div class="bg-white dark:bg-[#15171C]/70 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {loadingHistory ? (
              <div class="flex flex-col items-center justify-center py-20 gap-4">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 dark:border-dorado-campeon"></div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Cargando fechas de asistencia históricas...</p>
              </div>
            ) : historyList.length === 0 ? (
              <div class="text-center py-16 px-4 space-y-3">
                <Calendar size={48} class="text-gray-600 mx-auto" />
                <h3 class="text-base font-body font-semibold text-gray-900 dark:text-white uppercase">No se encontraron registros de asistencia</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Registra la asistencia diaria para ver el historial consolidado de fechas aquí.
                </p>
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse border-spacing-y-2">
                  <thead>
                    <tr class="bg-white dark:bg-[#15171C] border-b border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      <th class="py-4 px-6">Fecha</th>
                      <th class="py-4 px-6 text-center">Presentes</th>
                      <th class="py-4 px-6 text-center">Ausentes</th>
                      <th class="py-4 px-6 text-center">Tardes</th>
                      <th class="py-4 px-6 text-center">Justificados</th>
                      <th class="py-4 px-6 text-center">Total Registrados</th>
                      <th class="py-4 px-6 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-white/10 text-xs text-center">
                    {historyList.map((h, i) => (
                      <tr key={i} class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        {/* Fecha */}
                        <td class="py-4 px-6 text-left font-bold text-gray-900 dark:text-white">
                          <span class="inline-flex items-center gap-2">
                            <Calendar size={14} class="text-red-600 dark:text-dorado-campeon" />
                            {formatDateString(h.fecha)}
                          </span>
                        </td>
                        {/* Presentes */}
                        <td class="py-4 px-6">
                          <span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            {h.presentes}
                          </span>
                        </td>
                        {/* Ausentes */}
                        <td class="py-4 px-6">
                          <span class="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                            {h.ausentes}
                          </span>
                        </td>
                        {/* Tardes */}
                        <td class="py-4 px-6">
                          <span class="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                            {h.tardes}
                          </span>
                        </td>
                        {/* Justificados */}
                        <td class="py-4 px-6">
                          <span class="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                            {h.justificados}
                          </span>
                        </td>
                        {/* Total */}
                        <td class="py-4 px-6 text-gray-600 dark:text-gray-300 font-semibold">
                          {h.total}
                        </td>
                        {/* Acción */}
                        <td class="py-4 px-6">
                          <button
                            onClick={() => loadDateFromHistory(h.fecha)}
                            class="px-3 py-1 bg-dorado-campeon hover:bg-dorado-campeon/70 text-[#111114] text-[10px] font-extrabold rounded uppercase tracking-wide transition-colors"
                          >
                            Ver / Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: REPORTE POR ALUMNO --- */}
      {activeTab === 'reporte' && (
        <div class="space-y-8">
          <div class="bg-white dark:bg-[#15171C]/70 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {loadingReport ? (
              <div class="flex flex-col items-center justify-center py-20 gap-4">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 dark:border-dorado-campeon"></div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Calculando estadísticas de asistencia de alumnos...</p>
              </div>
            ) : reportList.length === 0 ? (
              <div class="text-center py-16 px-4 space-y-3">
                <Users size={48} class="text-gray-600 mx-auto" />
                <h3 class="text-base font-body font-semibold text-gray-900 dark:text-white uppercase">No hay alumnos para reportar</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Asegúrate de que haya alumnos cargados bajo los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse border-spacing-y-2 font-sans">
                  <thead>
                    <tr class="bg-white dark:bg-[#15171C] border-b border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      <th class="py-4 px-6">Estudiante</th>
                      <th class="py-4 px-6 hidden sm:table-cell">Sede / Club</th>
                      <th class="py-4 px-6 text-center">Clases Registradas</th>
                      <th class="py-4 px-6 text-center">Asistencias (P)</th>
                      <th class="py-4 px-6 text-center">Inasistencias (A/T/J)</th>
                      <th class="py-4 px-6">% Promedio de Asistencia</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-white/10 text-xs">
                    {reportList.map((student) => {
                      // Determinar color de porcentaje
                      let percentColor = 'text-rose-400';
                      let barColor = 'bg-rose-500';
                      if (student.porcentaje >= 80) {
                        percentColor = 'text-emerald-400';
                        barColor = 'bg-emerald-500';
                      } else if (student.porcentaje >= 50) {
                        percentColor = 'text-amber-400';
                        barColor = 'bg-amber-500';
                      }

                      return (
                        <tr key={student.id} class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          {/* Estudiante */}
                          <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                              {student.foto ? (
                                <img
                                  src={student.foto}
                                  alt={student.nombreCompleto}
                                  class="w-8 h-8 rounded-full object-cover border border-white/20"
                                />
                              ) : (
                                <div class="w-8 h-8 rounded-full bg-white dark:bg-[#15171C] border border-dorado-campeon/30 flex items-center justify-center text-[10px] font-bold text-red-600 dark:text-dorado-campeon uppercase">
                                  {student.nombreCompleto[0]}
                                </div>
                              )}
                              <div>
                                <span class="font-bold text-gray-900 dark:text-white block">{student.nombreCompleto}</span>
                                <span class="text-[9px] text-gray-500 dark:text-gray-400">{student.grado}</span>
                              </div>
                            </div>
                          </td>

                          {/* Club */}
                          <td class="py-4 px-6 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                            {student.club}
                          </td>

                          {/* Clases Totales */}
                          <td class="py-4 px-6 text-center font-bold text-gray-600 dark:text-gray-300">
                            {student.total}
                          </td>

                          {/* Presentes */}
                          <td class="py-4 px-6 text-center font-bold text-emerald-400">
                            {student.presentes}
                          </td>

                          {/* Faltas (Ausentes + Tardes + Justificados) */}
                          <td class="py-4 px-6 text-center text-gray-500 dark:text-gray-400">
                            <div class="flex items-center justify-center gap-2 font-semibold">
                              <span class="text-rose-400" title="Ausente">{student.ausentes}A</span>
                              <span class="text-amber-400" title="Tarde">{student.tardes}T</span>
                              <span class="text-blue-400" title="Justificado">{student.justificados}J</span>
                            </div>
                          </td>

                          {/* Porcentaje y Barra */}
                          <td class="py-4 px-6">
                            <div class="flex items-center gap-3 max-w-xs">
                              <span class={`font-extrabold text-sm w-12 text-right font-body font-bold tracking-normal ${percentColor}`}>
                                {student.porcentaje}%
                              </span>
                              <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div
                                  class={`h-full ${barColor} transition-all duration-500`}
                                  style={{ width: `${student.porcentaje}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AsistenciaAdmin;
