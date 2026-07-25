import React from 'react';
import { GitMerge, Calendar, Trophy, MapPin } from 'lucide-react';

const Campeonatos = () => {
  const events = [
    {
      id: 1,
      name: 'Copa Nacional Abierta de Taekwondo WT 2026',
      date: '2026-08-15',
      place: 'Coliseo Polideportivo Central',
      disciplina: 'TAEKWONDO',
      bracketStatus: 'Llaves Publicadas',
    },
    {
      id: 2,
      name: 'Torneo Abierto de Kickboxing Striking Championship',
      date: '2026-09-20',
      place: 'Arena Marcial Metropolitana',
      disciplina: 'KICKBOXING',
      bracketStatus: 'Inscripciones Abiertas',
    },
  ];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rojo-impacto/20 text-rojo-impacto border border-rojo-impacto/30 text-xs font-bold uppercase tracking-wider">
          <Trophy size={14} />
          Circuito Competitivo
        </div>
        <h1 class="text-4xl font-extrabold text-[#0B1550] font-heading">
          CAMPEONATOS & LLAVES DE COMPETENCIA
        </h1>
        <p class="text-sm text-[#111114]/80">
          Consulta las próximas fechas oficiales de competencia, llaves de eliminación (brackets) y resultados en tiempo real.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event) => (
          <div key={event.id} class="bg-carbon/80 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rojo-impacto text-white tracking-wider">
                {event.disciplina}
              </span>
              <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-dorado-campeon/20 text-dorado-campeon border border-dorado-campeon/30">
                {event.bracketStatus}
              </span>
            </div>

            <h3 class="text-xl font-bold text-white font-heading">
              {event.name}
            </h3>

            <div class="space-y-2 text-xs text-gray-300">
              <div class="flex items-center gap-2">
                <Calendar size={14} class="text-rojo-impacto" />
                <span>Fecha: {event.date}</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPin size={14} class="text-rojo-impacto" />
                <span>Lugar: {event.place}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-bold text-dorado-campeon">
                <GitMerge size={16} />
                Bracket Electrónico Disponible
              </div>
              <button class="px-4 py-2 bg-rojo-impacto text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow">
                Ver Llaves ➔
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Campeonatos;
