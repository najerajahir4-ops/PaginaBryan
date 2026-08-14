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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header Ledger */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-rojo-impacto/30 px-4 py-1.5 bg-rojo-impacto/5">
          <Trophy size={14} className="text-rojo-impacto" />
          <span className="text-xs font-body font-bold text-rojo-impacto tracking-[0.2em] uppercase">
            CIRCUITO COMPETITIVO
          </span>
        </div>
        <h1 className="text-5xl font-heading text-tatami-blanco uppercase tracking-tight">
          CAMPEONATOS & <span className="text-dorado-campeon">LLAVES</span>
        </h1>
        <p className="text-sm font-body text-tatami-blanco/70 uppercase tracking-widest max-w-xl mx-auto">
          Consulta las próximas fechas oficiales, brackets y resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        {events.map((event) => (
          <div key={event.id} className="bg-[#0A0B0E] border border-white/5 flex flex-col group transition-all duration-300 shadow-[0_0_15px_rgba(227,178,60,0.05)] hover:shadow-[0_0_25px_rgba(227,178,60,0.15)] hover:border-dorado-campeon/30 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-[2px] bg-dorado-campeon/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Cabecera de la Placa */}
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-carbon">
              <span className="px-3 py-1 text-[10px] font-heading uppercase bg-rojo-impacto text-tatami-blanco tracking-widest">
                {event.disciplina}
              </span>
              <span className="px-3 py-1 text-[10px] font-heading uppercase border border-dorado-campeon/50 text-dorado-campeon tracking-widest bg-dorado-campeon/5">
                {event.bracketStatus}
              </span>
            </div>

            {/* Info Principal */}
            <div className="p-6 space-y-6 flex-grow">
              <h3 className="text-2xl font-heading text-tatami-blanco uppercase leading-tight group-hover:text-dorado-campeon transition-colors">
                {event.name}
              </h3>

              <div className="space-y-3 font-body text-sm font-bold text-tatami-blanco/60 uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-carbon border border-white/5 text-dorado-campeon">
                    <Calendar size={16} />
                  </div>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-carbon border border-white/5 text-dorado-campeon">
                    <MapPin size={16} />
                  </div>
                  <span className="leading-tight">{event.place}</span>
                </div>
              </div>
            </div>

            {/* Footer de Acción */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between bg-carbon">
              <div className="flex items-center gap-2 text-xs font-body font-bold text-dorado-campeon/70 uppercase tracking-widest">
                <GitMerge size={16} />
                <span className="hidden sm:inline">Bracket Disponible</span>
              </div>
              <button className="px-6 py-2 bg-[#0A0B0E] border border-rojo-impacto text-rojo-impacto font-heading text-sm tracking-widest uppercase hover:bg-rojo-impacto hover:text-tatami-blanco transition-colors">
                VER LLAVES
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Campeonatos;
