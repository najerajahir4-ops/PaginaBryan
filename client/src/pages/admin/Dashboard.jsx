import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Users, AlertTriangle, Clock, DollarSign, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalActiveStudents: 0,
    alDiaCount: 0,
    porVencerCount: 0,
    vencidoCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/students/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error al cargar estadisticas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock revenue chart data based on system
  const chartData = [
    { mes: 'Ene', ingresos: 1200 },
    { mes: 'Feb', ingresos: 1500 },
    { mes: 'Mar', ingresos: 1800 },
    { mes: 'Abr', ingresos: 1400 },
    { mes: 'May', ingresos: 2100 },
    { mes: 'Jun', ingresos: 2400 },
    { mes: 'Jul', ingresos: stats.totalRevenue || 2800 },
  ];

  return (
    <div class="space-y-8">
      
      {/* Header */}
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white font-display tracking-widest uppercase">
            Panel Principal de Control
          </h1>
          <p class="text-xs text-gray-400 mt-1 font-body">
            Resumen estadístico de estudiantes, estado de cobranza e ingresos generales.
          </p>
        </div>

        <Link
          to="/admin/estudiantes"
          class="px-5 py-2.5 bg-rojo-impacto hover:bg-white hover:text-rojo-impacto text-white text-xs font-bold clip-button uppercase transition-colors shadow-lg inline-flex items-center gap-2 impact-flash"
        >
          <Users size={16} />
          GESTIONAR ESTUDIANTES
        </Link>
      </div>

      {/* Metrics Cards */}
      {loading ? (
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rojo-impacto"></div>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Estudiantes Activos */}
          <div class="bg-carbon/80 border border-white/10 p-6 rounded-2xl space-y-3 shadow-xl">
            <div class="flex items-center justify-between text-blue-400">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-300">Estudiantes Activos</span>
              <div class="p-2 rounded-xl bg-blue-500/10">
                <Users size={20} />
              </div>
            </div>
            <div class="text-3xl font-extrabold text-white font-heading">
              {stats.totalActiveStudents}
            </div>
            <p class="text-[11px] text-gray-400">Inscritos en la academia</p>
          </div>

          {/* Pagos al Día */}
          <div class="bg-carbon/80 border border-white/10 p-6 rounded-2xl space-y-3 shadow-xl">
            <div class="flex items-center justify-between text-emerald-400">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-300">Pagos al Día</span>
              <div class="p-2 rounded-xl bg-emerald-500/10">
                <Users size={20} />
              </div>
            </div>
            <div class="text-3xl font-extrabold text-emerald-400 font-heading">
              {stats.alDiaCount}
            </div>
            <p class="text-[11px] text-gray-400">Cuotas al corriente</p>
          </div>

          {/* Por Vencer (7 días o menos) */}
          <div class="bg-carbon/80 border border-white/10 p-6 rounded-2xl space-y-3 shadow-xl">
            <div class="flex items-center justify-between text-amber-400">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-300">Por Vencer (7 días)</span>
              <div class="p-2 rounded-xl bg-amber-500/10">
                <Clock size={20} />
              </div>
            </div>
            <div class="text-3xl font-extrabold text-amber-400 font-heading">
              {stats.porVencerCount}
            </div>
            <p class="text-[11px] text-gray-400">Requieren recordatorio</p>
          </div>

          {/* Pagos Vencidos */}
          <div class="bg-carbon/80 border border-white/10 p-6 rounded-2xl space-y-3 shadow-xl">
            <div class="flex items-center justify-between text-rose-400">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-300">Pagos Vencidos</span>
              <div class="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div class="text-3xl font-extrabold text-rose-400 font-heading">
              {stats.vencidoCount}
            </div>
            <p class="text-[11px] text-gray-400">Cobro prioritario</p>
          </div>

        </div>
      )}

      {/* Chart Section */}
      <div class="bg-carbon border border-white/10 p-6 sm:p-8 rounded-sm shadow-xl space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white font-display uppercase tracking-widest">Ingresos Mensuales por Colegiaturas</h3>
            <p class="text-xs text-gray-400 font-body">Histórico de recaudación acumulada del año 2026</p>
          </div>
          <div class="flex items-center gap-2 text-dorado-campeon font-bold text-sm">
            <DollarSign size={18} />
            Total Recaudado: ${stats.totalRevenue.toFixed(2)} USD
          </div>
        </div>

        <div class="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d0d38', borderColor: '#ffffff20', borderRadius: '12px' }}
                itemStyle={{ color: '#66FCF1' }}
              />
              <Bar dataKey="ingresos" fill="#c8102e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
